using Microsoft.AspNetCore.Mvc;

namespace MyAPI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.Title = "Home Page";
            return View();
        }
    }
}
