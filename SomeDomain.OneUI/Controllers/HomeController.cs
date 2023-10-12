using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using SomeDomain.Data.Entities;
using SomeDomain.OneUI.Authorize;
using SomeDomain.OneUI.Extensions;
using SomeDomain.OneUI.Models;
using System.Security.Claims;

namespace SomeDomain.OneUI.Controllers
{
    public class HomeController : Controller
	{
		private IHttpContextAccessor httpContextAccessor;
		SomeDomain.Data.DomainData domainData;
		SomeDomain.Data.DomainOfferData domainOfferData;

        public HomeController(IHttpContextAccessor _httpContextAccessor, Data.DomainData domainData, Data.DomainOfferData domainOfferData)
        {
            this.httpContextAccessor = _httpContextAccessor;
            this.domainData = domainData;
            this.domainOfferData = domainOfferData;
        }

        public IActionResult Index()
		{
			var request = httpContextAccessor.HttpContext.Request;
			string host = request.Host.Host;

			var domainInDb = domainData.FirstOrDefault(d => d.Name == host);
			if(domainInDb == null)
				return StatusCode(StatusCodes.Status404NotFound);

			domainInDb.Hit += 1;
			domainData.Update(domainInDb);

			var languages = request.GetUserLanguages();
			if (languages.Contains("tr") || languages.Contains("tr-TR"))
				domainInDb.Description = domainInDb.DescriptionTR;

			return View(domainInDb);
		}

		[HttpGet]
		public ActionResult Login(string url)
		{
			ViewBag.Url = url;

			return View();
		}

		[HttpPost]
		public ActionResult Login(string username, string password, string url = "")
		{
			var errors = new List<string>();
			if (string.IsNullOrEmpty(username))
				errors.Add("Kullanıcı adı boş bırakılamaz");
			if (string.IsNullOrEmpty(password))
				errors.Add("Şifre boş bırakılamaz");

			if (errors.Count > 0)
			{
				ViewBag.Errors = errors;
				return View();
			}

			if (username != "admin" || password != "admin")
			{
				errors.Add("Kullanıcı bilgileri hatalı girilmiş lütfen kontrol ediniz.");
				ViewBag.Errors = errors;
				return View();
			}

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.Name, username),
				new Claim("UserId", "1"),
				new Claim(ClaimTypes.Role, "1"),
			};

			var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
			var authProperties = new AuthenticationProperties
			{
				ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30),
			};

			HttpContext.SignInAsync(
				CookieAuthenticationDefaults.AuthenticationScheme,
				new ClaimsPrincipal(claimsIdentity),
				authProperties);

			if (!string.IsNullOrEmpty(url))
				return Redirect("/" + url);

			return RedirectToAction("Index", "Home");
		}

		[Authorize]
		public ActionResult Logout()
		{
			if (User.Identity.IsAuthenticated)
				HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

			return RedirectToAction("Login", "Home");
		}

		public ActionResult _403()
		{
			return View();
		}

		[HttpPost]
		public ActionResult Offer(OfferViewModel model)
		{
			if (string.IsNullOrEmpty(model.Name) || string.IsNullOrEmpty(model.Email))
				return RedirectToAction("Index", new { t = "validation_error" });

			var domainOffer = new DomainOffer()
			{
				CreateDate = DateTime.Now,
				Email = model.Email,
				Name = model.Name,
				Offer = model.Offer,
				DomainId = model.DomainId,
				HasSeen = false
			};

			var domainDataInsert = domainOfferData.Insert(domainOffer);

			return RedirectToAction("Index", new { t = domainDataInsert.IsSucceed });
		}
	}
}
