using Entities;
using Tek4AIWorkspaces.Data.Enums;

namespace Repositories.Entities
{
    public class MenuEntity : BaseEntity
    {
        public string Name { get; set; }
        public int ParentId { get; set; }
        public string Path { get; set; }
        public string Icon { get; set; }
        public int Order { get; set; }
        public bool Deleted { get; set; }
        public int SiteId { get; set; }
        public MenuStatus Status { get; set; }
        public int ApplicationId { get; set; }
    }
    public class ListMenuEntity
    {
        public List<MenuEntity> Listing = new List<MenuEntity>();
        public int Total { get; set; }
    }
}
