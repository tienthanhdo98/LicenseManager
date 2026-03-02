using Services.Viewmodels;

namespace Services.Interfaces
{
    public interface IUserService
    {
        UserViewModel GetByUserName(string userName);
        int? InsertUser(UserViewModel viewModel);
        int? UpdateUser(UserViewModel viewModel);
    }
}
