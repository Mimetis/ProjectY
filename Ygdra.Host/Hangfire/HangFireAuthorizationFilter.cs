using Hangfire.Dashboard;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Ygdra.Host.Hangfire
{
    public class HangFireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            //var httpContext = context.GetHttpContext();

            //return httpContext.User.Identity.IsAuthenticated && httpContext.User.IsInRole("Admin");
            return true;
        }
    }
}
