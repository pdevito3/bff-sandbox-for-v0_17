namespace RecipeManagement.Domain.Authors.Features;

using RecipeManagement.Domain.Authors.Dtos;
using RecipeManagement.Domain.Authors.Services;
using SharedKernel.Exceptions;
using MapsterMapper;
using MediatR;

public static class GetAuthor
{
    public class AuthorQuery : IRequest<AuthorDto>
    {
        public readonly Guid Id;

        public AuthorQuery(Guid id)
        {
            Id = id;
        }
    }

    public class Handler : IRequestHandler<AuthorQuery, AuthorDto>
    {
        private readonly IAuthorRepository _authorRepository;
        private readonly IMapper _mapper;

        public Handler(IAuthorRepository authorRepository, IMapper mapper)
        {
            _mapper = mapper;
            _authorRepository = authorRepository;
        }

        public async Task<AuthorDto> Handle(AuthorQuery request, CancellationToken cancellationToken)
        {
            var result = await _authorRepository.GetById(request.Id, cancellationToken: cancellationToken);
            return _mapper.Map<AuthorDto>(result);
        }
    }
}