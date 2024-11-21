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

public class CustomerServiceTests
{
    private DbContextOptions<DBModel> CreateInMemoryOptions()
    {
        return new DbContextOptionsBuilder<DBModel>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }


    [Fact]
    public async Task GetCustomers_ReturnsAllCustomers()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new DBModel(options);

        context.Customer.AddRange(
            new Customer { CustomerID = 1, Name = "John Doe" },
            new Customer { CustomerID = 2, Name = "Jane Smith" }
        );
        await context.SaveChangesAsync();

        var service = new CustomerService(context);

        // Act
        var result = await service.GetCustomers();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, c => c.Name == "John Doe");
        Assert.Contains(result, c => c.Name == "Jane Smith");
    }

    [Fact]
    public async Task GetCustomer_ReturnsCustomer_WhenCustomerExists()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new DBModel(options);

        context.Customer.Add(
            new Customer { CustomerID = 1, Name = "John Doe" }
        );
        await context.SaveChangesAsync();

        var service = new CustomerService(context);

        // Act
        var result = await service.GetCustomer(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("John Doe", result.Name);
    }

    [Fact]
    public async Task GetCustomer_ReturnsNull_WhenCustomerDoesNotExist()
    {
        // Arrange
        var options = CreateInMemoryOptions();
        using var context = new DBModel(options);

        context.Customer.Add(
            new Customer { CustomerID = 1, Name = "John Doe" }
        );
        await context.SaveChangesAsync();

        var service = new CustomerService(context);

        // Act
        var result = await service.GetCustomer(999);

        // Assert
        Assert.Null(result);
    }
}
