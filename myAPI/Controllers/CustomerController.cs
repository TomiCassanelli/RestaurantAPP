using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyAPI.Services;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _customerService.GetCustomers();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomer(int id)
        {
            var customer = await _customerService.GetCustomer(id);
            if (customer == null) return NotFound();

            return Ok(customer);
        }
    }
}