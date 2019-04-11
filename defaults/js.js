var path = require('path');

module.exports = {
    test: function JSTest(file, buf) {
        return path.extname(file) == ".js" || path.extname(file) == ".jsx";
    },
    gather: function JSGather(file, buf) {
        return {
            xFTYPE: path.extname(file).substring(1).toUpperCase()
        }
    }
}