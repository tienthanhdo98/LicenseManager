using Repositories.Entities;
using Tek4AIWorkspaces.Data.Enums;
using ViewModels;


namespace Services.ViewModels
{
    public class MenuViewModel : BaseViewModel
    {
        public MenuViewModel(MenuEntity entity)
        {
            bool isActive = true;
            //Trạng thái cập nhật check Status
            if (entity.Status == MenuStatus.DEACTIVE)
            {
                isActive = false;
            }
            IsActive = isActive;
            ID = entity.ID;
            Name = entity.Name;
            ParentId = entity.ParentId;
            Path = entity.Path;
            Icon = entity.Icon;
            Order = entity.Order;
            Deleted = entity.Deleted;
            SiteId = entity.SiteId;
            Status = entity.Status;
            ApplicationId = entity.ApplicationId;
            CreatedTime = entity.CreatedTime;
            CreatedUser = entity.CreatedUser;
            ModifiedTime = entity.ModifiedTime;
            ModifiedUser = entity.ModifiedUser;
        }
        public MenuViewModel() { }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public string Path { get; set; }
        public string Icon { get; set; }
        public int Order { get; set; }
        public bool Deleted { get; set; }
        public int SiteId { get; set; }
        public MenuStatus Status { get; set; }
        public int ApplicationId { get; set; }
        public bool IsActive { get; set; }
    }
    public class ListMenuViewModel
    {
        public List<MenuViewModel> Listing { get; set; }
        public int Total { get; set; }
    }

}
