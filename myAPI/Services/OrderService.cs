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
    public interface IOrderService
    {
        Task<List<Order>> GetOrders();
        Task<object?> GetOrder(long id);
        Task<bool> PostOrder(Order order);
        Task<bool> DeleteOrder(long id);
    }

    public class OrderService : IOrderService
    {
        private readonly DBModel _db;

        public OrderService(DBModel db)
        {
            _db = db;
        }

        public async Task<List<Order>> GetOrders()
        {
            return await _db.Order.ToListAsync();
        }

        public async Task<object?> GetOrder(long id)
        {
            var order = await (from a in _db.Order
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

            if (order == null) return null;

            var orderDetails = await (from a in _db.OrderItems
                                       join b in _db.Item on a.ItemID equals b.ItemID
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

            return new { order, orderDetails };
        }

        public async Task<bool> PostOrder(Order order)
        {
            if (order.OrderID == 0)
                _db.Order.Add(order);
            else
                _db.Entry(order).State = EntityState.Modified;

            foreach (var item in order.OrderItems)
            {
                if (item.OrderItemID == 0)
                    _db.OrderItems.Add(item);
                else
                    _db.Entry(item).State = EntityState.Modified;
            }

            foreach (var id in order.DeletedOrderItemIDs.Split(',').Where(x => x != ""))
            {
                var item = await _db.OrderItems.FindAsync(Convert.ToInt64(id));
                if (item != null)
                {
                    _db.OrderItems.Remove(item);
                }
            }

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrder(long id)
        {
            var order = await _db.Order.Include(o => o.OrderItems)
                                       .SingleOrDefaultAsync(o => o.OrderID == id);

            if (order == null) return false;

            foreach (var item in order.OrderItems)
            {
                _db.OrderItems.Remove(item);
            }

            _db.Order.Remove(order);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}
