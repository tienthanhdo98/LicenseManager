using Repositories.Entities;
using ViewModels;

namespace Services.Viewmodels
{
    public class DeviceViewModel : BaseViewModel
    {
        public DeviceViewModel() { }
        public DeviceViewModel(DeviceEntity entity) : base(entity)
        {
            Id = entity.Id;
            DeviceName = entity.DeviceName;
            Deleted = entity.Deleted;
            ChipsetId = entity.ChipsetId;
            Note = entity.Note;
            CreatedTime = entity.CreatedTime;
            CreatedUser = entity.CreatedUser;
            ModifiedUser = entity.ModifiedUser;
            ModifiedTime = entity.ModifiedTime;

        }

        public string DeviceName { get; set; }
        public string Note { get; set; } = "";
        public bool Deleted { get; set; }
        public string ChipsetId { get; set; }

    }
    public class ListDeviceViewModel
    {
        public List<DeviceViewModel> Listing { get; set; }
        public int Total { get; set; }
    }
}
