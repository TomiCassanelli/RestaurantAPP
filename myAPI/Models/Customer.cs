using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPI.Models
{
    public class Customer
    {
        public int CustomerID { get; set; }
        public required string Name { get; set; }

        // Simplificamos la colección
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();

        // Constructor para inicializar las propiedades
        public Customer()
        {
            Name = string.Empty;
        }
    }
}
