const path = require('path');
const fs = require('fs');

const bundlePath = path.resolve(__dirname, './project-dist');
const styleDir = path.join(__dirname, 'styles');
const stylePath = path.join(bundlePath, './bundle.css');

fs.stat(stylePath, (err) => {
    if (err) {
        fs.writeFile(stylePath, '', (err) => {
            if (err) console.log(err);
            else appendStyles();
        });
    } else {
        fs.unlink(stylePath, (err) => {
            if (err) console.log(err);
            fs.writeFile(stylePath, '', (err) => {
                if (err) console.log(err);
                else appendStyles();
            });
        });
    }
});

function appendStyles() {
    fs.readdir(styleDir, (err,files) => {
        const stylesArr = [];
        if (err) console.log(err);
        files.forEach(file => {
            if(path.parse(file).ext === '.css') {
                fs.readFile(
                    path.join(styleDir, file),
                    'utf-8',
                    (err, data) => {
                        if(err) throw err;
                        stylesArr.push(data);
                        if (stylesArr.length === files.filter(file => path.parse(file).ext === '.css').length) {
                            writeStyles(stylesArr);
                        }
                    }
                )
            }
        });
    });
}

function writeStyles(stylesArr) {
    (
        async function() {
            for await(const item of stylesArr) {
                try {
                    await fs.promises.appendFile(
                        stylePath,
                        item
                    );
                } catch (err) {
                    throw err;
                }
            }
        }
    ) ();
}
