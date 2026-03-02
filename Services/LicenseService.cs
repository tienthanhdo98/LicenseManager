using Repositories.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Viewmodels;

namespace Services
{
    public class LicenseService : ILicenseService
    {
        private readonly ILicenseRepository _ILicenseRepository;

        public LicenseService(ILicenseRepository iLicenseRepository)
        {
            _ILicenseRepository = iLicenseRepository;
        }

        public int? Delete(int iD, string modifiedUser)
        {
            var result = _ILicenseRepository.Delete(iD, modifiedUser);
            return result;
        }
        public int? Revoke(int iD, string modifiedUser)
        {
            var result = _ILicenseRepository.Revoke(iD, modifiedUser);
            return result;
        }




        public LicenseViewModel GetById(int Id)
        {
            var result = _ILicenseRepository.GetById(Id);
            if (result == null)
                return null;
            return new LicenseViewModel(result);
        }
        public LicenseViewModel GetByDeviceId(int deviceID)
        {
            var result = _ILicenseRepository.GetByDeviceId(deviceID);
            if (result == null)
                return null;
            return new LicenseViewModel(result);
        }

        public int? Insert(LicenseViewModel viewModel)
        {
        
            var entity = new LicenseEntity
            {
                ID = viewModel.ID,
                DeviceID = viewModel.DeviceID,
                LicenseName = viewModel.LicenseName,
                LicenseValue = viewModel.LicenseValue,
                Deleted = viewModel.Deleted,
                Status = viewModel.Status,
                CreatedTime = viewModel.CreatedTime,
                ExpiredTime = viewModel.ExpiredTime,
                CreatedUser = viewModel.CreatedUser,
                ModifiedUser = viewModel.ModifiedUser,
              
            };


            var result = _ILicenseRepository.Insert(entity);
            if (result == null)
                return null;
            return result;
        }

        public ListLicenseViewModel Search(String licenseName = "", int status = 0, int pageIndex = 1, int pageSize = 25)
        {
            var result = _ILicenseRepository.Search(licenseName, status, pageIndex, pageSize);
            if (result == null)
                return new ListLicenseViewModel();

            ListLicenseViewModel listing = new ListLicenseViewModel
            {
                Listing = result.Listing.Select(p => new LicenseViewModel(p)).ToList(),
                Total = result.Total
            };

            return listing;
        }

        public int? Update(LicenseViewModel viewModel)
        {
            var entity = new LicenseEntity
            {
                ID = viewModel.ID,
                DeviceID = viewModel.DeviceID,
                LicenseName = viewModel.LicenseName,
                LicenseValue = viewModel.LicenseValue,
                Deleted = viewModel.Deleted,
                Status = viewModel.Status,
                CreatedTime = viewModel.CreatedTime,
                ExpiredTime = viewModel.ExpiredTime,
                CreatedUser = viewModel.CreatedUser,
                ModifiedUser = viewModel.ModifiedUser,

            };

            var result = _ILicenseRepository.Update(entity);
            if (result == null)
                return null;
            return result;
        }
    }
}



























































