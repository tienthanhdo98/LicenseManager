using Repositories.Entities;
using Services.Viewmodels;

namespace Services.Interfaces
{
    public interface ILicenseService
    {
        int? Insert(LicenseViewModel entity);
        int? Update(LicenseViewModel entity);
        int? Delete(int iD, String modifiedUser);
        int? Revoke(int iD, String modifiedUser);
        LicenseViewModel GetById(int iD);
        LicenseViewModel GetByDeviceId(int DeviceID);
        ListLicenseViewModel Search(String licenseName = "", int status = 0, int pageIndex = 1, int pageSize = 25);
    }
}
