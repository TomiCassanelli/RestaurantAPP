namespace MyAPI.DTOs
{
    public class ItemDto
    {
        public int ItemID { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal? Price { get; set; }
    }
}
