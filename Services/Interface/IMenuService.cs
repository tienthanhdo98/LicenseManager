using Services.ViewModels;

namespace Services.Interfaces
{
    public interface IMenuService
    {
        List<MenuViewModel> GetAll();
        List<MenuViewModel> FindAll(int parentId = -1, int applicationId = 0, int status = -1, int? userId = null, string? roleIds = null);
        ListMenuViewModel Search(string keyword = "", int parentId = 0, int applicationId = 0, int pageIndex = 1, int pageSize = 25);
        MenuViewModel GetById(int Id);
        List<MenuViewModel> GetByParentId(int ParentId, int ApplicationId, int SiteId);
        int Insert(MenuViewModel entity);
        int Update(MenuViewModel entity);
        int Delete(int Id, string modifiedUser);
    }
}
