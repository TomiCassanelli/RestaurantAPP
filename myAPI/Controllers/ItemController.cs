using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyAPI.Services;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            var items = await _itemService.GetItems();
            return Ok(items);
        }
    }
}
