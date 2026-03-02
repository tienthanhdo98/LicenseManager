



using Repositories.Entities;

namespace Repositories.Interfaces
{
    public interface IUserRepository
    {
        UserEntity GetByUserName(string UserName);
        int? InsertUser(UserEntity userEntity);
        int? UpdateUser(UserEntity userEntity);

    }
}
