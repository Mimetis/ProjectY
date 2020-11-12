using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace Ygdra.Web.UI.TagHelpers
{
    [HtmlTargetElement(Attributes = "asp-row-submit")]
    public class TableRowSubmitTagHelper : TagHelper
    {
        private readonly HtmlHelper _htmlHelper;
        private readonly HtmlEncoder _htmlEncoder;
        private readonly LinkGenerator linkGenerator;

        public TableRowSubmitTagHelper(IHtmlHelper htmlHelper, HtmlEncoder htmlEncoder, LinkGenerator linkGenerator)
        {
            _htmlHelper = htmlHelper as HtmlHelper;
            _htmlEncoder = htmlEncoder;
            this.linkGenerator = linkGenerator;
        }


        [HtmlAttributeName("asp-page")]
        public string Page { get; set; }


        [HtmlAttributeName("asp-row-submit")]
        public bool RowSubmit { get; set; }


        private IDictionary<string, string> routeValues;


        /// <summary>Additional parameters for the route.</summary>
        [HtmlAttributeName("asp-all-route-data", DictionaryAttributePrefix = "asp-route-")]
        public IDictionary<string, string> RouteValues
        {
            get
            {
                if (this.routeValues == null)
                    this.routeValues = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                return this.routeValues;
            }
            set
            {
                this.routeValues = value;
            }
        }
        /// <summary>
        /// Gets or sets the <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.ViewContext" /> for the current request.
        /// </summary>
        [HtmlAttributeNotBound]
        [ViewContext]
        public ViewContext ViewContext { get; set; }


        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            base.Process(context, output);

            if (RowSubmit)
            {
                //var stringBuilder = new StringBuilder();
                
                //var uriBuilder = new UriBuilder($"{this.ViewContext.HttpContext.Request.Scheme}://{this.ViewContext.HttpContext.Request.Host.Value}");
                //uriBuilder.Path = this.Page;

                //foreach (var routeValue in RouteValues)
                //    uriBuilder.Query += $"{routeValue.Key}={routeValue.Value}";

                //var url = uriBuilder.Uri.AbsoluteUri;

                var url = linkGenerator.GetUriByPage(this.ViewContext.HttpContext, this.Page, null, RouteValues);

                var redirect = $"window.location.href='{url}'";
                output.Attributes.Add("onclick", redirect);

                var styleAttr = output.Attributes.FirstOrDefault(a => a.Name == "style");
                if (styleAttr == null)
                {
                    styleAttr = new TagHelperAttribute("style", "cursor:pointer");
                    output.Attributes.Add(styleAttr);
                }
                else if (styleAttr.Value == null || styleAttr.Value.ToString().IndexOf("style") < 0)
                {
                    output.Attributes.SetAttribute("style", styleAttr.Value == null
                        ? "cursor:pointer"
                        : styleAttr.Value.ToString() + ",cursor:pointer");
                }
            }

            output.Attributes.RemoveAll("asp-row-submit");
        }
    }
}
