import logo from "./logo.svg";
import "./Animal.css";
import Table from "./Table";
import React, { Component } from "react";
import ReactDOM from "react-dom";


class Animal extends Component {


  render() {
    return (
      <div className="Animal">
        <button className="delete_Animal" onClick={() => this.props.delete_item(this.props.animal)}>X
        </button>
        <div className="Name">{this.props.animal.name}</div>
        <div className="data_container">
          <div className="data">

            <div className="data_column">
              <div className="data_title">Provided</div>
              <div className="data_value">{this.props.animal.provided}</div>
            </div>            
            <div className="data_column">
              <div className="data_title">Needed</div>
              <div className="data_value">{this.props.animal.needed}</div>
            </div>
          </div>
          <div className="data">
            <div className="data_column">
              <div className="data_title">Result Provided</div>
              <div className="data_value">
                {this.props.animal.result_provided}
              </div>
            </div>
            <div className="data_column">
              <div className="data_title">Result Needed</div>
              <div className="data_value">
                {this.props.animal.result_needed}
              </div>
            </div>
            
          </div>
        </div>
        <div className="food">
          {this.props.animal.food_array[0] != null ? (
            this.props.animal.food_array.map((animal) => {
              return <div> {animal.name} </div>;
            })
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  }
}

export default Animal;
