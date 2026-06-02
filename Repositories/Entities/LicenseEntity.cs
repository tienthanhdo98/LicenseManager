using Entities;

namespace Repositories.Entities
{
    public class LicenseEntity : BaseEntity
    {
        public int Id { get; set; }
        public int DeviceId { get; set; }

        public string LicenseName { get; set; } = "";

        public string LicenseValue { get; set; } = "";

        public bool Deleted { get; set; }

        public int Status { get; set; }

        public DateTime ExpiredTime { get; set; }
    }

    public class ListLicenseEntity
    {
        public List<LicenseEntity> Listing = new List<LicenseEntity>();
        public int Total { get; set; }
    }
}
