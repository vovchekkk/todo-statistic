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
    const [cmd, arg] = command.split(' ');

    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            console.log(allComments);
            break;
        case 'sort':
            sortComments(arg);
        default:
            console.log('wrong command');
            break;
    }
}

function sortComments(arg) {
    let sorted = [...allComments];

    switch (arg) {
        case 'importance':

    }
}

for (let file of files) {
    let start_pos = -1;
    while ((start_pos = file.indexOf("// TODO ", start_pos + 1)) !== -1) {
        let charBefore = file[start_pos - 1];
        if (charBefore === "'" || charBefore === '"' || charBefore === '`') {
            continue;
        }

        let end_pos = file.indexOf("\r\n", start_pos);
        if (end_pos === -1) end_pos = file.length;

        allComments.push(file.slice(start_pos, end_pos));
    }
}

processCommand('show')

function showImportant() {
    const important = allComments.filter(comment => {
        return comment.trim().endsWith('!');
    });
    console.log(important);
}