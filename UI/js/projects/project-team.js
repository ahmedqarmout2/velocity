/*
Copyright (C) 2016
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

const addFieldDiv = '#appendFieldDiv';
const addSprintDiv = '#appendSprintDiv';
const addTagDiv = '#appendTagDiv';
const backButtonId = '#backButton';
const boardTypeSelectionId = '#boardTypeSelection';
const createTicketButtonId = '#createTicketButton';
const description = '#description';
const splithref = window.location.href.split('/');
const projectId = splithref[4];
const releaseCreations = '#releaseCreation';
const releaseField = '#releaseField';
const releaseInputRow = '.releaseInputRow';
const releaseVisibility = '#releaseVisibility';
const sprintCreations = '#sprintCreation';
const sprintEnd = '#endDatePicker'
const sprintField = '#sprintField';
const sprintInputRow = '.sprintInputRow';
const sprintStart = '#startDatePicker';
const sprintVisibility = '#sprintVisibility'
const tagCreations = '#tagCreation';
const tagField = '#tagField';
const tagInputRow = '.tagInputRow';
const tagVisibility = '#tagVisibility';
const teamId = splithref[6];

const assigneeAutocompleteBoardId = '#assigneeAutocompleteBoard';
const assigneeAutocompleteIssueId = '#assigneeAutocompleteIssue';
const assigneeAutocompleteId = '#assigneeAutocomplete';

var releaseComponent = null;
var selectedAssignee = null;
var selectedAssigneeBoard = null;
var selectedAssigneeIssue = null;
var sprintComponent = null;
var tagComponent = null;
var usernamesArray = [];

$(function () {
    initSummernote(description);
    $(description).summernote('disable');
    $(description).summernote({
        disableDragAndDrop: true,
        shortcuts: false
    });
    $('div.note-btn-group.btn-group button').remove();

    $(releaseInputRow).hide();
    $(tagInputRow).hide();
    $(sprintInputRow).hide();

    $(releaseVisibility).click(() => {
        $(releaseInputRow).show();
        $(releaseVisibility).hide();
    });

    $(tagVisibility).click(() => {
        $(tagInputRow).show();
        $(tagVisibility).hide();
    });

    $(sprintVisibility).click(() => {
        $(sprintInputRow).show();
        $(sprintVisibility).hide();
    });

    $(releaseCreation).click(() => {
        createRelease();
    });

    $(tagCreation).click(() => {
        createTag();
    });

    $(sprintCreation).click(() => {
        createSprint();
    });

    $(backButtonId).click(() => {
        window.location.href = '/projects';
    });

    $(createTicketButtonId).click(() => {
        window.location.href = `/project/${projectId}/team/${teamId}/tickets/add`;
    });

    $(sprintStart).pickadate({
        selectMonths: true,
        selectYears: 15,
        today: translate('today'),
        clear: translate('clear'),
        close: translate('ok'),
        closeOnSelect: false,
        container: undefined
    });

    $(sprintEnd).pickadate({
        selectMonths: true,
        selectYears: 15,
        today: translate('today'),
        clear: translate('clear'),
        close: translate('ok'),
        closeOnSelect: false,
        container: undefined
    });

    getListOfAssignee();
    getReleaseComponent();
    getSprintComponent();
    getTagComponent();

    /*
    $.ajax({
        type: 'PUT',
        url: '/tags/create',
        data: {
            projectId: projectId,
            teamId: teamId,
            name: 'Tag 2'
        },
        success: function (data) {
            alert(data);
        },
        error: function (data) {
            handle401And404(data);
            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'PUT',
        url: '/releases/create',
        data: {
            projectId: projectId,
            teamId: teamId,
            name: 'Release 1'
        },
        success: function (data) {
            alert(data);
        },
        error: function (data) {
            handle401And404(data);
            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'PUT',
        url: '/sprints/create',
        data: {
            projectId: projectId,
            teamId: teamId,
            name: 'Sprint 5',
            startDate: '1/2/2018',
            endDate: '1/20/2018'
        },
        success: function (data) {
            alert(data);
        },
        error: function (data) {
            handle401And404(data);
            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'GET',
        url: '/components/team/backlog',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'GET',
        url: '/components/teamsList',
        data: {
            projectId: projectId
        },
        success: function (data) {
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'GET',
        url: '/components/team/board',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'GET',
        url: '/project/team/releases/list',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
            alert(JSON.stringify(data));
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/

    /*
    $.ajax({
        type: 'GET',
        url: '/project/team/tags/list',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
            alert(JSON.stringify(data));
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });*/
});

/**
 * Gets the release component
 */
function getReleaseComponent() {
    /*
    $.ajax({
        type: 'GET',
        url: '/components/releases',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
            releaseComponent = data.releaseComponent;
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });
    */
}

/**
 * Gets the sprint component
 */
function getSprintComponent() {
    /*
    $.ajax({
        type: 'GET',
        url: '/components/sprints',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
            sprintComponent = data.sprintComponent;
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });
    */
}

/**
 * Gets the release component
 */
function getTagComponent() {
    /*
    $.ajax({
        type: 'GET',
        url: '/components/tags',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
            tagComponent = data.tagComponent;
        },
        error: function (data) {
            handle401And404(data);

            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });
    */
}

/**
 * Creates a release
 */
function createRelease() {
    if ($(releaseField).val() === "") {
        failSnackbar('Release field cannot be empty');
    } else {
        $.ajax({
            type: 'PUT',
            url: '/releases/create',
            data: {
                projectId: projectId,
                teamId: teamId,
                name: $(releaseField).val()
            },
            success: function (data) {
                window.location.href = `/project/${projectId}/team/${teamId}`;
            },
            error: function (data) {
                const jsonResponse = data.responseJSON;
                failSnackbar(getErrorMessageFromResponse(jsonResponse));
            }
        });
    }
}

/**
 * Creates a tag
 */
function createTag() {
    if ($(tagField).val() === "") {
        failSnackbar('Tag field cannot be empty');
    } else {
        $.ajax({
            type: 'PUT',
            url: '/tags/create',
            data: {
                projectId: projectId,
                teamId: teamId,
                name: $(tagField).val()
            },
            success: function (data) {
                window.location.href = `/project/${projectId}/team/${teamId}`;
            },
            error: function (data) {
                const jsonResponse = data.responseJSON;
                failSnackbar(getErrorMessageFromResponse(jsonResponse));
            }
        });
    }
}

/**
 * Creates a sprint
 */
function createSprint() {
    if ($(sprintField).val() === "") {
        failSnackbar('Tag field cannot be empty');
    } else if ($(sprintStart).val() === "") {
        failSnackbar('Start date cannot be empty');
    } else if ($(sprintEnd).val() === "") {
        failSnackbar('End date cannot be empty');
    } else {
        $.ajax({
            type: 'PUT',
            url: '/sprints/create',
            data: {
                projectId: projectId,
                teamId: teamId,
                name: $(sprintField).val(),
                startDate: $(sprintStart).val(),
                endDate: $(sprintEnd).val()
            },
            success: function (data) {
                window.location.href = `/project/${projectId}/team/${teamId}`;
            },
            error: function (data) {
                const jsonResponse = data.responseJSON;
                failSnackbar(getErrorMessageFromResponse(jsonResponse));
            }
        });
    }
}

/**
 * list of possible assignee
*/
function getListOfAssignee() {
    $.ajax({
        type: 'GET',
        url: '/project/team/members/list',
        data: {
            projectId: projectId,
            teamId: teamId
        },
        success: function (data) {
            let usersObj = {};
            let usernameObj = {};
            let nameObj = {};
            for (let i = 0; i < data.length; i++) {
                let user = data[i];
                usersObj[`${user.fname} ${user.lname}`] = `/picture/${user.picture}`;
                usernameObj[`${user.fname} ${user.lname}`] = user.username;
                nameObj[`${user.fname} ${user.lname}`] = `${user.fname} ${user.lname}`;
                usernamesArray.push(user.username);
            }
            $(assigneeAutocompleteId).autocomplete({
                data: usersObj,
                limit: 20,
                onAutocomplete: function (val) {
                    selectedAssignee = nameObj[val];
                    startLoad(sprintsLoadId, sprintsListId);
                    displaySprintsList();
                },
                minLength: 0,
            });
            $(assigneeAutocompleteId).on('keyup', function () {
                selectedAssignee = $(assigneeAutocompleteId)[0].value;
                startLoad(sprintsLoadId, sprintsListId);
                displaySprintsList();
            });
            $(assigneeAutocompleteIssueId).autocomplete({
                data: usersObj,
                limit: 20,
                onAutocomplete: function (val) {
                    selectedAssigneeIssue = nameObj[val];
                    startLoad(issuesLoadId, issuesListId);
                    displayIssuesList();
                },
                minLength: 0,
            });
            $(assigneeAutocompleteIssueId).on('keyup', function () {
                selectedAssigneeIssue = $(assigneeAutocompleteIssueId)[0].value;
                startLoad(issuesLoadId, issuesListId);
                displayIssuesList();
            });
            $(assigneeAutocompleteBoardId).autocomplete({
                data: usersObj,
                limit: 20,
                onAutocomplete: function (val) {
                    selectedAssigneeBoard = nameObj[val];
                    startLoad(boardsUserLoadId, boardsUserListId);
                    displayBoard();
                },
                minLength: 0,
            });
            $(assigneeAutocompleteBoardId).on('keyup', function () {
                selectedAssigneeBoard = $(assigneeAutocompleteBoardId)[0].value;
                startLoad(boardsUserLoadId, boardsUserListId);
                displayBoard();
            });
        },
        error: function (data) {
            handle401And404(data);

            endLoad(sprintsLoadId, sprintsListId);
            const jsonResponse = data.responseJSON;
            failSnackbar(getErrorMessageFromResponse(jsonResponse));
        }
    });
}

/**
 * save board type
*/
function saveBoardType() {
    let boardTypeValue = $(boardTypeSelectionId).val();
    swal({
        text: translate('saveBoardType'),
        icon: 'warning',
        dangerMode: true,
        buttons: [translate('cancel'), translate('save')]
    }).then(canDelete => {
        if (canDelete) {
            $.ajax({
                type: 'POST',
                url: '/project/teams/update/boardType/me',
                data: {
                    projectId: projectId,
                    boardType: boardTypeValue
                },
                success: function (data) {
                    window.location.reload();
                },
                error: function (data) {
                    handle401And404(data);

                    const jsonResponse = data.responseJSON;
                    failSnackbar(getErrorMessageFromResponse(jsonResponse));
                }
            });
        }
    });
}

/**
 * Deletes a release
 * @param {*} releaseId release id
 * @param {*} releaseName release name
 */
function deleteRelease(releaseId, releaseName) {
    swal({
        text: translate('deleteReleaseWarning'),
        icon: 'warning',
        dangerMode: true,
        buttons: [translate('cancel'), translate('delete')]
    }).then(canDelete => {
        if (canDelete) {
            alert('Deleting release.');
        }
    });
}

/**
 * Deletes a tag
 * @param {*} tagId tag id
 * @param {*} tagName tag name
 */
function deleteTag(tagId, tagName) {
    swal({
        text: translate('deleteTagWarning'),
        icon: 'warning',
        dangerMode: true,
        buttons: [translate('cancel'), translate('delete')]
    }).then(canDelete => {
        if (canDelete) {
            alert('Deleting tag.');
        }
    });
}

/**
 * Deletes a sprint
 * @param {*} sprintId sprint id
 * @param {*} sprintName sprint name
 */
function deleteSprint(sprintId, sprintName) {
    swal({
        text: translate('deleteSprintWarning'),
        icon: 'warning',
        dangerMode: true,
        buttons: [translate('cancel'), translate('delete')]
    }).then(canDelete => {
        if (canDelete) {
            alert('Deleting sprint.');
        }
    });
}