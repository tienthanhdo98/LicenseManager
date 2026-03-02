using Repositories.Entities;

namespace Repositories.Interfaces
{
    public interface IMenuRepository
    {
        List<MenuEntity> GetAll();
        List<MenuEntity> FindAll(int parentId = -1, int applicationId = 0, int status = -1, int? UserId = null, string? RoleIds = null);
        ListMenuEntity Search(string keyword = "", int parentId = 0, int applicationId = 0, int pageIndex = 1, int pageSize = 25);
        MenuEntity GetById(int Id);
        List<MenuEntity> GetByParentId(int ParentId, int ApplicationId, int SiteId);
        int Insert(MenuEntity entity);
        int Update(MenuEntity entity);
        int Delete(int Id, string modifiedUser);
    }
}
