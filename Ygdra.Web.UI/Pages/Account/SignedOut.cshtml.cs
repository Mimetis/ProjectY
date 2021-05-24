using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Ygdra.Web.UI.Pages.Account
{
    /// <summary>
    /// Model for the SignOut page.
    /// </summary>
    [AllowAnonymous]
    public class SignedOutModel : PageModel
    {
        /// <summary>
        /// Method handling the HTTP GET method.
        /// </summary>
        /// <returns>A Sign Out page or Home page.</returns>
        public IActionResult OnGet()
        {
            //if (User?.Identity?.IsAuthenticated ?? false)

            return LocalRedirect("~/");
        }
    }
}
