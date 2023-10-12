namespace SomeDomain.Data.Entities
{
    public class DomainOffer : ModelBase
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public decimal Offer { get; set; }
        public int DomainId { get; set; }
        public DateTime CreateDate { get; set; }

        public bool HasSeen { get; set; }
    }
}
