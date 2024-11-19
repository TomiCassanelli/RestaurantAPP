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
    public class ItemService
    {
        private readonly DBModel _dbContext;

        public ItemService(DBModel dbContext)
        {
            _dbContext = dbContext;
        }

        // Obtener todos los ítems
        public async Task<List<ItemDto>> GetItemsAsync()
        {
            return await _dbContext.Item
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