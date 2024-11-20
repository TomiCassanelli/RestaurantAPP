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
    public interface ICustomerService
    {
        Task<List<CustomerDto>> GetCustomers();
        Task<CustomerDto?> GetCustomer(int id);
    }

    public class CustomerService : ICustomerService
    {
        private readonly DBModel _db;

        public CustomerService(DBModel db)
        {
            _db = db;
        }

        public async Task<List<CustomerDto>> GetCustomers()
        {
            return await _db.Customer
                .Select(c => new CustomerDto
                {
                    CustomerID = c.CustomerID,
                    Name = c.Name
                })
                .ToListAsync();
        }

        public async Task<CustomerDto?> GetCustomer(int id)
        {
            var customer = await _db.Customer
                .Include(c => c.Orders)
                .FirstOrDefaultAsync(c => c.CustomerID == id);

            if (customer == null) return null;

            return new CustomerDto
            {
                CustomerID = customer.CustomerID,
                Name = customer.Name
            };
        }
    }
}