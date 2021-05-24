using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.ApplicationInsights.Metrics;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Engine;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Options;
using Ygdra.Core.Payloads;

namespace Ygdra.Host.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    [Produces("application/json")]
    public class AppInsightsController : ControllerBase
    {
        private IYHttpRequestHandler client;
        private IYEngineProvider engineProvider;
        private readonly DataFactoriesController dataFactoriesController;
        private KeyVaultsController keyVaultsController;
        private YMicrosoftIdentityOptions options;

        public AppInsightsController(IYHttpRequestHandler client,
            IYEngineProvider engineProvider,
            DataFactoriesController dataFactoriesController,
            KeyVaultsController keyVaultsController,
            IOptions<YMicrosoftIdentityOptions> azureAdOptions)
        {
            this.client = client;
            this.engineProvider = engineProvider;
            this.dataFactoriesController = dataFactoriesController;
            this.keyVaultsController = keyVaultsController;
            this.options = azureAdOptions.Value;

        }


        [HttpPost()]
        [Route("{engineId}/daemon/metrics/{dataSourceName}/{entityName}/{version}")]
        public async Task<ActionResult<bool>> AddMetricFromDaemonAsync(Guid engineId, [FromBody] YMetricPayload2 payload)
        {
            var userObjectId = this.User.GetObjectId();

            if (string.IsNullOrEmpty(userObjectId))
                return new UnauthorizedObjectResult("Daemon id unknown");

            if (userObjectId != this.options.ClientObjectId)
                return new UnauthorizedObjectResult("This web api should be called only from a daemon application using the correct Client Id / Client Secret");

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get connection string
            var instrumentationKeySecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.AppInsightsName);
            string instrumentationKey = instrumentationKeySecret?.Value;

            if (string.IsNullOrEmpty(instrumentationKey))
                throw new Exception("Can't find the App Insights Instrumentation Key in the Key Vault");

            await PostMetric2Async(engine, payload, instrumentationKey);

            return true;
        }


        [HttpPost()]
        [Route("{engineId}/daemon/metrics/{dataSourceName}/{entityName}/{version}/pandas")]
        public async Task<ActionResult<bool>> AddEntityPandasMetricAsync(Guid engineId, string dataSourceName, string entityName, string version, [FromBody] JObject pandasMetrics)
        {
            if (pandasMetrics == null)
                return false;

            if (pandasMetrics.Children().Count() <= 0)
                return false;

            //var userObjectId = this.User.GetObjectId();

            //if (string.IsNullOrEmpty(userObjectId))
            //    return new UnauthorizedObjectResult("Daemon id unknown");

            //if (userObjectId != this.options.ClientObjectId)
            //    return new UnauthorizedObjectResult("This web api should be called only from a daemon application using the correct Client Id / Client Secret");

            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            var entity = await this.dataFactoriesController.GetEntityAsync(engineId, entityName).ConfigureAwait(false);

            if (entity == null)
                throw new Exception($"Entity {entityName} does not exists");

            // Get connection string
            var instrumentationKeySecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.AppInsightsName);
            string instrumentationKey = instrumentationKeySecret?.Value;

            if (string.IsNullOrEmpty(instrumentationKey))
                throw new Exception("Can't find the App Insights Instrumentation Key in the Key Vault");


            //pandasMetrics = JObject.Parse(@"{""SalesOrderID"":{""count"":32.0,""unique"":null,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":71859.59375,""std"":56.6419765551,""min"":71774.0,""25%"":71810.5,""50%"":71860.5,""75%"":71905.25,""max"":71946.0},""RevisionNumber"":{""count"":32.0,""unique"":null,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":2.0,""std"":0.0,""min"":2.0,""25%"":2.0,""50%"":2.0,""75%"":2.0,""max"":2.0},""OrderDate"":{""count"":32,""unique"":1,""top"":1212278400000,""freq"":32,""first"":1212278400000,""last"":1212278400000,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""DueDate"":{""count"":32,""unique"":1,""top"":1213315200000,""freq"":32,""first"":1213315200000,""last"":1213315200000,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""ShipDate"":{""count"":32,""unique"":1,""top"":1212883200000,""freq"":32,""first"":1212883200000,""last"":1212883200000,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""Status"":{""count"":32.0,""unique"":null,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":5.0,""std"":0.0,""min"":5.0,""25%"":5.0,""50%"":5.0,""75%"":5.0,""max"":5.0},""OnlineOrderFlag"":{""count"":32,""unique"":1,""top"":false,""freq"":32,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""SalesOrderNumber"":{""count"":32,""unique"":32,""top"":""SO71915"",""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""PurchaseOrderNumber"":{""count"":32,""unique"":32,""top"":""PO16153112278"",""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""AccountNumber"":{""count"":32,""unique"":32,""top"":""10-4020-000187"",""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""CustomerID"":{""count"":32.0,""unique"":null,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":29839.5,""std"":196.7356175831,""min"":29485.0,""25%"":29650.75,""50%"":29899.5,""75%"":30020.5,""max"":30113.0},""ShipToAddressID"":{""count"":32.0,""unique"":null,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":869.90625,""std"":199.830147129,""min"":635.0,""25%"":651.75,""50%"":992.5,""75%"":1035.75,""max"":1102.0},""BillToAddressID"":{""count"":32.0,""unique"":null,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":869.90625,""std"":199.830147129,""min"":635.0,""25%"":651.75,""50%"":992.5,""75%"":1035.75,""max"":1102.0},""ShipMethod"":{""count"":32,""unique"":1,""top"":""CARGO TRANSPORT 5"",""freq"":32,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""CreditCardApprovalCode"":{""count"":0,""unique"":0,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""SubTotal"":{""count"":32,""unique"":32,""top"":63980.9884,""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""TaxAmt"":{""count"":32,""unique"":32,""top"":238.4634,""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""Freight"":{""count"":32,""unique"":32,""top"":1.9703,""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""TotalDue"":{""count"":32,""unique"":32,""top"":2228.0566,""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""Comment"":{""count"":0,""unique"":0,""top"":null,""freq"":null,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""rowguid"":{""count"":32,""unique"":32,""top"":""caad090d-56a6-444e-af24-7bee7605f120"",""freq"":1,""first"":null,""last"":null,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null},""ModifiedDate"":{""count"":32,""unique"":1,""top"":1212883200000,""freq"":32,""first"":1212883200000,""last"":1212883200000,""mean"":null,""std"":null,""min"":null,""25%"":null,""50%"":null,""75%"":null,""max"":null}}");

            foreach (var metric in pandasMetrics.Children())
            {
                var pMetric = metric as JProperty;

                foreach (var val in pMetric.Value.Children())
                {
                    var pVal = val as JProperty;

                    if (double.TryParse(pVal.Value.ToString(), out var doubleValue))
                    {
                        YMetricPayload payload = new YMetricPayload
                        {
                            Namespace = "Entities"
                        };

                        payload.Dimensions.Add(new YMetricDimensionPayload { Name = "Egine Name", Value = engine.EngineName });
                        payload.Dimensions.Add(new YMetricDimensionPayload { Name = "Entity Name", Value = entityName });
                        payload.Dimensions.Add(new YMetricDimensionPayload { Name = "DataSource Name", Value = dataSourceName });
                        payload.Dimensions.Add(new YMetricDimensionPayload { Name = "Version", Value = version });
                        payload.Dimensions.Add(new YMetricDimensionPayload { Name = "Column Name", Value = pMetric.Name });

                        Console.WriteLine("Metric : " + pVal.Name + " Value : " + pVal.Value);


                        var metricName = pVal.Name;
                        if (metricName == "25%")
                            metricName = "PercentTwentyFive";
                        if (metricName == "50%")
                            metricName = "PercentFifty";
                        if (metricName == "75%")
                            metricName = "PercentSeventyFive";

                        var charName = metricName.ToArray();
                        charName[0] = char.ToUpper(charName[0]);
                        metricName = new string(charName);

                        payload.Id = metricName;
                        payload.Value = doubleValue;

                        await PostMetricAsync(engine, payload, instrumentationKey);
                    }
                }
            }
            return true;
        }


        [HttpPost()]
        [Route("{engineId}/metrics/{dataSourceName}/{entityName}/{version}")]
        public async Task<ActionResult<bool>> AddMetricAsync(Guid engineId, [FromBody] YMetricPayload payload)
        {
            var engine = await this.engineProvider.GetEngineAsync(engineId).ConfigureAwait(false);

            if (engine == null)
                throw new Exception("Engine does not exists");

            // Get connection string
            var instrumentationKeySecret = await keyVaultsController.GetKeyVaultSecret(engine.Id, engine.AppInsightsName);
            string instrumentationKey = instrumentationKeySecret?.Value;

            if (string.IsNullOrEmpty(instrumentationKey))
                throw new Exception("Can't find the App Insights Instrumentation Key in the Key Vault");

            await PostMetricAsync(engine, payload, instrumentationKey);

            return true;

        }


        private async Task PostMetric2Async(YEngine engine, YMetricPayload2 payload, string instrumentationKey)
        {
            using TelemetryConfiguration configuration = TelemetryConfiguration.CreateDefault();
            
            configuration.InstrumentationKey = instrumentationKey;
            
            var telemetryClient = new TelemetryClient(configuration);

            var telemetry = new MetricTelemetry(payload.Namespace, payload.Name, payload.Count, payload.Sum, payload.Min, payload.Max, 0);

            foreach (var d in payload.Dimensions)
                telemetry.Properties.Add(d.Name, d.Value);

            telemetryClient.TrackMetric(telemetry);

            telemetryClient.Flush();
        }

        private async Task PostMetricAsync(YEngine engine, YMetricPayload payload, string instrumentationKey)
        {

            using TelemetryConfiguration configuration = TelemetryConfiguration.CreateDefault();
            configuration.InstrumentationKey = instrumentationKey;

            var telemetryClient = new TelemetryClient(configuration);

            if (payload.Dimensions.Count <= 0)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value);
            }
            else if (payload.Dimensions.Count == 1)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value);
            }
            else if (payload.Dimensions.Count == 2)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value);
            }
            else if (payload.Dimensions.Count == 3)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value);
            }
            else if (payload.Dimensions.Count == 4)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value);
            }
            else if (payload.Dimensions.Count == 5)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name, payload.Dimensions[4].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value, payload.Dimensions[4].Value);
            }
            else if (payload.Dimensions.Count == 6)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name, payload.Dimensions[4].Name, payload.Dimensions[5].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value, payload.Dimensions[4].Value, payload.Dimensions[5].Value);
            }
            else if (payload.Dimensions.Count == 7)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name, payload.Dimensions[4].Name, payload.Dimensions[5].Name, payload.Dimensions[6].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value, payload.Dimensions[4].Value, payload.Dimensions[5].Value, payload.Dimensions[6].Value);
            }
            else if (payload.Dimensions.Count == 8)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name, payload.Dimensions[4].Name, payload.Dimensions[5].Name, payload.Dimensions[6].Name, payload.Dimensions[7].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value, payload.Dimensions[4].Value, payload.Dimensions[5].Value, payload.Dimensions[6].Value, payload.Dimensions[7].Value);
            }
            else if (payload.Dimensions.Count == 9)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name, payload.Dimensions[4].Name, payload.Dimensions[5].Name, payload.Dimensions[6].Name, payload.Dimensions[7].Name
                    , payload.Dimensions[8].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value, payload.Dimensions[4].Value, payload.Dimensions[5].Value, payload.Dimensions[6].Value, payload.Dimensions[7].Value
                    , payload.Dimensions[8].Value);
            }
            else if (payload.Dimensions.Count >= 10)
            {
                var id = new MetricIdentifier(payload.Namespace, payload.Id, payload.Dimensions[0].Name, payload.Dimensions[1].Name, payload.Dimensions[2].Name
                    , payload.Dimensions[3].Name, payload.Dimensions[4].Name, payload.Dimensions[5].Name, payload.Dimensions[6].Name, payload.Dimensions[7].Name
                    , payload.Dimensions[8].Name, payload.Dimensions[9].Name);
                var metric = telemetryClient.GetMetric(id);
                metric.TrackValue(payload.Value, payload.Dimensions[0].Value, payload.Dimensions[1].Value, payload.Dimensions[2].Value
                    , payload.Dimensions[3].Value, payload.Dimensions[4].Value, payload.Dimensions[5].Value, payload.Dimensions[6].Value, payload.Dimensions[7].Value
                    , payload.Dimensions[8].Value, payload.Dimensions[9].Value);
            }

            telemetryClient.Flush();
        }

    }
}
