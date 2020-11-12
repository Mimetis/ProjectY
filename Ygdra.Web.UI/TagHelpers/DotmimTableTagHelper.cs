using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Ygdra.Web.UI.TagHelpers
{

    [HtmlTargetElement("dotmim-table")]
    public class DotmimTableTagHelper : TagHelper
    {

        private readonly HtmlHelper htmlHelper;
        private readonly HtmlEncoder htmlEncoder;
        private readonly LinkGenerator linkGenerator;

        public DotmimTableTagHelper(IHtmlHelper htmlHelper, HtmlEncoder htmlEncoder, LinkGenerator linkGenerator)
        {
            this.htmlHelper = htmlHelper as HtmlHelper;
            this.htmlEncoder = htmlEncoder;
            this.linkGenerator = linkGenerator;
        }

        /// <summary>
        /// Gets or sets the <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.ViewContext" /> for the current request.
        /// </summary>
        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }


        [HtmlAttributeName("name")]
        public string Name { get; set; }


        [HtmlAttributeName("items-url")]
        public string Items { get; set; }

        [HtmlAttributeName("items-url-count")]
        public string ItemsCount { get; set; }

        [HtmlAttributeName("items-per-page")]
        public int ItemsPerPage { get; set; } = 10;


        private IDictionary<string, string> _routeValues;

        /// <summary>Additional parameters for the route.</summary>
        [HtmlAttributeName("asp-all-route-data", DictionaryAttributePrefix = "asp-route-")]
        public IDictionary<string, string> RouteValues
        {
            get
            {
                if (this._routeValues == null)
                    this._routeValues = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                return this._routeValues;
            }
            set
            {
                this._routeValues = value;
            }
        }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {

            this.htmlHelper.Contextualize(this.ViewContext);

            // Replace tag dotmim-table with div
            output.TagName = "div";

            // Add responsive class
            output.AddClass("table-responsive", NullHtmlEncoder.Default);

            var tagContent = await output.GetChildContentAsync(NullHtmlEncoder.Default);

            var content = tagContent.GetContent(NullHtmlEncoder.Default);

            var htmlContent = new HtmlDocument();
            htmlContent.LoadHtml(content);

            // Get the number of columns created by the user
            var trNodes = htmlContent.DocumentNode.SelectNodes(".//table//tr/th");

            // Getting the table
            var tableNode = htmlContent.DocumentNode.SelectSingleNode("//table");

            if (tableNode != null && trNodes != null)
            {
                if (!string.IsNullOrEmpty(this.Items) && !string.IsNullOrEmpty(this.ItemsCount) && !string.IsNullOrEmpty(this.Name))
                {
                    var script = HtmlNode.CreateNode("<script>document.addEventListener('DOMContentLoaded', () => {new dotmimtable('" + this.Name + "', '" + this.Items + "', '" + this.ItemsCount + "', " + this.ItemsPerPage + ").run();});</script>");
                    tableNode.AppendChild(script);
                }

                var data = "";

                foreach (KeyValuePair<string, string> routeValue in RouteValues)
                {
                    var path = this.linkGenerator.GetPathByPage(routeValue.Value);
                    data += $"data-{routeValue.Key}='{path}' ";
                }

                // Add the first row when table is empty
                var tbodyName = $"tbody-{this.Name}";

                var tbodyNode = HtmlNode.CreateNode($"<tbody id='{tbodyName}' name='{tbodyName}' {data}><tr><td colspan='{trNodes.Count}'>&nbsp;</td></tr></tbody>");

                tableNode.AppendChild(tbodyNode);

                // Previous and next button
                var refreshNode = HtmlNode.CreateNode(
                    $"<li class='page-item'><a id='refresh-{this.Name}' class='page-link bg-dark text-white' href='#'>" +
                    "<i class='fas fa-sync-alt'></i>" +
                    Environment.NewLine +
                    "Refresh</a></li>");
                var previousNode = HtmlNode.CreateNode($"<li class='page-item disabled'><a id='previous-{this.Name}' class='page-link bg-dark text-white' href='#'>Previous</a></li>");
                var nextNode = HtmlNode.CreateNode($"<li class='page-item disabled'><a id='next-{this.Name}' class='page-link bg-dark text-white' href='#'>Next</a></li>");

                var nav = HtmlNode.CreateNode("<nav></nav>");
                var ul = HtmlNode.CreateNode("<ul class='pagination'></ul>");
                ul.AppendChild(refreshNode);
                ul.AppendChild(previousNode);
                ul.AppendChild(nextNode);

                nav.AppendChild(ul);

                // Add the Nav item
                htmlContent.DocumentNode.AppendChild(nav);


                // add the spinner
                var spinnerName = $"spinner-{this.Name}";
                var spinner = $"<div id='{spinnerName}' name='{spinnerName}' style='display:none' class='align-middle text-center overlay'>" +
                                   "<i class='fas fa-compact-disc fa-spin h1 mt-5' style='color:white'></i>" +
                              "</div>";

                var divSpinner = HtmlNode.CreateNode(spinner);

                // Add the spinner at the end of the html content
                htmlContent.DocumentNode.AppendChild(divSpinner);
            }


            output.Content.SetHtmlContent(htmlContent.DocumentNode.InnerHtml);

            await base.ProcessAsync(context, output);
        }
    }
}
