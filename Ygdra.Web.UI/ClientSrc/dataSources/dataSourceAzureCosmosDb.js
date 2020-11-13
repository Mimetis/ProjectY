export class dataSourceAzureCosmosDb {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);


    }
}