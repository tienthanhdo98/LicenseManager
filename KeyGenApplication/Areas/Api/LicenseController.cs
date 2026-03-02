using Areas.Api;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Interfaces;
using Services.Viewmodels;
using System;
using System.ComponentModel;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
using System.Security.Cryptography;
using Ultilities;

namespace KeyGenApplication.Areas.Api
{
    [Route("api/[controller]")]
    [ApiController]
    [Area("Api")]
    public class LicenseController : BaseController
    {
        private readonly ILicenseService _LicenseService;
        private readonly ILogger<LicenseController> _logger;
        private readonly string _privateKeyPkcs8Base64;

        public LicenseController(ILicenseService iLicenseService, ILogger<LicenseController> logger, IConfiguration config) : base()
        {
            _LicenseService = iLicenseService;
            _logger = logger;
            _privateKeyPkcs8Base64 = config["License:PrivateKeyPkcs8Base64"] ?? "";
        }


        [HttpGet]
        [Route("Search")]
        public IActionResult Search(String licenseName = "", int status = 0, int pageIndex = 1, int pageSize = 25)
        {
            try
            {
                _logger.LogInformation($"[Search] Request: {JsonConvert.SerializeObject(new { licenseName, status, pageIndex, pageSize })}");
              
                var result = _LicenseService.Search(licenseName, status, pageIndex, pageSize);
                _logger.LogInformation($"[Search] Response: {JsonConvert.SerializeObject(result)}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Search] Request: {JsonConvert.SerializeObject(new { licenseName, status, pageIndex, pageSize })}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }
        [HttpPost]
        [Route("Insert")]
        public IActionResult Insert([FromBody] LicenseViewModel viewModel)
        {
            try
            {
                _logger.LogInformation($"[Insert] Request: {JsonConvert.SerializeObject(viewModel)}");
                viewModel.CreatedUser = CurrentUserViewModel.Username;
                viewModel.ModifiedUser = CurrentUserViewModel.Username;


                var result = _LicenseService.Insert(viewModel);
                _logger.LogInformation($"[Insert] Response: {JsonConvert.SerializeObject(result)}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
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
        public IActionResult Update(LicenseViewModel viewModel)
        {
            try
            {
                _logger.LogInformation($"[Update] Request: {JsonConvert.SerializeObject(viewModel)}");
                viewModel.ModifiedUser = CurrentUserViewModel.Username;

                var result = _LicenseService.Update(viewModel);
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
                var result = _LicenseService.GetById(id);
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

        [HttpGet]
        [Route("GetByDeviceId")]
        public IActionResult GetByDeviceId([FromQuery] int deviceId)
        {
            try
            {
                _logger.LogInformation($"[GetByDeviceId] Request: {deviceId}");
                var result = _LicenseService.GetByDeviceId(deviceId);
                _logger.LogInformation($"[GetByDeviceId] Response: {deviceId}");
                return Ok(new
                {
                    Code = 1,
                    Data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[GetByDeviceId] Request: {JsonConvert.SerializeObject(new { DeviceId = deviceId })}");
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }

        [HttpPost]
        [Route("Delete")]
        public IActionResult Delete([FromBody] LicenseViewModel viewModel)
        {
            try
            {

                _logger.LogInformation($"[Delete] Request: {JsonConvert.SerializeObject(viewModel)}");
                var item = _LicenseService.Delete(viewModel.ID, CurrentUserViewModel.Username);
 
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

        [HttpPost]
        [Route("Revoke")]
        public IActionResult Revoke([FromBody] LicenseViewModel viewModel)
        {
            try
            {

                _logger.LogInformation($"[Revoke] Request: {JsonConvert.SerializeObject(viewModel)}");
                var item = _LicenseService.Revoke(viewModel.ID, CurrentUserViewModel.Username);

                if (item > 0)
                {
                    _logger.LogInformation($"[Revoke] Response: {JsonConvert.SerializeObject(item)}");
                    return Ok(new
                    {
                        Code = 1,
                        Message = "Thu hồi thành công"
                    });
                }
                else
                {
                    _logger.LogError($"[Revoke] Response: {JsonConvert.SerializeObject(item)}");
                    return Ok(new
                    {
                        Code = -1,
                        Message = "Thu hồi không thành công"
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

        [HttpPost]
        [Route("GenLicense")]
        public IActionResult GenerateLicense([FromBody] LicenseRequest req)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(req.ChipSetId))
                    return BadRequest("ChipSetId is required");

                if (req.StartTime == default)
                    return BadRequest("StartTime is required");

                if (req.ExpiredTime == default)
                    return BadRequest("ExpiredTime is required");

                if (string.IsNullOrWhiteSpace(_privateKeyPkcs8Base64))
                    return StatusCode(500, "Server signing key not configured");

                var nowUtc = DateTime.UtcNow;
                var startUtc = req.StartTime.ToUniversalTime();
                var expUtc = req.ExpiredTime.ToUniversalTime();

                if (expUtc <= startUtc)
                    return BadRequest("ExpiredTime must be after StartTime");

                long startEpoch = new DateTimeOffset(startUtc).ToUnixTimeSeconds();
                long expEpoch = new DateTimeOffset(expUtc).ToUnixTimeSeconds();

                var payload = new
                {
                    v = 1,
                    chipsetid = req.ChipSetId,
                    start = startEpoch,
                    exp = expEpoch,
                    nonce = Guid.NewGuid().ToString("N")
                };
                string licenseKey = LicenseSigner.Issue(payload, _privateKeyPkcs8Base64);


                return Ok(new
                {
                    Code = 1,
                    Message = licenseKey
                });


            }
            catch (Exception ex)
            {
              
                return Ok(new
                {
                    Code = -1,
                    Message = $"{ex.Message}"
                });
            }
        }

        [HttpGet("GetPubKey")]
        public IActionResult GetPubKey()
        {
            try
            {
                using var ecdsa = ECDsa.Create();
                ecdsa.ImportPkcs8PrivateKey(Convert.FromBase64String(_privateKeyPkcs8Base64), out _);

                byte[] spki = ecdsa.ExportSubjectPublicKeyInfo();
                //string pem = PemEncoding.WriteString("PUBLIC KEY", spki)
                //              .Replace("\r\n", "\n");

                //return Ok(new { Code = 1, Message = pem });

                string pubKeyBase64 = Convert.ToBase64String(spki);
                return Ok(new { Code = 1, Message = pubKeyBase64 });
            }
            catch (Exception ex)
            {
                return Ok(new { Code = -1, Message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpGet("ValidateLicense")]
        public IActionResult ValidateLicense([FromQuery] int deviceId)
        {
            try
            {
                var licenseItem = _LicenseService.GetByDeviceId(deviceId);

                // 1) Chưa có device
                if (licenseItem == null)
                {
                    return Ok(new
                    {
                        Code = 0,
                        Data = new
                        {
                            HasLicense = false
                        }
                    });
                }
                // 2) License bị xóa (nếu bạn dùng soft delete)
                if (licenseItem.Deleted)
                {
                    return Ok(new
                    {
                        Code = 0,
                        Data = new
                        {
                            HasLicense = false,           
                        }
                    });
                }
                // 3) Check hết hạn
                // Nếu ExpiredTime lưu UTC thì dùng DateTime.UtcNow
                // Nếu lưu local server time thì DateTime.Now
                var now = DateTime.Now;
                var isExpired = licenseItem.ExpiredTime <= now;

                // 4) Check trạng thái
                // Tùy bạn quy ước: ví dụ Status == 1 là Active
                var isActive = licenseItem.Status == 1;
                // 5) Kết luận tổng
                var isValid = !isExpired && isActive && !licenseItem.Deleted;

                return Ok(new
                {
                    Code = 1,
                    Data = new
                    {
                        HasLicense = true,
                        IsExpired = isExpired,
                        IsActive = isActive,
                        IsValid = isValid,
                        License = licenseItem.LicenseValue,
                        CurrentServerTime = now,
                    }
                });
            }
            catch (Exception ex)
            {
                return Ok(new { Code = -1, Message = ex.Message });
            }
        }


    }
}
