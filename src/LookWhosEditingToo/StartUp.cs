using LookWhosEditingToo;
using Microsoft.Owin;
using Owin;
using Umbraco.Web;

[assembly: OwinStartup(typeof(StartUp))]

namespace LookWhosEditingToo
{
    public class StartUp : UmbracoDefaultOwinStartup
    {
        public override void Configuration(IAppBuilder app)
        {
            //ensure the default options are configured
            base.Configuration(app);
            // Any connection or hub wire up and configuration should go here
            app.MapSignalR();
        }
    }
}