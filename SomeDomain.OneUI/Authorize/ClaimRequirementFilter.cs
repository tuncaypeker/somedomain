using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SomeDomain.OneUI.Authorize
{
    public class ClaimRequirementFilter : IAuthorizationFilter
    {
        /// <summary>
        /// Bu claim'e göre kontrol etcez ama o claim ztn Role, bu sekilde davranabiliriz
        /// </summary>
        /// <param name="claim"></param>
        public ClaimRequirementFilter()
        {
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var role = context.HttpContext.User.Claims.FirstOrDefault(x => x.Type == System.Security.Claims.ClaimTypes.Role);
            if (role == null)
            {
                context.Result = new RedirectResult("/Home/Login?url=" + context.HttpContext.Request.Path.Value.TrimStart('/') + context.HttpContext.Request.QueryString);
                return;
            }

            return;
        }
    }
}
