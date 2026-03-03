const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

let allComments = []

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(allComments)
            break;
        default:
            console.log('wrong command');
            break;
        case 'important':
            showImportant();
            break;
    }
}


let start_pos = -1;
for (let file of files) {
    while ((start_pos = file.indexOf("// TODO ", start_pos + 1)) !== -1) {
        let end_pos = file.indexOf("\r\n", start_pos + 1);
        allComments.push(file.slice(start_pos, end_pos));
    }
}

function showImportant() {
    const important = allComments.filter(comment => {
        return comment.trim().endsWith('!');
    });
    console.log(important);
}