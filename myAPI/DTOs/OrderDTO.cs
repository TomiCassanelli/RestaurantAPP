namespace MyAPI.DTOs
{
    public class OrderDto
    {
        public long OrderID { get; set; }
        public string OrderNo { get; set; } = string.Empty;
        public int? CustomerID { get; set; }
        public string PMethod { get; set; } = string.Empty;
        public decimal? GTotal { get; set; }
        public List<OrderDetailDto> OrderDetails { get; set; } = new();
    }
}