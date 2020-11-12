// @ts-check
export class dataSourceAzureSql {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;


        if (!this.isLoaded) {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);
        }
 
        this.isLoaded = true;

    }

}