﻿using Microsoft.EntityFrameworkCore;
using MyAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Data
{
    public class DBModel : DbContext
    {
        public DbSet<Customer> Customer { get; set; }
        public DbSet<Item> Item { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DBModel(DbContextOptions<DBModel> options) : base(options) { }
    }
}
