using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;
using System.Linq;
using System.Threading.Tasks;

namespace Ygdra.Core.Payloads
{
    public enum YPurviewSourceKind {
        [EnumMember(Value="AdlsGen2")]
        AdlsGen2,
        AdlsGen1,
        AzureCosmosDb,
        AzureDataExplorer,
        AzureStorage,
        AzureSqlDatabase,
        AzureSqlDataWarehouse,
        PowerBI,
        SqlServerDatabase,
        AzureSqlDatabaseManagedInstance,
        AzureFileService,
        Teradata,
        SapEcc,
        SapS4Hana,
        Hive,
        AmazonS3
    }
    public class YPurviewSourcePayload
    {
        [Required]
        public YPurviewSourceKind Kind {get;set;}
        public YPurviewSourceProperties Properties{get;set;}
    }
    public class YPurviewSourceProperties
    {
        [Required]
        public string endpoint {get;set;}
        public string subscriptionId {get;set;}
        public string resourceGroup {get;set;}
        public string location {get;set;}
    }

    public enum YPurviewSourceScanKind{
        [EnumMember(Value="AdlsGen2Credential")]
        AdlsGen2Credential
    }
    public class YPurviewSourceScanRunPayload {
        public string scanLevel {get;set;}
    }
    public class YPurviewSourceScanPayload {
        public string Kind {get;set;}
        public YPurviewSourceScanProperties properties {get;set;}
    }

    public class YPurviewSourceScanProperties {
        public YPurviewSourceScanCredential credential {get;set;}
        public string scanRuleSetName {get;set;}
        public string scanRuleSetType {get;set;}

    }
    public class YPurviewSourceScanCredential{
        
        public string referenceName {get;set;}
        public string credentialType {get;set;}
    }
}
