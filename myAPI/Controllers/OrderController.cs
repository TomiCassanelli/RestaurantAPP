using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using WebAPI.Data; // Para acceder a DBModel
using WebAPI.Models; // Para acceder a las clases Order, Customer, etc.

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly DBModel db; // Cambiar MyDbContext a DBModel

        public OrderController(DBModel context) // Cambiar el tipo de parámetro a DBModel
        {
            db = context;
        }

        // GET: api/Order
        [HttpGet]
        public ActionResult<IEnumerable<object>> GetOrders()
        {
            var result = (from a in db.Order
                          join b in db.Customer on a.CustomerID equals b.CustomerID
                          select new
                          {
                              a.OrderID,
                              a.OrderNo,
                              Customer = b.Name,
                              a.PMethod,
                              a.GTotal
                          }).ToList();

            return Ok(result);
        }

        // GET: api/Order/5
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Order), 200)]
        [ProducesResponseType(404)]
        public ActionResult GetOrder(long id)
        {
            var order = (from a in db.Order
                         where a.OrderID == id
                         select new
                         {
                             a.OrderID,
                             a.OrderNo,
                             a.CustomerID,
                             a.PMethod,
                             a.GTotal,
                             DeletedOrderItemIDs = ""
                         }).FirstOrDefault();

            var orderDetails = (from a in db.OrderItems
                                join b in db.Item on a.ItemID equals b.ItemID
                                where a.OrderID == id
                                select new
                                {
                                    a.OrderID,
                                    a.OrderItemID,
                                    a.ItemID,
                                    ItemName = b.Name,
                                    b.Price,
                                    a.Quantity,
                                    Total = a.Quantity * b.Price
                                }).ToList();

            if (order == null) return NotFound();
            return Ok(new { order, orderDetails });
        }

        // POST: api/Order
        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        public ActionResult PostOrder(Order order)
        {
            try
            {
                if (order.OrderID == 0)
                    db.Order.Add(order);
                else
                    db.Entry(order).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                foreach (var item in order.OrderItems)
                {
                    if (item.OrderItemID == 0)
                        db.OrderItems.Add(item);
                    else
                        db.Entry(item).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                }

                foreach (var id in order.DeletedOrderItemIDs.Split(',').Where(x => x != ""))
                {
                    var item = db.OrderItems.Find(Convert.ToInt64(id));
                    if (item != null) // Verificar que el objeto no sea nulo
                    {
                        db.OrderItems.Remove(item); // Eliminar solo si el objeto no es nulo
                    }
                }

                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Order/5
        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public ActionResult DeleteOrder(long id)
        {
            var order = db.Order.Include(o => o.OrderItems)
                .SingleOrDefault(o => o.OrderID == id);

            if (order == null) return NotFound();

            foreach (var item in order.OrderItems)
            {
                db.OrderItems.Remove(item);
            }

            db.Order.Remove(order);
            db.SaveChanges();
            return Ok(order);
        }

    }
}
