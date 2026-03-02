using Entities;

namespace Repositories.Entities
{
    public class LicenseEntity : BaseEntity
    {
        public int ID { get; set; }
        public int DeviceID { get; set; }

        public string LicenseName { get; set; }

        public string LicenseValue { get; set; }

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
