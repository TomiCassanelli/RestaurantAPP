namespace MyAPI.DTOs
{
    public class OrderDetailDto
    {
        public long OrderItemID { get; set; }
        public long? OrderID { get; set; }
        public int? ItemID { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public decimal? Price { get; set; }
        public int? Quantity { get; set; }
        public decimal? Total { get; set; }
    }
}