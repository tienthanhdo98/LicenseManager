using Areas.Api;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Interfaces;
using Services.Viewmodels;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;

namespace KeyGenApplication.Areas.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Area("Api")]
    public class DeviceController : BaseController
    {
        private readonly IDeviceService _IDeviceService;
        private readonly ILogger<DeviceController> _logger;
        private readonly string _privateKeyPkcs8Base64;

        public DeviceController(IDeviceService iDeviceService, ILogger<DeviceController> logger, IConfiguration config) : base()
        {
            _IDeviceService = iDeviceService;
            _logger = logger;
            _privateKeyPkcs8Base64 = config["License:PrivateKeyPkcs8Base64"] ?? "";
        }


        [HttpGet]
        [Route("Search")]
        public IActionResult Search(String deviceName = "", int status = 0, int pageIndex = 1, int pageSize = 25)
        {
            try
            {
                _logger.LogInformation($"[Search] Request: {JsonConvert.SerializeObject(new { deviceName,status, pageIndex, pageSize })}");


                var result = _IDeviceService.Search(deviceName,status, pageIndex, pageSize);
                _logger.LogInformation($"[Search] Response: {JsonConvert.SerializeObject(result)}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Search] Request: {JsonConvert.SerializeObject(new { deviceName,status, pageIndex, pageSize })}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }
        [HttpPost]
        [Route("Insert")]
        public IActionResult Insert(DeviceViewModel viewModel)
        {
            try
            {
                _logger.LogInformation($"[Insert] Request: {JsonConvert.SerializeObject(viewModel)}");
                viewModel.CreatedUser = CurrentUserViewModel.Username;
                viewModel.ModifiedUser = CurrentUserViewModel.Username;
      

                var result = _IDeviceService.Insert(viewModel);
                _logger.LogInformation($"[Insert] Response: {JsonConvert.SerializeObject(result)}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
                });
            }
    
            catch (SqlException ex) when (ex.Number == 2601 || ex.Number == 2627)
            {
                _logger.LogWarning(ex,
                    $"[Insert] DUPLICATE UNIQUE. SqlNumber={ex.Number}. Request={JsonConvert.SerializeObject(viewModel)}");

                return Ok(new
                {
                    Code = -2,
                    Data = "DeviceID/Serial đã tồn tại (trùng unique)."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Insert] Request: {JsonConvert.SerializeObject(viewModel)}");
                return Ok(new
                {
                    Code = -1,
                    Data = $"{ex.Message}"
                });
            }
        }

        [HttpPost]
        [Route("Update")]
        public IActionResult Update(DeviceViewModel viewModel)
        {
            try
            {
                _logger.LogInformation($"[Update] Request: {JsonConvert.SerializeObject(viewModel)}");
                viewModel.ModifiedUser = CurrentUserViewModel.Username;
                var result = _IDeviceService.Update(viewModel);
                _logger.LogInformation($"[Update] Response: {JsonConvert.SerializeObject(result)}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Update] Request: {JsonConvert.SerializeObject(viewModel)}");
                return Ok(new
                {
                    Code = -1,
                    Data = $"{ex.Message}"
                });
            }
        }

        [HttpGet]
        [Route("GetById")]
        public IActionResult GetById([FromQuery] int id)
        {
            try
            {
                _logger.LogInformation($"[GetById] Request: {id}");
                var result = _IDeviceService.GetById(id);
                _logger.LogInformation($"[GetById] Response: {id}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[GetById] Request: {JsonConvert.SerializeObject(new { Id = id })}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }

        [HttpPost]
        [Route("Delete")]
        public IActionResult Delete([FromBody] DeviceViewModel viewModel)
        {
            try
            {

                _logger.LogInformation($"[Delete] Request: {JsonConvert.SerializeObject(viewModel)}");
                var item = _IDeviceService.Delete(viewModel.ID, CurrentUserViewModel.Username);

                if (item > 0)
                {
                    _logger.LogInformation($"[Delete] Response: {JsonConvert.SerializeObject(item)}");
                    return Ok(new
                    {
                        Code = 1,
                        Message = "Xóa thành công"
                    });
                }
                else
                {
                    _logger.LogError($"[Delete] Response: {JsonConvert.SerializeObject(item)}");
                    return Ok(new
                    {
                        Code = -1,
                        Message = "Xóa không thành công"
                    });
                }


            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Delete] Response: {JsonConvert.SerializeObject(viewModel)}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }



    }
}
