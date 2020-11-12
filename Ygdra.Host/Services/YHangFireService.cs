using Hangfire;
using Hangfire.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Engine.Entities;

namespace Ygdra.Host.Services
{
    public class YHangFireService : IYHangFireService
    {

        public Job GetProcessingJob(YEngine engine)
        {
            var monitoring = JobStorage.Current.GetMonitoringApi();
            var jobs = monitoring.ProcessingJobs(0, 1000);

            if (jobs == null || jobs.Count <= 0)
                return null;

            var job = jobs.Select(kv => kv.Value.Job).FirstOrDefault(j =>
            {
                if (j.Args == null || j.Args.Count <= 0)
                    return false;

                if (!(j.Args[0] is YEngine engineJob))
                    return false;

                if (engineJob.Id == engine.Id)
                    return true;

                return false;
            });

            return job;
        }
    }
}
