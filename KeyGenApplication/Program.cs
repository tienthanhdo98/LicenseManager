using KeyGenApplication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Configuration;
using Repositories;
using Repositories.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var provider = builder.Services.BuildServiceProvider();
var _configuration = provider.GetRequiredService<IConfiguration>();

// Add services to the container.
builder.Services.AddControllersWithViews();

var connection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddScoped<ISQLServerConnection>(c =>
{
    return new SQLServerConnection(connection);
});

builder.Services.AddAppService();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(CookieAuthenticationDefaults.AuthenticationScheme,
           options =>
           {
               options.LoginPath = "/Auth";
               options.LogoutPath = "/Auth/Signout";
               options.AccessDeniedPath = "/AccessDenied";
               options.Cookie.HttpOnly = true;
               options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
               options.ExpireTimeSpan = TimeSpan.FromDays(2);
               options.SlidingExpiration = true;
               options.ReturnUrlParameter = "ReturnUrl";
               options.Cookie.Name = CookieAuthenticationDefaults.AuthenticationScheme;

           });

builder.Services.Configure<AppSettings>(_configuration.GetSection("AppSettings"));

var app = builder.Build();


app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=auth}/{action=Index}");

app.Run();
