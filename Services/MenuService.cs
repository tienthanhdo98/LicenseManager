using Repositories.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.ViewModels;


namespace Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _IMenuRepository;
        public MenuService(IMenuRepository menuRepository)
        {
            _IMenuRepository = menuRepository;
        }

        public List<MenuViewModel> GetAll()
        {
            var result = _IMenuRepository.GetAll();
            if (result == null)
                return null;
            return result.Select(p => new MenuViewModel(p)).ToList();
        }
        public List<MenuViewModel> FindAll(int parentId = -1, int applicationId = 0, int status = -1, int? userId = null, string? roleIds = null)
        {
            var result = _IMenuRepository.FindAll(parentId, applicationId, status, userId, roleIds);
            if (result == null)
                return null;
            return result.Select(p => new MenuViewModel(p)).ToList();
        }
        public ListMenuViewModel Search(string keyword = "", int parentId = 0, int applicationId = 0, int pageIndex = 1, int pageSize = 25)
        {
            var result = _IMenuRepository.Search(keyword, parentId, applicationId, pageIndex, pageSize);
            if (result == null)
                return null;

            ListMenuViewModel listing = new ListMenuViewModel
            {
                Listing = result.Listing.Select(p => new MenuViewModel(p)).ToList(),
                Total = result.Total
            };

            return listing;
        }
        public MenuViewModel GetById(int Id)
        {
            var result = _IMenuRepository.GetById(Id);
            if (result == null)
                return null;
            return new MenuViewModel(result);
        }
        public List<MenuViewModel> GetByParentId(int ParentId, int ApplicationId, int SiteId)
        {
            var result = _IMenuRepository.GetByParentId(ParentId, ApplicationId, SiteId);
            if (result == null)
                return null;
            return result.Select(p => new MenuViewModel(p)).ToList();
        }
        public int Insert(MenuViewModel model)
        {
            var entity = new MenuEntity();
            entity.Name = model.Name;
            entity.ParentId = model.ParentId;
            entity.Path = model.Path;
            entity.Icon = model.Icon;
            entity.SiteId = model.SiteId;
            entity.Status = model.Status;
            entity.ApplicationId = model.ApplicationId;
            entity.CreatedUser = model.CreatedUser;
            entity.ModifiedUser = model.ModifiedUser;
            int result = _IMenuRepository.Insert(entity);
            return result;
        }
        public int Update(MenuViewModel model)
        {
            var entity = new MenuEntity();
            entity.ID = model.ID;
            entity.Name = model.Name;
            entity.ParentId = model.ParentId;
            entity.Path = model.Path;
            entity.Icon = model.Icon;
            entity.Order = model.Order;
            entity.SiteId = model.SiteId;
            entity.Status = model.Status;
            entity.ApplicationId = model.ApplicationId;
            entity.ModifiedUser = model.ModifiedUser;
            int result = _IMenuRepository.Update(entity);
            return result;
        }
        public int Delete(int Id, string modifiedUser)
        {
            var result = _IMenuRepository.Delete(Id, modifiedUser);
            return result;
        }
    }
}
