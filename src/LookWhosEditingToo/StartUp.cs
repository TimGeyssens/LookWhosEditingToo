using System.Linq;
using System.Web.Routing;
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
    public class StartUp
    {
        public void Configuration(IAppBuilder app)
        {
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }

        
    }
}