

namespace Entities
{
    public class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedTime { get; set; }
        public string CreatedUser { get; set; }
        public DateTime ModifiedTime { get; set; }
        public string ModifiedUser { get; set; }
    }
}
