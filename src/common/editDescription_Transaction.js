'use strict'

import { jsTPS_Transaction } from "./jsTPS";

export default class editDescription_Transaction extends jsTPS_Transaction {

    constructor(initApp, id, newName, oldName) {
        super();
        this.app = initApp;
        this.id  = id;
        this.newName = newName;
        this.oldName = oldName;
    }

    doTransaction() {
        this.app.editDescription(this.id, this.newName);
    }

    undoTransaction() {
        this.app.editDescription(this.id, this.oldName);
    }

}