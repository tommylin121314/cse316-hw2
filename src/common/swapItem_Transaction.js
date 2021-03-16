'use strict'

import { jsTPS_Transaction } from "./jsTPS";

export default class swapItem_Transaction extends jsTPS_Transaction {

    constructor(initApp, index, newIndex) {
        super();
        this.app = initApp;
        this.index = index;
        this.newIndex = newIndex;
    }

    doTransaction() {
        this.app.swapItems(this.index, this.newIndex);
    }

    undoTransaction() {
        this.app.swapItems(this.index, this.newIndex);
    }

}