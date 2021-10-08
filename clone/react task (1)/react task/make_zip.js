const stat = require('fs').statSync;
const AdmZip = require('adm-zip');

/**
 * @param {String} zipFileName
 * @param {Array<String>} pathNames
 */

function newArchive(zipFileName, pathNames) {

    const zip = new AdmZip();

    pathNames.forEach(path => {
        const p = stat(path);
        if (p.isFile()) {
            zip.addLocalFile(path);
        } else if (p.isDirectory()) {
            zip.addLocalFolder(path, path);
        }
    });

    zip.writeZip(zipFileName);

}

newArchive(`beatific.zip`, [
    'css/',
    'fonts/',
    'index.html',
    'server/node_modules/buffer'
]);