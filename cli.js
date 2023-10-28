var program = require('commander');
var package = require('./package.json');
var fdat = require('./index.js');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

const defaultsPath = path.join(__dirname, 'defaults/');
const fdatPath = path.join(require('os').homedir(), '.fdat/');

program
    .version(package.version)
    .option("--install", "install default fdat mods")
    .usage("<file> [options]")
    .parse(process.argv);

if (program.install) {
    var files = fs.readdirSync(defaultsPath).filter(x => path.extname(x) == ".js");
    files.forEach(barename => {
        var fullname = path.join(defaultsPath, barename);
        fs.copyFileSync(fullname, path.join(fdatPath, barename));
    });
    console.log("copied " + chalk.green(files.length) + " mods: " + files.map(x => chalk.yellow(path.basename(x, '.js'))).join(", "));

    process.exit(0);
}

if (program.args.length < 1) {
    program.outputHelp();
    process.exit(0);
}

var file = program.args[0];

var res = fdat(file, {});

if (res.err) {
    console.error(chalk.bgRed(res.err));
    process.exit(1);
}

var datapointText = "";

var xpoints = [];

if (res.datapoints.xFTYPE) xpoints.push(chalk.blue(res.datapoints.xFTYPE) + " file");
if (res.datapoints.xFSIZE) xpoints.push(chalk.yellow(res.datapoints.xFSIZE) + " bytes");

datapointText += xpoints.join(", ");

var dpraw = Object.keys(res.datapoints).filter(x => x != "xFTYPE" && x != "xFSIZE").map(x => x + ": " + res.datapoints[x]).join("\n");
if (dpraw.length > 0) datapointText += "\n\n";
datapointText += dpraw;

console.log(`fdat ${chalk.green(package.version)} by ${chalk.blue("skiilaa")}\nusing mod ${chalk.yellow(res.mod)}\n${datapointText}`);