using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;

namespace Ygdra.Web.UI.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        [HttpGet]
        public IActionResult SignIn(string redirectUri)
        {
            var redirectUrl = string.IsNullOrEmpty(redirectUri) ? Url.Page("/Index") : redirectUri;
            
            return Challenge(
                new AuthenticationProperties { RedirectUri = redirectUrl },
                OpenIdConnectDefaults.AuthenticationScheme);
        }

        //[HttpGet]
        //public IActionResult SignOut()
        //{
        //    var callbackUrl = Url.Page("/MicrosoftIdentity/Account/SignedOut", null, Request.Scheme);
        //    return SignOut(
        //        new AuthenticationProperties { RedirectUri = callbackUrl },
        //        CookieAuthenticationDefaults.AuthenticationScheme,
        //        OpenIdConnectDefaults.AuthenticationScheme);
        //}

    }
}
