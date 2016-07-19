using System;
using System.Linq;
using LookWhosEditingToo.Models;
using Umbraco.Core;
using Umbraco.Core.Persistence;
using Umbraco.Web.Trees;
using System.Web.Hosting;
using System.Xml;
using Microsoft.AspNet.SignalR;
using Umbraco.Core.Logging;
using Umbraco.Core.Services;
using Umbraco.Web;

namespace LookWhosEditingToo
{
    public class UmbracoStartUp : ApplicationEventHandler
    {
        public UmbracoStartUp()
        {
            ContentService.Published += ContentService_Published;
        }

        private void ContentService_Published(Umbraco.Core.Publishing.IPublishingStrategy sender,
            Umbraco.Core.Events.PublishEventArgs<Umbraco.Core.Models.IContent> e)
        {
            var currentUser = UmbracoContext.Current.Security.CurrentUser;
            if (currentUser == null) return;
            var email = currentUser.Email;
            var hubContext = GlobalHost.ConnectionManager.GetHubContext<EditingHub>();
            foreach (var node in e.PublishedEntities)
            {
                hubContext.Clients.Group("LWETGroup")
                    .broadcastPublished(node.Id, email, DateTime.Now.ToString("HH:mm:ss"));
            }
        }

        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {
            TreeControllerBase.TreeNodesRendering += TreeControllerBase_TreeNodesRendering;
            var ctx = ApplicationContext.Current.DatabaseContext;
            var db = new DatabaseSchemaHelper(ctx.Database, applicationContext.ProfilingLogger.Logger, ctx.SqlSyntax);
            //Check if the DB table does NOT exist
            if (!db.TableExist("LookWhosEditingNow"))
            {
                //Create DB table - and set overwrite to false
                db.CreateTable<Edit>(false);
            }
            //Install dashboard
            AddStartUpSectionDashboard();
        }

        void TreeControllerBase_TreeNodesRendering(TreeControllerBase sender, TreeNodesRenderingEventArgs e)
        {
            var db = sender.ApplicationContext.DatabaseContext.Database;

            if (sender.TreeAlias == "content")
            {
                foreach (var node in e.Nodes)
                {
                    var query = new Sql().Select("*").From("lookwhoseditingnow").Where<Edit>(x => x.NodeId == (int)node.Id && x.UserId != sender.Security.CurrentUser.Id);
                    if (db.Fetch<Edit>(query).Any())
                    {
                        node.CssClasses.Add("look-whos-editing-too");
                    }
                }
            }
            else
            {
                db.Execute("DELETE FROM lookwhoseditingnow WHERE userid=@0", sender.Security.CurrentUser.Id);
            }
        }

        private void AddStartUpSectionDashboard()
        {
            //Open up language file
            const string dashboardPath = "~/config/dashboard.config";
            //Path to the file resolved
            var dashboardFilePath = HostingEnvironment.MapPath(dashboardPath);
            //Load dashboard.config XML file
            var dashboardXml = new XmlDocument();
            try
            {
                dashboardXml.Load(dashboardFilePath);
                // Section Node
                var findSection = dashboardXml.SelectSingleNode("//section [@alias='StartupDashboardSection']");
                //Couldn't find it
                if (findSection == null) return;
                //Check if our dashboard is already added
                var customTab = findSection.SelectSingleNode("//tab [@caption='Look Whos Editing Too']");
                if (customTab != null) return;
                const string xmlToAdd = "<tab caption='Look Whos Editing Too'>" +
                                        "<control addPanel='true' panelCaption=''>/App_Plugins/LookWhosEditingToo/views/dashboard.html</control>" +
                                        "</tab>";
                //Load in the XML string above
                var xmlNodeToAdd = new XmlDocument();
                xmlNodeToAdd.LoadXml(xmlToAdd);
                //Append the xml above to the dashboard node
                try
                {
                    var copiedNode = dashboardXml.ImportNode(xmlNodeToAdd.DocumentElement, true);
                    findSection.AppendChild(copiedNode);
                    //Save the file flag to true
                    dashboardXml.Save(dashboardFilePath);
                }
                catch (Exception ex) { LogHelper.Error<UmbracoStartUp>("Couldn't add content section dashboard", ex); }
            }
            catch (Exception ex)
            {
                LogHelper.Error<UmbracoStartUp>("Couldn't add content section dashboard", ex);
            }
        }
    }
}