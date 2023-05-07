const fs = require('fs');
const path = require('path');

const thisPath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

fs.stat(copyPath, err => {
    if(err) {
        fs.mkdir(copyPath, err => err);
    } else {
        fs.rmdir(copyPath, err => err);
        fs.mkdir(copyPath, err => err);
    }
}
)

fs.readdir(thisPath, (err, files) => {
    files.forEach(file => {
        const sourcePath = path.join(thisPath, file);
        const destPath = path.join(copyPath, file);
        fs.copyFile(sourcePath, destPath, err => err);
    })
})