using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace Tek4AIWorkspaces.BackOffices.ViewComponents
{
    public abstract class BaseViewComponent : ViewComponent
    {
        protected ClaimsPrincipal CurrentUser => HttpContext.User;

        protected string Ip => HttpContext.Connection.RemoteIpAddress?.ToString();

        protected int UserId
        {
            get
            {
                var userDataClaim = CurrentUser?.FindFirst("http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata")?.Value;

                if (!string.IsNullOrEmpty(userDataClaim))
                {
                    var userData = JObject.Parse(userDataClaim);

                    return userData["Id"]?.Value<int>() ?? 0;
                }

                return 0;
            }
        }
    }
}
