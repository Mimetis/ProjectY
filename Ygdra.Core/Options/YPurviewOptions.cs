using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Options
{
    public abstract class YAPurviewOptions
    {
        public string PurviewResource {get;set;}
        public string PurviewResourceGroup {get;set;}
        public string PurviewSubscriptionId {get;set;}
        public string PurviewAtlasEndpoint {get; set;}
        public string PurviewScanEndpoint {get;set;}        
    }
    public class YPurviewOptions : YAPurviewOptions
    {

    }
}
