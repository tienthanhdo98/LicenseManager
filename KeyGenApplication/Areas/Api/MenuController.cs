using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Interfaces;
using Services.ViewModels;

namespace Areas.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Area("Api")]
    public class MenuController : BaseController
    {

        private readonly ILogger<MenuController> _logger;
        private readonly IMenuService _IMenuService;


        public MenuController(ILogger<MenuController> logger,

            IUserService iAspNetUserService,


        IMenuService categoryService
       ) : base()
        {
           
            _logger = logger;
            _IMenuService = categoryService;

        }


        [HttpGet]
        [Route("GetAll")]
        public IActionResult GetAll()
        {
            try
            {
                var data = _IMenuService.GetAll();
                _logger.LogInformation($"[GetAll] Response: {JsonConvert.SerializeObject(data)}");
                return Ok(new
                {
                    Code = 1,
                    Message = "Thành công!",
                    Data = data
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[GetAll] Request: " + ex.Message);
                return Ok(new { Code = -1, Message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                _logger.LogInformation($"[Get] Request: {JsonConvert.SerializeObject(new { Id = id })}");
                var menu = _IMenuService.GetById(id);
                var model = new ActionMenuViewModel(menu);


                _logger.LogInformation($"[Get] Response: {JsonConvert.SerializeObject(model)}");
                return Ok(new
                {
                    Code = 1,
                    Message = "Thành công!",
                    Data = model
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Get] Request: {JsonConvert.SerializeObject(new { Id = id })}");
                return Ok(new { Code = -1, Message = ex.Message });
            }
        }


        [HttpPost]
        [Route("FindAll")]
        public IActionResult FindAll([FromBody] MenuByParentIdViewModel model)
        {
            try
            {
                _logger.LogInformation($"[FindAll] Request: {JsonConvert.SerializeObject(model)}");
                var menus = _IMenuService.FindAll(-1, model.ApplicationId, -1);
                _logger.LogInformation($"[FindAll] Response: {JsonConvert.SerializeObject(menus)}");
                return Ok(new
                {
                    Code = 1,
                    Message = "Thành công!",
                    Data = menus
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[FindAll] Request: {JsonConvert.SerializeObject(model)}");
                return Ok(new { Code = -1, Message = ex.Message });
            }
        }

        [HttpPost]
        [Route("GetByParentId")]
        public IActionResult GetByParentId([FromBody] MenuByParentIdViewModel model)
        {
            try
            {
                _logger.LogInformation($"[GetByParentId] Request: {JsonConvert.SerializeObject(model)}");
                var menus = _IMenuService.GetByParentId(0, model.ApplicationId, model.SiteId);
                menus.Insert(0, new MenuViewModel { ID = 0, Name = "Chọn danh mục cha" });
                _logger.LogInformation($"[GetByParentId] Response: {JsonConvert.SerializeObject(menus)}");
                return Ok(new
                {
                    Code = 1,
                    Message = "Thành công!",
                    Data = menus
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[GetByParentId] Request: {JsonConvert.SerializeObject(model)}");
                return Ok(new { Code = -1, Message = ex.Message });
            }
        }

        [HttpPost]
        [Route("Delete")]
        public IActionResult Delete(int Id)
        {
            try
            {
                _logger.LogInformation($"[Delete] Request: {JsonConvert.SerializeObject(new { Id = Id })}");
                var objId = _IMenuService.Delete(Id, CurrentUserViewModel.ModifiedUser);
                if (objId > 0)
                {
                    _logger.LogInformation($"[Delete] Response: {JsonConvert.SerializeObject(objId)}");
                    return Ok(new
                    {
                        Code = 1,
                        Message = "Xóa thành công"
                    });
                }
                else
                {
                    _logger.LogInformation($"[Delete] Response: {JsonConvert.SerializeObject(objId)}");
                    return Ok(new
                    {
                        Code = -1,
                        Message = "Xóa không thành công",
                    });
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Delete] Request: {JsonConvert.SerializeObject(new { Id = Id })}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }
    }
}
