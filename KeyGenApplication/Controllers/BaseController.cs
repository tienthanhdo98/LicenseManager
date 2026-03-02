using KeyGenApplication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Services.Viewmodels;
using System.Security.Claims;

namespace Controllers
{
    [Authorize]
    public class BaseController : Controller
    {
        private readonly AppSettings _appSettings;

        public BaseController(IOptions<AppSettings> options)
        {
            _appSettings = options.Value;
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
