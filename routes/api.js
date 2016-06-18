var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var SSH = require('simple-ssh');
var config = require('config');
var _ = require('underscore');

function getSSHClient() {
    var sshParams = config.get('jitsiConf.sshParams');
    sshParams.key = fs.readFileSync(sshParams.keyLocation);
    return new SSH(sshParams);
}

router.post('/jitsi/config/save/:id', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        var ssh = getSSHClient();
        var configFiles = config.get('configFiles');
        var selectedFile = _.select(configFiles, function (file) {
            return file.id == req.params.id;
        })[0];
        var data = req.body.config;
        data = data.replace(/"/g, '\\"');
        var configBakPath = selectedFile.path + "/" + selectedFile.backupFolderName;
        var configFilePath = selectedFile.path + '/' + selectedFile.fileName;
        var cmd = 'echo "' + data + '" > ' + configFilePath;
        ssh
            .exec("mkdir -p " + configBakPath)
            .exec("rm " + configBakPath + "/" + selectedFile.fileName + ".5")
            .exec("mv " + configBakPath + "/" + selectedFile.fileName + ".4 " + configBakPath + "/" + selectedFile.fileName + ".5")
            .exec("mv " + configBakPath + "/" + selectedFile.fileName + ".3 " + configBakPath + "/" + selectedFile.fileName + ".4")
            .exec("mv " + configBakPath + "/" + selectedFile.fileName + ".2 " + configBakPath + "/" + selectedFile.fileName + ".3")
            .exec("mv " + configBakPath + "/" + selectedFile.fileName + ".1 " + configBakPath + "/" + selectedFile.fileName + ".2")
            .exec("mv " + configFilePath + " " + configBakPath + "/" + selectedFile.fileName + ".1")
            .exec(cmd, {
                out: res.send(req.body.conf),
                err: function (stderr) {
                    console.log(stderr);
                    res.sendStatus(500);
                }
            })
            .start();
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * Get Jell data for particular client
 */

router.get('/jitsi/jellStats', function (req, res) {
    if (req.session.jitsiLoggedIn) {
        var userProfile = JSON.parse(req.session.user);
        var id = userProfile.clientKey;
        var serverUrl = config.get('jitsiConf.serverUrl');
        var url = serverUrl + 'colibri/Jellstats?' + id;
        request.get({
            url: url,
            headers: {
                "Authorization": 'Bearer ' + req.session.token
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error Jell stats', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error,'Jell stats');
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * Get all the client keys
 */

router.get('/jitsi/clientKeys', function (req, res) {
    if (req.session.jitsiLoggedIn) {

        var serverUrl = config.get('jitsiConf.thinAppServerURL');
        var url = serverUrl + 'user/getClientKey';
        request.get({
            url: url,
            headers: {
                "Authorization": 'Bearer ' + req.session.token
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error clientKeys', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error,'clientKeys');
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * Stats Data-- Data of all conferences
 */

router.get('/jitsi/stats', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        var serverUrl = config.get('jitsiConf.serverUrl');
        var url = serverUrl + 'colibri/stats?admin123';
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error Stats', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error,"stats error");
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * Conference Data
 */

router.get('/jitsi/conferences', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        debugger;
        var serverUrl = config.get('jitsiConf.serverUrl');
        request(serverUrl + '/colibri/conferences?admin', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error);
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

router.get('/jitsi/conferences/id/:id', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        debugger;
        var serverUrl = config.get('jitsiConf.serverUrl')
        request(serverUrl + '/colibri/conferences' + req.params.id + '?admin', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }else {
                if (response) {
                    console.log('Error', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error);
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

router.get('/jitsi/config/current/:id', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        var ssh = getSSHClient();
        var configFiles = config.get('configFiles');
        var selectedFile = _.select(configFiles, function (file) {
            return file.id == req.params.id;
        })[0];
        ssh
            .exec('ls -l', {
                args: [selectedFile.path + '/' + selectedFile.fileName],
                out: function (stdout) {
                    var fileParts = stdout.trim().split(/ +/);
                    var fileInfo = {
                        name: selectedFile.fileName,
                        time: fileParts[5] + " " + fileParts[6] + " " + fileParts[7]
                    };
                    res.json(fileInfo);
                },
                err: function (stderr) {
                    console.log(stderr);
                    res.json([]);
                }
            })
            .start();
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

router.get('/jitsi/config/bak/:id', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        var ssh = getSSHClient();
        var configFiles = config.get('configFiles');
        var selectedFile = _.select(configFiles, function (file) {
            return file.id == req.params.id;
        })[0];
        ssh
            .exec('ls -l', {
                args: [selectedFile.path + '/' + selectedFile.backupFolderName],
                out: function (stdout) {
                    var files = stdout.trim().split("\n");
                    files.shift();
                    var result = [];
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        var fileParts = file.split(/ +/);
                        result.push({
                            name: fileParts[8],
                            time: fileParts[5] + " " + fileParts[6] + " " + fileParts[7]
                        })
                    }
                    res.json(result);
                },
                err: function (stderr) {
                    console.log(stderr);
                    res.json([]);
                }
            })
            .start();
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

router.get('/jitsi/config/content/:id/:bak?', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        var configFiles = config.get('configFiles');
        var selectedFile = _.select(configFiles, function (file) {
            return file.id == req.params.id;
        })[0];
        var configFilePath
        if (req.params.bak) {
            configFilePath = selectedFile.path + '/' + selectedFile.backupFolderName + '/' + req.params.bak
        } else {
            configFilePath = selectedFile.path + '/' + selectedFile.fileName
        }
        var ssh = getSSHClient();
        ssh
            .exec('cat', {
                args: [configFilePath],
                out: function (stdout) {
                    res.send(stdout);
                },
                err: function (stderr) {
                    console.log(stderr);
                    res.sendStatus(500);
                }
            })
            .start();
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * Add user -- only Admin can create
 */

router.post('/jitsi/addUser', function (req, res) {
    var data = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        role: req.body.role,
        clientKey: req.body.clientKey
    };
    if (req.session.jitsiLoggedIn) {
        var serverUrl = config.get('jitsiConf.thinAppServerURL');
        var url = serverUrl + 'user';
        request.post({
            url: url,
            headers: {
                "content-type": "application/json",
                "Authorization": 'bearer ' + req.session.token
            },
            body: JSON.stringify(data)
        }, function (error, response, body) {
            if (!error && response.statusCode == 201) {
                res.send(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error add user', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error,'add user');
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * List of all users -- only Admin can see
 */

router.get('/jitsi/allUsers', function (req, res) {
    if (req.session.jitsiLoggedIn) {
        var serverUrl = config.get('jitsiConf.thinAppServerURL');
        var url = serverUrl + '/user';
        request({
            url: url,
            headers: {
                "Authorization": 'bearer ' + req.session.token
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error all users', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error,'all users');
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

/**
 * Delete any particular user -- Admin can Delete
 */

router.get('/jitsi/deleteUser/:id', function (req, res) {
    var id = req.params.id;
    var userProfile = JSON.parse(req.session.user);

    if (req.session.jitsiLoggedIn) {
        if (id == userProfile.userId) {
            res.send({'deleteMessage': "Sorry you can't delete this user"})
        }
        else {
            var serverUrl = config.get('jitsiConf.thinAppServerURL');
            var url = serverUrl + '/user/' + id;
            request.del({
                url: url,
                headers: {
                    "Authorization": 'bearer ' + req.session.token
                }
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.json(JSON.stringify(body));
                }
                else {
                    if (response) {
                        console.log('Error delete', response.statusCode);
                        if (response.statusCode == 401) {
                            res.redirect('/jitsi/logout');
                        }
                    } else if (error) {
                        res.send({'message': "Sorry try again later"});
                        console.log(error,'delete');
                    }
                }
            });
        }
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }


});

/**
 * Get the current logged in user profile
 */

router.get('/jitsi/userProfile', function (req, res) {
    if (req.session.jitsiLoggedIn) {
        var serverUrl = config.get('jitsiConf.thinAppServerURL');
        var url = serverUrl + 'user/getUserProfile';
        request.get({
            url: url,
            headers: {
                "Authorization": 'Bearer ' + req.session.token
            }
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                res.json(JSON.parse(body));
            }
            else {
                if (response) {
                    console.log('Error user profile', response.statusCode);
                    if (response.statusCode == 401) {
                        res.redirect('/jitsi/logout');
                    }
                } else if (error) {
                    res.send({'message': "Sorry try again later"});
                    console.log(error , 'user profile');
                }
            }
        });
    } else {
        res.sendStatus(401);
        res.redirect('/jitsi/logout');
    }
});

module.exports = router;
