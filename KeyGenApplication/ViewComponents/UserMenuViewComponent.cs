using Microsoft.AspNetCore.Mvc;
using Models;
using Newtonsoft.Json;
using Services.Viewmodels;
using System.Security.Claims;

namespace ViewComponents
{
    [ViewComponent(Name = "UserMenu")]
    public class UserMenuViewComponent : ViewComponent
    {
        private readonly ILogger<UserMenuViewComponent> _logger;

        public UserMenuViewComponent(ILogger<UserMenuViewComponent> logger)
        {
            _logger = logger;
        }

        public IViewComponentResult Invoke()
        {
            var model = new UserMenuComponentViewModel();
            try
            {
                model.User = CurrentUserViewModel;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"UserMenuViewComponent: {ex.Message}");
            }
            return View(model);
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
