using Microsoft.AspNetCore.Mvc;
using Moq;
using MyAPI.Controllers;
using MyAPI.Services;
using MyAPI.Models;
using MyAPI.DTOs;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAPI.Tests
{
    public class OrderControllerTests
    {
        private readonly OrderController _controller;
        private readonly Mock<IOrderService> _mockService;

        public OrderControllerTests()
        {
            _mockService = new Mock<IOrderService>();
            _controller = new OrderController(_mockService.Object);
        }

        // GetOrders Tests
        [Fact]
        public async Task GetOrders_ShouldReturnListOfOrders()
        {
            _mockService.Setup(s => s.GetOrders())
                .ReturnsAsync(new List<Order>
                {
                    new Order { OrderID = 1, OrderNo = "0123", CustomerID = 1, PMethod = "Cash", GTotal = 100 },
                    new Order { OrderID = 2, OrderNo = "0456", CustomerID = 2, PMethod = "Card", GTotal = 200 }
                });

            var result = (OkObjectResult)await _controller.GetOrders();
            var orders = result.Value as List<Order>;
            Assert.NotNull(orders);

            Assert.Equal(2, orders.Count);
        }

        [Fact]
        public async Task GetOrders_ShouldReturnEmptyListIfNoOrders()
        {
            _mockService.Setup(s => s.GetOrders())
                .ReturnsAsync(new List<Order>());

            var result = (OkObjectResult)await _controller.GetOrders();
            var orders = result.Value as List<Order>;
            Assert.NotNull(orders);

            Assert.Empty(orders);
        }

        [Fact]
        public async Task GetOrders_ShouldNotReturnDuplicateOrderIDs()
        {
            // Arrange
            _mockService.Setup(s => s.GetOrders())
                .ReturnsAsync(new List<Order>
                {
                    new Order { OrderID = 1, OrderNo = "0123", CustomerID = 1, PMethod = "Cash", GTotal = 100 },
                    new Order { OrderID = 2, OrderNo = "0456", CustomerID = 2, PMethod = "Card", GTotal = 200 },
                });

            // Act
            var result = (OkObjectResult)await _controller.GetOrders();
            var orders = result.Value as List<Order>;
            Assert.NotNull(orders);

            // Assert
            var orderIDs = orders.Select(o => o.OrderID).ToList();
            Assert.Equal(orderIDs.Count, orderIDs.Distinct().Count());
        }


        // GetOrder Tests
        [Fact]
        public async Task GetOrder_ShouldMatchRequestedID()
        {
            _mockService.Setup(s => s.GetOrder(1))
                .ReturnsAsync(new { OrderID = 1, OrderNo = "0123", CustomerID = 1 });

            var result = (OkObjectResult)await _controller.GetOrder(1);
            var order = result.Value as dynamic;
            Assert.NotNull(order);

            Assert.Equal(1, order!.OrderID);
        }

        [Fact]
        public async Task GetOrder_ShouldReturnNotFoundForNonexistentOrder()
        {
            // Arrange
            _mockService.Setup(s => s.GetOrder(999))
                .ReturnsAsync(null as object);

            // Act
            var result = await _controller.GetOrder(999);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task GetOrder_ShouldNotHaveEmptyOrderNo()
        {
            // Arrange
            _mockService.Setup(s => s.GetOrder(1))
                .ReturnsAsync(new OrderDto
                {
                    OrderID = 1,
                    OrderNo = "0123",
                    CustomerID = 1,
                    PMethod = "Card",
                    GTotal = 200,
                    OrderDetails = new List<OrderDetailDto>()
                });

            // Act
            var result = (OkObjectResult)await _controller.GetOrder(1);
            var order = result.Value as OrderDto;
            Assert.NotNull(order);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(order.OrderNo));
        }

        // PostOrder Tests
        [Fact]
        public async Task PostOrder_ShouldReturnOkForValidOrder()
        {
            // Arrange
            var order = new Order
            {
                OrderID = 0,
                OrderNo = "0123",
                CustomerID = 1,
                PMethod = "Cash",
                GTotal = 100
            };

            _mockService.Setup(s => s.PostOrder(order))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.PostOrder(order);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task PostOrder_ShouldReturnBadRequestForNullOrder()
        {
            // Act
            var result = await _controller.PostOrder(null);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task PostOrder_ShouldReturnBadRequestForEmptyOrderNo()
        {
            // Arrange
            var order = new Order
            {
                OrderID = 0,
                OrderNo = " ",
                CustomerID = 1,
                PMethod = "Cash",
                GTotal = 10
            };

            _mockService.Setup(s => s.PostOrder(order))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.PostOrder(order);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task PostOrder_ShouldReturnOkForUpdateOrder()
        {
            // Arrange
            var order = new Order
            {
                OrderID = 1,
                OrderNo = "0123",
                CustomerID = 1,
                PMethod = "Card",
                GTotal = 150
            };

            _mockService.Setup(s => s.PostOrder(order))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.PostOrder(order);

            // Assert
            Assert.IsType<OkResult>(result);
            Assert.True(order.OrderID > 0);
        }

        // DeleteOrder Tests
        [Fact]
        public async Task DeleteOrder_ShouldReturnOkForValidId()
        {
            // Arrange
            var validId = 1;

            _mockService.Setup(s => s.DeleteOrder(validId))
                .ReturnsAsync(true); // Simula éxito al eliminar

            // Act
            var result = await _controller.DeleteOrder(validId);

            // Assert
            Assert.IsType<OkResult>(result);
        }

        [Fact]
        public async Task DeleteOrder_ShouldReturnNotFoundForNonExistentId()
        {
            // Arrange
            var nonExistentId = 99;

            _mockService.Setup(s => s.DeleteOrder(nonExistentId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteOrder(nonExistentId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }



    }
}