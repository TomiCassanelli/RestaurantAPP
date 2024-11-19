using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyAPI.Models
{
    public class OrderItem
    {
        public long OrderItemID { get; set; }
        public long? OrderID { get; set; }
        public int? ItemID { get; set; }
        public int? Quantity { get; set; }
        
    public virtual Item? Item { get; set; }
    }

}
