namespace SomeDomain.Data
{
    using Microsoft.Extensions.DependencyInjection;
    using SomeDomain.Data.Infrastructure;
    using SomeDomain.Infrastructure.Interfaces;

    public class DomainData : EntityBaseData<Entities.Domain>
    {
        public DomainData(ILogger<object> logger, IServiceScopeFactory serviceScopeFactory) : base(logger, serviceScopeFactory) { }
    }
}
