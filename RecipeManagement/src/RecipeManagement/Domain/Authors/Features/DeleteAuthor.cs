namespace RecipeManagement.Domain.Authors.Features;

using RecipeManagement.Domain.Authors.Services;
using RecipeManagement.Services;
using SharedKernel.Exceptions;
using MediatR;

public static class DeleteAuthor
{
    public class DeleteAuthorCommand : IRequest<bool>
    {
        public readonly Guid Id;

        public DeleteAuthorCommand(Guid author)
        {
            Id = author;
        }
    }

    public class Handler : IRequestHandler<DeleteAuthorCommand, bool>
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly IUnitOfWork _unitOfWork;

        public Handler(IAuthorRepository authorRepository, IUnitOfWork unitOfWork)
        {
            _authorRepository = authorRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<bool> Handle(DeleteAuthorCommand request, CancellationToken cancellationToken)
        {
            var recordToDelete = await _authorRepository.GetById(request.Id, cancellationToken: cancellationToken);

            _authorRepository.Remove(recordToDelete);
            await _unitOfWork.CommitChanges(cancellationToken);
            return true;
        }
    }
}