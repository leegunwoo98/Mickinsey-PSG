import React from "react";

export default ({ data }) => (
  <table>
    {data.map((row, i) => (
      <tr key={i}>
        {row.map((col, j) => (
          <td key={j}>{col}</td>
        ))}
      </tr>
    ))}
  </table>
);
