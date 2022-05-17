import React from "react";
import {useDrag} from "react-dnd"

function Animal_Box({ animal,level }) {
    const [{isDragging}, drag] = useDrag(() => ({
        type:"level"+level,
        item:animal,
        collect:(monitor) =>({
            isDragging: monitor.isDragging()
        })
    }));
  return (
    <div
      ref={drag}
      className="animal_box"
      style={{ backgroundColor: isDragging ? "#144e6a" : "#248abd" }}
    >
      {animal.name}
    </div>
  );
}
export default Animal_Box;
