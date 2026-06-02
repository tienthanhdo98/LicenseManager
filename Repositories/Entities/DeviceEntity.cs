using Entities;

namespace Repositories.Entities
{
    public class DeviceEntity : BaseEntity
    {
        public int Id { get; set; }
        public string DeviceName { get; set; }
        public string Note { get; set; } = "";
        public bool Deleted { get; set; }
        public string ChipsetId { get; set; } = "";
    }
    public class ListDeviceEntity
    {
        public List<DeviceEntity> Listing = new List<DeviceEntity>();
        public int Total { get; set; }
    }
}
