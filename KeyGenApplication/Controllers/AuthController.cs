using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Services.Interfaces;
using Services.Viewmodels;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace KeyGenApplication.Controllers
{
    public class AuthController : Controller
    {

        private readonly IUserService _iUserService;

        public AuthController(IUserService service)
        {
            _iUserService = service;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Login(string username, string password)
        {

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                TempData["Warning"] = "Vui lòng nhập đầy đủ thông tin!";
                return RedirectToAction("Index", "Auth");
            }
            var user = _iUserService.GetByUserName(username);

            if (user != null)
            {
                if (HashPassword(password).Equals(user.PasswordHash))
                {
                    ClaimsIdentity identity = new ClaimsIdentity(this.GetUserClaims(user), CookieAuthenticationDefaults.AuthenticationScheme);
                    ClaimsPrincipal principal = new ClaimsPrincipal(identity);

                    var authProperties = new AuthenticationProperties
                    {

                        IsPersistent = true

                    };
                    HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);
                    return RedirectToAction("Index", "Device");
                }
            }
            else
            {
                TempData["Error"] = "Tên đăng nhập hoặc mật khẩu không đúng!";
            }
            return RedirectToAction("Index", "Auth");

        }
        private IEnumerable<Claim> GetUserClaims(UserViewModel user)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()));
            claims.Add(new Claim(ClaimTypes.Name, user.Username));
            claims.Add(new Claim(ClaimTypes.UserData, JsonConvert.SerializeObject(user)));
            return claims;
        }
        private string HashPassword(string password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
        public async Task<IActionResult> Signout()
        {
            await HttpContext.SignOutAsync();

            return RedirectToAction("Index", "Auth");
        }
    }
}
