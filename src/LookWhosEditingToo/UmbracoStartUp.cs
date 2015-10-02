using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LookWhosEditingToo.Models;
using Umbraco.Core;
using Umbraco.Core.Persistence;
using Umbraco.Web.Trees;
using System.Web.Hosting;
using System.Xml;
using Umbraco.Core.Logging;

namespace LookWhosEditingToo
{
    public class UmbracoStartUp: ApplicationEventHandler
    {
        protected override void ApplicationStarted(UmbracoApplicationBase umbracoApplication, ApplicationContext applicationContext)
        {

            TreeControllerBase.TreeNodesRendering += TreeControllerBase_TreeNodesRendering;

            var db = applicationContext.DatabaseContext.Database;

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

        public void AddStartUpSectionDashboard()
        {
            bool saveFile = false;

            //Open up language file
            var dashboardPath = "~/config/dashboard.config";

            //Path to the file resolved
            var dashboardFilePath = HostingEnvironment.MapPath(dashboardPath);

            //Load dashboard.config XML file
            XmlDocument dashboardXml = new XmlDocument();

            try
            {
                dashboardXml.Load(dashboardFilePath);

                // Section Node
                XmlNode findSection = dashboardXml.SelectSingleNode("//section [@alias='StartupDashboardSection']");

                //Couldn't find it
                if (findSection == null)
                {
                    //Content section is not found - something is really bad!
                    return;
                }
                else
                {

                    //Check if our dashboard is already added
                    XmlNode customTab = findSection.SelectSingleNode("//tab [@caption='Look Whos Editing Too']");

                    if (customTab == null)
                    {
                        var xmlToAdd = "<tab caption='Look Whos Editing Too'>" +
                                            "<control addPanel='true' panelCaption=''>/App_Plugins/LookWhosEditingToo/views/dashboard.html</control>" +
                                        "</tab>";

                        //Load in the XML string above
                        XmlDocument xmlNodeToAdd = new XmlDocument();
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
                }
            }
            catch (Exception ex)
            {
                LogHelper.Error<UmbracoStartUp>("Couldn't add content section dashboard", ex);
            }
        }
    }
}