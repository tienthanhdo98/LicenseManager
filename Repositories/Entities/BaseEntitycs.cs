

namespace Entities
{
    public class BaseEntity
    {
        public int ID { get; set; }
        public DateTime CreatedTime { get; set; }
        public string CreatedUser { get; set; }
        public DateTime ModifiedTime { get; set; }
        public string ModifiedUser { get; set; }
    }
}
