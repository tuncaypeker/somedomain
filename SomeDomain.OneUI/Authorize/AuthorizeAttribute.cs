using Microsoft.AspNetCore.Mvc;

namespace SomeDomain.OneUI.Authorize
{
    public class AuthorizeAttribute : TypeFilterAttribute
    {
        public AuthorizeAttribute() 
            : base(typeof(ClaimRequirementFilter))
        {
            Arguments = new object[] { };
        }
    }
}
