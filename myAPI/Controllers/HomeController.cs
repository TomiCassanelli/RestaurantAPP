using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    // Cambiamos de ControllerBase a Controller
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.Title = "Home Page";
            return View();
        }
    }
}
