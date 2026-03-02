
using Dapper;
using Repositories.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class LicenseRepository : ILicenseRepository
    {
        private IDatabaseExecuteRepository<LicenseEntity> _databaseExecuteRepository;

        public LicenseRepository(IDatabaseExecuteRepository<LicenseEntity> databaseExecuteRepository)
        {
            _databaseExecuteRepository = databaseExecuteRepository;
        }

        public int? Delete(int iD, string modifiedUser)
        {
            string sql = "sp_Licenses_Deleted";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@ID", iD);
            dParameter.Add($"@ModifiedUser", modifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }

        public int? Revoke(int iD, string modifiedUser)
        {
            string sql = "sp_Licenses_Revoke";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@ID", iD);
            dParameter.Add($"@ModifiedUser", modifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }


        public LicenseEntity GetById(int Id)
        {
            string sql = "sp_Licenses_GetById";
            var dParameter = new Dictionary<string, string>();
            dParameter["ID"] = Id.ToString();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<LicenseEntity>(sql, dParameter);
            if (result == null)
                return null;
            return result;
        }

        public LicenseEntity GetByDeviceId(int Id)
        {
            string sql = "sp_Licenses_GetByDeviceId";
            var dParameter = new Dictionary<string, string>();
            dParameter["DeviceID"] = Id.ToString();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<LicenseEntity>(sql, dParameter);
            if (result == null)
                return null;
            return result;

        }

        public int? Insert(LicenseEntity entity)
        {
            string sql = "sp_Licenses_Insert";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@DeviceID", entity.DeviceID);
            dParameter.Add($"@LicenseName", entity.LicenseName);
            dParameter.Add($"@LicenseValue", entity.LicenseValue);
            dParameter.Add($"@Status", entity.Status);
            dParameter.Add($"@CreatedTime", entity.CreatedTime);
            dParameter.Add($"@ExpiredTime", entity.ExpiredTime);
            dParameter.Add($"@CreatedUser ", entity.CreatedUser);
            dParameter.Add($"@ModifiedUser", entity.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;

        }

        public ListLicenseEntity Search(String licenseName = "", int status = 0, int pageIndex = 1, int pageSize = 25)
        {
            string sql = "sp_Licenses_Search";
            var dParameter = new Dictionary<string, string>();
            dParameter["LicenseName"] = string.IsNullOrEmpty(licenseName) ? "" : licenseName.ToString();
            dParameter["Status"] = status.ToString();
            dParameter["PageIndex"] = pageIndex.ToString();
            dParameter["PageSize"] = pageSize.ToString();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<LicenseEntity>(sql, dParameter, paramOutput: "Total");
            
            if (result.exception != null)
                return null;

            int Total = (int)result.paramOut;
            var listing = new ListLicenseEntity();
            listing.Listing = result.data.ToList();
            listing.Total = Total;

            
            
            return listing;
        }



        public int? Update(LicenseEntity entity)
        {

            string sql = "sp_Licenses_Update";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@ID", entity.ID);
            dParameter.Add($"@DeviceID", entity.DeviceID);
            dParameter.Add($"@LicenseName", entity.LicenseName);
            dParameter.Add($"@Status", entity.Status);
            dParameter.Add($"@CreatedTime", entity.CreatedTime);
            dParameter.Add($"@ExpiredTime", entity.ExpiredTime);
            dParameter.Add($"@ModifiedUser", entity.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }
    }
}
