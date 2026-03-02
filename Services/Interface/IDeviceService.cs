using Services.Viewmodels;

namespace Services.Interfaces
{
    public interface IDeviceService
    {
        int? Insert(DeviceViewModel entity);
        int? Update(DeviceViewModel entity);
        int? Delete(int iD, String modifiedUser);
        DeviceViewModel GetById(int Id);

        ListDeviceViewModel Search(String deviceName = "",int status = 0, int pageIndex = 1, int pageSize = 25);
    }
}
