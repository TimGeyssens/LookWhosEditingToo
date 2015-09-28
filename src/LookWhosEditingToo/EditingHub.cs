using Microsoft.AspNet.SignalR;

namespace LookWhosEditingToo
{
    public class EditingHub : Hub
    {
        public void Send(int nodeId, int userId)
        {
            // Call the broadcasMessage method to update clients.
            //var query = new Sql().Select("*").From("lookwhoseditingnow");
            //var edits = ApplicationContext.Current.DatabaseContext.Database.Fetch<Edit>(query).Where(x => x.UserId != Umbraco.Web.UmbracoContext.Current.Security.CurrentUser.Id).ToList();
            
            Clients.Others.broadcastEdit(nodeId, userId);
        }
    }
}