// @ts-check
import { setEngineBootstrapTable } from "../bootstrapTables/index.js";

export class entitiesDetailsPage {

    constructor() {

    }

    async onPostBody(data) {
        if (data && data.length > 0) {
            this.engine = data[0];
            this.$enginesTable.bootstrapTable('check', 0);
        }
    }

    async onClickRow(row) {
        this.engine = row;
        await this.loadEntitiesAsync(this.engine);
    }


    async onLoad() {

        // get table
        this.$pipelinesTable = $("#pipelinesTable");

        if (!this.$pipelinesTable)
            return;

        this.$pipelinesTable.bootstrapTable();
    }

 
    async onUnLoad() {

    }
}