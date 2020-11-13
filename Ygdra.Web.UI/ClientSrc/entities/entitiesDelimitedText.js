// @ts-check

import { modalPanelError } from "../modal/index";

export class entitiesDelimitedText {

    constructor() {
        this.isLoaded = false;
    }

    /**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        if (!this.isLoaded) {
            await element.loadAsync(`/entities/new/entities?dvt=DelimitedText&engineId=${engineId}`);
        }

        // transform all select picker into selectpicker
        $('select').selectpicker();


        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshStoragesPaths(engineId) });


        this.$directoryPathSelect = $(`#${this.htmlFieldPrefix}FullPath`);
        this.$labelErrorDirectoryPath = $("#labelErrorDirectoryPath");


        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
        this.isLoaded = true;
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();

        let dataSources = [];
        try {

            let r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobStorage`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            let dataSourcesJson = await r.json();
            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }))
            });

            r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobFS`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            dataSourcesJson = await r.json();
            dataSources = dataSourcesJson.map(item => item.name);

            $.each(dataSources, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item, text: item }))
            });


            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');

            } else {
                this.$dataSourcesSelectString.val(dataSources.join());

            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshStoragesPaths(engineId, dataSourceSelected);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");

            new modalPanelError("error", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }


    async refreshStoragesPaths(engineId) {

        this.$directoryPathSelect.empty();
        this.$directoryPathSelect.disablePicker("Loading all paths ...");
        this.$labelErrorDirectoryPath.empty();

        var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();


        let directories = [];
        try {

            let r = await fetch(`/api/storages/${engineId}/containers/${dataSourceSelected}`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDirectoryPath.text(text.error.message);
                return;
            }
            let directoriesJson = await r.json();
            directories = directoriesJson.map(item => item.name);

            $.each(directories, (i, item) => {
                this.$directoryPathSelect.append($('<option>', { value: item, text: item }))
            });
        } catch (e) {

            this.$labelErrorDirectoryPath.text("Unexpected Server error");
            this.$directoryPathSelect.data("noneSelectedText", "Can't load Storage files...");

            new modalPanelError("error", e).show();
        }

        this.$directoryPathSelect.enablePicker();

    }
}
