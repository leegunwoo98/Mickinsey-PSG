import logo from "./logo.svg";
import "./App.css";
import Table from "./Table";
import parseClip from "./parseClip";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Animal_Box from "./Animal_Box.js";
import Basket from "./Basket.js";

class Animal {
  constructor(
    name,
    needed,
    provided,
    food_array,
    result_needed,
    result_provided,
    level
  ) {
    this.name = name;
    this.needed = needed;
    this.provided = provided;
    this.result_needed = result_needed;
    this.result_provided = result_provided;
    this.food_array = food_array;
    this.level = level;
  }
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawStr: "",
      animals: [],
      foodChain: [[],[],[],[]],
      classes: [],
    };
    this.handleCallback = this.handleCallback.bind(this);
  }
  componentDidMount() {
    var rawStr = localStorage.getItem("rawStr");
    var animals = JSON.parse(localStorage.getItem("animals"));
    var classes = JSON.parse(localStorage.getItem("classes"));
    console.log(rawStr, animals, classes);
    if ((rawStr != null) & (animals != null) & (classes != null)) {
      this.setState({
        rawStr: rawStr,
        animals: animals,
        classes: classes,
      });
    }
  }
  handleChange = ({ target: { value } }) => {
    let data = parseClip(value);
    let header = data[0];
    let newData = [];
    let animals = [];
    for (var i = 1; i < data.length; i++) {
      var name = "";
      var needed = "";
      var provided = "";
      var food = [];
      for (var j = 0; j < header.length; j++) {
        if (header[j].toLowerCase().includes("name")) {
          name = data[i][j].toLowerCase();
        } else if (header[j].toLowerCase().includes("needed")) {
          needed = parseInt(data[i][j].toLowerCase());
        } else if (header[j].toLowerCase().includes("provided")) {
          provided = parseInt(data[i][j].toLowerCase());
        } else if (header[j].toLowerCase().includes("food")) {
          food = data[i][j].split(/[-,~]/).map(function (item) {
            return item.trim().toLowerCase();
          });
        }
      }
      animals.push(
        new Animal(name, needed, provided, food, needed, provided, -1)
      );
    }
    let level_0 = [];
    animals.map((animal) => {
      var food_array = [];
      animal.food_array.map((food) => {
        food_array.push(
          animals.find((element) => {
            return element.name.toLowerCase() === food.toLocaleLowerCase();
          })
        );
      });
      animal.food_array = food_array;
    });
    this.make_level(animals);
    var classes = this.classify(animals);
    localStorage.setItem("rawStr", value);
    localStorage.setItem("animals", JSON.stringify(animals));
    localStorage.setItem("classes", JSON.stringify(classes));
    this.setState({
      rawStr: value,
      animals: animals,
      classes: classes,
    });
  };

  make_level(animals) {
    animals.map((animal) => {
      var current_animal = animal;
      animal.level = this.recursive_traverse(animal);
    });
  }
  recursive_traverse(animal) {
    var depth = -1;
    if (animal == undefined) {
      return -1;
    }
    for (var index in animal.food_array) {
      var new_depth = this.recursive_traverse(animal.food_array[index]);
      if (new_depth > depth) depth = new_depth;
    }
    return depth + 1;
  }
  handleCallback(item, level, key) {
    var data = this.state.foodChain;
    data[level][key] = item;
    this.setState({ foodChain: data });
    var foodChain = this.state.foodChain;
    for (var i = foodChain.length - 1; i >= 0; i++) {
      for (var j = 0; j < foodChain[i].length; j++) {}
    }
  }
  classify(animals) {
    var classes = [[], [], [], []];
    for (var index in animals) {
      classes[animals[index].level].push(animals[index]);
    }
    return classes;
  }

  render() {
    return (
      <div className="App">
        <textarea
          rows="3"
          placeholder="Paste your animal data here..."
          // onPaste={this.handlePaste}
          onChange={this.handleChange}
          value={this.state.rawStr}
        />
        <textarea
          rows="3"
          placeholder="Paste your environment data here..."
          // onPaste={this.handlePaste}
          onChange={this.handleEnvironment}
          value={this.state.rawStr}
        />
        <textarea
          rows="10"
          placeholder="JSON Data will appear here..."
          value={JSON.stringify(this.state.data, null, 2)}
          disabled
        />
        <div className="selection">
          <div className="levels">
            {this.state.classes.reverse().map((animals, key) => {
              return (
                <DndProvider backend={HTML5Backend}>
                  <Basket
                    animals={animals}
                    level={this.state.classes.length - key - 1}
                    foodChainBasket={
                      this.state.foodChain[this.state.classes.length - key - 1]
                    }
                  ></Basket>
                </DndProvider>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
