// @ts-check
import { modalPanelPreview } from "../modal/index.js";
import { entitiesAzureSql } from "./entitiesAzureSql.js";
import { entitiesDelimitedText } from "./entitiesDelimitedText.js";
import { wizardPage } from '../wizard/index.js';

export class entitiesNewPage extends wizardPage {

    constructor() {
        super('EntityView', '/entities/new/engines');

        this.entitiesAzureSql = new entitiesAzureSql();
        this.entitiesDelimitedText = new entitiesDelimitedText();
        this.lastTypeSelected = '';
}

    async onLoad() {
        // call base onLoad method
        super.onLoad();

        // init preview panel
        modalPanelPreview.initialize("panelPreview");

        // transform all select picker into selectpicker
        $('select').selectpicker();

        this.$smartWizard.on("stepContent", async (e, anchorObject, stepNumber, stepDirection) => {

            if (stepNumber == 2) {

                try {

                    if (this.$engineIdElement) {
                        let engineId = this.$engineIdElement.val().toString();

                        if (!engineId?.length)
                            return;

                        let type = $(`input[name="EntityView.EntityType"]:checked`).val();

                        if (!type)
                            return;

                        if (this.lastTypeSelected === type)
                            return;

                        this.lastTypeSelected = type;

                        if (type == 'AzureSqlTable')
                            await this.entitiesAzureSql.loadAsync(this.htmlFieldPrefix, this.$properties, engineId, this.loadMethod);

                        if (type == 'DelimitedText')
                            await this.entitiesDelimitedText.loadAsync(this.htmlFieldPrefix, this.$properties, engineId, this.loadMethod);

                    }

                } catch (e) {

                    this.$smartWizard.smartWizard("goToStep", 0);
                }
            }
        });
    }



    async onUnLoad() {

    }
}