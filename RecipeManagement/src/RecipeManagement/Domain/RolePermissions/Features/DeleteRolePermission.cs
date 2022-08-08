namespace RecipeManagement.Domain.RolePermissions.Features;

using RecipeManagement.Domain.RolePermissions.Services;
using RecipeManagement.Services;
using SharedKernel.Exceptions;
using RecipeManagement.Domain;
using HeimGuard;
using MediatR;

public static class DeleteRolePermission
{
    public class DeleteRolePermissionCommand : IRequest<bool>
    {
        public readonly Guid Id;

        public DeleteRolePermissionCommand(Guid rolePermission)
        {
            Id = rolePermission;
        }
    }

    public class Handler : IRequestHandler<DeleteRolePermissionCommand, bool>
    {
        private readonly IRolePermissionRepository _rolePermissionRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHeimGuardClient _heimGuard;

        public Handler(IRolePermissionRepository rolePermissionRepository, IUnitOfWork unitOfWork, IHeimGuardClient heimGuard)
        {
            _rolePermissionRepository = rolePermissionRepository;
            _unitOfWork = unitOfWork;
            _heimGuard = heimGuard;
        }

        public async Task<bool> Handle(DeleteRolePermissionCommand request, CancellationToken cancellationToken)
        {
            await _heimGuard.MustHavePermission<ForbiddenAccessException>(Permissions.CanDeleteRolePermission);

            var recordToDelete = await _rolePermissionRepository.GetById(request.Id, cancellationToken: cancellationToken);

            _rolePermissionRepository.Remove(recordToDelete);
            await _unitOfWork.CommitChanges(cancellationToken);
            return true;
        }
    }
}