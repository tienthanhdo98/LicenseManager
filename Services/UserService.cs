

using Repositories.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using Services.Viewmodels;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _iUserRepository;

        public UserService(IUserRepository iUserRepository)
        {
            _iUserRepository = iUserRepository;
        }

        public UserViewModel GetByUserName(string userName)
        {
            var result = _iUserRepository.GetByUserName(userName);
            if (result == null)
                return null;
            return new UserViewModel(result);
        }

        public int? InsertUser(UserViewModel viewModel)
        {
            return 0;
        }

        public int? UpdateUser(UserViewModel viewModel)
        {
            var userEntity = new UserEntity();
            userEntity.ID = viewModel.ID;
            userEntity.Username = viewModel.Username;
            userEntity.FullName = viewModel.FullName;
            userEntity.Email = viewModel.Email;
            userEntity.Phone = viewModel.Phone;
            userEntity.Avatar = viewModel.Avatar;
            userEntity.Address = viewModel.Address;
            userEntity.IdentityNumber = viewModel.IdentityNumber;
            userEntity.BankAccountNumber = viewModel.BankAccountNumber;
            userEntity.LoginFailCount = viewModel.LoginFailCount;
            userEntity.PasswordHash = viewModel.PasswordHash;
            userEntity.ModifiedUser = viewModel.ModifiedUser;

            var result = _iUserRepository.UpdateUser(userEntity);
            if (result == null)
                return null;
            return result;
        }

    
    }
}
