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
    public class PolymorphicEntitySourceBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context.Metadata.ModelType != typeof(EntityView))
                return null;

            var subclasses = new[] { typeof(EntityView),
                                     typeof(EntityViewAzureSqlTable),
                                     typeof(EntityViewDelimitedText),
                                     typeof(EntityViewParquet),
                                     typeof(EntityViewUnknown),
            };

            var binders = new Dictionary<Type, (ModelMetadata, IModelBinder)>();
            foreach (var type in subclasses)
            {
                var modelMetadata = context.MetadataProvider.GetMetadataForType(type);
                binders[type] = (modelMetadata, context.CreateBinder(modelMetadata));
            }

            return new PolymorphicEntitySourceModelBinder(binders);
        }
    }

    public class PolymorphicEntitySourceModelBinder : IModelBinder
    {
        private readonly Dictionary<Type, (ModelMetadata, IModelBinder)> binders;

        public PolymorphicEntitySourceModelBinder(Dictionary<Type, (ModelMetadata, IModelBinder)> binders)
        {
            this.binders = binders;
        }

        public async Task BindModelAsync(ModelBindingContext bindingContext)
        {
            var modelKindName = ModelNames.CreatePropertyModelName(bindingContext.ModelName, nameof(EntityView.EntityType));
            var modelTypeValue = bindingContext.ValueProvider.GetValue(modelKindName).FirstValue;

            IModelBinder modelBinder;
            ModelMetadata modelMetadata;

            if (Enum.TryParse(typeof(YEntityType), modelTypeValue, out var t))
            {
                YEntityType entityType = (YEntityType)t;

                switch (entityType)
                {
                    case YEntityType.AzureSqlTable:
                        (modelMetadata, modelBinder) = binders[typeof(EntityViewAzureSqlTable)];
                        break;
                    case YEntityType.DelimitedText:
                        (modelMetadata, modelBinder) = binders[typeof(EntityViewDelimitedText)];
                        break;
                    case YEntityType.Parquet:
                        (modelMetadata, modelBinder) = binders[typeof(EntityViewParquet)];
                        break;
                    case YEntityType.None:
                    default:
                        (modelMetadata, modelBinder) = binders[typeof(EntityViewUnknown)];
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
