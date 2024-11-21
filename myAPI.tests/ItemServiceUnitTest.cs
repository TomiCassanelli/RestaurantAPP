using Moq;
using Xunit;
using MyAPI.Services;
using MyAPI.Models;
using MyAPI.DTOs;
using MyAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class ItemServiceTests
{
    private DbContextOptions<DBModel> CreateInMemoryOptions()
    {
        return new DbContextOptionsBuilder<DBModel>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task GetItems_ReturnsAllItems()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new DBModel(options);

        context.Item.AddRange(
            new Item { ItemID = 1, Name = "Item1", Price = 10.5m },
            new Item { ItemID = 2, Name = "Item2", Price = 20.0m }
        );
        await context.SaveChangesAsync();

        var service = new ItemService(context);

        // Act
        var result = await service.GetItems();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, i => i.Name == "Item1" && i.Price == 10.5m);
        Assert.Contains(result, i => i.Name == "Item2" && i.Price == 20.0m);
    }

    [Fact]
    public async Task GetItems_ReturnsEmptyList_WhenNoItemsExist()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new DBModel(options);

        var service = new ItemService(context);

        // Act
        var result = await service.GetItems();

        // Assert
        Assert.Empty(result);
    }
}
