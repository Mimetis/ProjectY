﻿export class dataSourceAzureDataLakeV2 {

    constructor() {
        this.isLoaded = false;
    }
    async loadAsync(engineId, htmlFieldPrefix, element) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/dataSources/new/properties?engineId=${engineId}&dvt=AzureBlobFS`);


        // Getting test button
        this.$dataSourceTestButton = $("#dataSourceTestButton");

        if (this.$dataSourceTestButton.length) {

            this.$dataSourceTestButton.click(async (evt) => {

                evt.preventDefault();

                let engineId = $("#DataSourceView_EngineId").val();

                if (engineId)
                    await this.$dataSourceTestButton.testAsync(`/api/datafactories/${engineId}/test`);
            });
        }

    }

}