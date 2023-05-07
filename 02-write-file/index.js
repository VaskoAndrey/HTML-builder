const { stdin, stdout } = process;
const fs = require("fs");
const path = require("path");

const output = fs.createWriteStream(path.join(__dirname, "destination.txt"));

stdout.write('Print some text\n');
stdin.on('data', data => {
  const input = data.toString().trim();
  if(input === 'exit') {
    console.log('Bye-bye');
    process.exit()
  }
    output.write(data);
})

process.on('SIGINT', () => {
    console.log('Bye-bye');
    process.exit()
});