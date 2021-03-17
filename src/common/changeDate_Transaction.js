'use strict'

import { jsTPS_Transaction } from "./jsTPS";

export default class changeDate_Transaction extends jsTPS_Transaction {

    constructor(initApp, id, oldDate, newDate) {
        super();
        this.app = initApp;
        this.id = id;
        this.oldDate = oldDate;
        this.newDate = newDate;
    }

    doTransaction() {
        this.app.changeDueDate(this.id, this.newDate);
    }

    undoTransaction() {
        console.log(this.oldDate);
        this.app.changeDueDate(this.id, this.oldDate);
    }

}