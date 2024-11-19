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
    public interface IItemService
    {
        Task<List<ItemDto>> GetItems();
    }

    public class ItemService : IItemService
    {
        private readonly DBModel _db;

        public ItemService(DBModel db)
        {
            _db = db;
        }

        public async Task<List<ItemDto>> GetItems()
        {
            return await _db.Item
                .Select(i => new ItemDto
                {
                    ItemID = i.ItemID,
                    Name = i.Name,
                    Price = i.Price
                })
                .ToListAsync();
        }
    }
}