using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Umbraco.Web.Mvc;
using Umbraco.Web.WebApi;

namespace LookWhosEditingToo.Controllers
{
    [PluginController("LookWhosEditingToo")]
    public class PublicEditApiController: UmbracoApiController
    {
        public int DeleteByUserId(int userId)
        {
            return DatabaseContext.Database.Execute("DELETE FROM lookwhoseditingnow WHERE userid=@0", userId);
        }
    }
}