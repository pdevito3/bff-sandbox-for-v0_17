namespace RecipeManagement.Domain.Authors.Dtos
{
    using System.Collections.Generic;
    using System;

    public class AuthorDto 
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid RecipeId { get; set; }
    }
}