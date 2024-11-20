using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyAPI.Services;
using MyAPI.Models;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderService.GetOrders();
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(long id)
        {
            var order = await _orderService.GetOrder(id);
            if (order == null) return NotFound();

            return Ok(order);
        }

        [HttpPost]
        public async Task<IActionResult> PostOrder(Order? order)
        {
            if (order == null)
                return BadRequest("Order cannot be null");

            if (string.IsNullOrWhiteSpace(order.OrderNo))
                return BadRequest("Order number is required");
            
            var success = await _orderService.PostOrder(order);
            if (!success)
                return BadRequest("Unable to save the order");

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(long id)
        {
            var success = await _orderService.DeleteOrder(id);
            if (!success) return NotFound();

            return Ok();
        }
    }
}
