using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Ygdra.Core.Engine.Entities;
using Ygdra.Core.Services;

namespace Ygdra.Web.UI.Models
{
    public class EngineView : IValidatableObject
    {
        public static string[] Locations => new string[]{
                "westus", "eastus2", "westeurope", "eastus", "northeurope", "southeastasia", "eastasia", "southcentralus", "northcentralus",
                "westus2", "centralus", "ukwest", "uksouth", "australiaeast", "australiasoutheast", "australiacentral", "australiacentral2",
                "japaneast", "japanwest", "canadacentral", "canadaeast", "centralindia", "southindia", "westindia",
                "koreacentral", "koreasouth", "southafricawest", "southafricanorth", "brazilsouth", "francecentral", "uaenorth"};



        public EngineView()
        {
            this.IsNew = true;
            this.Engine = new YEngine
            {
                Id = Guid.NewGuid(),
                EngineName = YNameGenerator.GetRandomName(9, "eng"),
                Status = YEngineStatus.InReview
            };

        }
        public EngineView(YEngine engineDeployment)
        {
            this.IsNew = false;
            this.Engine = engineDeployment;
        }

        public bool IsNew { get; set; }


        /// <summary>
        /// Gets the authorized location
        /// </summary>
        public List<SelectListItem> LocationsItems => Locations.OrderBy(l => l).Select(l => new SelectListItem(l, l)).ToList();

        /// <summary>
        /// Gets or Sets the selected location for deployment
        /// </summary>
        [Required]
        public string Location
        {
            get => this.Engine.Location;
            set => this.Engine.Location = value;
        }

        public YEngine Engine { get; set; }

        public Guid Id
        {
            get => this.Engine.Id;
            set => this.Engine.Id = value;
        }

        public YEngineStatus Status
        {
            get => this.Engine.Status;
            set => this.Engine.Status = value;
        }

        [StringLength(10, MinimumLength = 5)]
        [Required]
        [Display(Name = "Engine name")]
        public string EngineName
        {
            get => this.Engine.EngineName;
            set => this.Engine.EngineName = value;
        }

        public string Comments
        {
            get => this.Engine.Comments;
            set => this.Engine.Comments = value;
        }

        [Display(Name = "Status log")]
        public string StatusLog
        {
            get => this.Engine.StatusLog;
            set => this.Engine.StatusLog = value;
        }

        [Display(Name = "Admin comments")]
        public string AdminComments
        {
            get => this.Engine.AdminComments;
            set => this.Engine.AdminComments = value;
        }


        [Display(Name = "Resource group")]
        [StringLength(20, MinimumLength = 5)]
        [Required]
        public string ResourceGroupName
        {
            get => this.Engine.ResourceGroupName;
            set => this.Engine.ResourceGroupName = value;
        }


        [Display(Name = "Cluster name")]
        [StringLength(20, MinimumLength = 5)]
        [Required]
        public string ClusterName
        {
            get => this.Engine.ClusterName;
            set => this.Engine.ClusterName = value;
        }

        [Display(Name = "Factory name")]
        [StringLength(20, MinimumLength = 5)]
        [Required]
        public string FactoryName
        {
            get => this.Engine.FactoryName;
            set => this.Engine.FactoryName = value;
        }

        [Display(Name = "Keyvault name")]
        [StringLength(20, MinimumLength = 5)]
        [Required]
        public string KeyVaultName
        {
            get => this.Engine.KeyVaultName;
            set => this.Engine.KeyVaultName = value;
        }


        [Display(Name = "Storage name")]
        [StringLength(20, MinimumLength = 5)]
        [Required]
        public string StorageName
        {
            get => this.Engine.StorageName;
            set => this.Engine.StorageName = value;
        }



        [Required]
        public YEngineType EngineType
        {
            get => this.Engine.EngineType;
            set => this.Engine.EngineType = value;
        }

        public string EngineTypeIconString
        {
            get
            {
                switch (this.EngineType)
                {
                    case YEngineType.Synapse:
                        return "svg-i-100x100-AzureSynapse";
                    case YEngineType.Unknown:
                    case YEngineType.Databricks:
                    default:
                        return "svg-i-100x100-DataBricks";
                }
            }
        }
        public dynamic EngineTypeJson
        {
            get
            {
                return new
                {
                    EngineTypeIconString,
                    EngineType = EngineType.ToString(),
                };
            }
        }


        [Required]
        public List<Guid> Owners
        {
            get => this.Engine.Owners?.Select(p => p.Id).ToList();
            set => this.Engine.Owners = value == null ? null : (ICollection<YPerson>)value.Select(g => new YPerson { Id = g }).ToList();
        }


        public List<Guid> Members
        {
            get => this.Engine.Members?.Select(p => p.Id).ToList();
            set => this.Engine.Members = value == null ? null : (ICollection<YPerson>)value.Select(g => new YPerson { Id = g }).ToList();
        }

        public bool HasOwners => Owners != null && Owners.Any();
        public string OwnersFlatListing => HasOwners ? string.Join(",", Owners) : string.Empty;

        public bool HasMembers => Members != null && Members.Any();
        public string MembersFlatListing => HasMembers ? string.Join(",", Members) : string.Empty;


        public dynamic StatusJson
        {
            get
            {
                return new
                {
                    StatusIcon,
                    StatusColor,
                    StatusClass,
                    StatusString,
                    StatusTrClass
                };
            }
        }

        public string StatusIcon
        {
            get
            {
                switch (Status)
                {
                    case YEngineStatus.InReview:
                        return "fas fa-tasks";
                    case YEngineStatus.NeedMoreInfos:
                        return "fas fa-info-circle";
                    case YEngineStatus.Rejected:
                        return "fas fa-minus-circle";
                    case YEngineStatus.Deploying:
                        return "fas fa-cog";
                    case YEngineStatus.Deployed:
                        return "fas fa-check-circle";
                    case YEngineStatus.Failed:
                        return "fas fa-exclamation";
                    default:
                        return "fas fa-cog";
                }
            }
        }

        public string StatusColor
        {
            get
            {
                switch (Status)
                {
                    case YEngineStatus.InReview:
                    case YEngineStatus.Deploying:
                        return "#017CFF";
                    case YEngineStatus.NeedMoreInfos:
                        return "#18A2B8";
                    case YEngineStatus.Rejected:
                    case YEngineStatus.Failed:
                        return "#DC3646";
                    case YEngineStatus.Deployed:
                        return "#29A746";
                    default:
                        return "#29A746";
                }
            }
        }

        public string StatusClass
        {
            get
            {
                switch (Status)
                {
                    case YEngineStatus.InReview:
                    case YEngineStatus.Deploying:
                        return "btn btn-outline-primary";
                    case YEngineStatus.NeedMoreInfos:
                        return "btn btn-outline-info";
                    case YEngineStatus.Rejected:
                    case YEngineStatus.Failed:
                        return "btn btn-outline-danger";
                    case YEngineStatus.Deployed:
                        return "btn btn-outline-success";
                    default:
                        return "btn btn-outline-primary";
                }
            }
        }
        public string StatusString
        {
            get
            {
                switch (Status)
                {
                    case YEngineStatus.InReview:
                        return "Reviewing";
                    case YEngineStatus.NeedMoreInfos:
                        return "Need more informations";
                    default:
                        return Status.ToString();
                }
            }
        }

        public string StatusTrClass
        {
            get
            {
                switch (Status)
                {
                    case YEngineStatus.Rejected:
                    case YEngineStatus.Failed:
                        return "table-danger";
                    default:
                        return "";
                }
            }
        }


        public string DetailsPage
        {
            get
            {
                //if (this.linkGenerator != null)
                //{
                //    var d = new Dictionary<string, string> {
                //        { "Id", this.Id.ToString() }
                //    };

                //    var url = linkGenerator.GetUriByPage(this.pageModel.HttpContext, "/Engines/Details", null, d);
                //    return url;
                //}

                return $"/Engines/Details/{this.Id}";
            }
        }


        public DateTime? RequestDate
        {
            get => this.Engine.RequestDate;
            set => this.Engine.RequestDate = value;
        }

        public DateTime? UpdateDate
        {
            get => this.Engine.UpdateDate;
            set => this.Engine.UpdateDate = value;
        }

        public DateTime? DeploymentDate
        {
            get => this.Engine.DeploymentDate;
            set => this.Engine.DeploymentDate = value;
        }

        public string RequestDateString => !RequestDate.HasValue || RequestDate == DateTime.MinValue ? "" : RequestDate.Value.ToShortDateString();
        public string DeploymentDateString => !DeploymentDate.HasValue || DeploymentDate == DateTime.MinValue ? "" : DeploymentDate.Value.ToShortDateString();
        public string UpdateDateString => !UpdateDate.HasValue || UpdateDate == DateTime.MinValue ? "" : UpdateDate.Value.ToShortDateString();



        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            IHttpContextAccessor httpContextAccessor = validationContext.GetService<IHttpContextAccessor>();

            var userId = new Guid(httpContextAccessor.HttpContext.User.GetObjectId());

            var userName = httpContextAccessor.HttpContext.User.GetDisplayName();

            // Admin don't have to be part of the owners
            var isAdmin = httpContextAccessor.HttpContext.User.IsInRole("Admin");

            if (this.Owners == null || this.Owners.Count <= 0)
                yield return new ValidationResult($"You should select at least one Owner. Please add at least your username [{userName}] to the owners list.", new string[] { nameof(Owners) });

            if (this.Owners != null && !this.Owners.Any(o => o == userId || isAdmin))
                yield return new ValidationResult($"You should be part of the Owners. Please add [{userName}] to the owners list.", new string[] { nameof(Owners) });

            if (this.Status == YEngineStatus.NeedMoreInfos && string.IsNullOrWhiteSpace(this.AdminComments))
                yield return new ValidationResult($"Since this request need more infos, you should provide a feedback to the user, through the admin comments section", new string[] { nameof(AdminComments) });
        }
    }
}
