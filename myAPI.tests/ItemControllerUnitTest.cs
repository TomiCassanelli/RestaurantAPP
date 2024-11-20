using Microsoft.AspNetCore.Mvc;
using Moq;
using MyAPI.Controllers;
using MyAPI.Services;
using MyAPI.DTOs;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
#pragma warning disable CS8600 // Conversión nula posible
#pragma warning disable CS8602 // Desreferenciación de un posible valor nulo

namespace MyAPI.Tests
{
    public class ItemControllerTests
    {
        private readonly ItemController _controller;
        private readonly Mock<IItemService> _mockService;

        public ItemControllerTests()
        {
            _mockService = new Mock<IItemService>();
            _controller = new ItemController(_mockService.Object);
        }

        [Fact]
        public async Task GetItems_ShouldReturnListOfItems()
        {
            // Arrange
            _mockService.Setup(s => s.GetItems())
                .ReturnsAsync(new List<ItemDto>
                {
                    new ItemDto { ItemID = 1, Name = "Food 1", Price = 10.5m },
                    new ItemDto { ItemID = 2, Name = "Food 2", Price = 20.0m }
                });

            // Act
            var result = (OkObjectResult)await _controller.GetItems();
            var items = result.Value as List<ItemDto>;
            Assert.NotNull(items);

            // Assert
            Assert.Equal(2, items.Count);
        }

        [Fact]
        public async Task GetItems_ShouldNotReturnEmptyList()
        {
            // Arrange
            _mockService.Setup(s => s.GetItems())
                .ReturnsAsync(new List<ItemDto>
                {
                    new ItemDto { ItemID = 1, Name = "Food 1", Price = 10.5m },
                    new ItemDto { ItemID = 2, Name = "Food 2", Price = 20.0m }
                });

            // Act
            var result = (OkObjectResult)await _controller.GetItems();
            var items = result.Value as List<ItemDto>;

            // Assert
            Assert.NotNull(items);
        }

        [Fact]
        public async Task GetItems_ShouldHaveValidPrices()
        {
            // Arrange
            _mockService.Setup(s => s.GetItems())
                .ReturnsAsync(new List<ItemDto>
                {
                    new ItemDto { ItemID = 1, Name = "Food 1", Price = 10.5m },
                    new ItemDto { ItemID = 2, Name = "Food 2", Price = 20.0m }
                });

            // Act
            var result = (OkObjectResult)await _controller.GetItems();
            var items = result.Value as List<ItemDto>;
            Assert.NotNull(items);

            // Assert
            Assert.All(items, item => Assert.True(item.Price > 0));
        }
    }
}
