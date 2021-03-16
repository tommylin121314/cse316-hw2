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
      useVerboseFeedback: true
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

    this.setState({
      toDoLists: nextLists,
      currentList: toDoList
    });
  }

  addNewList = () => {
    let newToDoListInList = [this.makeNewToDoList()];
    let newToDoListsList = [...newToDoListInList, ...this.state.toDoLists];
    let newToDoList = newToDoListInList[0];

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
    let newCurrentList = this.state.currentList;
    newCurrentList.items[newCurrentList.items.length] = newItem;
    console.log(newCurrentList);
    let newListOfLists = this.state.toDoLists.map((toDoList) => {
      if(toDoList === this.state.currentList) {
        toDoList = newCurrentList;
      }
    })

    console.log(this);

    this.setState({
      listOfLists: newListOfLists,
      currentList: newCurrentList
    })
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
    let newListOfLists = this.state.toDoLists.map((toDoList) => {
      if(toDoList === this.state.currentList) {
        toDoList = newCurrentList;
      }
    })

    this.setState({
      currentList: newCurrentList,
      listOfLists: newListOfLists
    })

    console.log(removedItem);
    return removedItem;
  }

  swapItemTransaction = (id, up) => {
    let index = this.indexOfId(id);
    let newIndex = index;
    if(up) {
      newIndex--;
    }
    else {
      newIndex++;
    }

    if(newIndex < 0 || newIndex > this.state.currentList.items.length - 1) {
      console.log("dont do that")
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

    let newListOfLists = this.state.toDoLists.map((toDoList) => {
      if(toDoList === this.state.currentList) {
        toDoList = newCurrentList;
      }
    })

    this.setState({
      currentList: newCurrentList,
      listOfLists: newListOfLists
    })
  }

  insertItem = (item, index) => {
    console.log(item);
    let newCurrentListItems = this.state.currentList.items;
    for(let i = newCurrentListItems.length; i > index; i--) {
      newCurrentListItems[i] = newCurrentListItems[i-1];
    }
    newCurrentListItems[index] = item;
    let newCurrentList = this.state.currentList;
    newCurrentList.items = newCurrentListItems;
    let newListOfLists = this.state.toDoLists.map((toDoList) => {
      if(toDoList === this.state.currentList) {
        toDoList = newCurrentList;
      }
    })

    this.setState({
      currentList: newCurrentList,
      listOfLists: newListOfLists
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
        <Navbar />
        <LeftSidebar 
          toDoLists={this.state.toDoLists}
          loadToDoListCallback={this.loadToDoList}
          addNewListCallback={this.addNewList}
        />
        <Workspace 
          toDoListItems={items}
          addNewItemCallback={this.addNewItemTransaction}
          deleteItemCallback={this.deleteItemTransaction}
          swapItemCallback={this.swapItemTransaction}
          undoTransactionCallback={this.undoTransaction}
          redoTransactionCallback={this.redoTransaction}
        />
      </div>
    );
  }
}

export default App;