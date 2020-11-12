using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.DataSources.Entities;
using Ygdra.Core.Entities.Entities;
using Ygdra.Web.UI.Models;

namespace Ygdra.Web.UI.ModelBinders
{
    public class PolymorphicDataSourceViewModelBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context.Metadata.ModelType != typeof(DataSourceView))
                return null;

            var subclasses = new[] { typeof(DataSourceView),
                                     typeof(DataSourceViewUnknown),
                                     typeof(DataSourceViewAzureSqlDatabase),
                                     typeof(DataSourceViewAzureBlobFS),
                                     typeof(DataSourceViewAzureDatabricks),
                                     typeof(DataSourceViewCosmosDb),
            };

            var binders = new Dictionary<Type, (ModelMetadata, IModelBinder)>();
            foreach (var type in subclasses)
            {
                var modelMetadata = context.MetadataProvider.GetMetadataForType(type);
                binders[type] = (modelMetadata, context.CreateBinder(modelMetadata));
            }

            return new PolymorphicDataSourceViewModelBinder(binders);
        }
    }

    public class PolymorphicDataSourceViewModelBinder : IModelBinder
    {
        private readonly Dictionary<Type, (ModelMetadata, IModelBinder)> binders;

        public PolymorphicDataSourceViewModelBinder(Dictionary<Type, (ModelMetadata, IModelBinder)> binders)
        {
            this.binders = binders;
        }

        public async Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var modelKindName = ModelNames.CreatePropertyModelName(bindingContext.ModelName, nameof(DataSourceView.DataSourceType));
            var modelTypeValue = bindingContext.ValueProvider.GetValue(modelKindName).FirstValue;

            IModelBinder modelBinder;
            ModelMetadata modelMetadata;

            if (Enum.TryParse(typeof(YDataSourceType), modelTypeValue, out var t))
            {
                YDataSourceType dataSourceType = (YDataSourceType)t;

                switch (dataSourceType)
                {
                    case YDataSourceType.AzureBlobStorage:
                    case YDataSourceType.AzureBlobFS:
                        (modelMetadata, modelBinder) = binders[typeof(DataSourceViewAzureBlobFS)];
                        break;
                    case YDataSourceType.AzureSqlDatabase:
                    case YDataSourceType.AzureSqlDW:
                        (modelMetadata, modelBinder) = binders[typeof(DataSourceViewAzureSqlDatabase)];
                        break;
                    case YDataSourceType.AzureDatabricks:
                        (modelMetadata, modelBinder) = binders[typeof(DataSourceViewAzureDatabricks)];
                        break;
                    case YDataSourceType.CosmosDb:
                        (modelMetadata, modelBinder) = binders[typeof(DataSourceViewCosmosDb)];
                        break;
                    case YDataSourceType.None:
                    default:
                        (modelMetadata, modelBinder) = binders[typeof(DataSourceViewUnknown)];
                        break;
                }
            }
            else
            {
                bindingContext.Result = ModelBindingResult.Failed();
                return;
            }


            var newBindingContext = DefaultModelBindingContext.CreateBindingContext(
                bindingContext.ActionContext,
                bindingContext.ValueProvider,
                modelMetadata,
                bindingInfo: null,
                bindingContext.ModelName);

            await modelBinder.BindModelAsync(newBindingContext);
            bindingContext.Result = newBindingContext.Result;

            if (newBindingContext.Result.IsModelSet)
            {
                // Setting the ValidationState ensures properties on derived types are correctly 
                bindingContext.ValidationState[newBindingContext.Result] = new ValidationStateEntry
                {
                    Metadata = modelMetadata,
                };
            }
        }
    }

}
