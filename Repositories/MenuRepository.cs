using Dapper;
using Repositories.Entities;
using Repositories.Interfaces;


namespace Repositories
{
    public class MenuRepository : IMenuRepository
    {
        private IDatabaseExecuteRepository<IMenuRepository> _databaseExecuteRepository;
        public MenuRepository(IDatabaseExecuteRepository<IMenuRepository> databaseExecuteRepository)
        {
            _databaseExecuteRepository = databaseExecuteRepository;
        }

        public List<MenuEntity> GetAll()
        {
            string sql = "sp_Menus_GetAll";
            var dParameter = new Dictionary<string, string>();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<MenuEntity>(sql, dParameter, paramOutput: "Total");
            if (result.exception != null)
                return null;
            return result.data.ToList();
        }
        public List<MenuEntity> FindAll(int parentId = -1, int applicationId = 0, int status = -1, int? userId = null, string? roleIds = null)
        {
            string sql = "sp_Menus_FindAllWithAccess";
            var dParameter = new Dictionary<string, string>();
            dParameter["ParentId"] = parentId.ToString();
            dParameter["ApplicationId"] = applicationId.ToString();
            dParameter["Status"] = status.ToString();
            dParameter["UserId"] = userId.HasValue ? userId.Value.ToString() : string.Empty;
            dParameter["RoleIds"] = !string.IsNullOrEmpty(roleIds) ? roleIds : string.Empty;
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<MenuEntity>(sql, dParameter, paramOutput: "Total");
            if (result.exception != null)
                return null;
            return result.data.ToList();
        }
        public ListMenuEntity Search(string keyword = "", int parentId = 0, int applicationId = 0, int pageIndex = 1, int pageSize = 25)
        {
            string sql = "sp_Menus_Search";
            var dParameter = new Dictionary<string, string>();
            dParameter["Keyword"] = keyword.ToString();
            dParameter["ParentId"] = parentId.ToString();
            dParameter["ApplicationId"] = applicationId.ToString();
            dParameter["PageIndex"] = pageIndex.ToString();
            dParameter["PageSize"] = pageSize.ToString();

            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<MenuEntity>(sql, dParameter, paramOutput: "Total");
            if (result.exception != null)
                return null;

            ListMenuEntity listing = new ListMenuEntity();
            listing.Listing = result.data.ToList();
            listing.Total = (int)result.paramOut;

            return listing;
        }
        public MenuEntity GetById(int Id)
        {
            string sql = "sp_Menus_GetById";
            var dParameter = new Dictionary<string, string>();
            dParameter["Id"] = Id.ToString();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<MenuEntity>(sql, dParameter);
            if (result == null)
                return null;
            return result;
        }
        public List<MenuEntity> GetByParentId(int ParentId, int ApplicationId, int SiteId)
        {
            string sql = "sp_Menus_GetByParentId";
            var dParameter = new Dictionary<string, string>();
            dParameter["ParentId"] = ParentId.ToString();
            dParameter["ApplicationId"] = ApplicationId.ToString();
            dParameter["SiteId"] = SiteId.ToString();

            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<MenuEntity>(sql, dParameter, paramOutput: "Total");
            if (result.exception != null)
                return null;
            return result.data.ToList();
        }
        public int Insert(MenuEntity model)
        {
            string sql = "sp_Menus_Insert";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@Name", model.Name);
            dParameter.Add($"@ParentId", model.ParentId);
            dParameter.Add($"@Path", model.Path);
            dParameter.Add($"@Icon", model.Icon);
            dParameter.Add($"@SiteId", model.SiteId);
            dParameter.Add($"@Status", model.Status);
            dParameter.Add($"@ApplicationId", model.ApplicationId);
            dParameter.Add($"@CreatedUser", model.CreatedUser);
            dParameter.Add($"@ModifiedUser", model.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }

        public int Update(MenuEntity model)
        {
            string sql = "sp_Menus_Update";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@Id", model.ID);
            dParameter.Add($"@Name", model.Name);
            dParameter.Add($"@ParentId", model.ParentId);
            dParameter.Add($"@Path", model.Path);
            dParameter.Add($"@Icon", model.Icon);
            dParameter.Add($"@Order", model.Order);
            dParameter.Add($"@SiteId", model.SiteId);
            dParameter.Add($"@Status", model.Status);
            dParameter.Add($"@ApplicationId", model.ApplicationId);
            dParameter.Add($"@ModifiedUser", model.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }
        public int Delete(int Id, string modifiedUser)
        {
            string sql = "sp_Menus_Delete";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@Id", Id);
            dParameter.Add($"@ModifiedUser", modifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }
    }
}
