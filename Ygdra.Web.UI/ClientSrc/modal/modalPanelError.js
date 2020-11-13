// @ts-check
import { modalPanel } from "./modalPanel.js";


export class modalPanelError {


    /**
     * @param {string} modal_data_target modal attribute data-target
     */
    constructor(modal_data_target, errorMessage) {

        this.modal_data_target = modal_data_target;
        this.errorMessage = errorMessage;
        this.modalError = new modalPanel(modal_data_target).xl().center().generate();

        this.modalError.onShown(e => this.shownPanel(e));
        this.modalError.onUnLoad(e => this.unloadPanel(e));
        this.modalError.onShow(e => this.showPanel(e));

    }

    /** @returns modalPanel */
    modal() {
        return this.modalError;
    }

    show() {
        this.modalError.panel().modal('show');
    }

    showPanel(event) {
        this._isInterrupted = false;

        let button = $(event.relatedTarget) // Button that triggered the modal

        this.modalError.submitButton().hide();
        this.modalError.deleteButton().hide();

        this.modalError.body().empty();
        this.modalError.title().text("Error");
        this.modalError.body().text(this.errorMessage);
    }

    async shownPanel(event) {

        var button = $(event.relatedTarget) // Button that triggered the modal
    }

    unloadPanel(event) {
        this.modalError.body().empty();
    }


}