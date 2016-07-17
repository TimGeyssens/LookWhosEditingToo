using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using Umbraco.Core;

namespace LookWhosEditingToo
{
    [HubName("LWETHub")] 
    public class EditingHub : Hub
    {
        private const string LWETGroup = "LWETGroup";

        public void Listen()
        {
            Groups.Add(Context.ConnectionId, LWETGroup);
        }

        public void Send(int nodeId, int userId)
        {
            var user = ApplicationContext.Current.Services.UserService.GetUserById(userId);
            var userGravatar = Utility.HashEmailForGravatar(user.Email);
            var userName = user.Name;

            var context = GlobalHost.ConnectionManager.GetHubContext<EditingHub>();
            context.Clients.Group(LWETGroup).broadcastEdit(nodeId, userId, userName, userGravatar);
        }

        public void Stop(int userId)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<EditingHub>();
            context.Clients.Group(LWETGroup).broadcastStopEdit(userId);
        }

        public void GreetAll(string userName, string message)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<EditingHub>();
            context.Clients.Group(LWETGroup).recieveMessage(userName, message);
        }
    }
}