using Microsoft.AspNetCore.Mvc;
using SomeDomain.Data.Entities;
using SomeDomain.OneUI.Authorize;
using SomeDomain.OneUI.Models;

namespace SomeDomain.OneUI.Controllers
{
	[Authorize]
	public class DomainController : Controller
	{
		SomeDomain.Data.DomainData domainData;
		SomeDomain.Data.DomainOfferData domainOfferData;

		public DomainController(Data.DomainData domainData, Data.DomainOfferData domainOfferData)
		{
			this.domainData = domainData;
			this.domainOfferData = domainOfferData;
		}

		public IActionResult Index()
		{
			var notReadOffersCount = domainOfferData.GetCount(x => !x.HasSeen);
			ViewBag.NotReadOffersCount = notReadOffersCount;

			var domains = domainData.GetAll("Name", isDesc: false);

			return View(domains);
		}

		[HttpGet]
		public ActionResult Add()
		{
			var model = new Domain()
			{
				ExpireDate = DateTime.Now.AddYears(1),
			};

			return View(model);
		}

		[HttpPost]
		public ActionResult Add(Domain domain)
		{
			var messages = new List<string>();
			if (string.IsNullOrEmpty(domain.Name))
				messages.Add("name girilmelidir");

			if (messages.Count > 0)
			{
				ViewBag.Result = new ViewModelResult(false, "Hata Oluştu", messages);
				return View(domain);
			}

			domain.Description = domain.Description ?? "";
			domain.DescriptionTR = domain.DescriptionTR ?? "";

			var operationResult = domainData.Insert(domain);
			if (operationResult.IsSucceed)
			{
				ViewBag.Result = new ViewModelResult(true, "Domain Eklendi");
				return View(new Domain() { });
			}

			ViewBag.Result = new ViewModelResult(false, operationResult.Message);
			return View(domain);
		}

		[HttpGet]
		public ActionResult Edit(int id)
		{
			var data = domainData.GetByKey(id);
			return View(data);
		}

		[HttpPost]
		public ActionResult Edit(Domain domain)
		{
			var messages = new List<string>();
			var modelInDb = domainData.GetByKey(domain.Id);
			if (modelInDb == null)
			{
				ViewBag.Result = new ViewModelResult(false, "Hata Oluştu", messages);
				return View(domain);
			}

			if (string.IsNullOrEmpty(domain.Name)) messages.Add("name girilmelidir");
			if (messages.Count > 0)
			{
				ViewBag.Result = new ViewModelResult(false, "Hata Oluştu", messages);
				return View(domain);
			}

			modelInDb.Description = domain.Description ?? "";
			modelInDb.DescriptionTR = domain.DescriptionTR ?? "";
			modelInDb.Name = domain.Name;
			modelInDb.MinOffer = domain.MinOffer;
			modelInDb.BuyNow = domain.BuyNow;
			modelInDb.Registry = domain.Registry;
			modelInDb.ExpireDate = domain.ExpireDate;

			var dbResult = domainData.Update(modelInDb);
			ViewBag.Result = dbResult.IsSucceed
				? new ViewModelResult(true, "Güncellendi")
				: new ViewModelResult(false, dbResult.Message);

			return View(domain);
		}

		[HttpGet]
		public ActionResult Delete(int id)
		{
			var domain = domainData.GetByKey(id);
			if (domain == null) {
				//domain bulamadik ama biz offer'lar kalmistir falan silelim
				domainOfferData.DeleteBulk(x => x.DomainId == id);

				return RedirectToAction("Index", "Domain", new { t = "domain_not_found" });
			}

			var result = domainData.DeleteByKey(id);
			if (result.IsSucceed)
				return RedirectToAction("Index", "Domain");

			return RedirectToAction("Index", "Domain", new { t = "domain_silinemedi" });
		}

		[HttpGet]
		public ActionResult Offers(int id)
		{
			var domainInDb = domainData.GetByKey(id);
			var domainOffersInDb = domainOfferData.GetBy(x => x.DomainId == id);

			var viewModel = new Models.OfferListViewModel()
			{
				Domain = domainInDb,
				DomainOffers = domainOffersInDb
			};

			return View(viewModel);
		}


		[HttpGet]
		public ActionResult OffersNotSeen()
		{
			var domainOffersInDb = domainOfferData.GetBy(x => !x.HasSeen);

			return View(domainOffersInDb);
		}

		public ActionResult OfferDelete(int id)
		{
			var offerInDb = domainOfferData.GetByKey(id);
			if (offerInDb == null)
				return RedirectToAction("Index", "Domain", new { t = "no_offer_found" });

			var dbResult = domainOfferData.DeleteByKey(id);

			return RedirectToAction("Offers", new { id = offerInDb.DomainId });
		}

		[HttpPost]
		public JsonResult OfferCheckAsSeen(int id)
		{
			var updateResult = domainOfferData.UpdateBulk(x => x.Id == id, new List<string> { "HasSeen" }, new List<object> { true });

			return Json(new { result = updateResult.IsSucceed });
		}
	}
}
