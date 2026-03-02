
using Dapper;
using Repositories.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class DeviceRepository : IDeviceRepository
    {
        private IDatabaseExecuteRepository<DeviceEntity> _databaseExecuteRepository;

        public DeviceRepository(IDatabaseExecuteRepository<DeviceEntity> databaseExecuteRepository)
        {
            _databaseExecuteRepository = databaseExecuteRepository;
        }

        public int? Delete(int iD, string modifiedUser)
        {
            string sql = "sp_Devices_Deleted";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@ID", iD);
            dParameter.Add($"@ModifiedUser", modifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }


        public DeviceEntity GetById(int Id)
        {
            string sql = "sp_Devices_GetById";
            var dParameter = new Dictionary<string, string>();
            dParameter["ID"] = Id.ToString();
                  
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<DeviceEntity>(sql, dParameter);
            if (result == null)
                return null;
            return result;

        }


        public int? Insert(DeviceEntity entity)
        {
            string sql = "sp_Devices_Insert";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@DeviceName", entity.DeviceName);
            dParameter.Add($"@ChipsetID", entity.ChipsetID);
            dParameter.Add($"@Note", entity.Note);
            dParameter.Add($"@CreatedUser", entity.CreatedUser);
            dParameter.Add($"@ModifiedUser", entity.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;

        }

        public ListDeviceEntity Search(String deviceName = "", int status = 0, int pageIndex = 1, int pageSize = 25)
        {
            string sql = "sp_Devices_Search";
            var dParameter = new Dictionary<string, string>();
            dParameter["DeviceName"] = string.IsNullOrEmpty(deviceName) ? "" : deviceName.ToString();
            dParameter["Status"] = status.ToString();
            dParameter["PageIndex"] = pageIndex.ToString();
            dParameter["PageSize"] = pageSize.ToString();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<DeviceEntity>(sql, dParameter, paramOutput: "Total");
            if (result.exception != null)
                return null;

            int Total = (int)result.paramOut;
            var listing = new ListDeviceEntity();
            listing.Listing = result.data.ToList();
            listing.Total = Total;

            return listing;
        }



        public int? Update(DeviceEntity entity)
        {

            string sql = "sp_Devices_Update";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@ID", entity.ID);
            dParameter.Add($"@DeviceName", entity.DeviceName);
            dParameter.Add($"@Note", entity.Note);
            dParameter.Add($"@ModifiedUser", entity.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }
    }
}
