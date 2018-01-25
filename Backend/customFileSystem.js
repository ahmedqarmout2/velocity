/*
Copyright (C) 2018
Developed at University of Toronto

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');

const common = require('./common.js');
const db = require('./db.js');

/**
 * make a directory given its parent path and the name of the new directory
 *
 * @param {string} parentPath parent path
 * @param {string} directoryName new directory's name
 * @param {string} directoryPermissions new directory's permissions
 * @param {function} callback callback function
 */
const mkdir = function (parentPath, directoryName, directoryPermissions, callback) {
    const fullPath = path.join(parentPath, directoryName);
    const entryObject = {
        _id: directoryName,
        path: fullPath,
        type: common.cfsTypes.DIRECTORY,
        permission: directoryPermissions
    };

    db.addToVirtualFileSystem(entryObject, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        fs.mkdir(fullPath, function (err) {
            if (err) {
                return callback(common.getError(4001), null);
            }

            return callback(null, entryObject);
        });
    });
}
exports.mkdir = mkdir;

/**
 * BE CAREFUL: remove a directory given its parent path and the name of the new directory
 *
 * @param {string} parentPath parent path
 * @param {string} directoryName directory name
 * @param {function} callback callback function
 */
const rmdir = function (parentPath, directoryName, callback) {
    const fullPath = path.join(parentPath, directoryName);
    db.removeFromVirtualFileSystem({ _id: directoryName }, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        fs.rmdir(fullPath, function (err) {
            if (err) {
                return callback(common.getError(4003), null);
            }

            return callback(null, 'ok');
        });
    });
}
exports.rmdir = rmdir;

/**
 * BE CAREFUL: perform rm -rf on a directory
 *
 * @param {string} parentPath parent path
 * @param {string} directoryName directory name
 * @param {function} callback callback function
 */
const rmrf = function (parentPath, directoryName, callback) {
    const fullPath = path.join(parentPath, directoryName);
    db.removeFromVirtualFileSystem({ _id: directoryName }, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        rimraf(fullPath, function (err) {
            if (err) {
                return callback(common.getError(4004), null);
            }

            return callback(null, 'ok');
        });
    });
}
exports.rmrf = rmrf;

/**
 * check if a file or directory exists
 *
 * @param {string} entryId file or directory Id
 * @param {function} callback callback function
 */
const existsSync = function (entryId, callback) {
    db.findInVirtualFileSystem({ _id: entryId }, function (err, fileObj) {
        if (err) {
            return callback(err, null);
        }

        if (!fs.existsSync(fileObj.path)) {
            return callback(common.getError(4007), null);
        }

        return callback(null, fileObj);
    });
}
exports.dirExists = existsSync;
exports.fileExists = existsSync;

/**
 * write data to a file
 *
 * @param {object} fileObj fileName, filePath, fileExtension, fileCreator, filePermissions and fileData
 * @param {function} callback callback function
 */
const writeFile = function (fileObj, callback) {
    const fullPath = `${path.join(fileObj.filePath, fileObj.fileName)}.${fileObj.fileExtension}`;
    const fileObject = {
        _id: fileObj.fileName,
        path: fullPath,
        type: common.cfsTypes.FILE,
        extension: fileObj.fileExtension,
        creator: fileObj.fileCreator,
        permission: fileObj.filePermissions
    };

    db.addToVirtualFileSystem(fileObject, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        fs.writeFile(fullPath, fileObj.fileData, function (err) {
            if (err) {
                return callback(common.getError(4008), null);
            }

            return callback(null, fileObject);
        });
    });
}
exports.writeFile = writeFile;

/**
 * re-create the custom file syste,
 *
 * @param {function} callback callback function
 */
const resetCustomFileSystem = function (callback) {
    db.removeFromVirtualFileSystem({}, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        rimraf(common.cfsTree.HOME, function (err) {
            if (err) {
                return callback(common.getError(4009), null);
            }

            mkdir(common.cfsTree.HOME, 'Users', common.cfsPermission.SYSTEM, callback);
        });
    });
}
exports.resetCustomFileSystem = resetCustomFileSystem;

// convert string to a path
exports.joinPath = path.join;