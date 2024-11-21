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

public class OrderServiceTests
{
    private DbContextOptions<DBModel> CreateInMemoryOptions()
    {
        return new DbContextOptionsBuilder<DBModel>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task GetOrders_ReturnsAllOrders()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var db = new DBModel(options);

        db.Order.AddRange(
            new Order { OrderID = 1, OrderNo = "ORD001", PMethod = "Cash", GTotal = 100 },
            new Order { OrderID = 2, OrderNo = "ORD002", PMethod = "Card", GTotal = 200 }
        );
        await db.SaveChangesAsync();

        var service = new OrderService(db);

        // Act
        var result = await service.GetOrders();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, o => o.OrderNo == "ORD001");
        Assert.Contains(result, o => o.OrderNo == "ORD002");
    }

    [Fact]
    public async Task GetOrder_ReturnsNotNull_WhenOrderExists()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var db = new DBModel(options);

        // Datos básicos de prueba
        var order = new Order
        {
            OrderID = 1,
            OrderNo = "ORD001",
            CustomerID = 1,
            PMethod = "Cash",
            GTotal = 100
        };
        db.Order.Add(order);
        await db.SaveChangesAsync();

        var service = new OrderService(db);

        // Act
        var result = await service.GetOrder(1);

        // Assert
        Assert.NotNull(result);
    }

    [Fact]
    public async Task PostOrder_AddsNewOrder_WhenOrderIDIsZero()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var db = new DBModel(options);

        var service = new OrderService(db);

        var newOrder = new Order
        {
            OrderID = 0,
            OrderNo = "ORD001",
            CustomerID = 1,
            PMethod = "Card",
            GTotal = 100.50m,
            OrderItems = new List<OrderItem>
            {
                new OrderItem { ItemID = 1, Quantity = 2 },
                new OrderItem { ItemID = 2, Quantity = 1 }
            }
        };

        // Act
        var result = await service.PostOrder(newOrder);

        // Assert
        Assert.True(result);
        Assert.Equal(1, db.Order.Count());

        var savedOrder = db.Order.Include(o => o.OrderItems).FirstOrDefault();
        Assert.NotNull(savedOrder);
    }


    [Fact]
    public async Task DeleteOrder_RemovesOrderAndItems()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var db = new DBModel(options);

        var order = new Order
        {
            OrderID = 1,
            OrderNo = "ORD001",
            PMethod = "Cash",
            GTotal = 100,
            OrderItems = new List<OrderItem>
            {
                new OrderItem { OrderItemID = 1, ItemID = 1, Quantity = 1 }
            }
        };
        db.Order.Add(order);
        await db.SaveChangesAsync();

        var service = new OrderService(db);

        // Act
        var result = await service.DeleteOrder(1);

        // Assert
        Assert.True(result);
        Assert.Empty(db.Order);
        Assert.Empty(db.OrderItems);
    }
}
