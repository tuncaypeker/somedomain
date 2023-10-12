using SomeDomain.Data.Infrastructure.Entities;
using SomeDomain.Data;
using System.Configuration;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddControllersWithViews();
builder.Services.AddHttpContextAccessor();

//Configuration
builder.Services.Configure<DatabaseSettings>(builder.Configuration.GetSection("DatabaseSettings"));
builder.Services.AddOptions();

var databaseSettings = builder.Configuration
  .GetSection("DatabaseSettings")
  .Get<DatabaseSettings>();
builder.Services.AddScoped(x => new DataContext(databaseSettings.ConnectionString));
builder.Services.AddDbContext<DataContext>(ServiceLifetime.Scoped);

//Authentication
builder.Services.AddAuthentication(o =>
{
	o.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, o => { o.LoginPath = new PathString("/login/"); });

//logger
builder.Services.AddTransient(typeof(SomeDomain.Infrastructure.Interfaces.ILogger<>), typeof(SomeDomain.Infrastructure.Logging.DummyLog.Logger<>));

builder.Services.AddTransient<SomeDomain.Data.DomainData>();
builder.Services.AddTransient<SomeDomain.Data.DomainOfferData>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAuthentication();
app.UseRouting();

app.UseEndpoints(endpoints =>
{
	endpoints.MapDefaultControllerRoute();
});

app.Run();
