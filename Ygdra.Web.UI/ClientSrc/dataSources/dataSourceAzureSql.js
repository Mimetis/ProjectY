// @ts-check
export class dataSourceAzureSql {


    async loadAsync(engineId, htmlFieldPrefix, element, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;


        if (loadMethod !== 'POST') {
            await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureSqlDatabase`);
        }

        //if (loadMethod !== 'POST') {
        //}
        
    }

}