using Microsoft.AspNetCore.Mvc;
using System.Linq;
using MyAPI.Data; // Para acceder a DBModel
using MyAPI.Models; // Para acceder a Customer
using Microsoft.EntityFrameworkCore;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly DBModel db;

        public CustomerController(DBModel context)
        {
            db = context;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<List<Customer>> GetCustomers()
        {
            var customers = await db.Customer.ToListAsync();
            return customers;
        }

    }
}
