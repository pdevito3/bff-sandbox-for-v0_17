namespace RecipeManagement.Domain.Recipes.Features;

using RecipeManagement.Domain.Recipes.Dtos;
using RecipeManagement.Domain.Recipes.Services;
using SharedKernel.Exceptions;
using RecipeManagement.Domain;
using HeimGuard;
using MapsterMapper;
using MediatR;

public static class GetRecipe
{
    public class RecipeQuery : IRequest<RecipeDto>
    {
        public readonly Guid Id;

        public RecipeQuery(Guid id)
        {
            Id = id;
        }
    }

    public class Handler : IRequestHandler<RecipeQuery, RecipeDto>
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IMapper _mapper;
        private readonly IHeimGuardClient _heimGuard;

        public Handler(IRecipeRepository recipeRepository, IMapper mapper, IHeimGuardClient heimGuard)
        {
            _mapper = mapper;
            _recipeRepository = recipeRepository;
            _heimGuard = heimGuard;
        }

        public async Task<RecipeDto> Handle(RecipeQuery request, CancellationToken cancellationToken)
        {
            await _heimGuard.MustHavePermission<ForbiddenAccessException>(Permissions.CanReadRecipes);

            var result = await _recipeRepository.GetById(request.Id, cancellationToken: cancellationToken);
            return _mapper.Map<RecipeDto>(result);
        }
    }
}