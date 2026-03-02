using KeyGenApplication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Services.Interfaces;
using Services.ViewModels;
using Tek4AIWorkspaces.Data.Enums;

namespace Controllers
{
    public class MenusController : BaseController
    {
        private readonly ILogger<MenusController> _logger;
        private readonly IUserService _IUserService;


        private readonly IMenuService _MenuService;


        public MenusController(ILogger<MenusController> logger,
           IUserService iUserService,
           IMenuService menuService,
           IOptions<AppSettings> options) : base(options)
        {
            _logger = logger;
            _IUserService = iUserService;
            _MenuService = menuService;

        }

        private void DataBinding()
        {
            try
            {
                //Lấy dữ liệu danh mục cha
                var meunParent = _MenuService.GetByParentId(0, 2, 0);
                var list_menuParents = new List<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>();
                list_menuParents.Add(new Microsoft.AspNetCore.Mvc.Rendering.SelectListItem { Text = "Chọn danh mục cha", Value = "0" });
                foreach (var item in meunParent)
                {
                    list_menuParents.Add(new Microsoft.AspNetCore.Mvc.Rendering.SelectListItem { Text = item.Name, Value = item.ID.ToString() });
                }
                ViewBag.MenuParents = list_menuParents;
                //Kiểm tra superAdmin
                ViewBag.CurrentUserAdmin = CurrentUserViewModel.SuperAdmin;
                ViewBag.CurrentUserSiteId = CurrentUserViewModel.SiteId;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex.Message}:{ex.StackTrace}");
            }
        }

        public IActionResult Index()
        {
            DataBinding();
            return View();
        }

        [HttpPost]
        [AutoValidateAntiforgeryToken]
        public IActionResult Action(ActionMenuViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errorInfo = ModelState
                        .Where(ms => ms.Value.Errors.Count > 0)
                        .Select(kvp => new
                        {
                            Field = kvp.Key,
                            Messages = kvp.Value.Errors.Select(e => e.ErrorMessage).ToList()
                        })
                        .ToList();

                    var formattedMessage = string.Join("<br/>",
                        errorInfo.SelectMany(e => e.Messages.Select(m => $"- {m}")));

                    return Ok(new
                    {
                        Code = -1,
                        Message = $"Có lỗi xảy ra khi cập nhật:<br/>{formattedMessage}",
                        ErrorInfo = errorInfo
                    });
                }

                //Trạng thái
                MenuStatus status = model.IsActive ? MenuStatus.ACTIVE : MenuStatus.DEACTIVE;

                if (model.Id > 0)
                {
                    // Cập nhật menu
                    var menuViewModel = _MenuService.GetById(model.Id);
                    if (menuViewModel == null)
                    {
                        return Ok(new
                        {
                            Code = -1,
                            Message = "Không tìm thấy menu cần cập nhật."
                        });
                    }

                    menuViewModel.Name = model.Name;
                    menuViewModel.Path = model.Path;
                    menuViewModel.Icon = model.Icon;
                    menuViewModel.Order = model.Order;
                    menuViewModel.SiteId = model.SiteId;
                    menuViewModel.Status = status;
                    menuViewModel.ParentId = model.ParentId;
                    menuViewModel.ApplicationId = model.ApplicationId;
                    menuViewModel.ModifiedUser = CurrentUserViewModel.ModifiedUser;

                    int result = _MenuService.Update(menuViewModel);
                    if (result > 0)
                    {

                        return Ok(new
                        {
                            Code = 1,
                            Message = "Cập nhật menu thành công."
                        });
                    }
                }
                else
                {
                    var entity = new MenuViewModel
                    {
                        Name = model.Name,
                        Path = model.Path,
                        Icon = model.Icon,
                        SiteId = 0,
                        ParentId = model.ParentId,
                        Status = status,
                        ApplicationId = model.ApplicationId,
                        CreatedUser = CurrentUserViewModel.CreatedUser,
                        ModifiedUser = CurrentUserViewModel.ModifiedUser
                    };

                    int result = _MenuService.Insert(entity);
                    if (result > 0)
                    {
                        model.Id = result;
                        return Ok(new
                        {
                            Code = 1,
                            Message = "Thêm mới menu thành công."
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{ex.Message}:{ex.StackTrace}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"Có lỗi xảy ra: {ex.Message}"
                });
            }

            return Ok(new
            {
                Code = -1,
                Message = "Thao tác không thành công."
            });
        }




    }
}
