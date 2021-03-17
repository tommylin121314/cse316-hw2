'use strict'

import { jsTPS_Transaction } from "./jsTPS";

export default class changeStatus_Transaction extends jsTPS_Transaction {

    constructor(initApp, id) {
        super();
        this.app = initApp;
        this.id = id;
    }

    doTransaction() {
        this.app.changeStatus(this.id);
    }

    undoTransaction() {
        this.app.changeStatus(this.id);
    }

}