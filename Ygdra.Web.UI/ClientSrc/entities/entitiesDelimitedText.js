// @ts-check

export class entitiesDelimitedText {

	/**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     * @param {string} loadMethod
     */
    async loadAsync(htmlFieldPrefix, element, engineId, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);
        }

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$labelErrorDataSources = $("#labelErrorDataSources");

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);

        if (loadMethod !== 'POST') {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();


        let dataSourcesUrl = `/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureSqlDatabase`;
        let r = await fetch(dataSourcesUrl);
        let dataSources = [];

        if (r.status >= 400) {
            var text = await r.json();
            this.$labelErrorDataSources.text(text.error.message);
            return;
        }

        if (r.status != 400) {
            let dataSourcesJson = await r.json();

            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }))
            });
        }

        if (!dataSources.length) {
            this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
            this.$dataSourcesSelectString.val('');

        } else {
            this.$dataSourcesSelectString.val(dataSources.join());

        }

        this.$dataSourcesSelect.enablePicker();

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

    }
}
