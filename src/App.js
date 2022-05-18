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
      foodChain: [[], [], [], []],
      classes: [],
    };
    this.updateFoodChain = this.updateFoodChain.bind(this);
    this.calculate_results = this.calculate_results.bind(this);
    this.loop_calculate_results = this.loop_calculate_results.bind(this);
    this.parse = this.parse.bind(this);
  }
  componentDidMount() {
    var rawStr = localStorage.getItem("rawStr");
    this.parse(rawStr);
  }
  handleChange = ({ target: { value } }) => {
    this.parse(value);
  };
  parse = (value) => {
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

  classify(animals) {
    var classes = [[], [], [], []];
    for (var index in animals) {
      classes[animals[index].level].push(animals[index]);
    }
    return classes;
  }
  calculate_results(foodChain) {
    this.initialize_result(foodChain);
    this.loop_calculate_results(foodChain);
    this.setState({ foodChain: foodChain });
  }
  loop_calculate_results(oldFoodChain) {
    var foodChain = [[], [], [], []];
    oldFoodChain.map((level, key) => {
      level.map((animal) => {
        foodChain[key].push(animal);
      });
    });
    for (var level_index = 1; level_index < foodChain.length; level_index++) {
      var level = foodChain[level_index];
      var previous_level = foodChain[level_index - 1];
      level.sort(this.compareProvided);
      previous_level.sort(this.compareProvided);
      for (var animal_index = 0; animal_index < level.length; animal_index++) {
        var animal = level[animal_index];
        console.log("animal", animal);
        var foodSource = animal.food_array;
        if (foodSource[0] != undefined) {
          var edibles = foodSource.filter((myAnimal) =>
            previous_level.includes(myAnimal)
          );
          edibles.sort(this.compareProvided);
          console.log("edibles", edibles);
          for (
            var edible_index = 0;
            edible_index < edibles.length;
            edible_index++
          ) {
            var copy = [];
            edibles.map((value) => {
              copy.push(Object.assign({}, value));
            });
            console.log("deep copy", copy);
            var edible = edibles[edible_index];
            var sameProvided = edibles.filter((animal, index) => {
              if (index < edible_index) return false;
              return animal.result_provided == edible.result_provided;
            });
            console.log("sameProvided", sameProvided);
            var num_same = sameProvided.length;
            edible_index = edible_index + sameProvided.length - 1;
            if (animal.result_needed >= edible.result_provided * num_same) {
              animal.result_needed =
                animal.result_needed - edible.result_provided * num_same;
              for (var i = 0; i < sameProvided.length; i++) {
                sameProvided[i].result_provided = 0;
              }
            } else {
              console.log("previous needed", animal.result_needed);
              console.log("animal.result_needed", animal.result_needed);
              for (var i = 0; i < sameProvided.length; i++) {
                sameProvided[i].result_provided =
                  sameProvided[i].result_provided -
                  animal.result_needed / num_same;
              }
              animal.result_needed = 0;
            }
          }
        }
      }
    }
    console.log(foodChain);
  }
  checkCorrectness(foodChain) {
    var correct = true;
    foodChain.map((level) => {
      level.map((animal) => {
        if ((animal.result_provided === 0) | (animal.result_needed > 0)) {
          correct = false;
          return;
        }
      });
    });
    return correct;
  }
  initialize_result(foodChain) {
    foodChain.map((level) => {
      level.map((animal) => {
        animal.result_needed = animal.needed;
        animal.result_provided = animal.provided;
      });
    });
  }
  compareNeeded(a, b) {
    if (a.result_needed < b.result_needed) {
      return 1;
    }
    if (a.result_needed > b.result_needed) {
      return -1;
    }
    return 0;
  }
  compareProvided(a, b) {
    if (a.result_provided < b.result_provided) {
      return 1;
    }
    if (a.result_provided > b.result_provided) {
      return -1;
    }
    return 0;
  }

  updateFoodChain(foodChain) {
    this.setState({ foodChain: foodChain });
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
            {[...this.state.classes].reverse().map((animals, key) => {
              return (
                <DndProvider backend={HTML5Backend}>
                  <Basket
                    animals={animals}
                    level={this.state.classes.length - key - 1}
                    foodChain={this.state.foodChain}
                    calculate_results={this.calculate_results}
                    updateFoodChain={this.updateFoodChain}
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
