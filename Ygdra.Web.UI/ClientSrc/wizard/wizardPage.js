// @ts-check
import { setEngineBootstrapTable } from "../bootstrapTables/index.js";

export class wizardPage {

    constructor(htmlFieldPrefix, engineUrl) {

        // HtmlFieldPrefix prefix is the predix for rendering asp.net core items
        this.htmlFieldPrefix = `${htmlFieldPrefix}_`;

        // url for loading engines
        this.engineUrl = engineUrl;
    }

    async onLoad() {
        // get form
        this.$form = $("form");

        // get engine table
        this.$enginesTable = $("#enginesTable");

        // get spinner
        this.$spinner = $("#spinner")

        // get buttons
        this.$nextButton = $("#nextButton");
        this.$previousButton = $("#previousButton");
        this.$saveButton = $("#saveButton");

        // get wizard
        this.$smartWizard = $("#smartWizard");

        // get properties panel
        this.$properties = $("#properties");

        // hidden fields
        this.$engineIdElement = $(`#${this.htmlFieldPrefix}EngineId`);
        this.$isNew = $(`#${this.htmlFieldPrefix}IsNew`);

        // No prefix for hiddent Step field, since it's directly binded into the PageModel
        this.$step = $(`#Step`);

        this.step = this.$step  && this.$step.val() ? parseInt(this.$step.val()) : 0;

        if (this.$spinner)
            this.$spinner.hide();

        this.boostrapEnginesTable();

        this.bootstrapWizard();

        this.bootstrapButtons();
    }


    bootstrapWizard() {

        // Step show event
        this.$smartWizard.on("showStep", async (e, anchorObject, stepNumber, stepDirection, stepPosition) => {

            // Update step
            this.$step.val(stepNumber);

            this.$nextButton.enable();
            this.$previousButton.enable();
            this.$nextButton.enable();
            this.$saveButton.disable();

            if (stepPosition === "first") {
                this.$previousButton.disable();
            } else if (stepPosition === "middle") {
                this.$previousButton.enable();
                this.$nextButton.enable();
            } else if (stepPosition === "last") {
                this.$nextButton.disable();
                this.$saveButton.enable();
            }

        });


        // bootstrap wizard
        this.$smartWizard.smartWizard({
            selected: this.step,
            theme: 'dots', // theme for the wizard, related css need to include for other than default theme
            autoAdjustHeight: false,
            transition: {
                animation: 'fade', // Effect on navigation, none/fade/slide-horizontal/slide-vertical/slide-swing
                speed: '200', // Transion animation speed
                easing: '' // Transition animation easing. Not supported without a jQuery easing plugin
            },
            enableURLhash: false,
            toolbarSettings: {
                toolbarPosition: 'none', // none, top, bottom, both
                toolbarButtonPosition: 'right', // left, right, center
                showNextButton: false, // show/hide a Next button
                showPreviousButton: false, // show/hide a Previous button
                toolbarExtraButtons: [] // Extra buttons to show on toolbar, array of jQuery input/buttons elements
            },
            keyboardSettings: {
                keyNavigation: false, // Enable/Disable keyboard navigation(left and right keys are used if enabled)
            },
        });

    }


    async engineTableOnCheckRow(row, $element) {
        if (this.$engineIdElement)
            this.$engineIdElement.val(row.id);

    }
    async engineTableOnPostBody(data) {

        if (!data?.length) {
            this.$nextButton.disable();
            return;
        }

        if (this.$engineIdElement && this.$engineIdElement.val()) {

            let selectedIndex = data.findIndex(e => e.id === this.$engineIdElement.val());

            if (selectedIndex >= 0)
                this.$enginesTable.bootstrapTable('check', selectedIndex);
        }

        // get the radio inputs buttons to add a validation rule on them
        let $btSelectItem = $('input[name="btSelectItem"]');

        $btSelectItem.rules("add", {
            required: true,
            messages: {
                required: "You should select an engine before going next step.",
            }
        });

    }

    boostrapEnginesTable() {

        if (!this.$enginesTable || !this.engineUrl)
            return;

        setEngineBootstrapTable(this.$enginesTable, this.engineUrl, true,
            (data) => this.engineTableOnPostBody(data),
            (row, $element) => this.engineTableOnCheckRow(row, $element));

    }

    bootstrapButtons() {

        if (this.$previousButton) {
            this.$previousButton.click((evt) => {
                evt.preventDefault();
                this.$smartWizard.smartWizard("prev");
                return true;
            });
        }

        if (this.$nextButton) {
            this.$nextButton.click((evt) => {
                evt.preventDefault();

                if (!this.validateForm())
                    return false;

                this.$smartWizard.smartWizard("next");
                return true;
            });
        }
    }


    validateForm() {

        if (!this.$form)
            return true;

        let isValid = this.$form.valid();

        if (!isValid)
            return false;

        let validator = this.$form.validate();
        validator.resetForm();

        let summary = this.$form.find(".validation-summary-errors");

        if (summary) {
            let list = summary.find("ul");
            if (list)
                list.empty();
        }

        return true;
    }

}