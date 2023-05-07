const fs = require('fs');
const path = require('path');

const pathProject = path.join(__dirname, 'project-dist');
const style = path.join(pathProject, 'style.css');
const html = path.join(pathProject, 'index.html');

async function makeFolder() {
  await fs.promises.mkdir(pathProject);
  await fs.promises.copyFile(path.join(__dirname, 'template.html'), html);
  await fs.promises.writeFile(style, '');
  await makeHtml();
  await fs.promises.mkdir(path.join(pathProject, 'assets'));
  await copyFun();
}

async function makeHtml() {
  try {
    // Считываем содержимое шаблона
    const templatePath = path.join(__dirname, 'template.html');
    const template = await fs.promises.readFile(templatePath,'utf-8');

    // Получаем список файлов в папке components
    const componentsPath = path.join(__dirname,'components');
    const componentFiles = await fs.promises.readdir(componentsPath);

    // Заменяем теги в шаблоне на содержимое компонентов
    let result = template;
    await Promise.all(
      componentFiles.map(async (file) => {
        const componentName = path.parse(file).name;
        const componentPath = path.join(componentsPath, file);
        const componentContent = await fs.promises.readFile(componentPath, 'utf-8');
        const tag = `{{${componentName}}}`;
        result = result.replace(new RegExp(tag, 'g'), componentContent);
      })
    );

    // Сохраняем результат в файл
    await fs.promises.writeFile(html, result);

  } catch (error) {
    console.error('Ошибка при обработке шаблона:', error);
  }
}

// appen styles

const bundlePath = path.resolve(__dirname, './project-dist');
const styleDir = path.join(__dirname, 'styles');
const stylePath = path.join(bundlePath, './style.css');

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

// copy assets

const thisPath = path.join(__dirname, 'assets');
const copyPath = path.join(pathProject, 'assets');

async function copyFilesRecursive(sourcePath, destPath) {
  const files = await fs.promises.readdir(sourcePath);
  for (const file of files) {
    const sourceFilePath = path.join(sourcePath, file);
    const destFilePath = path.join(destPath, file);

    const fileStat = await fs.promises.stat(sourceFilePath);
    if (fileStat.isDirectory()) {
      await fs.promises.mkdir(destFilePath);
      await copyFilesRecursive(sourceFilePath, destFilePath);
    } else {
      await fs.promises.copyFile(sourceFilePath, destFilePath);
    }
  }
}

async function copyFun() {
  try {
    await fs.promises.stat(copyPath);
    await fs.promises.rmdir(copyPath);
  } catch (err) {
    console.log(err)
  }
  await fs.promises.mkdir(copyPath);

  await copyFilesRecursive(thisPath, copyPath);
}

// create app

makeFolder();
