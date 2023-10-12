namespace SomeDomain.Data
{
    using Microsoft.Extensions.DependencyInjection;
    using SomeDomain.Data.Infrastructure;
    using SomeDomain.Infrastructure.Interfaces;

    public class DomainOfferData : EntityBaseData<Entities.DomainOffer>
    {
        public DomainOfferData(ILogger<object> logger, IServiceScopeFactory serviceScopeFactory) : base(logger, serviceScopeFactory) { }
    }
}
