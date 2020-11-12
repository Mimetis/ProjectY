// @ts-check
import { modalPanel } from "./modalPanel.js";


export class modalPanelPreview {


    static initialize(modal_data_target) {
        return new modalPanelPreview(modal_data_target);
    }

    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target) {

        this.modal_data_target = modal_data_target;
        // Get the small modal
        this.modalPreview = new modalPanel(modal_data_target).xl().center();

        this.modalPreview.onShown(e => this.shownPanel(e));
        this.modalPreview.onUnLoad(e => this.unloadPanel(e));
        this.modalPreview.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalPreview;
    }

    stop() {
        this._isInterrupted = true;
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget) // Button that triggered the modal

        this.modalPreview.submitButton().hide();
        this.modalPreview.deleteButton().hide();

        let titleString = button.data('title');

        this.modalPreview.body().empty();
        this.modalPreview.title().text(titleString);
        this.modalPreview.body().text('Loading ...');
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    async shownPanel(event) {

        var button = $(event.relatedTarget) // Button that triggered the modal

        // Extract info from data-* attributes
        var engineId = button.data('engine-id')
        var dataSourceName = button.data('data-source-name')
        var schemaName = button.data('schema-name')
        var tableName = button.data('table-name')


        let previewRowsResponse = await fetch(`/api/AzureSqlDatabase/${engineId}/${dataSourceName}/tables/${schemaName}/${tableName}/preview`);

        if (previewRowsResponse.status != 400) {
            let previewRows = await previewRowsResponse.json();

            if (previewRows.length) {

                this.modalPreview.body().empty();
                this.modalPreview.body().append("<table id='table'></table>");

                var row1 = previewRows[0];

                var columns = [];
                for (var o in row1) {
                    columns.push({
                        field: o,
                        title: o
                    });
                }

                $('#table').bootstrapTable({
                    columns: columns,
                    data: previewRows
                });


            } else {
                this.modalPreview.body().text('No rows...');
            }
        }
    }

    /** @param {import("bootstrap").ModalEventHandler<HTMLElement>} event */
    unloadPanel(event) {
        this.stop();
        this.modalPreview.body().empty();
    }


}