using Repositories.Entities;
using System.ComponentModel.DataAnnotations;
using ViewModels;

namespace Services.Viewmodels
{
    public class UserViewModel : BaseViewModel
    {
        public UserViewModel()
        {
        }
        public UserViewModel(UserEntity entity)
        {
            ID = entity.ID;
            Username = entity.Username;
            PasswordHash = entity.PasswordHash;
            FullName = entity.FullName;
            Email = entity.Email;
            Phone = entity.Phone;
            Address = entity.Address;
            Avatar = entity.Avatar;
            Deleted = entity.Deleted;
            Status = entity.Status;
            UserTypeId = entity.UserTypeId;
            SuperAdmin = entity.SuperAdmin;
            TeamId = entity.TeamId;
            Attributes = entity.Attributes;
            SiteId = entity.SiteId;
            IsFirstLogin = entity.IsFirstLogin;
            GoogleAuthenticatorQR = entity.GoogleAuthenticatorQR;
            IsGoogleAuthenticator = entity.IsGoogleAuthenticator;
            LoginFailCount = entity.LoginFailCount;
            IdentityNumber = entity.IdentityNumber;
            HomeTown = entity.HomeTown;
            BankAccountNumber = entity.BankAccountNumber;
            TaxCode = entity.TaxCode;
            ManualEntryKey = entity.ManualEntryKey;
            Question1 = entity.Question1;
            Question2 = entity.Question2;
            Question3 = entity.Question3;
        }
        public String Username { get; set; } = "";
        public String PasswordHash { get; set; } = "";
        public String FullName { get; set; } = "";
        public String Email { get; set; } = "";
        public String Phone { get; set; } = "";
        public String Address { get; set; } = "";
        public String Avatar { get; set; } = "";
        public bool Deleted { get; set; } = true;
        public int Status { get; set; }
        public int UserTypeId { get; set; }
        public int SuperAdmin { get; set; }
        public int TeamId { get; set; }
        public int Attributes { get; set; }
        public int SiteId { get; set; }
        public bool IsFirstLogin { get; set; }
        public String GoogleAuthenticatorQR { get; set; } = "";
        public bool IsGoogleAuthenticator { get; set; }
        public int LoginFailCount { get; set; } = 0;
        public String IdentityNumber { get; set; } = "";
        public String HomeTown { get; set; } = "";
        public String BankAccountNumber { get; set; } = "";
        public String TaxCode { get; set; } = "";
        public String ManualEntryKey { get; set; } = "";
        public String Question1 { get; set; } = "";
        public String Question2 { get; set; } = "";
        public String Question3 { get; set; } = "";
    }
    public class ActionResetPasswordViewModel
    {

        public ActionResetPasswordViewModel() { }

        public int Id { get; set; }

        [Required(ErrorMessage = "Hãy nhập {0}")]
        [Display(Name = "Tên đăng nhập ")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Hãy nhập {0}")]
        [Display(Name = "Mật khẩu mới")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Hãy nhập {0}")]
        [Compare("Password", ErrorMessage = "Mật khẩu không khớp, Vui lòng nhập lại!")]
        [Display(Name = "Nhập lại mật khẩu mới")]
        public string PasswordAgain { get; set; }
    }
}
