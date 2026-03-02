using Enums;
using Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;

namespace KeyGenApplication.Controllers
{
    [Authorize]
    public class DeviceController : BaseController
    {
        public DeviceController(IOptions<AppSettings> options) : base(options)
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

        [Route("device/chi-tiet/{id}")]
        public IActionResult Detail(int id = 0)
        {
            ViewBag.DeviceId = id;
            return View();
        }
    }

}
