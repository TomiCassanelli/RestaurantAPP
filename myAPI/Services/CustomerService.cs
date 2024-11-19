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
    public class CustomerService
    {
        private readonly DBModel _dbContext;

        public CustomerService(DBModel dbContext)
        {
            _dbContext = dbContext;
        }

        // Obtener todos los clientes
        public async Task<List<CustomerDto>> GetAllCustomersAsync()
        {
            return await _dbContext.Customer
                .Select(c => new CustomerDto
                {
                    CustomerID = c.CustomerID,
                    Name = c.Name,
                    Orders = c.Orders.Select(o => new OrderDto
                    {
                        OrderID = o.OrderID,
                        OrderNo = o.OrderNo,
                        PMethod = o.PMethod,
                        GTotal = o.GTotal
                    }).ToList()
                })
                .ToListAsync();
        }

        // Obtener un cliente por ID
        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            var customer = await _dbContext.Customer
                .Include(c => c.Orders) // Incluye los pedidos si es necesario
                .FirstOrDefaultAsync(c => c.CustomerID == id);

            if (customer == null) return null;

            return new CustomerDto
            {
                CustomerID = customer.CustomerID,
                Name = customer.Name,
                Orders = customer.Orders.Select(o => new OrderDto
                {
                    OrderID = o.OrderID,
                    OrderNo = o.OrderNo,
                    PMethod = o.PMethod,
                    GTotal = o.GTotal
                }).ToList()
            };
        }
    }
}