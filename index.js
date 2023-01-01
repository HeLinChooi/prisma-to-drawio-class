const express = require('express')
const fs = require("fs");
var logger = fs.createWriteStream('text_to_draw_io_'+Date.now()+'.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

const app = express()
const port = 3000

app.get('/', (req, res) => {
  fs.readFile("sample.prisma", (err, data) => {
    if (err) throw err;

    console.log(data.toString());
    const lineArr = data.toString().split(/\r?\n/);
    let result = "";
    lineArr.forEach(line => {
      if (line.startsWith("model ")) {
        result = result.concat("\n")
        let tableName = line.replace("model ", "").replace("{", "")
        result = result.concat(tableName, "\n")
      } else if (isAttributeLine(line)) {
        const arr = line.trim().split(/\s+/g);
        const attribute = arr[0] + ": " + arr[1];
        console.log('attribute', attribute)
        result = result.concat("-"+attribute, "\n")
      }
    });
    logger.write(result);
    res.send(result)
  });
})

const isAttributeLine = (line) => {
  const arr = line.trim().replace(/\s+/g, ' ').split(" ");
  console.log(arr)
  const ret = line.startsWith("  ")
    && !line.startsWith("  @")
    && arr[1] && !arr[1].startsWith("@")
    && !arr[1].startsWith("=")
  return ret;
}



function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})