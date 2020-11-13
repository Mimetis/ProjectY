// @ts-check

export class modalPanel {

    /**
     * @param {string} id
     */
    constructor(id) {
        this.id = id;
        this._shownPanel = (e) => { };
        this._showPanel = (e) => { };
        this._unloadPanel = (e) => { };
        this._large = "";
        this._position = "right";
        this._center = "";

    }

    generate() {

        if (this.panel() && this.panel().length > 0)
            return this;

        let modalHtmlDiv = this._generateModalHtml();
        $('body').append(modalHtmlDiv);

        return this;
    }

    /** @returns modalPanel */
    sm() {
        this._large = "";
        return this;
    }


    /** @returns modalPanel */
    lg() {
        this._large = " modal-lg";
        return this;
    }

    /** @returns modalPanel */
    xl() {
        this._large = " modal-xl";
        this._position = "";
        return this;
    }


    /** @returns modalPanel */
    readonly() {
        this._data_readonly = 'data-backdrop="static" data-keyboard="false" ';
        return this;
    }

    center() {
        this._center = "modal-dialog-centered modal-dialog-scrollable";
        return this;
    }


    onShown(shownPanelEvent) { this.panel().on('shown.bs.modal', shownPanelEvent) }

    onShow(showPanelEvent) { this.panel().on('show.bs.modal', showPanelEvent) }

    onUnLoad(unloadPanelEvent) { this.panel().on('hide.bs.modal', unloadPanelEvent) }


    /** @returns {JQuery<HTMLElement>} */
    panel() { return $(`#${this.id}`) }

    /** @returns {JQuery<HTMLButtonElement>} */
    submitButton() { return $(`#${this.id}SubmitButton`) }

    /**  @returns {JQuery<HTMLButtonElement>} */
    deleteButton() {
        return $(`#${this.id}DeleteButton`)
    }

    deleteButtonText(text) {
        $(`#${this.id}DeleteButtonText`).text(text);
    }


    /** @returns {JQuery<HTMLButtonElement>}*/
    closeButton() { return $(`#${this.id}CloseButton`) }

    /** @returns {JQuery<HTMLDivElement>}*/
    // @ts-ignore
    body() { return $(`#${this.id}Body`) }

    /** @returns {JQuery<HTMLHRElement>}*/
    // @ts-ignore
    title() { return $(`#${this.id}Title`) }


    _generateModalHtml() {

        let modal = `
        <div class="modal ${this._position} fade" id="${this.id}" tabindex="-1" ${this._data_readonly}aria-labelledby="${this.id}" aria-hidden="true">
            <div class="modal-dialog${this._large} ${this._center}">
                <div class="modal-content${this._large}">
                    <div class="modal-header">
                        <h5 class="modal-title" id="${this.id}Title"></h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="${this.id}Body">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark btn-sm" data-dismiss="modal" id="${this.id}CloseButton">
                            <i class="fas fa-undo"></i>
                            Close
                        </button>
                        <button type="button" class="btn btn-primary btn-sm" id="${this.id}SubmitButton">
                            <i class="fas fa-save"></i>
                            Submit
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" id="${this.id}DeleteButton">
                            <i class="fas fa-trash-alt"></i>
                            <span id="${this.id}DeleteButtonText">Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>`;

        return modal;
    }

}
