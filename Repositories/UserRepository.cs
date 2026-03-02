using Dapper;
using Repositories.Entities;
using Repositories.Interfaces;

namespace Repositories
{
    public class UserRepository : IUserRepository
    {
        private IDatabaseExecuteRepository<UserEntity> _databaseExecuteRepository;

        public UserRepository(IDatabaseExecuteRepository<UserEntity> databaseExecuteRepository)
        {
            _databaseExecuteRepository = databaseExecuteRepository;
        }

        public UserEntity GetByUserName(string UserName)
        {
            string sql = "sp_Users_GetByUserName";
            var dParameter = new Dictionary<string, string>();
            dParameter["UserName"] = UserName.ToString();
            var result = _databaseExecuteRepository.ExcecuteProceduceQuery<UserEntity>(sql, dParameter);
            if (result == null)
                return null;
            return result;
        }

        public int? InsertUser(UserEntity entity)
        {

            string sql = "sp_Users_Insert";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@CreatedUser", entity.ModifiedUser);
            dParameter.Add($"@ModifiedUser", entity.ModifiedUser);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }

        public int? UpdateUser(UserEntity model)
        {
            string sql = "sp_Users_Update";
            DynamicParameters dParameter = new DynamicParameters();
            dParameter.Add($"@Id", model.ID);
            dParameter.Add($"@PasswordHash", model.PasswordHash);
            dParameter.Add($"@FullName", model.FullName);
            dParameter.Add($"@Email", model.Email);
            dParameter.Add($"@Phone", model.Phone);
            dParameter.Add($"@Address", model.Address);
            dParameter.Add($"@Avatar", model.Avatar);
            dParameter.Add($"@Status", model.Status);
            dParameter.Add($"@UserTypeId", model.UserTypeId);
            dParameter.Add($"@SuperAdmin", model.SuperAdmin);
            dParameter.Add($"@TeamId", model.TeamId);
            dParameter.Add($"@Attributes", model.Attributes);
            dParameter.Add($"@SiteId", model.SiteId);
            dParameter.Add($"@ModifiedUser", model.ModifiedUser);
            dParameter.Add($"@IsFirstLogin", model.IsFirstLogin);
            dParameter.Add($"@GoogleAuthenticatorQR", model.GoogleAuthenticatorQR);
            dParameter.Add($"@IsGoogleAuthenticator", model.IsGoogleAuthenticator);
            dParameter.Add($"@LoginFailCount", model.LoginFailCount);
            dParameter.Add($"@Question1", model.Question1);
            dParameter.Add($"@Question2", model.Question2);
            dParameter.Add($"@Question3", model.Question3);
            dParameter.Add($"@IdentityNumber", model.IdentityNumber);
            dParameter.Add($"@HomeTown", model.HomeTown);
            dParameter.Add($"@BankAccountNumber", model.BankAccountNumber);
            dParameter.Add($"@TaxCode", model.TaxCode);
            dParameter.Add($"@ManualEntryKey", model.ManualEntryKey);
            var result = _databaseExecuteRepository.ExcecuteNonQuery(sql, dParameter);
            return result;
        }
    }
}
