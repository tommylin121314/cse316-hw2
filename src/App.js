// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import React, { Component } from 'react';
import testData from './test/testData.json'
import jsTPS from './common/jsTPS' // WE NEED THIS TOO

// THESE ARE OUR REACT COMPONENTS
import Navbar from './components/Navbar'
import LeftSidebar from './components/LeftSidebar'
import Workspace from './components/Workspace'
import addItem_Transaction from './common/addItem_Transaction'
import deleteItem_Transaction from './common/deleteItem_Transaction'
import swapItem_Transaction from './common/swapItem_Transaction'
import changeStatus_Transaction from './common/changeStatus_Transaction'
import changeDate_Transaction from './common/changeDate_Transaction'
import editDescription_Transaction from './common/editDescription_Transaction'
import DeleteModal from './components/DeleteModal'
{/*import ItemsListHeaderComponent from './components/ItemsListHeaderComponent'
import ItemsListComponent from './components/ItemsListComponent'
import ListsComponent from './components/ListsComponent'
*/}
class App extends Component {
  constructor(props) {
    // ALWAYS DO THIS FIRST
    super(props);

    // DISPLAY WHERE WE ARE
    console.log("App constructor");

    // MAKE OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // CHECK TO SEE IF THERE IS DATA IN LOCAL STORAGE FOR THIS APP
    let recentLists = localStorage.getItem("recentLists");
    console.log("recentLists: " + recentLists);
    if (!recentLists) {
      recentLists = JSON.stringify(testData.toDoLists);
      localStorage.setItem("toDoLists", recentLists);
    }
    recentLists = JSON.parse(recentLists);

    // FIND OUT WHAT THE HIGHEST ID NUMBERS ARE FOR LISTS
    let highListId = -1;
    let highListItemId = -1;
    for (let i = 0; i < recentLists.length; i++) {
      let toDoList = recentLists[i];
      if (toDoList.id > highListId) {
        highListId = toDoList.id;
      }
      for (let j = 0; j < toDoList.items.length; j++) {
        let toDoListItem = toDoList.items[j];
        if (toDoListItem.id > highListItemId)
        highListItemId = toDoListItem.id;
      }
    };

    // SETUP OUR APP STATE
    this.state = {
      toDoLists: recentLists,
      currentList: {items: []},
      nextListId: highListId+1,
      nextListItemId: highListItemId+1,
      useVerboseFeedback: true,
      modalVisible: false
    }
  }

  // WILL LOAD THE SELECTED LIST
  loadToDoList = (toDoList) => {
    console.log("loading " + toDoList);

    // MAKE SURE toDoList IS AT THE TOP OF THE STACK BY REMOVING THEN PREPENDING
    const nextLists = this.state.toDoLists.filter(testList =>
      testList.id !== toDoList.id
    );
    nextLists.unshift(toDoList);

    nextLists[0].highlighted = true;
    for(let i = 1; i < nextLists.length; i++) {
      nextLists[i].highlighted = false;
    }

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

    newToDoListsList[0].highlighted = true;
    for(let i = 1; i < newToDoListsList.length; i++) {
      newToDoListsList[i].highlighted = false;
    }

    // AND SET THE STATE, WHICH SHOULD FORCE A render
    this.setState({
      toDoLists: newToDoListsList,
      currentList: newToDoList,
      nextListId: this.state.nextListId+1
    }, this.afterToDoListsChangeComplete);
  }

  makeNewToDoList = () => {
    let newToDoList = {
      id: this.highListId,
      name: 'Untitled',
      items: []
    };
    return newToDoList;
  }

  makeNewToDoListItem = () =>  {
    let newToDoListItem = {
      description: "No Description",
      dueDate: "none",
      status: "incomplete"
    };
    return newToDoListItem;
  }

  addNewItemTransaction = () => {
    let newTransaction = new addItem_Transaction(this);
    this.tps.addTransaction(newTransaction);
  }

  addNewItem = () => {
    let newItem = this.makeNewToDoListItem();
    let newId = this.state.nextListItemId+1;
    newItem.id = newId;

    let newCurrentList = this.state.currentList;
    newCurrentList.items[newCurrentList.items.length] = newItem;
    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      toDoLists: newListOfLists,
      currentList: newCurrentList,
      nextListItemId: this.state.nextListItemId + 1
    })

    return newId;
  }

  deleteItemTransaction = (id) => {
    let newTransaction = new deleteItem_Transaction(this, id);
    this.tps.addTransaction(newTransaction);
  }

  deleteItem = (id) => {
    let index = this.indexOfId(id);
    let removedItem = this.state.currentList.items[index];
    let newCurrentListItems = this.state.currentList.items.filter(item => item.id != id);
    let newCurrentList = this.state.currentList;
    newCurrentList.items = newCurrentListItems;
    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      currentList: newCurrentList,
      toDoLists: newListOfLists
    })

    return removedItem;
  }

  swapItemTransaction = (id, up) => {
    console.log(id);
    let index = this.indexOfId(id);
    let newIndex = index;
    if(up) {
      newIndex--;
    }
    else {
      newIndex++;
    }

    if(newIndex < 0 || newIndex > this.state.currentList.items.length - 1) {
      return;
    }
    else {
      let newTransaction = new swapItem_Transaction(this, index, newIndex);
      this.tps.addTransaction(newTransaction);
    }
  }

  swapItems = (indexOne, indexTwo) => {
    let newCurrentList = this.state.currentList;
    let newCurrentItems = this.state.currentList.items;
    let temp = newCurrentItems[indexOne];
    newCurrentItems[indexOne] = newCurrentItems[indexTwo];
    newCurrentItems[indexTwo] = temp;
    newCurrentList.items = newCurrentItems;

    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      currentList: newCurrentList,
      toDoLists: newListOfLists
    })
  }

  changeStatusTransaction = (id) => {
    let newTransaction = new changeStatus_Transaction(this, id);
    this.tps.addTransaction(newTransaction);
  }

  changeStatus = (id) => {
    let newCurrentList = this.state.currentList;
    let index = this.indexOfId(id);
    if(newCurrentList.items[index].status === 'complete') {
      newCurrentList.items[index].status = 'incomplete';
    }
    else {
      newCurrentList.items[index].status = 'complete';
    }

    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      currentList: newCurrentList,
      toDoLists: newListOfLists
    })

  }

  changeDateTransaction = (id, oldDate, newDate) => {
    let newTransaction = new changeDate_Transaction(this, id, oldDate, newDate);
    this.tps.addTransaction(newTransaction);
  }

  changeDueDate = (id, date) => {
    let newCurrentList = this.state.currentList;
    let index = this.indexOfId(id);
    newCurrentList.items[index].dueDate = date;

    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      currentList: newCurrentList,
      toDoLists: newListOfLists
    })

  }

  editDescriptionTransaction = (id, newName, oldName) => {
    let newTransaction = new editDescription_Transaction(this, id, newName, oldName);
    this.tps.addTransaction(newTransaction);
  }

  editDescription = (id, name) => {
    let newCurrentList = this.state.currentList;
    let index = this.indexOfId(id);
    newCurrentList.items[index].description = name;

    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      currentList: newCurrentList,
      toDoLists: newListOfLists
    })
  }

  insertItem = (item, index) => {
    let newCurrentListItems = this.state.currentList.items;
    for(let i = newCurrentListItems.length; i > index; i--) {
      newCurrentListItems[i] = newCurrentListItems[i-1];
    }
    newCurrentListItems[index] = item;
    let newCurrentList = this.state.currentList;
    newCurrentList.items = newCurrentListItems;
    let newListOfLists = this.state.toDoLists.map((toDoList) => toDoList.id === this.state.currentList.id ? newCurrentList : toDoList)

    this.setState({
      currentList: newCurrentList,
      toDoLists: newListOfLists
    })

  }

  openModal = () => {
    this.setState({
      modalVisible: true
    })
  }

  closeModal = () => {
    this.setState({
      modalVisible: false
    })
  }

  deleteList = () => {
    let newListOfLists = this.state.toDoLists;
    console.log(newListOfLists);
    for(let i = 0; i < newListOfLists.length; i++) {
      console.log(newListOfLists[i]);
      newListOfLists[i] = newListOfLists[i + 1];
    }
    newListOfLists.length = newListOfLists.length - 1;
    console.log(newListOfLists);

    this.setState({
      toDoLists: newListOfLists,
      currentList: { items: [] },
      modalVisible: false
    })

  }

  closeList = () => {
    let listOfLists = this.state.toDoLists;
    for(let i = 0; i < listOfLists.length; i++) {
      listOfLists[i].highlighted = false;
    }

    this.setState({
      toDoLists: listOfLists,
      currentList: { items: [] }
    })

  }

  changeListName = (id, name) => {
    let newListsList = this.state.toDoLists;
    for(let i = 0; i < newListsList.length; i++) {
      if(newListsList[i].id === id) {
        console.log("list at index " + i + " :" + newListsList[i].name);
        newListsList[i].name = name;
        console.log("list at index " + i + " after change:" + newListsList[i].name);
      }
    }

    this.setState({
      toDoLists: newListsList
    })
  }

  indexOfId = (id) => {
    let todoItems = this.state.currentList.items;
    for(let i = 0; i < todoItems.length; i++) {
      if(todoItems[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  undoTransaction = () => {
    this.tps.undoTransaction();
  }

  redoTransaction = () => {
    this.tps.doTransaction();
  }

  // THIS IS A CALLBACK FUNCTION FOR AFTER AN EDIT TO A LIST
  afterToDoListsChangeComplete = () => {
    console.log("App updated currentToDoList: " + this.state.currentList);

    // WILL THIS WORK? @todo
    let toDoListsString = JSON.stringify(this.state.toDoLists);
    localStorage.setItem("recent_work", toDoListsString);
  }

  render() {
    let items = this.state.currentList.items;
    return (
      <div id="root">
        <DeleteModal 
          visible={this.state.modalVisible}
          closeModal={this.closeModal}
          deleteListCallback={this.deleteList}
        />
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
          changeListNameCallback={this.changeListName}
        />
        <Workspace 
          toDoListItems={items}
          addNewItemCallback={this.addNewItemTransaction}
          deleteItemCallback={this.deleteItemTransaction}
          swapItemCallback={this.swapItemTransaction}
          changeStatusCallback={this.changeStatusTransaction}
          changeDateCallback={this.changeDateTransaction}
          editDescriptionCallback={this.editDescriptionTransaction}
          undoTransactionCallback={this.undoTransaction}
          redoTransactionCallback={this.redoTransaction}
          openModal={this.openModal}
          closeListCallback={this.closeList}
          canUndo={this.tps.hasTransactionToUndo()}
          canRedo={this.tps.hasTransactionToRedo()}
          listOpen={this.state.currentList.items.length === 0}
        />
      </div>
    );
  }
}

export default App;