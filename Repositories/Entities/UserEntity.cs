using Entities;

namespace Repositories.Entities
{
    public class UserEntity : BaseEntity
    {
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
}
