namespace RecipeManagement.Domain.Recipes.Features;

using RecipeManagement.Domain.Recipes.Services;
using RecipeManagement.Services;
using SharedKernel.Exceptions;
using RecipeManagement.Domain;
using HeimGuard;
using MediatR;

public static class DeleteRecipe
{
    public class DeleteRecipeCommand : IRequest<bool>
    {
        public readonly Guid Id;

        public DeleteRecipeCommand(Guid recipe)
        {
            Id = recipe;
        }
    }

    public class Handler : IRequestHandler<DeleteRecipeCommand, bool>
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHeimGuardClient _heimGuard;

        public Handler(IRecipeRepository recipeRepository, IUnitOfWork unitOfWork, IHeimGuardClient heimGuard)
        {
            _recipeRepository = recipeRepository;
            _unitOfWork = unitOfWork;
            _heimGuard = heimGuard;
        }

        public async Task<bool> Handle(DeleteRecipeCommand request, CancellationToken cancellationToken)
        {
            await _heimGuard.MustHavePermission<ForbiddenAccessException>(Permissions.CanDeleteRecipe);

            var recordToDelete = await _recipeRepository.GetById(request.Id, cancellationToken: cancellationToken);

            _recipeRepository.Remove(recordToDelete);
            await _unitOfWork.CommitChanges(cancellationToken);
            return true;
        }
    }
}