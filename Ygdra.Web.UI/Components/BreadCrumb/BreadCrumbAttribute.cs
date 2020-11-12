using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace Ygdra.Web.UI.Components.BreadCrumb
{

    public class CustomFilterAttribute : ResultFilterAttribute
    {
        public override async Task OnResultExecutionAsync(ResultExecutingContext context, ResultExecutionDelegate next)
        {
            var ipAddress = context.HttpContext.Request.Host.ToString();
            var result = (PageResult)context.Result;
            result.ViewData["CountryCode"] = ipAddress;
            await next.Invoke();
        }
    }
    /// <summary>
    /// BreadCrumb Action Filter. It can be applied to action methods or controllers.
    /// </summary>
    [AttributeUsage(AttributeTargets.All, AllowMultiple = true)]
    public class BreadCrumbAttribute : ResultFilterAttribute
    {
        /// <summary>
        /// Use this property to remove all of the previous items of the current stack
        /// </summary>
        public bool ClearStack { get; set; }

        /// <summary>
        /// An optional glyph icon of the current item
        /// </summary>
        public string GlyphIcon { get; set; }

        /// <summary>
        /// If UseDefaultRouteUrl is set to true, this property indicated all of the route items should be removed from the final URL
        /// </summary>
        public bool RemoveAllDefaultRouteValues { get; set; }

        /// <summary>
        /// If UseDefaultRouteUrl is set to true, this property indicated which route items should be removed from the final URL
        /// </summary>
        public string[] RemoveRouteValues { get; set; }

        /// <summary>
        /// Title of the current item
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Gets or sets the resource name (property name) to use as the key for lookups on the resource type.
        /// </summary>
        public string TitleResourceName { get; set; }

        /// <summary>
        /// Gets or sets the resource type to use for title lookups.
        /// </summary>
        public Type TitleResourceType { get; set; }

        /// <summary>
        /// A constant URL of the current item. If UseDefaultRouteUrl is set to true, its value will be ignored
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// This property is useful for controller level bread crumbs. If it's true, the Url value will be calculated automatically from the DefaultRoute
        /// </summary>
        public bool UseDefaultRouteUrl { get; set; }

        /// <summary>
        /// This property is useful when you need a back functionality. If it's true, the Url value will be previous Url using UrlReferrer
        /// </summary>
        public bool UsePreviousUrl { get; set; }

        /// <summary>
        /// Disables the breadcrumb for Ajax requests. Its default value is true.
        /// </summary>
        public bool IgnoreAjaxRequests { get; set; } = true;

        /// <summary>
        /// Adds the current item to the stack
        /// </summary>
        /// <param name="filterContext"></param>
        public override async Task OnResultExecutionAsync(ResultExecutingContext filterContext, ResultExecutionDelegate next)
        {
            if (IgnoreAjaxRequests && isAjaxRequest(filterContext))
            {
                await next.Invoke();
                return;
            }

            if (ClearStack)
            {
                filterContext.HttpContext.ClearBreadCrumbs();
            }

            var url = string.IsNullOrWhiteSpace(Url) ? filterContext.HttpContext.Request.GetEncodedUrl() : Url;

            if (UseDefaultRouteUrl)
            {
                url = getDefaultControllerActionUrl(filterContext);
            }

            if (UsePreviousUrl)
            {
                url = filterContext.HttpContext.Request.Headers["Referrer"];
            }

            setEmptyTitleFromResources();
            setEmptyTitleFromAttributes(filterContext);

            filterContext.HttpContext.AddBreadCrumb(new BreadCrumb
            {
                Url = url,
                Title = Title,
                Order = Order,
                GlyphIcon = GlyphIcon
            });

            await next.Invoke();
        }

        private static bool isAjaxRequest(ResultExecutingContext filterContext)
        {
            var request = filterContext.HttpContext.Request;
            return request?.Headers != null && request.Headers["X-Requested-With"] == "XMLHttpRequest";
        }

        private string getDefaultControllerActionUrl(ResultExecutingContext filterContext)
        {
            var defaultAction = string.Empty;
            var urlHelper = getUrlHelper(filterContext);

            if (RemoveAllDefaultRouteValues)
            {
                return urlHelper.ActionWithoutRouteValues(defaultAction);
            }

            if (RemoveRouteValues?.Any() != true)
            {
                return urlHelper.Action(defaultAction);
            }

            return urlHelper.ActionWithoutRouteValues(defaultAction, RemoveRouteValues);
        }

        private static IUrlHelper getUrlHelper(ResultExecutingContext filterContext)
        {
            if (!(filterContext.Controller is PageModel pageModel))
            {
                throw new NullReferenceException("Failed to find the current PageModel.");
            }

            var urlHelper = pageModel.Url;
            if (urlHelper == null)
            {
                throw new NullReferenceException("Failed to find the IUrlHelper of the filterContext.Controller.");
            }

            return urlHelper;
        }

        private void setEmptyTitleFromAttributes(ResultExecutingContext filterContext)
        {
            if (!string.IsNullOrWhiteSpace(Title))
            {
                return;
            }

            if (!(filterContext.ActionDescriptor is ControllerActionDescriptor descriptor))
            {
                return;
            }

            var currentFilter = filterContext.ActionDescriptor
                                            .FilterDescriptors
                                            .Select(filterDescriptor => filterDescriptor)
                                            .FirstOrDefault(filterDescriptor => ReferenceEquals(filterDescriptor.Filter, this));
            if (currentFilter == null)
            {
                return;
            }

            MemberInfo typeInfo = null;

            if (currentFilter.Scope == FilterScope.Action)
            {
                typeInfo = descriptor.MethodInfo;
            }
            if (currentFilter.Scope == FilterScope.Controller)
            {
                typeInfo = descriptor.ControllerTypeInfo;
            }

            if (typeInfo == null)
            {
                return;
            }

            Title = typeInfo.GetCustomAttribute<DisplayNameAttribute>(inherit: true)?.DisplayName;
            if (string.IsNullOrWhiteSpace(Title))
            {
                Title = typeInfo.GetCustomAttribute<DescriptionAttribute>(inherit: true)?.Description;
            }
        }

        private void setEmptyTitleFromResources()
        {
            if (string.IsNullOrWhiteSpace(TitleResourceName) || TitleResourceType == null)
            {
                return;
            }

            var property = TitleResourceType.GetTypeInfo().GetDeclaredProperty(TitleResourceName);
            if (property != null)
            {
                var propertyGetter = property.GetMethod;

                // We only support internal and public properties
                if (propertyGetter == null || (!propertyGetter.IsAssembly && !propertyGetter.IsPublic))
                {
                    // Set the property to null so the exception is thrown as if the property wasn't found
                    property = null;
                }
            }

            if (property == null)
            {
                throw new InvalidOperationException($"ResourceType `{TitleResourceType.FullName}` does not have the `{TitleResourceName}` property.");
            }

            if (property.PropertyType != typeof(string))
            {
                throw new InvalidOperationException($"`{TitleResourceType.FullName}.{TitleResourceName}` property is not an string.");
            }

            Title = (string)property.GetValue(null, null);
        }
    }

    /// <summary>
    /// UrlHelper Extensions
    /// </summary>
    public static class UrlHelperExtensions
    {
        /// <summary>
        /// Creates a URL without its route values
        /// </summary>
        /// <param name="helper"></param>
        /// <param name="action"></param>
        /// <param name="removeRouteValues"></param>
        /// <returns></returns>
        public static string ActionWithoutRouteValues(this IUrlHelper helper, string action, string[] removeRouteValues = null)
        {
            var routeValues = helper.ActionContext.RouteData.Values;
            var routeValueKeys = routeValues.Keys.Where(o => o != "controller" && o != "action").ToList();

            // Temporarily remove route values
            var oldRouteValues = new Dictionary<string, object>();

            foreach (var key in routeValueKeys)
            {
                if (removeRouteValues != null && !removeRouteValues.Contains(key))
                {
                    continue;
                }

                oldRouteValues[key] = routeValues[key];
                routeValues.Remove(key);
            }

            // Generate URL
            var url = helper.Action(action);

            // Reinsert route values
            foreach (var keyValuePair in oldRouteValues)
            {
                routeValues.Add(keyValuePair.Key, keyValuePair.Value);
            }

            return url;
        }
    }
}
