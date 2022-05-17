import React, {useState}from "react";
import { useDrop } from "react-dnd";
import Animal_Box from './Animal_Box';
import Animal from "./Animal"
var basket;
function Basket({animals,level,foodChainBasket }) {
  const [basket,setBasket] = useState([]);
  const [{ isOver }, dropRef] = useDrop({
    accept: "level"+level,
    drop: (item) =>
      setBasket((basket) =>{
        var newBasket=!basket.includes(item) ? [...basket, item] : basket
        foodChainBasket=newBasket
        return newBasket;
        }
      ),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  function delete_item(item)
  {
    setBasket((basket) => {
      var newBasket=basket.filter(animal => animal !== item)
      foodChainBasket=newBasket
      console.log(newBasket)
      return newBasket
    })
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

        <div className={isOver ? "level_basket_dragging" : "level_basket"} ref={dropRef}>
          {basket.map((animal) => {
            return <Animal animal={animal} delete_item={delete_item} ></Animal>;
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
export default Basket;
