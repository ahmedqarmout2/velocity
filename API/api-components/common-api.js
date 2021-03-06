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

const common_backend = require('../../Backend/common.js');

// File names to render the pages
const pugPages = Object.freeze({
    about: 'about',
    feedback: 'feedback',
    login: 'login',
    modeSelector: 'modeSelector',
    pageNotFound: 'pageNotFound',
    profile: 'profile',
    projects: 'projects/projects',
    projectsAdd: 'projects/projects-add',
    projectsExport: 'projects/projects-export',
    projectsExportComplete: 'projects/projects-export-complete',
    projectsImport: 'projects/projects-import',
    projectsImportComplete: 'projects/projects-import-complete',
    projectPage: 'projects/project-page',
    projectTeam: 'projects/project-team',
    releasePage: 'projects/release-page',
    settings: 'settings/settings',
    sprintPage: 'projects/sprint-page',
    tagPage: 'projects/tag-page',
    ticketCreation: 'tickets/tickets-entry',
    ticketModification: 'tickets/tickets-edit',
    ticketSearch: 'tickets/tickets-search',
    users: 'users/users',
    usersAdd: 'users/users-add',
    usersEdit: 'users/users-edit',
    usersExport: 'users/users-export',
    usersExportComplete: 'users/users-export-complete',
    usersImport: 'users/users-import',
    usersImportComplete: 'users/users-import-complete'
});
exports.pugPages = pugPages;

// all pages components
var pugComponents = {
    boardTicketEntryComponent: null,
    boardUserOutlineComponent: null,
    projectsEntryComponent: null,
    projectsGroupEntryComponent: null,
    projectsGroupModalComponent: null,
    projectsGroupModalEntryComponent: null,
    projectsGroupUserEntryComponent: null,
    projectsUserEntryComponent: null,
    sprintEntryComponent: null,
    teamEntryComponent: null,
    teamManagementSprintEntryComponent: null,
    teamManagementReleaseEntryComponent: null,
    teamManagementTagEntryComponent: null,
    ticketCommentEntry: null,
    ticketEntryComponent: null,
    usersEntryComponent: null
};
exports.pugComponents = pugComponents;

/**
 * verify active sessions
 *
 * @param {object} req req value of the session
 */
const isActiveSession = function (req) {
    return typeof (req.session) !== common_backend.variableTypes.UNDEFINED
        && typeof (req.session.user) !== common_backend.variableTypes.UNDEFINED;
}
exports.isActiveSession = isActiveSession;
