function countQuotes(str) {
  return str.split('"').length - 1;
}

export default function parseClip(str) {
  var r,
    rlen,
    rows,
    arr = [],
    a = 0,
    c,
    clen,
    multiline,
    last;
  rows = str
    .split("\r\n")
    .reduce((acc, item) => acc.concat(item.split("\n")), [])
    .reduce((acc, item) => acc.concat(item.split("\r")), []);
  if (rows.length > 1 && rows[rows.length - 1] === "") {
    rows.pop();
  }
  for (r = 0, rlen = rows.length; r < rlen; r += 1) {
    rows[r] = rows[r].split("\t");
    for (c = 0, clen = rows[r].length; c < clen; c += 1) {
      if (!arr[a]) {
        arr[a] = [];
      }
      if (multiline && c === 0) {
        last = arr[a].length - 1;
        arr[a][last] = arr[a][last] + "\n" + rows[r][0];
        if (multiline && countQuotes(rows[r][0]) & 1) {
          //& 1 is a bitwise way of performing mod 2
          multiline = false;
          arr[a][last] = arr[a][last]
            .substring(0, arr[a][last].length - 1)
            .replace(/""/g, '"');
        }
      } else {
        if (
          c === clen - 1 &&
          rows[r][c].indexOf('"') === 0 &&
          countQuotes(rows[r][c]) & 1
        ) {
          arr[a].push(rows[r][c].substring(1).replace(/""/g, '"'));
          multiline = true;
        } else {
          arr[a].push(rows[r][c].replace(/""/g, '"'));
          multiline = false;
        }
      }
    }
    if (!multiline) {
      a += 1;
    }
  }
  return arr;
}
