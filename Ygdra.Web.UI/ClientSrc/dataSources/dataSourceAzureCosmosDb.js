export class dataSourceAzureCosmosDb {


    async loadAsync(engineId, htmlFieldPrefix, element, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=CosmosDb`);
        }

        if (loadMethod !== 'POST') {
        }
    }
}