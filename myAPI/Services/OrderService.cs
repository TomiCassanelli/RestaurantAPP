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
            var order = await (from a in _db.Order where a.OrderID == id 
                                select new
                               {
                                   a.OrderID,
                                   a.OrderNo,
                                   a.CustomerID,
                                   a.PMethod,
                                   a.GTotal,
                               }).FirstOrDefaultAsync();

            if (order == null) return null;

            var orderDetails = await (from a in _db.OrderItems join b in _db.Item on a.ItemID equals b.ItemID where a.OrderID == id
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
            {
                // Nueva orden
                _db.Order.Add(order);
            }
            else
            {
                // Orden existente
                var existingOrder = await _db.Order
                                            .Include(o => o.OrderItems)
                                            .FirstOrDefaultAsync(o => o.OrderID == order.OrderID);

                if (existingOrder == null)
                {
                    throw new InvalidOperationException("La orden no existe.");
                }
                existingOrder.OrderNo = order.OrderNo;
                existingOrder.CustomerID = order.CustomerID;
                existingOrder.PMethod = order.PMethod;
                existingOrder.GTotal = order.GTotal;

                var incomingOrderItemIDs = order.OrderItems.Select(oi => oi.OrderItemID).ToList();

                var itemsToRemove = existingOrder.OrderItems
                                                .Where(oi => !incomingOrderItemIDs.Contains(oi.OrderItemID))
                                                .ToList();

                foreach (var item in itemsToRemove)
                {
                    _db.OrderItems.Remove(item);
                }

                foreach (var item in order.OrderItems)
                {
                    if (item.OrderItemID == 0)
                    {
                        existingOrder.OrderItems.Add(item);
                    }
                    else
                    {
                        var existingItem = existingOrder.OrderItems.FirstOrDefault(oi => oi.OrderItemID == item.OrderItemID);
                        if (existingItem != null)
                        {
                            existingItem.ItemID = item.ItemID;
                            existingItem.Quantity = item.Quantity;
                        }
                    }
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
