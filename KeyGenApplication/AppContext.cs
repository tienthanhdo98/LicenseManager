using Repositories;
using Repositories.Interfaces;
using Services;
using Services.Interfaces;




namespace KeyGenApplication
{
    public static class AppContext
    {
        public static void AddAppService(this IServiceCollection services)
        {
           

            //REPOSITORIES 
            services.AddScoped(typeof(IDatabaseExecuteRepository<>), typeof(DatabaseExecuteRepository<>));
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IDeviceRepository, DeviceRepository>();
            services.AddScoped<ILicenseRepository, LicenseRepository>();
            services.AddScoped<IMenuRepository, MenuRepository>();


            //SERVICE
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IDeviceService, DeviceService>();
            services.AddScoped<ILicenseService, LicenseService>();
            services.AddScoped<IMenuService, MenuService>();

        }
    }
}
