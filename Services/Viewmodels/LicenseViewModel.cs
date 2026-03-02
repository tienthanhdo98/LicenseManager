using Repositories.Entities;
using ViewModels;

namespace Services.Viewmodels
{
    public class LicenseViewModel : BaseViewModel
    {
        public LicenseViewModel() { }

        public LicenseViewModel(LicenseEntity entity) : base(entity)
        {
            ID = entity.ID;
            DeviceID = entity.DeviceID;
            LicenseName = entity.LicenseName;
            LicenseValue = entity.LicenseValue;
            Deleted = entity.Deleted;
            Status = entity.Status;
            ExpiredTime = entity.ExpiredTime;
            CreatedTime = entity.CreatedTime;
            CreatedUser = entity.CreatedUser;
            ModifiedUser = entity.ModifiedUser;
            ModifiedTime = entity.ModifiedTime;

        }
        public int DeviceID { get; set; }

        public string LicenseName { get; set; }

        public string LicenseValue { get; set; }

        public bool Deleted { get; set; }

        public int Status { get; set; }

        public DateTime ExpiredTime { get; set; }
    }
    public class ListLicenseViewModel
    {
        public List<LicenseViewModel> Listing { get; set; }
        public int Total { get; set; }
    }
}
