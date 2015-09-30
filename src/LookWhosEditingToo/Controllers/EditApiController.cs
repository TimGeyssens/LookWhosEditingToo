using System.Collections.Generic;
using LookWhosEditingToo.Models;
using Umbraco.Core.Persistence;
using Umbraco.Web.Editors;
using Umbraco.Web.Mvc;

namespace LookWhosEditingToo.Controllers
{
   [PluginController("LookWhosEditingToo")]
    public class EditApiController: UmbracoAuthorizedJsonController
    {
       public IEnumerable<Edit> GetAllEdits()
       {
           var query = new Sql().Select("*").From("lookwhoseditingnow").Where<Edit>(x=> x.UserId != UmbracoContext.UmbracoUser.Id);
           var edits = DatabaseContext.Database.Fetch<Edit>(query);
           foreach (var edit in edits)
           {
               var user = Services.UserService.GetUserById((int)edit.UserId);
               edit.UserGravatar = Utility.HashEmailForGravatar(user.Email);
               edit.UserName = user.Username;
           }
           return edits;
       }

       public IEnumerable<Edit> GetByNodeId(int nodeId)
       {

           var query = new Sql().Select("*").From("lookwhoseditingnow").Where<Edit>(x => x.NodeId == nodeId && x.UserId != UmbracoContext.UmbracoUser.Id);
           return DatabaseContext.Database.Fetch<Edit>(query);

       }

       public Edit PostSave(Edit edit)
       {
            DatabaseContext.Database.Execute("DELETE FROM lookwhoseditingnow WHERE userid=@0", edit.UserId);

            DatabaseContext.Database.Save(edit);

            return edit;
       }

       public int DeleteByUserId(int userId)
       {
           return DatabaseContext.Database.Execute("DELETE FROM lookwhoseditingnow WHERE userid=@0", userId);
       }
    }
}