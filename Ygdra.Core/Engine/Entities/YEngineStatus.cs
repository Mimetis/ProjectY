using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Engine.Entities
{
    public enum YEngineStatus
    {
        None = 0,
        InReview,
        NeedMoreInfos,
        Rejected,
        Deploying,
        Deployed,
        Failed
    }
}
