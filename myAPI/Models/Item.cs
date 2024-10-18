using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Item
    {
        public int ItemID { get; set; }
        public required string Name { get; set; }
        public decimal? Price { get; set; }

        // Simplificamos esta propiedad inicializando la colección solo cuando sea necesario
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
