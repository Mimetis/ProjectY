using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Ygdra.WebUI.Pages.Account
{
    public class SignedOutModel : PageModel
    {
        public void OnGet()
        {
            if (User.Identity.IsAuthenticated)
                RedirectToPage("/Index");

            foreach (var key in this.HttpContext.Session.Keys.ToArray())
                if (key.StartsWith("graph-"))
                    this.HttpContext.Session.Remove(key);
        }
    }
}
