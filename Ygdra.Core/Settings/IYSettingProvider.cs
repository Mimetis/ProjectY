using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Ygdra.Core.Settings.Entities;

namespace Ygdra.Core.Settings
{
    public interface IYSettingProvider
    {
        Task<IEnumerable<YSetting>> GetSettingsAsync();
        Task<YSetting> GetSettingAsync(Guid id);
        Task<YSetting> SaveSettingAsync(YSetting setting);
        Task<bool> DeleteSettingAsync(Guid id);

    }
}
