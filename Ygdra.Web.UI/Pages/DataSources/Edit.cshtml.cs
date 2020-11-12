using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json.Linq;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Http;
using Ygdra.Core.Payloads;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.Pages.DataSources
{
    public class EditModel : PageModel
    {

        private readonly IYHttpRequestHandler client;

        public EditModel(IYHttpRequestHandler client)
        {
            this.client = client;
        }

        [BindProperty]
        public DataSourceView DataSourceView { get; set; }

        public async Task<IActionResult> OnGetAsync(Guid engineId, string dataSourceName)
        {
            if (string.IsNullOrEmpty(dataSourceName))
                return new NotFoundResult();

            try
            {
                var response = await this.client.ProcessRequestApiAsync<YDataSource>(
                    $"api/Datafactories/{engineId}/links/{dataSourceName}").ConfigureAwait(false);

                if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                    return new NotFoundResult();

                var dataSource = response.Value;

                this.DataSourceView = DataSourceViewFactory.GetTypedDatSourceView(dataSource.DataSourceType, new DataSourceViewUnknown(dataSource));
                this.DataSourceView.IsNew = false;
                this.DataSourceView.EngineId = engineId;

            }
            catch (Exception)
            {
                return NotFound();
            }

            return Page();
        }

        public async Task<IActionResult> OnPost()
        {

            if (!ModelState.IsValid)
                return Page();

            try
            {

                await this.client.ProcessRequestApiAsync<JObject>($"api/DataFactories/{this.DataSourceView.EngineId}/links/{this.DataSourceView.Name}",
                    null, this.DataSourceView.DataSource, HttpMethod.Put).ConfigureAwait(false);

            }
            catch (Exception ex)
            {
                ModelState.AddModelError("DataSource", ex.Message);
                return Page();
            }


            return Redirect("/DataSources/Index");

        }
    }
}
