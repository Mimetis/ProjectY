using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
using Ygdra.Core.Auth;
using Ygdra.Core.Settings;
using Ygdra.Core.Settings.Entities;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class SettingsController : ControllerBase
    {
        private readonly IYSettingProvider settingProvider;
        static readonly string[] scopeRequiredByApi = new string[] { "user_impersonation" };

        public SettingsController(IYSettingProvider settingProvider)
        {
            this.settingProvider = settingProvider;
        }

        /// <summary>
        /// Gets all settings
        /// </summary>
        [HttpGet()]
        public async Task<ActionResult<List<YSetting>>> GetSettings()
        {
            var items = await this.settingProvider.GetSettingsAsync().ConfigureAwait(false);
            return items.ToList();
        }

        /// <summary>
        /// Get one setting
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>

        [HttpGet("{id}")]
        public async Task<ActionResult<YSetting>> GetSettingAsync(Guid id)
        {
            var item = await this.settingProvider.GetSettingAsync(id).ConfigureAwait(false);
            return item;
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<YSetting>> SaveSettingAsync(Guid id, [FromBody] YSetting setting)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            if (!this.User.IsInRole("Admin"))
                return new UnauthorizedObjectResult("You should be admin for this action");

            if (id != setting.Id)
                return new UnprocessableEntityObjectResult("id and entity differs");

            var itemSaved = await this.settingProvider.SaveSettingAsync(setting);

            return itemSaved;
        }
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult<bool>> DeleteSettingAsync(Guid id)
        {
            HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);

            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("User unknown");

            if (!this.User.IsInRole("Admin"))
                return new UnauthorizedObjectResult("You should be admin for this action");

            var itemSaved = await this.settingProvider.DeleteSettingAsync(id);

            return itemSaved;
        }

    }
}
