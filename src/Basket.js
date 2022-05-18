import React, { useState } from "react";
import { useDrop } from "react-dnd";
import Animal_Box from "./Animal_Box";
import Animal from "./Animal";
var basket;
function Basket({
  animals,
  level,
  foodChain,
  calculate_results,
  updateFoodChain,
}) {
  // const [basket,setBasket] = useState([]);
  const [{ isOver }, dropRef] = useDrop({
    accept: "level" + level,
    drop: (item) =>
      // setBasket((basket) =>{
      //   // var newBasket=!basket.includes(item) ? [...basket, item] : basket
      //   var newBasket=[];
      //   if(basket.includes(item)){
      //     newBasket=basket
      //   }
      //   else{
      //     basket.push(item)
      //     newBasket=basket
      //   }
      //   item.result_needed = item.needed;
      //   item.result_provided = item.provided;
      //   updateFoodChain(newBasket,level)
      //   calculate_results();
      //   return newBasket;
      //   }
      // ),
      {
        var basket = foodChain[level];
        if (!basket.includes(item)) {
          basket.push(item);
          calculate_results(foodChain);
        }
      },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  function delete_item(item) {
    // setBasket((basket) => {
    //   var newBasket=basket.filter(animal => animal !== item)
    //   item.result_needed = item.needed;
    //   item.result_provided = item.provided;
    //   updateFoodChain(newBasket,level);
    //   calculate_results();
    //   return newBasket
    // })
    foodChain[level] = foodChain[level].filter((animal) => animal !== item);
    calculate_results(foodChain)
    updateFoodChain(foodChain)
  }
  return (
    <React.Fragment>
      <div className="level" key={level}>
        <div className="level_drop">
          <div className="level_label">LEVEL {level}</div>
          <div className="level_items">
            {animals.map((animal) => {
              return <Animal_Box animal={animal} level={level}></Animal_Box>;
            })}
          </div>
        </div>

        <div
          className={isOver ? "level_basket_dragging" : "level_basket"}
          ref={dropRef}
        >
          {foodChain[level].map((animal) => {
            return <Animal animal={animal} delete_item={delete_item}></Animal>;
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
export default Basket;
