using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.ViewComponents
{
    public class AzureDatabricksViewComponent : ViewComponent
    {

        public AzureDatabricksViewComponent()
        {

        }

        public DataSourceViewAzureDatabricks DatasourveView { get; set; }

        public async Task<IViewComponentResult> InvokeAsync(DataSourceViewAzureDatabricks datasourveView)
        {
            return View(datasourveView);
        }
    }
}
