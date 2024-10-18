using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Data; // Asegúrate de que tienes este espacio de nombres
using WebAPI.Models; // This allows access to the Customer, Item, and Order classes.


[ApiController]
[Route("api/[controller]")]
public class ItemController : ControllerBase
{
    private readonly DBModel _context;

    public ItemController(DBModel context)
    {
        _context = context;
    }

    // GET: api/Item
    [HttpGet]
    public ActionResult<IEnumerable<Item>> GetItems()
    {
        return _context.Item.ToList();
    }

}
