using Microsoft.AspNetCore.Mvc;
using Moq;
using MyAPI.Controllers;
using MyAPI.Services;
using MyAPI.DTOs;
using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyAPI.Tests
{
    public class CustomerControllerTests
    {
        private readonly CustomerController _controller;
        private readonly Mock<ICustomerService> _mockService;

        public CustomerControllerTests()
        {
            _mockService = new Mock<ICustomerService>();
            _controller = new CustomerController(_mockService.Object);
        }

        [Fact]
        public async Task GetCustomers_ShouldReturnListOfCustomers()
        {
            _mockService.Setup(s => s.GetCustomers())
                .ReturnsAsync(new List<CustomerDto>
                {
                    new CustomerDto { CustomerID = 1, Name = "John Doe" },
                    new CustomerDto { CustomerID = 2, Name = "Jane Smith" }
                    // Para que falle, agrego un customer
                });

            var result = (OkObjectResult)await _controller.GetCustomers();
            var customers = result.Value as List<CustomerDto>;
            Assert.NotNull(customers);

            Assert.Equal(2, customers.Count); // Para que falle, cambio el 2
        }

        [Fact]
        public async Task GetCustomers_ShouldNotReturnEmptyList()
        {
            _mockService.Setup(s => s.GetCustomers())
                .ReturnsAsync(new List<CustomerDto>
                {
                    new CustomerDto { CustomerID = 1, Name = "John Doe" },
                    new CustomerDto { CustomerID = 2, Name = "Jane Smith" }
                    
                });

            var result = (OkObjectResult)await _controller.GetCustomers();
            var customers = result.Value as List<CustomerDto>;
            Assert.NotNull(customers);
        }

        [Fact]
        public async Task GetCustomers_ShouldNotHaveDuplicateIDs()
        {
            _mockService.Setup(s => s.GetCustomers())
                .ReturnsAsync(new List<CustomerDto>
                {
                    new CustomerDto { CustomerID = 1, Name = "John Doe" },
                    new CustomerDto { CustomerID = 2, Name = "Jane Smith" }
                    // Para que falle, igualo los ID
                });

            var result = (OkObjectResult)await _controller.GetCustomers();
            var customers = result.Value as List<CustomerDto>;
            Assert.NotNull(customers);

            var ids = customers.Select(c => c.CustomerID).ToList();
            Assert.Equal(ids.Count, ids.Distinct().Count());
        }

        [Fact]
        public async Task GetCustomerById_ShouldReturnCorrectName()
        {
            _mockService.Setup(s => s.GetCustomer(1))
                .ReturnsAsync(new CustomerDto { CustomerID = 1, Name = "John Doe" });

            var result = (OkObjectResult)await _controller.GetCustomer(1);
            var customer = result.Value as CustomerDto;
            Assert.NotNull(customer);

            Assert.Equal("John Doe", customer.Name);
        }

        [Fact]
        public async Task GetCustomerById_ShouldMatchRequestedID()
        {
            _mockService.Setup(s => s.GetCustomer(2))
                .ReturnsAsync(new CustomerDto { CustomerID = 2, Name = "Jane Smith" });

            var result = (OkObjectResult)await _controller.GetCustomer(2);
            var customer = result.Value as CustomerDto;
            Assert.NotNull(customer);

            Assert.Equal(2, customer.CustomerID);
        }

        [Fact]
        public async Task GetCustomerById_ShouldNotHaveEmptyName()
        {
            _mockService.Setup(s => s.GetCustomer(2))
                .ReturnsAsync(new CustomerDto { CustomerID = 2, Name = "Jane Smith" });

            var result = (OkObjectResult)await _controller.GetCustomer(2);
            var customer = result.Value as CustomerDto;
            Assert.NotNull(customer);

            Assert.False(string.IsNullOrWhiteSpace(customer.Name));
        }
    }

}