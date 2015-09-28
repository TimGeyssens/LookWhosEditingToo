using System.Linq;
using LookWhosEditingToo;
using LookWhosEditingToo.Models;
using Microsoft.Owin;
using Owin;
using Umbraco.Core;
using Umbraco.Core.Persistence;
using Umbraco.Web.Trees;

[assembly: OwinStartup(typeof(StartUp))]
namespace LookWhosEditingToo
{
    public class StartUp : ApplicationEventHandler
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }

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


        }

        void TreeControllerBase_TreeNodesRendering(TreeControllerBase sender, TreeNodesRenderingEventArgs e)
        {
            
            if (sender.TreeAlias == "content")
            {
                foreach (var node in e.Nodes)
                {
                    var db = sender.ApplicationContext.DatabaseContext.Database;

                    var query = new Sql().Select("*").From("lookwhoseditingnow").Where<Edit>(x => x.NodeId == (int)node.Id && x.UserId != sender.Security.CurrentUser.Id);
                    if (db.Fetch<Edit>(query).Any())
                        node.CssClasses.Add("editing");

                   
                }
            }
        }
    }
}