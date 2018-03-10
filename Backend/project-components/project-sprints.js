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

"use strict";

const common = require('../common.js');
const db = require('../db.js');

/**
 * initialize the ticket
 *
 * @param {function} callback callback function
 */
const initialize = function (callback) {

}

/**
 * Create a sprint
 *
 * @param {object} sprint sprint object to add
 * @param {function} callback callback function
 */
const addSprint = function (sprint, callback) {
    if (typeof (sprint.name) !== common.variableTypes.STRING
        || typeof (sprint.projectId) !== common.variableTypes.STRING
        || typeof (sprint.teamId) !== common.variableTypes.STRING
        || typeof (sprint.startDate) !== common.variableTypes.STRING
        || typeof (sprint.endDate) !== common.variableTypes.STRING) {
        return callback(common.getError(10006), null);
    }

    const currentDate = common.getDate();
    const currentISODate = common.getISODate();
    let sprintToAdd = {};

    sprintToAdd._id = common.getUUID();
    sprintToAdd.ctime = currentDate;
    sprintToAdd.mtime = currentDate;
    sprintToAdd.ictime = currentISODate;
    sprintToAdd.imtime = currentISODate;
    sprintToAdd.projectId = sprint.projectId;
    sprintToAdd.teamId = sprint.teamId;
    sprintToAdd.name = sprint.name;
    sprintToAdd.startDate = sprint.startDate;
    sprintToAdd.endDate = sprint.endDate;
    sprintToAdd.state = common.sprintStates.CLOSED.value;
    sprintToAdd.status = common.sprintStatus.ACTIVE.value;
    sprintToAdd.tickets = Array.isArray(sprint.tickets) ? sprint.tickets : [];

    db.addSprint(sprintToAdd, callback);
}

/**
 * get sprints list with search, sort and limit params
 *
 * @param {object} searchQuery search parameters
 * @param {object} sortQuery sort parameters
 * @param {number} lim limit on the results list length
 * @param {function} callback callback function
 */
const getLimitedSprintsListSorted = function (searchQuery, sortQuery, lim, callback) {
    db.getLimitedSprintsListSorted(searchQuery, sortQuery, lim, callback);
}

/**
 * find a single sprint by the search parameters
 *
 * @param {object} searchQuery search parameters
 * @param {function} callback callback function
 */
const getSprint = function (searchQuery, callback) {
    db.getSprint(searchQuery, callback);
}

/**
 * find the list of sprints under a team
 *
 * @param {string} projectId project id
 * @param {string} teamId team id
 * @param {string} sprintId sprint id
 * @param {function} callback callback function
 */
const getSprintById = function (projectId, teamId, sprintId, callback) {
    getSprint({ $and: [{ _id: sprintId }, { projectId: projectId }, { teamId: teamId }, { status: common.sprintStatus.ACTIVE.value }] }, callback);
}

/**
 * find the list of sprints under a team
 *
 * @param {string} projectId project id
 * @param {string} teamId team id
 * @param {function} callback callback function
 */
const getSprintsByTeamId = function (projectId, teamId, callback) {
    getLimitedSprintsListSorted({ $and: [{ projectId: projectId }, { teamId: teamId }, { status: common.sprintStatus.ACTIVE.value }] }, { status: -1, name: 1 }, 0, callback);
}

/**
 * find the active sprint under a team
 *
 * @param {string} projectId project id
 * @param {string} teamId team id
 * @param {function} callback callback function
 */
const getActiveSprint = function (projectId, teamId, callback) {
    getSprint({ $and: [{ projectId: projectId }, { teamId: teamId }, { state: common.sprintStates.ACTIVE.value }, { status: common.sprintStatus.ACTIVE.value }] }, callback);
}

/**
 * set active sprint 
 *
 * @param {string} projectId project id
 * @param {string} teamId team id
 * @param {string} sprintId sprint id
 * @param {function} callback callback function
 */
const setActiveSprint = function (projectId, teamId, sprintId, callback) {
    let deactivateSearchQuery = { $and: [{ $ne: { _id: sprintId } }, { projectId: projectId }, { teamId: teamId }] };
    let deactivateUpdateQuery = { $set: { state: common.sprintStates.CLOSED.value } };
    db.updateSprint(deactivateSearchQuery, deactivateUpdateQuery, function (err, result) {
        if (err) {
            return callback(err, null);
        }

        let activateSearchQuery = { $and: [{ _id: sprintId }, { projectId: projectId }, { teamId: teamId }] };
        let activateUpdateQuery = { $set: { state: common.sprintStates.ACTIVE.value } };
        db.updateSprint(activateSearchQuery, activateUpdateQuery, callback);
    });
}

/**
 * update the sprint information
 *
 * @param {string} sprintId sprint id
 * @param {string} teamId team id
 * @param {string} projectId project id
 * @param {object} updateParams modify parameters
 * @param {function} callback callback function
 */
const updateSprint = function (sprintId, teamId, projectId, updateParams, callback) {
    let searchQuery = {};
    searchQuery.$and = {};
    let updateQuery = {};
    updateQuery.$set = {};

    if (typeof (projectId) !== common.variableTypes.STRING) {
        return callback(common.getError(10007), null);
    }

    if (typeof (teamId) !== common.variableTypes.STRING) {
        return callback(common.getError(10007), null);
    }

    if (typeof (sprintId) !== common.variableTypes.STRING) {
        return callback(common.getError(10007), null);
    }

    searchQuery.$and = [{ _id: sprintId }, { projectId: projectId }, { teamId: teamId }, { status: common.sprintStatus.ACTIVE.value }];

    if (typeof (updateParams.name) === common.variableTypes.STRING) {
        updateQuery.$set.name = updateParams.name;
    }

    if (typeof (updateParams.startDate) === common.variableTypes.STRING) {
        updateQuery.$set.startDate = updateParams.startDate;
    }

    if (typeof (updateParams.endDate) === common.variableTypes.STRING) {
        updateQuery.$set.endDate = updateParams.endDate;
    }

    if (common.isValueInObjectWithKeys(updateParams.status, 'value', common.sprintStatus)) {
        updateQuery.$set.status = updateParams.status;
    }

    if (common.isValueInObjectWithKeys(updateParams.state, 'value', common.sprintStates)) {
        updateQuery.$set.state = updateParams.state;
    }

    if (Array.isArray(updateParams.tickets)) {
        updateQuery.$set.tickets = updateParams.tickets;
    }

    if (common.isEmptyObject(updateQuery.$set)) {
        delete updateQuery.$set;
    }

    if (common.isEmptyObject(updateQuery)) {
        return callback(common.getError(10007), null);
    }

    updateQuery.$set.mtime = common.getDate();
    updateQuery.$set.imtime = common.getISODate();

    db.updateSprint(searchQuery, updateQuery, callback);
}

// <exports> -----------------------------------
exports.addSprint = addSprint;
exports.getActiveSprint = getActiveSprint;
exports.getSprintById = getSprintById;
exports.getSprintsByTeamId = getSprintsByTeamId;
exports.initialize = initialize;
exports.setActiveSprint = setActiveSprint;
exports.updateSprint = updateSprint;
// </exports> ----------------------------------