var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config');
var JITSI_PASSWORD = config.get('password');

router.get('/login', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        res.redirect('/jitsi/stats');
    } else {
        res.render('login', {});
    }
});

router.post('/login', function (req, res, next) {
    var serverUrl = config.get('jitsiConf.thinAppServerURL');
    var _url = serverUrl + 'oauth/token?grant_type=password&client_id=myuser&client_secret=secret&username=' + req.body.username + '&password=' + req.body.password;
    request({url: _url, method: 'GET'}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body);
            /*res.setHeader('bearer', info.value);
             res.redirect('http://10.1.22.51:8080/JellRTCAdminServer/user');*/
            req.session.jitsiLoggedIn = true;
            req.session.refreshInterval = req.body.refreshInterval;
            req.session.token = info.value;

            if (req.session.jitsiLoggedIn) {
                var serverUrl = config.get('jitsiConf.thinAppServerURL');
                var url = serverUrl + 'user/getUserProfile';
                request.get({
                    url: url,
                    headers: {
                        "Authorization": 'Bearer ' + req.session.token
                    }
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200){
                        req.session.user = body;
                        res.redirect('/jitsi/stats');
                    }
                    else {
                        if (response)
                            console.log('Error user profile', response.statusCode);
                        else
                            console.log(error,'user profile');
                    }
                });
            } else {
                res.sendStatus(401);
            }
        } else {
            res.render('login', {message: "Invalid Username/Password"})
        }
    });
    /*if (req.body.password == JITSI_PASSWORD) {
     req.session.jitsiLoggedIn = true
     req.session.refreshInterval = req.body.refreshInterval
     res.redirect('/jitsi/stats');
     } else {
     res.render('login', {message: 'Invalid Password'});
     }*/

});

router.get('/logout', function (req, res, next) {
    req.session.jitsiLoggedIn = null;
    req.session.token = '';
    res.redirect('/jitsi/login');
});

router.get('/stats', function (req, res, next) {
    if (req.session.jitsiLoggedIn) {
        res.render('stats', {
            refreshInterval:req.session.refreshInterval,
            configFiles: config.get('configFiles')
        });
    } else {
        res.redirect('/jitsi/login');
    }
});

module.exports = router;
