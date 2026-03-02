using Services.ViewModels;

namespace Models
{
    public class MenuComponentViewModel
    {
        public string CurrentPath { get; set; }
        public List<MenuViewModel> Menus { get; set; } = new();
    }

    public class MenuItemViewModel
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string Name { get; set; }
        public string? Path { get; set; }
        public string? Icon { get; set; }
        public bool IsActive { get; set; }
        public bool IsOpen { get; set; }   // mở accordion
        public List<MenuItemViewModel> Children { get; set; } = new();
    }
}
