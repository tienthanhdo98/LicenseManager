using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Interfaces;
using Services.Viewmodels;
using System.Security.Claims;

namespace Areas.Api
{
    [Authorize]
    public class BaseController : Controller
    {

  

        public BaseController()
        {

        }

        

        protected ClaimsPrincipal CurrentUser => HttpContext?.User;

        private UserViewModel _AuthorizedUserViewModel;
        protected UserViewModel CurrentUserViewModel
        {
            get
            {
                //_accessor.HttpContext.Connection.RemoteIpAddress;
                if (CurrentUser == null)
                    return null;
                if (CurrentUser.Identity.IsAuthenticated)
                {
                    var jsonUserViewModel = CurrentUser.Claims.Where(c => c.Type == ClaimTypes.UserData).FirstOrDefault();
                    UserViewModel retUserViewModel = JsonConvert.DeserializeObject<UserViewModel>(jsonUserViewModel.Value);




                    return retUserViewModel;
                }

                return null;
            }
            set
            {
                _AuthorizedUserViewModel = value;
            }
        }
    }
}
