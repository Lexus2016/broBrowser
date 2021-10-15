const fs = require('fs');
const path = require('path');
const walk = function (dir, done) {
    let results = [];
    fs.readdir(dir, function (err, list) {
        if (err) return done(err);
        let i = 0;
        (function next() {
            let file = list[i++];
            if (!file) return done(null, results);
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    results.push(file);
                    next();
                }
            });
        })();
    });
};

let pathDest = './Profiles/';
let pathWork = './Devices/';

if (!fs.existsSync(pathDest)) {
    fs.mkdirSync(pathDest);
}

walk(pathWork, function (err, results) {
    if (err) throw err;

    let checkFileDuplicateArr = [];

    results.forEach(file => {
        require(file);

        console.log(Profile.name);

        if (typeof Profile.OSName === 'undefined' || Profile.OSName === null || Profile.OSName === 'undefined' || Profile.OSName === 'unknown') {
            // Skip
            return;
        }

        if (Profile.BrowserName === 'undefined' || Profile.BrowserName === 'unknown') {
            // Skip
            return;
        }

        if (Profile.OSName === 'macOS') {
            Profile['OSName'] = 'MacOSX';
        }

        if (Profile.OSName.includes('Win')) {
            Profile['OSName'] = 'Windows';
        }

        Profile["name"] = Profile.device + ": " + Profile.OSName + " " + Profile.OSVersion + "/" + Profile.BrowserName + " " + Profile.BrowserVersion;

        if (!fs.existsSync(pathDest + Profile.device + '/')) {
            fs.mkdirSync(pathDest + Profile.device + '/');
        }

        if (!fs.existsSync(pathDest + Profile.device + '/' + Profile.OSName + '/')) {
            fs.mkdirSync(pathDest + Profile.device + '/' + Profile.OSName + '/');
        }

        if (!fs.existsSync(pathDest + Profile.device + '/' + Profile.OSName + '/' + Profile.BrowserName + '/')) {
            fs.mkdirSync(pathDest + Profile.device + '/' + Profile.OSName + '/' + Profile.BrowserName + '/');
        }


        if (!checkFileDuplicateArr.includes(Profile.name)) {
            checkFileDuplicateArr.push(Profile.name);

            fs.copyFile(file, pathDest + Profile.device + '/' + Profile.OSName + '/' + Profile.BrowserName + '/' + path.basename(file), (err) => {
                if (err) throw err;
                console.log(file + ' +');
            });
        } else {
            console.log(file + ' -');
        }
    });
});