using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Ostale konfiguracije servisa...
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseCors(builder =>
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader());

        // Ostale konfiguracije aplikacije...
    }
}
