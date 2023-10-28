var os = require('os');
var path = require('path');
var fs = require('fs');

const moddir = path.join(os.homedir(), ".fdat/");

if (!fs.existsSync(moddir)) {
    fs.mkdirSync(moddir);
}

var mods = require('require-all')({
    dirname     :  moddir,
    filter      :  /(.+)\.js$/,
    excludeDirs :  /^\.(git|svn)$/,
    recursive   : true
});

module.exports = function fdat(file, options) {
    var base = path.basename(file);
    var buf; // buffer of file

    if (typeof file == "string") {
        if (fs.existsSync(file)) {
            buf = fs.readFileSync(file);
        } else {
            return {err: "file not found"};
        }
    } else {
        throw "bad file parameter";
    }

    var selectedModKey = Object.keys(mods).find(key => {
        var value = mods[key];
        if (!value.test || !value.gather) return false;

        return value.test(base, buf);
    });

    if (!selectedModKey) return { err: "no mod for file type" };

    var selectedMod = mods[selectedModKey];

    var res = selectedMod.gather(base, buf);

    res.xFSIZE = buf.length;

    return {
        mod: selectedModKey,
        datapoints: res
    };
}