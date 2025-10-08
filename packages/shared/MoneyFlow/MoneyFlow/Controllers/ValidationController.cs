using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace MoneyFlow.Controllers
{
    public class ValidationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
