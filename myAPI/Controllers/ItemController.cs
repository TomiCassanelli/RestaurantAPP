using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyAPI.Data;
using MyAPI.Models;

namespace MyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly DBModel db;

        public ItemController(DBModel context)
        {
            db = context;
        }

        // GET: api/Item
        [HttpGet]
        public async Task<List<Item>> GetItems()
        {
            var items = await db.Item.ToListAsync();
            return items;
        }
    }
}