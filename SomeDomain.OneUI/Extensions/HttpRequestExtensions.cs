namespace SomeDomain.OneUI.Extensions
{
    using Microsoft.AspNetCore.Http;
    using System.Linq;

    public static class HttpRequestExtensions
    {
        public static string[] GetUserLanguages(this HttpRequest request)
        {
            return request.GetTypedHeaders().AcceptLanguage
                ?  .OrderByDescending(x => x.Quality ?? 1)
                   .Select(x => x.Value.ToString()).ToArray() 
                ?? Array.Empty<string>();
        }
    }
}
