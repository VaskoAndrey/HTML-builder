const path = require('path');
const fs = require('fs');
const sectretFolder = path.resolve(__dirname,'secret-folder');
fs.readdir(sectretFolder, (err, files) => {
    if (err) console.log(err);
    files.forEach(item => {
        fs.stat(path.join(sectretFolder,item),(err, file) => {
            if(file.isFile()) {
                console.log(`${path.parse(item).name} - ${path.parse(item).ext} - ${file.size / 1024} KB`)
            }
        })
    })
})