using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace Ygdra.Core.Exceptions
{
    public class YWebException : Exception
    {
        public YWebException(Exception exception, string content = null, HttpStatusCode statusCode = HttpStatusCode.BadRequest) : base(exception.Message, exception)
        {
            this.StatusCode = statusCode;

            if (string.IsNullOrEmpty(content))
            {
                this.Error = new JObject { { "message", exception.Message } };

            }
            else if (content.StartsWith("{") || content.StartsWith("["))
            {
                var jError = JObject.Parse(content);

                if (jError.First is JProperty jErrorToken && jErrorToken.Name.ToLowerInvariant() == "error" && jErrorToken.First is JObject firstError)
                    jError = firstError;

                this.Error = jError;
            }
            else
            {
                this.Error = new JObject { { "message", content } };
            }

        }

        public override string Message
        {
            get
            {
                if (this.Error != null)
                    return this.Error.ToString(Formatting.Indented);

                if (!string.IsNullOrEmpty(base.Message))
                    return base.Message;

                return null;
            }
        }

        /// <summary>
        /// Gets or Sets error if StatusCode not in (200, 204)
        /// </summary>
        public JObject Error { get; set; }

        /// <summary>
        /// Get the error status code
        /// </summary>
        public HttpStatusCode StatusCode { get; set; }
    }






    /// <summary>
    /// Unknown Exception
    /// </summary>
    public class UnknownException : Exception
    {
        public UnknownException(string message) : base(message) { }
    }

    public class DataSourceNotExists : Exception
    {
        const string message = "DataSource is not existing";
        public DataSourceNotExists() : base(message) { }

    }
    public class DataSourceCreationFailedException : Exception
    {
        const string message = "Can't create data source {0}.";
        public DataSourceCreationFailedException(string dataSourceName, Exception innerException = null)
            : base(string.Format(message, dataSourceName), innerException) { }

    }


}
