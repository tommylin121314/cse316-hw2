'use strict'

import { jsTPS_Transaction } from "./jsTPS";

export default class addItem_Transaction extends jsTPS_Transaction {

    constructor(initApp) {
        super();
        this.app = initApp;
    }

    doTransaction() {
        this.id = this.app.addNewItem();
    }

    undoTransaction() {
        this.app.deleteItem(this.id);
    }

}