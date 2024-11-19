using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using MyAPI.Data;
using MyAPI.Models;
using MyAPI.DTOs;

namespace MyAPI.Services
{
    public class OrderService
    {
        private readonly DBModel _dbContext;

        public OrderService(DBModel dbContext)
        {
            _dbContext = dbContext;
        }

        // Obtener todos los pedidos
        public async Task<List<Order>> GetOrders()
        {
            return await _dbContext.Order.ToListAsync();
        }

        // Obtener un pedido por ID
        public async Task<object?> GetOrder(long id)
        {
            // Consulta principal para el pedido
            var order = await (from a in _dbContext.Order
                            where a.OrderID == id
                            select new
                            {
                                a.OrderID,
                                a.OrderNo,
                                a.CustomerID,
                                a.PMethod,
                                a.GTotal,
                                DeletedOrderItemIDs = ""
                            }).FirstOrDefaultAsync();

            // Si no encuentra el pedido, retorna null
            if (order == null) return null;

            // Consulta para los detalles del pedido
            var orderDetails = await (from a in _dbContext.OrderItems
                                    join b in _dbContext.Item on a.ItemID equals b.ItemID
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
                                    }).ToListAsync();

            // Retorna el objeto combinado como lo hacía el controlador original
            return new { order, orderDetails };
        }

        // Crear o actualizar un pedido
        public async Task<bool> PostOrder(Order order)
        {
            if (order.OrderID == 0)
                _dbContext.Order.Add(order);
            else
                _dbContext.Entry(order).State = EntityState.Modified;

            foreach (var item in order.OrderItems)
            {
                if (item.OrderItemID == 0)
                    _dbContext.OrderItems.Add(item);
                else
                    _dbContext.Entry(item).State = EntityState.Modified;
            }

            foreach (var id in order.DeletedOrderItemIDs.Split(',').Where(x => x != ""))
            {
                var item = await _dbContext.OrderItems.FindAsync(Convert.ToInt64(id));
                if (item != null)
                {
                    _dbContext.OrderItems.Remove(item);
                }
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }

        // Eliminar un pedido por ID
        public async Task<bool> DeleteOrder(long id)
        {
            var order = await _dbContext.Order.Include(o => o.OrderItems)
                                              .SingleOrDefaultAsync(o => o.OrderID == id);

            if (order == null) return false;

            foreach (var item in order.OrderItems)
            {
                _dbContext.OrderItems.Remove(item);
            }

            _dbContext.Order.Remove(order);
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
