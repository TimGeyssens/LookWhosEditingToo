using Microsoft.AspNet.SignalR;
using Umbraco.Core;

namespace LookWhosEditingToo
{
    public class EditingHub : Hub
    {
        public void Send(int nodeId, int userId)
        {
            
            var user = ApplicationContext.Current.Services.UserService.GetUserById(userId);
            var userGravatar = Utility.HashEmailForGravatar(user.Email);
            var userName = user.Name;

            Clients.Others.broadcastEdit(nodeId, userId, userName, userGravatar);
        }

        public void Stop(int userId)
        {
            Clients.Others.broadcastStopEdit(userId);
        }
    }
}