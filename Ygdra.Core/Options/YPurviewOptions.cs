using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Options
{
    public class YPurviewOptions
    {
        public string AccountName {get;set; }
        public string AtlasEndpoint => $"https://{AccountName}.catalog.purview.azure.com";
        public string ScanEndpoint => $"https://{AccountName}.scan.purview.azure.com";
    }
}
