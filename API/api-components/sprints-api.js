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

const common_api = require('./common-api.js');

const analytics = require('../../Backend/analytics.js');
const common_backend = require('../../Backend/common.js');
const logger = require('../../Backend/logger.js');
const projects = require('../../Backend/projects.js');
const settings = require('../../Backend/settings.js');
const users = require('../../Backend/users.js');

/**
 * root path to create a sprint
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const createSprint = function (req, res) {
    if (!common_api.isActiveSession(req)) {
        return res.status(401).render(common_api.pugPages.login);
    }

    const projectId = req.body.projectId;
    const teamId = req.body.teamId;
    projects.getActiveProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).send(err);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(400).send(common_backend.getError(2018));
        }

        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(500).send(err);
            }

            if (projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(400).send(common_backend.getError(2019));
            }

            if (teamObj.boardType !== common_backend.boardTypes.SCRUM.value) {
                logger.error(JSON.stringify(common_backend.getError(1000)));
                return res.status(400).send(common_backend.getError(1000));
            }

            let newSprint = {
                projectId: projectId,
                teamId: teamId,
                name: req.body.name,
                startDate: req.body.startDate,
                endDate: req.body.endDate
            };

            //TODO: check values of start date and end date
            projects.addSprintToTeam(newSprint, function (err, sprintObj) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(500).send(err);
                }

                return res.status(200).send(sprintObj);
            });
        });
    });
}

/**
 * root path to delete a sprint
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const deleteSprint = function (req, res) {
    if (!common_api.isActiveSession(req)) {
        return res.status(401).render(common_api.pugPages.login);
    }

    const projectId = req.body.projectId;
    const teamId = req.body.teamId;
    const sprintId = req.body.sprintId;

    projects.getActiveProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).send(err);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(400).send(common_backend.getError(2018));
        }

        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(500).send(err);
            }

            if (projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(400).send(common_backend.getError(2019));
            }

            projects.getSprintById(projectId, teamId, sprintId, function (err, sprintObj) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(500).send(err);
                }

                if (sprintObj.status !== common_backend.sprintStatus.OPEN.value) {
                    logger.error(JSON.stringify(common_backend.getError(2051)));
                    return res.status(400).send(common_backend.getError(2051));
                }

                let updatedSprint = { status: common_backend.sprintStatus.DELETED.value };
                projects.updateSprintById(sprintId, teamId, projectId, updatedSprint, function (err, result) {
                    if (err) {
                        logger.error(JSON.stringify(err));
                        return res.status(500).send(err);
                    }

                    return res.status(200).send('ok');
                });
            });
        });
    });
}

/**
 * root path to close a sprint
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const closeSprint = function (req, res) {
    if (!common_api.isActiveSession(req)) {
        return res.status(401).render(common_api.pugPages.login);
    }

    const projectId = req.body.projectId;
    const teamId = req.body.teamId;
    const sprintId = req.body.sprintId;

    projects.getActiveProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).send(err);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(400).send(common_backend.getError(2018));
        }

        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(500).send(err);
            }

            if (projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(400).send(common_backend.getError(2019));
            }

            projects.getSprintById(projectId, teamId, sprintId, function (err, sprintObj) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(500).send(err);
                }

                if (sprintObj.status !== common_backend.sprintStatus.ACTIVE.value) {
                    logger.error(JSON.stringify(common_backend.getError(2052)));
                    return res.status(400).send(common_backend.getError(2052));
                }

                let updatedSprint = { status: common_backend.sprintStatus.CLOSED.value };
                projects.updateSprintById(sprintId, teamId, projectId, updatedSprint, function (err, result) {
                    if (err) {
                        logger.error(JSON.stringify(err));
                        return res.status(500).send(err);
                    }

                    projects.putTicketsInBacklog(projectId, teamId, sprintObj.tickets, function (err, result) {
                        if (err) {
                            logger.error(JSON.stringify(err));
                            return res.status(500).send(err);
                        }

                        sprintObj.status = common_backend.sprintStatus.CLOSED.value;
                        projects.getTicketsByTeamId(projectId, teamId, function (err, ticketObj) {
                            if (err) {
                                logger.error(JSON.stringify(err));
                                return res.status(500).send(err);
                            }
                            
                            analytics.saveSpecificSprintAnalytics(sprintObj, teamObj, ticketObj, function (err, analyticsObj) {
                                if (err) {
                                    logger.error(JSON.stringify(err));
                                    return res.status(500).send(err);
                                }
            
                                return res.status(200).send('ok');
                            });
                        });
                    });
                });
            });
        });
    });
}

/**
 * root path to get the sprints list
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const getSprintsList = function (req, res) {
    const projectId = req.query.projectId;
    const teamId = req.query.teamId;
    projects.getActiveOrClosedProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).send(err);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(400).send(common_backend.getError(2018));
        }

        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(500).send(err);
            }

            if (settings.getModeType() === common_backend.modeTypes.CLASS
                && projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(400).send(common_backend.getError(2019));
            }

            projects.getAvailableSprintsByTeamId(projectId, teamId, function (err, sprintsObjList) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(500).send(err);
                }

                let sprintsList = [];
                for (let i = 0; i < sprintsObjList.length; i++) {
                    let sprint = sprintsObjList[i];
                    sprintsList.push({
                        _id: sprint._id,
                        name: sprint.name,
                        startDate: sprint.startDate,
                        endDate: sprint.endDate
                    });
                }

                return res.status(200).send({
                    sprintsList: sprintsList
                });
            });
        });
    });
}

/**
 * root path to activate a sprint
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const activateSprint = function (req, res) {
    if (!common_api.isActiveSession(req)) {
        return res.status(401).render(common_api.pugPages.login);
    }

    const projectId = req.body.projectId;
    const teamId = req.body.teamId;
    const sprintId = req.body.sprintId;

    projects.getActiveProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).send(err);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(400).send(common_backend.getError(2018));
        }

        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(500).send(err);
            }

            if (projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(400).send(common_backend.getError(2019));
            }

            projects.getSprintById(projectId, teamId, sprintId, function (err, sprintObj) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(500).send(err);
                }

                if (sprintObj.status !== common_backend.sprintStatus.OPEN.value) {
                    logger.error(JSON.stringify(common_backend.getError(2053)));
                    return res.status(400).send(common_backend.getError(2053));
                }

                projects.getActiveSprintByTeamId(projectId, teamId, function (err, prevActiveSprint) {
                    if (err && err.code !== 10004) {
                        logger.error(JSON.stringify(err));
                        return res.status(500).send(err);
                    }
                    
                    projects.setActiveSprintByTeamId(projectId, teamId, sprintId, function (err, result) {
                        if (err) {
                            logger.error(JSON.stringify(err));
                            return res.status(500).send(err);
                        }
                        
                        sprintObj.status = common_backend.sprintStatus.ACTIVE.value;
                        projects.getTicketsByTeamId(projectId, teamId, function (err, ticketObj) {
                            if (err) {
                                logger.error(JSON.stringify(err));
                                return res.status(500).send(err);
                            }

                            analytics.saveSpecificSprintAnalytics(sprintObj, teamObj, ticketObj, function (err, analyticsObj) {
                                if (err) {
                                    logger.error(JSON.stringify(err));
                                    return res.status(500).send(err);
                                }

                                if (prevActiveSprint) {
                                    prevActiveSprint.status = common_backend.sprintStatus.CLOSED.value;
                                    analytics.saveSpecificSprintAnalytics(prevActiveSprint, teamObj, ticketObj, function (err, analyticsObj) {
                                        if (err) {
                                            logger.error(JSON.stringify(err));
                                            return res.status(500).send(err);
                                        }
                    
                                        return res.status(200).send('ok');
                                    });
                                } else {
                                    return res.status(200).send('ok');
                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

/**
 * root path to render the sprint page
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const renderSprintPage = function (req, res) {
    if (!common_api.isActiveSession(req)) {
        return res.status(401).render(common_api.pugPages.login);
    }

    const projectId = req.params.projectId;
    const teamId = req.params.teamId;
    const sprintId = req.params.sprintId;
    projects.getActiveOrClosedProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(404).render(common_api.pugPages.pageNotFound);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(404).render(common_api.pugPages.pageNotFound);
        }
        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(404).render(common_api.pugPages.pageNotFound);
            }

            if (settings.getModeType() === common_backend.modeTypes.CLASS
                && projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(404).render(common_api.pugPages.pageNotFound);
            }

            projects.getSprintById(projectId, teamId, sprintId, function (err, sprintObj) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(404).render(common_api.pugPages.pageNotFound);
                }

                return res.status(200).render(common_api.pugPages.sprintPage, {
                    user: req.session.user,
                    projectId: projectId,
                    teamId: teamId,
                    sprint: sprintObj
                });
            });
        });
    });
}

/**
 * root path to get the sprint page components
 *
 * @param {object} req req object
 * @param {object} res res object
 */
const getSprintComponents = function (req, res) {
    if (!common_api.isActiveSession(req)) {
        return res.status(401).render(common_api.pugPages.login);
    }

    const projectId = req.query.projectId;
    const teamId = req.query.teamId;
    const sprintId = req.query.sprintId;
    projects.getActiveOrClosedProjectById(projectId, function (err, projectObj) {
        if (err) {
            logger.error(JSON.stringify(err));
            return res.status(500).send(err);
        }

        if (projectObj.members.indexOf(req.session.user._id) === -1) {
            logger.error(JSON.stringify(common_backend.getError(2018)));
            return res.status(400).send(common_backend.getError(2018));
        }

        projects.getConfiguredTeamById(projectId, teamId, function (err, teamObj) {
            if (err) {
                logger.error(JSON.stringify(err));
                return res.status(500).send(err);
            }

            if (settings.getModeType() === common_backend.modeTypes.CLASS
                && projectObj.admins.indexOf(req.session.user._id) === -1
                && teamObj.members.indexOf(req.session.user._id) === -1) {
                logger.error(JSON.stringify(common_backend.getError(2019)));
                return res.status(400).send(common_backend.getError(2019));
            }

            projects.getSprintById(projectId, teamId, sprintId, function (err, sprintObj) {
                if (err) {
                    logger.error(JSON.stringify(err));
                    return res.status(500).send(err);
                }

                projects.getTicketsByIds(projectId, teamId, sprintObj.tickets, function (err, ticketsList) {
                    if (err) {
                        logger.error(JSON.stringify(err));
                        return res.status(500).send(err);
                    }

                    const resolvedUsers = common_backend.convertListToJason('_id', users.getActiveUsersList());
                    let resolvedList = [];
                    for (let i = 0; i < ticketsList.length; i++) {
                        const ticketObj = ticketsList[i];
                        const resolvedReporter = resolvedUsers[ticketObj.reporter] ? `${resolvedUsers[ticketObj.reporter].fname} ${resolvedUsers[ticketObj.reporter].lname}` : common_backend.noReporter;
                        const resolvedAssignee = resolvedUsers[ticketObj.assignee] ? `${resolvedUsers[ticketObj.assignee].fname} ${resolvedUsers[ticketObj.assignee].lname}` : common_backend.noReporter;
                        const reporterPicture = resolvedUsers[ticketObj.reporter] ? resolvedUsers[ticketObj.reporter].picture : null;
                        const assigneePicture = resolvedUsers[ticketObj.assignee] ? resolvedUsers[ticketObj.assignee].picture : null;
                        resolvedList.push({
                            _id: ticketObj._id,
                            reporterId: ticketObj.reporter,
                            assigneeId: ticketObj.assignee,
                            reporter: resolvedReporter,
                            assignee: resolvedAssignee,
                            reporterPicture: reporterPicture,
                            assigneePicture: assigneePicture,
                            ctime: ticketObj.ctime,
                            mtime: ticketObj.mtime,
                            displayId: ticketObj.displayId,
                            projectId: ticketObj.projectId,
                            teamId: ticketObj.teamId,
                            title: ticketObj.title,
                            description: ticketObj.description,
                            status: ticketObj.status,
                            state: ticketObj.state,
                            type: ticketObj.type,
                            priority: ticketObj.priority,
                            points: ticketObj.points
                        });
                    }

                    return res.status(200).send({
                        ticketEntryComponent: common_api.pugComponents.ticketEntryComponent(),
                        ticketsList: resolvedList
                    });
                });
            });
        });
    });
}


// <exports> ------------------------------------------------
exports.activateSprint = activateSprint;
exports.closeSprint = closeSprint;
exports.createSprint = createSprint;
exports.deleteSprint = deleteSprint;
exports.getSprintComponents = getSprintComponents;
exports.getSprintsList = getSprintsList;
exports.renderSprintPage = renderSprintPage;
// </exports> -----------------------------------------------