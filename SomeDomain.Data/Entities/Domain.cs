namespace SomeDomain.Data.Entities
{
    public class Domain : ModelBase
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string DescriptionTR { get; set; }
        public decimal BuyNow { get; set; }
        public decimal MinOffer { get; set; }
        public int Hit { get; set; }
        public string Registry { get; set; }
        public DateTime ExpireDate { get; set; }
    }
}
