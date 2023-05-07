const fs = require('fs');
const path = require('path');
const {stdout} = process;
const readableStream = fs.createReadStream(
  path.resolve(__dirname,'text.txt'), 'utf-8');

readableStream.on('readable', () => {
  const rsData = readableStream.read();
  if(rsData) stdout.write(rsData.toString())
});

