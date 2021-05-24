// @ts-check

import { modalPanelError } from "../modal/index";

export class entitiesParquet {

    constructor() {
        this.isLoaded = false;
    }

    /**
     * @param {JQuery<HTMLElement>} element
     * @param {string} engineId
     */
    async loadAsync(htmlFieldPrefix, element, engineId) {

        this.htmlFieldPrefix = htmlFieldPrefix;

        await element.loadAsync(`/entities/new/entities?dvt=Parquet&engineId=${engineId}`);

        // transform all select picker into selectpicker
        $('select').selectpicker();

        // once loaded, get the selectors
        this.$dataSourcesSelect = $(`#${this.htmlFieldPrefix}DataSourceName`);
        this.$dataSourcesSelectString = $(`#${this.htmlFieldPrefix}DataSourcesItemsString`);
        this.$dataSourcesJsonSelectString = $(`#${this.htmlFieldPrefix}DataSourcesJsonItemsString`);
        this.$labelErrorDataSources = $("#labelErrorDataSources");
        // on data sources changes, refresh the tables
        this.$dataSourcesSelect.change(async () => { await this.refreshStoragesPaths(engineId) });


        this.$directoryPathSelect = $(`#${this.htmlFieldPrefix}FullPath`);
        this.$labelErrorDirectoryPath = $("#labelErrorDirectoryPath");


        if (!this.isLoaded) {
            setTimeout(() => this.refreshDataSourcesAsync(engineId), 10);
        }
    }


    async refreshDataSourcesAsync(engineId) {
        this.$dataSourcesSelect.disablePicker("Loading Data Sources ...");
        this.$labelErrorDataSources.empty();


        this.mapDataSources = new Map();
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
            let dataSources1 = dataSourcesJson.map(item => { let i = {}; i.name = item.name; i.dataSourceType = item.dataSourceType; return i; });

            $.each(dataSources1, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item.name, text: item.name }))
            });

            r = await fetch(`/entities/new/datasources?engineId=${engineId}&dataSourceType=AzureBlobFS`);

            if (r.status >= 400) {
                let contentType = r.headers.get("content-type");
                var text = (contentType && contentType.indexOf("json") !== -1) ? (await r.json()).error.message : await r.text();
                this.$labelErrorDataSources.text(text.error.message);
                return;
            }
            dataSourcesJson = await r.json();
            let dataSources2 = dataSourcesJson.map(item => { let i = {}; i.name = item.name; i.dataSourceType = item.dataSourceType; return i; });

            $.each(dataSources2, (i, item) => {
                this.$dataSourcesSelect.append($('<option>', { value: item.name, text: item.name }))
            });


            dataSources = dataSources1.concat(dataSources2);

            if (!dataSources.length) {
                this.$dataSourcesSelect.data("noneSelectedText", "No Data Sources...");
                this.$dataSourcesSelectString.val('');
                this.$dataSourcesJsonSelectString.val('');

            } else {

                this.$dataSourcesSelectString.val(dataSources.map(ds => ds.name).join());
                this.$dataSourcesJsonSelectString.val(JSON.stringify(dataSources));
            }
            var dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();

            if (dataSourceSelected)
                await this.refreshStoragesPaths(engineId, dataSourceSelected);

        } catch (e) {
            this.$labelErrorDataSources.text("Unexpected Server error");
            this.$dataSourcesSelect.data("noneSelectedText", "Can't load Data Sources...");
            this.$dataSourcesSelectString.val('');
            this.$dataSourcesJsonSelectString.val('');
            new modalPanelError("error", e).show();
        }

        this.$dataSourcesSelect.enablePicker();

    }


    async refreshStoragesPaths(engineId) {

        this.$directoryPathSelect.empty();
        this.$directoryPathSelect.disablePicker("Loading all paths ...");
        this.$labelErrorDirectoryPath.empty();

        let dataSourceSelected = $(`#${this.htmlFieldPrefix}DataSourceName option:selected`).val();
        let dataSources = JSON.parse(this.$dataSourcesJsonSelectString.val());


        let dataSource = dataSources.find(e => e.name == dataSourceSelected);

        let entityLocationTypeElement = $(`#${this.htmlFieldPrefix}LocationType`);

        if (dataSource.dataSourceType === 'AzureBlobStorage')
            entityLocationTypeElement.val('AzureBlobStorageLocation');
        else if (dataSource.dataSourceType === 'AzureBlobFS')
            entityLocationTypeElement.val('AzureBlobFSLocation');



        let directories = [];
        try {

            let r = await fetch(`/api/storages/${engineId}/${dataSource.name}/files`);

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
