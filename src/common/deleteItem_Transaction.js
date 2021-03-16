'use strict'

import { jsTPS_Transaction } from "./jsTPS";

export default class deleteItem_Transaction extends jsTPS_Transaction {

    constructor(initApp, id) {
        super();
        this.app = initApp;
        this.id  = id;
    }

    doTransaction() {
        this.index = this.app.indexOfId(this.id);
        this.deletedItem = this.app.deleteItem(this.id);
        console.log("doing transaction");
    }

    undoTransaction() {
        this.app.insertItem(this.deletedItem, this.index);
    }

}