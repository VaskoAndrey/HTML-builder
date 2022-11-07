const {stdin, stdout} = process;
const fs = require('fs');
const path = require('path');
const output = fs.createWriteStream(path.join(__dirname, 'destination.txt'));

stdout.write('Write text that you want to add at file destination.txt \n');
stdin.on('data', data => {
   if(data == 'exite') {
      process.on('exit', () => {
         console.log('Bye-bye');
         process.exit();
      })
   }
   output.write(data);
})