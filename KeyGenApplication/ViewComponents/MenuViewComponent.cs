using KeyGenApplication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Interfaces;
using Services.ViewModels;

namespace Models
{
    [ViewComponent(Name = "Menu")]
    public class MenuViewComponent : ViewComponent
    {

        private readonly ILogger<MenuViewComponent> _logger;
        private readonly AppSettings _AppSettings;
        private readonly IMenuService _IMenuService;


        public MenuViewComponent(ILogger<MenuViewComponent> logger,
            IOptions<AppSettings> appSettings,
            IMenuService menuService)


        {
            _logger = logger;
            _AppSettings = appSettings.Value;
            _IMenuService = menuService;


        }

        public IViewComponentResult Invoke()
        {
            var menus = new List<MenuItemViewModel>();
            try
            {
                var currentPath = HttpContext.Request.Path.Value ?? "/";
                menus = this.GetMenuTree(currentPath);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"MenuViewComponent: {ex.Message}");
            }
            return View(menus);
        }

        private List<MenuItemViewModel> GetMenuTree(string currentUrl)
        {
            var key = "MenuViewComponent";
            var menus = new List<MenuViewModel>();

            menus = _IMenuService.FindAll(parentId: -1, _AppSettings.ApplicationId, status: -1, userId: null, roleIds: null);


            if (menus != null && menus.Any())
            {
                var menuItems = menus.Where(x => x.IsActive)
                    .OrderBy(x => x.Order)
                    .Select(x => new MenuItemViewModel
                    {
                        Id = x.ID,
                        ParentId = x.ParentId,
                        Name = x.Name,
                        Path = x.Path,
                        Icon = x.Icon
                    })
                    .ToList();

                var tree = this.BuildTree(menuItems, 0);

                this.SetActive(tree, currentUrl);

                return tree;
            }
            return new();
        }

        private List<MenuItemViewModel> BuildTree(List<MenuItemViewModel> source, int parentId)
        {
            return source
                .Where(x => x.ParentId == parentId)
                .Select(x =>
                {
                    x.Children = BuildTree(source, x.Id);
                    return x;
                })
                .ToList();
        }

        private bool SetActive(List<MenuItemViewModel> menus, string currentUrl)
        {
            var anyActive = false;
            foreach (var menu in menus)
            {
                if (!string.IsNullOrEmpty(menu.Path) &&
                    currentUrl.Equals(menu.Path, StringComparison.OrdinalIgnoreCase))
                {
                    menu.IsActive = true;
                    anyActive = true;
                }

                if (menu.Children.Any() && SetActive(menu.Children, currentUrl))
                {
                    menu.IsOpen = true;
                    anyActive = true;
                }
            }
            return anyActive;
        }
    }
}
