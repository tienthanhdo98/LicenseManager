using Repositories.Entities;

namespace Repositories.Interfaces
{
    public interface ILicenseRepository
    {
        int? Insert(LicenseEntity entity);
        int? Update(LicenseEntity entity);
        int? Delete(int iD, String modifiedUser);
        int? Revoke(int iD, String modifiedUser);
        LicenseEntity GetById(int iD);
        LicenseEntity GetByDeviceId(int deviceID);
        ListLicenseEntity Search(String licenseName = "", int status = 0, int pageIndex = 1, int pageSize = 25);
    }
}
