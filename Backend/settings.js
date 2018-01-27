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

const common = require('./common.js');
const db = require('./db.js');

var settingsObject;

/**
 * fetch the settings object from the database
 *
 * @param {function} callback callback function
 */
const initialize = function (callback) {
    db.getAllSettings(function (err, obj) {
        if (err) {
            if (err.code === 3001) {
                return resetAllSettings(callback);
            } else {
                return callback(err, null);
            }
        }

        settingsObject = obj;
        return callback(null, 'ok');
    });
}

/**
 * get all settings
 *
 * @returns {object}
 */
const getAllSettings = function () {
    return settingsObject;
}

/**
 * reset all settings to default
 *
 * @param {function} callback callback function
 */
const resetAllSettings = function (callback) {
    db.removeAllSettings(function (err, result) {
        if (err) {
            return callback(err, null);
        }

        var defaultSettings = {};
        defaultSettings._id = common.getUUID();
        defaultSettings.active = true;
        defaultSettings.mode = common.modeTypes.UNKNOWN;

        db.addAllSettings(defaultSettings, function (err, result) {
            if (err) {
                return callback(err, null);
            }

            settingsObject = defaultSettings;
            return callback(null, 'ok');
        });
    });
}

/**
 * update the mode type
 *
 * @param {number} modeType mode type
 * @param {function} callback callback function
 */
const updateModeType = function (modeType, callback) {
    if (!common.isValueInObject(modeType, common.modeTypes)) {
        return callback(common.getError(3006), null);
    }

    const updateQuery = { $set: { mode: modeType } };
    db.updateAllSettings(updateQuery, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        settingsObject.mode = modeType;
        return callback(null, result);
    });
}

// <exports> -----------------------------------
exports.getAllSettings = getAllSettings;
exports.initialize = initialize;
exports.resetAllSettings = resetAllSettings;
exports.updateModeType = updateModeType;
// </exports> ----------------------------------