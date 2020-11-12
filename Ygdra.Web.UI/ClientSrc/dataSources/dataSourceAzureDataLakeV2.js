export class dataSourceAzureDataLakeV2 {


    async loadAsync(engineId, htmlFieldPrefix, element, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);
        }


        if (loadMethod !== 'POST') {
        }

    }

}