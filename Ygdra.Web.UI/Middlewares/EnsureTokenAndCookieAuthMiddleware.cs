using Azure.Core;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Identity.Web;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace Ygdra.Web.UI.Middlewares
{
    public class EnsureTokenAndCookieAuthMiddleware
    {

        private readonly RequestDelegate _next;

        public EnsureTokenAndCookieAuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var userIsAuth = context.User.Identity.IsAuthenticated;
            string accountIdentifier = context.User.GetMsalAccountId();

            if (context.Session == null)
            {
                await _next(context);
                return;
            }

            await context.Session.LoadAsync();

            var accountExists = context.Session.Keys.Any(k => k == accountIdentifier);

            if (userIsAuth && accountIdentifier != null && !accountExists)
            {
                var uri = UriHelper.GetEncodedUrl(context.Request);
                context.Response.Redirect($"/Account/Signin?redirectUri={uri}", true);
            }

            // Call the next delegate/middleware in the pipeline
            await _next(context);
        }
    }
}
