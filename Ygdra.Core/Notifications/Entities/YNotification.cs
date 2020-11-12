using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ygdra.Core.Notifications.Entities
{
    public class YNotification
    {
        /// <summary>
        /// Gets or Sets the Engine Id. Should come from an engine request id
        /// </summary>
        [Key]
        [JsonProperty("id")]
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or Sets the recipient of the notification
        /// </summary>
        [Key]
        public Guid To { get; set; }

        /// <summary>
        /// Gets or Sets the reference object who has generated the notification
        /// </summary>
        public Guid? LinkId { get; set; }

        public string Type => "Notification";


        /// <summary>
        /// Gets or Sets the notification title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or Sets the notification message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// Gets or Sets the notification url if exists
        /// </summary>
        public string Url { get; set; }


        /// <summary>
        /// Gets or Sets the author of the notification
        /// </summary>
        public Guid? From { get; set; }


        /// <summary>
        /// Gets or Sets if the notification has been read by the recipient
        /// </summary>
        public bool IsRead { get; set; }

        /// <summary>
        /// Gets or Set the sending date
        /// </summary>
        public DateTime SendDate { get; set; }

        /// <summary>
        /// Gets or Sets the read date
        /// </summary>
        public DateTime? ReadDate { get; set; }

    }
}
