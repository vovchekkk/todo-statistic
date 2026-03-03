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
            console.log(sortComments(arg));
            break;
        default:
            console.log('wrong command');
            break;
        case 'important':
            showImportant();
            break;
        case 'user':
            if (arg) {
                user(arg);
            } else {
                console.log('Please provide username');
            }
            break;
    }
}

let users = []

function sortComments(arg) {
    let sorted = [...allComments];

    switch (arg) {
        case 'importance':
            const getPriority = (text) => text.split('!').length - 1;
            sorted.sort((a, b) => getPriority(b) - getPriority(a));
            break;
        case 'user':
            const withUser = [];
            const withoutUser = [];

            const getName = (s) => {
                const p = s.split('; ');
                return p.length > 1 ? p[0].replace('// TODO ', '').trim() : null;
            };

            for (const todo of allComments) {
                const name = getName(todo);
                if (name) {
                    withUser.push({ name: name.toLowerCase(), text: todo });
                } else {
                    withoutUser.push(todo);
                }
            }

            withUser.sort((a, b) => a.name.localeCompare(b.name));

            sorted = [...withUser.map(item => item.text), ...withoutUser];
            break;
        case 'date':
            sorted.sort((a, b) => {
                const parseDate = (s) => {
                    const p = s.split('; ');
                    if (p.length > 1) {
                        const dateStr = p[1].trim();
                        const d = new Date(dateStr);
                        return isNaN(d.getTime()) ? null : d;
                    }
                    return null;
                };

                const dateA = parseDate(a);
                const dateB = parseDate(b);

                if (dateA === null && dateB === null) return 0;
                if (dateA === null) return 1;
                if (dateB === null) return -1;

                return dateB - dateA;
            });
            break;
    }

    return sorted;
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

function showImportant() {
    const important = allComments.filter(comment => {
        return comment.endsWith('!');
    });
    console.log(important);
}

function user(username) {
    for (let item of allComments) {
        const content = item.replace('// TODO ', '');
        const parts = content.split(';');

        if (parts.length < 3) continue;

        const commentUser = parts[0];
        const date = parts[1];     
        const text = parts.slice(2).join(';');

        if (commentUser.toLowerCase() === username.toLowerCase()) {
            console.log(item);
        }
    }
}
