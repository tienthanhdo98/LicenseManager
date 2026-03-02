using Repositories.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IDeviceRepository
    {
        int? Insert(DeviceEntity entity);
        int? Update(DeviceEntity entity);
        int? Delete(int iD, String modifiedUser);
        DeviceEntity GetById(int Id);

        ListDeviceEntity Search(String deviceName = "", int status = 0, int pageIndex = 1, int pageSize = 25);

    }
}
