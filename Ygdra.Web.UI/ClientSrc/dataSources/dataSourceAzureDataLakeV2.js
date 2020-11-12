export class dataSourceAzureDataLakeV2 {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);
        }


        this.isLoaded = true;

    }

}