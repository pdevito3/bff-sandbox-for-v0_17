namespace RecipeManagement.Domain.Authors.Dtos
{
    using System.Collections.Generic;
    using System;

    public abstract class AuthorForManipulationDto 
    {
        public string Name { get; set; }
        public Guid RecipeId { get; set; }
    }
}