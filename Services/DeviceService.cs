using Repositories.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Viewmodels;

namespace Services
{
    public class DeviceService : IDeviceService
    {
        private readonly IDeviceRepository _IDeviceRepository;

        public DeviceService(IDeviceRepository iDeviceRepository)
        {
            _IDeviceRepository = iDeviceRepository;
        }

        public int? Delete(int iD, string modifiedUser)
        {
            var result = _IDeviceRepository.Delete(iD, modifiedUser);
            return result;
        }



        public DeviceViewModel GetById(int Id)
        {
            var result = _IDeviceRepository.GetById(Id);
            if (result == null)
                return null;
            return new DeviceViewModel(result);
        }
   

        public int? Insert(DeviceViewModel viewModel)
        {
            var entity = new DeviceEntity
            {
                DeviceName = viewModel.DeviceName,
                Note = viewModel.Note,
                ChipsetID = viewModel.ChipsetID,
                CreatedUser = viewModel.CreatedUser,
                ModifiedUser = viewModel.ModifiedUser,
            };

            var result = _IDeviceRepository.Insert(entity);
            if (result == null)
                return null;
            return result;
        }

        public ListDeviceViewModel Search(String deviceName = "", int status = 0, int pageIndex = 1, int pageSize = 25)
        {
            var result = _IDeviceRepository.Search(deviceName, status,pageIndex, pageSize);
            if (result == null)
                return new ListDeviceViewModel();

            ListDeviceViewModel listing = new ListDeviceViewModel
            {
                Listing = result.Listing.Select(p => new DeviceViewModel(p)).ToList(),
                Total = result.Total
            };

            return listing;
        }

        public int? Update(DeviceViewModel viewModel)
        {
            var entity = new DeviceEntity
            {
                ID = viewModel.ID,
                DeviceName = viewModel.DeviceName,
                Deleted = viewModel.Deleted,
                Note = viewModel.Note,
                ChipsetID = viewModel.ChipsetID,
                CreatedUser = viewModel.CreatedUser,
                ModifiedUser = viewModel.ModifiedUser,
            };

            var result = _IDeviceRepository.Update(entity);
            if (result == null)
                return null;
            return result;
        }
    }
}
