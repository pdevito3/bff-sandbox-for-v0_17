namespace RecipeManagement.Domain.Ingredients.Dtos
{
    using System.Collections.Generic;
    using System;

    public abstract class IngredientForManipulationDto 
    {
        public string Name { get; set; }
        public string Quantity { get; set; }
        public DateTime? ExpiresOn { get; set; }
        public string Measure { get; set; }
        public Guid RecipeId { get; set; }
    }
}