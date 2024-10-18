using Microsoft.AspNetCore.Mvc;
using System.Linq;
using WebAPI.Data; // Para acceder a DBModel
using WebAPI.Models; // Para acceder a Customer

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly DBModel db; // Cambiar MyDbContext a DBModel

        public CustomerController(DBModel context) // Cambiar el tipo de parámetro a DBModel
        {
            db = context;
        }

        // GET: api/Customer
        [HttpGet]
        public ActionResult<IQueryable<Customer>> GetCustomers()
        {
            return Ok(db.Customer);
        }

    }
}
