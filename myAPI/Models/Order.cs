using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Collections.Generic;

namespace WebAPI.Models
{
    public class Order
    {
        public long OrderID { get; set; }
        public required string OrderNo { get; set; }
        public int? CustomerID { get; set; }
        public required string PMethod { get; set; }
        public decimal? GTotal { get; set; }

        [NotMapped]
        public string DeletedOrderItemIDs { get; set; } = string.Empty;

        // Relación con el cliente
        public required Customer Customer { get; set; }

        // Inicializamos la colección de OrderItems
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

        // Constructor para inicializar las propiedades
        public Order()
        {
            OrderNo = string.Empty;
            PMethod = string.Empty;
            Customer = new Customer { Name = "Cliente Predeterminado" }; // Asignar un valor predeterminado
        }
    }
}
