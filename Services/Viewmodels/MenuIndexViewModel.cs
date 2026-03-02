using System.ComponentModel.DataAnnotations;
using Tek4AIWorkspaces.Data.Enums;

namespace Services.ViewModels
{
    public class MenuIndexViewModel
    {
        public List<MenuViewModel> Listing { get; set; } = new List<MenuViewModel>();
        public PagerViewModel Paging { get; set; }
        public string Keyword { get; set; }
        public int ParentId { get; set; }
        public int ApplicationId { get; set; }
        public int Total { get; set; }
    }

    public class MenuByParentIdViewModel
    {
        public int ApplicationId { get; set; }
        public int SiteId { get; set; }
    }

    public class FindAllViewModel
    {
        public int ApplicationId { get; set; }
    }

    public class ActionMenuViewModel
    {
        public ActionMenuViewModel(MenuViewModel model)
        {
            bool isActive = true;
            //Trạng thái cập nhật check Status
            if (model.Status == MenuStatus.DEACTIVE)
            {
                isActive = false;
            }

            Id = model.ID;
            Name = model.Name;
            Path = model.Path;
            Icon = model.Icon;
            Order = model.Order;
            SiteId = model.SiteId;
            ParentId = model.ParentId;
            ApplicationId = model.ApplicationId;
            IsActive = isActive;
        }

        public ActionMenuViewModel() { }

        public int Id { get; set; }

        [Required(ErrorMessage = "Hãy nhập {0}")]
        [Display(Name = "Tiêu đề")]
        public string Name { get; set; }

        //[Required(ErrorMessage = "Hãy nhập {0}")]
        [Display(Name = "Đường dẫn")]
        public string Path { get; set; } = "";

        [Required(ErrorMessage = "Hãy nhập {0}")]
        [Display(Name = "Icon")]
        public string Icon { get; set; }

        [Display(Name = "Tổ chức")]
        public int SiteId { get; set; }

        [Display(Name = "Chọn danh mục cha")]
        public int ParentId { get; set; }

        [Display(Name = "Hoạt động")]
        public bool IsActive { get; set; }

        [Display(Name = "Chọn dự án")]
        public int ApplicationId { get; set; }

        [Display(Name = "Chọn các người dùng được phép truy cập")]
        public int[]? UserIds { get; set; }

        [Display(Name = "Chọn các vai trò được phép truy cập")]
        public int[]? RoleIds { get; set; }
        public int[]? SiteMapIds { get; set; }
        public int Order { get; set; }
    }
}

