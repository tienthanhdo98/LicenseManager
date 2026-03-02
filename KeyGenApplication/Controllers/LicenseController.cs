using Controllers;
using Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;

namespace KeyGenApplication.Controllers
{

    public class LicenseController : BaseController
    {
        public LicenseController(IOptions<AppSettings> options) : base(options)
        {
        }

        public IActionResult Index()
    {
        ViewBag.StatusSelects = EnumHelper.GetValues<StatusType>()
        .Select(e => new SelectListItem()
        {
            Text = e.Text,
            Value = e.Value.ToString()
        }).ToList();
        return View();
    }
}
}
