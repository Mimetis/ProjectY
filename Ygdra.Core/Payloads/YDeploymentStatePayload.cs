using System;
using System.Collections.Generic;
using System.Text;

namespace Ygdra.Core.Payloads
{
    public class YDeploymentStatePayload
    {
        private YDeploymentStatePayloadState state;

        public YDeploymentStatePayload(YDeploymentStatePayloadState state)
        {
            this.state = state;
        }

        /// <summary>
        /// Deployment Id
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Can be "None", "Deploying", "Deployed", "Error"
        /// </summary>
        public string State => this.state.ToString();

        /// <summary>
        /// Message to send to the client
        /// </summary>
        public string Message { get; set; }



    }

    public enum YDeploymentStatePayloadState
    {
        None = 0,
        Deploying,
        Deployed,
        Droping,
        Dropped,
        Error
    }
}
