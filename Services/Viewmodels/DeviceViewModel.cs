using Repositories.Entities;
using ViewModels;

namespace Services.Viewmodels
{
    public class DeviceViewModel : BaseViewModel
    {
        public DeviceViewModel() { }
        public DeviceViewModel(DeviceEntity entity) : base(entity)
        {
            ID = entity.ID;
            DeviceName = entity.DeviceName;
            Deleted = entity.Deleted;
            ChipsetID = entity.ChipsetID;
            Note = entity.Note;
            CreatedTime = entity.CreatedTime;
            CreatedUser = entity.CreatedUser;
            ModifiedUser = entity.ModifiedUser;
            ModifiedTime = entity.ModifiedTime;

        }
        public int ID { get; set; }
        public string DeviceName { get; set; }
        public string Note { get; set; } = "";
        public bool Deleted { get; set; }
        public string ChipsetID { get; set; }

    }
    public class ListDeviceViewModel
    {
        public List<DeviceViewModel> Listing { get; set; }
        public int Total { get; set; }
    }
}
