const glob = require('glob');
const fs  = require('fs');


async function readFile(file, output) {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) { console.log(err); }
        const twits = JSON.parse(data);
        Object.entries(twits.results).forEach(([key, twit]) => {
            if (!output.has(twit.created_at)) {
                output.set(twit.created_at, twit);
            }
        });
    });
}

async function readFolder(path) {
    glob(path, (err, files) => {
        if (err) {
            console.log(err);
        }

        const output = new Map();
        files.forEach(file => {
            await readFile(file, output);
        });

        console.log(output);
    });
}


'./raw_official/*.json'
