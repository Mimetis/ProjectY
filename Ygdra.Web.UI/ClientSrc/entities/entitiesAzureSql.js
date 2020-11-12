// @ts-check

export class entitiesAzureSql {

	/**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     * @param {string} loadMethod
     */
    async loadAsync(htmlFieldPrefix, element, engineId, loadMethod) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (loadMethod !== 'POST') {
            await element.loadAsync(`/entities/new/entities?dvt=AzureSqlTable&engineId=${engineId}`);
        }

        // get errors labels
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        this.$labelErrorTables = $("#labelErrorTables");

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshTablesAsync(engineId) });

        this.$tablesSelect = $(`#${this.htmlFieldPrefix}TableName`);
        this.$tablesSelectString = $(`#${this.htmlFieldPrefix}TablesItemsString`);
        // on table change, set the correct attributes for the preview button
        this.$tablesSelect.change(() => { this.setPreviewDataAttributes(engineId) });

        if (loadMethod !== 'POST') {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
    }

    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();
        this.$labelErrorTables.empty();


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

        if (dataSourceSelected)
            await this.refreshTablesAsync(engineId);

    }

    async refreshTablesAsync(engineId) {
        this.$labelErrorTables.empty();

        this.$tablesSelect.disablePicker("loading tables ...");

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        let tables = [];

        let tablesUrl = `/api/AzureSqlDatabase/${engineId}/${dataSourceSelected}/tables`;
        let r = await fetch(tablesUrl);

        if (r.status >= 400) {
            var text = await r.json();
            this.$labelErrorTables.text(text.error.message);
            return;
        }

        if (r.status != 400) {
            let tablesJson = await r.json();

            tables = tablesJson.map(item => `${item.schemaName}.${item.tableName}`);

            $.each(tables, (i, item) => {
                this.$tablesSelect.append($('<option>', { value: item, text: item }))
            });
        }

        if (!tables.length) {
            this.$tablesSelect.data("noneSelectedText", "No Tables...");
            this.$tablesSelectString.val('');
        }
        else {
            this.$tablesSelectString.val(tables.join());
        }

        this.$tablesSelect.enablePicker();

        var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

        if (tableSelected)
            this.setPreviewDataAttributes(engineId);

    }

    setPreviewDataAttributes(engineId) {
        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

        if (!dataSourceSelected?.length)
            return;

        var tableSelected = $(`#${this.htmlFieldPrefix}TableName option:selected`).val();

        if (!tableSelected?.length)
            return;

        var tableTab = tableSelected.split(".");
        var schemaName = tableTab[0];
        var tableName = tableTab[1];

        // before refreshing columns, add data to preview buttons
        let $previewEntityButton = $("#previewEntityButton");
        $previewEntityButton.data("engine-id", engineId);
        $previewEntityButton.data("data-source-name", dataSourceSelected);
        $previewEntityButton.data("schema-name", schemaName);
        $previewEntityButton.data("table-name", tableName);
        $previewEntityButton.data("title", `Table preview [${schemaName}].[${tableName}]`);

    }

}
