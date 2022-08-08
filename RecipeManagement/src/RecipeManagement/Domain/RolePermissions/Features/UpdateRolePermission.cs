namespace RecipeManagement.Domain.RolePermissions.Features;

using RecipeManagement.Domain.RolePermissions;
using RecipeManagement.Domain.RolePermissions.Dtos;
using RecipeManagement.Domain.RolePermissions.Validators;
using RecipeManagement.Domain.RolePermissions.Services;
using RecipeManagement.Services;
using SharedKernel.Exceptions;
using RecipeManagement.Domain;
using HeimGuard;
using MapsterMapper;
using MediatR;

public static class UpdateRolePermission
{
    public class UpdateRolePermissionCommand : IRequest<bool>
    {
        public readonly Guid Id;
        public readonly RolePermissionForUpdateDto RolePermissionToUpdate;

        public UpdateRolePermissionCommand(Guid rolePermission, RolePermissionForUpdateDto newRolePermissionData)
        {
            Id = rolePermission;
            RolePermissionToUpdate = newRolePermissionData;
        }
    }

    public class Handler : IRequestHandler<UpdateRolePermissionCommand, bool>
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

        public async Task<bool> Handle(UpdateRolePermissionCommand request, CancellationToken cancellationToken)
        {
            await _heimGuard.MustHavePermission<ForbiddenAccessException>(Permissions.CanUpdateRolePermission);

            var rolePermissionToUpdate = await _rolePermissionRepository.GetById(request.Id, cancellationToken: cancellationToken);

            rolePermissionToUpdate.Update(request.RolePermissionToUpdate);
            await _unitOfWork.CommitChanges(cancellationToken);

            return true;
        }
    }
}