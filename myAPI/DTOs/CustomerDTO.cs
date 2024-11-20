namespace MyAPI.DTOs
{
    public class CustomerDto
    {
        public int CustomerID { get; set; }
        public string Name { get; set; } = string.Empty;
        // public List<OrderDto>? Orders { get; set; } // Incluye los pedidos si son necesarios
    }
}