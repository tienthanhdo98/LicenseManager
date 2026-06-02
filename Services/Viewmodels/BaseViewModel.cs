


using Entities;

namespace ViewModels
{
    public class BaseViewModel
    {
        public BaseViewModel() { }
        public BaseViewModel(BaseEntity entity)
        {
            Id = entity.Id;
            CreatedTime = entity.CreatedTime;
            CreatedUser = entity.CreatedUser;
            ModifiedTime = entity.ModifiedTime;
            ModifiedUser = entity.ModifiedUser;
        }
        public int Id { get; set; }
        public DateTime CreatedTime { get; set; }
        public string CreatedUser { get; set; } = "";
        public DateTime ModifiedTime { get; set; }
        public string ModifiedUser { get; set; } = "";
    }
}
