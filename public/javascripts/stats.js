var statsFetcher;
var selectedFile;

function jellStats() {
    var url = '/api/jitsi/jellStats/';
    $('#JellStatsTable').html('');
    $.get(url).done(function (data) {
        if (data.message) {
            alert(data.message);
        } else {
            for (var i = 0; i < data.length; i++) {
                var rows = $('#JellStatsTable').html();
                $('#JellStatsTable').html(rows + '<tr>' +
                '<td style="width: 16%;text-align: center">' + data[i].client + '</td>' +
                '<td style="width: 12%;text-align:center;">' + moment(data[i].current_timestamp).format('MMMM Do YYYY') + '</td>' +
                '<td style="width: 12%;text-align:center;">' + moment(data[i].current_timestamp).format('h:mm:ss a') + '</td>' +
                '<td style="width: 12%;text-align:center;">' + data[i].conference + '</td>' +
                '<td style="width: 12%;text-align:center;">' + data[i].participants + '</td>' +
                '<td style="width:12%;text-align:center;">' + data[i].audiochannels + '</td>' +
                '<td style="width: 12%;text-align:center;">' + data[i].videochannels + '</td>' +
                '<td style="width: 12%;text-align:center;">' + data[i].videostreams + '</td>' +
                '</tr>');
            }
        }
    });
}

function getStats() {
    $.get('/api/jitsi/stats').done(function (data) {
        if (data.message) {
            console.log("stas error", data.message);
            alert(data.message);
        } else {
            $('#statsTable').prepend('<tr>' +
            '<td style="width: 10%;text-align:center;">' + moment(data.current_timestamp).format('MMMM Do YYYY') + '</td>' +
            '<td style="width: 7%;text-align:center;">' + moment(data.current_timestamp).format('h:mm:ss a') + '</td>' +
            '<td style="width: 7%;text-align:center;">' + data.participants + '</td>' +
            '<td style="width:6%;text-align:center;">' + data.audiochannels + '</td>' +
            '<td style="width: 7%;text-align:center;">' + data.bit_rate_download + '</td>' +
            '<td style="width: 7%;text-align:center;">' + data.bit_rate_upload + '</td>' +
            '<td style="width: 8%;text-align:center;">' + data.conferences + '</td>' +
            '<td style="width: 6%;text-align:center;">' + data.cpu_usage + '</td>' +
            '<td style="width: 8%;text-align:center;">' + data.graceful_shutdown + '</td>' +
            '<td style="width: 4.5%;text-align:center;">' + data.rtp_loss + '</td>' +
            '<td style="width: 5%;text-align:center;">' + data.threads + '</td>' +
            '<td style="width: 5.5%;text-align:center;">' + data.total_memory + '</td>' +
            '<td style="width: 5.5%;text-align:center;">' + data.used_memory + '</td>' +
            '<td style="width: 6.5%;text-align:center;">' + data.videochannels + '</td>' +
            '<td style="width: 7%;text-align:center;">' + data.videostreams + '</td>' +
            '</tr>');
        }
    });
}

function getConference() {
    $.get('/api/jitsi/conferences', function (data) {
        $('#conferenceTab').html('');
        $.each(data, function (key, value) {
            $.get('/api/jitsi/conferences/id/' + value.id, function (result) {
                var _length = (result.contents && result.contents[0].channels && result.contents[0].channels.length) ? result.contents[0].channels.length : 0;
                $('#conferenceTab').prepend('<tr>' +
                '<td style="width: 20%">' + value.id + ' </td>' +
                '<td style="width: 20%">' + _length + '</td>' +
                '<td style="width: 20%"><a href="#audio" id="audio-' + key + '"  data-toggle="modal">' + 'Audio' + '</a></td>' +
                '<td style="width: 20%"><a href="#video" id="video-' + key + '" data-toggle="modal">' + 'Video' + '</a></td>' +
                '<td style="width: 20%"><a href="#data" id="data-' + key + '" data-toggle="modal">' + 'Data' + '</a></td>' +
                '</tr>');

                var datadisplay = function (resultdata) {
                    return function () {
                        $('#audioresult').empty();
                        $('#videoresult').empty();
                        $('#dataresult').empty();
                        $.each(resultdata.contents, function (key, value) {
                            if (value.name == 'audio') {
                                $.each(value.channels, function (i, val) {
                                    $('#audioresult').append('<tr>' +
                                        '<td style="width:10%;text-align:center;">' + val.endpoint + ' </td>' +
                                        '<td style="width:10%;text-align:center;">' + val['channel-bundle-id'] + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val.sources + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val['rtp-level-relay-type'] + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val.expire + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val.initiator + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val.ssrcs + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val.id + '</td>' +
                                        '<td style="width:10%;text-align:center;">' + val.direction + '</td>' +
                                        '</tr>'
                                    );
                                })

                            }

                            if (value.name == 'video') {
                                $.each(value.channels, function (i, val) {
                                    $('#videoresult').append('<tr>' +
                                        '<td style="width:7%;text-align:center;">' + val.endpoint + ' </td>' +
                                        '<td style="width:7%;text-align:center;">' + val['channel-bundle-id'] + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val.sources + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val['rtp-level-relay-type'] + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val.expire + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val.initiator + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val.ssrcs + '</td>' +
                                        '<td style="width:14%;text-align:center;">' + val.id + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val['simulcast-mode'] + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val['receive-simulcast-layer'] + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val.direction + '</td>' +
                                        '<td style="width:7%;text-align:center;">' + val['last-n'] + '</td>' +
                                        '</tr>'
                                    );
                                })

                            }

                            if (value.name == 'data') {
                                $.each(value.sctpconnections, function (i, val) {
                                    $('#dataresult').append('<tr>' +
                                        '<td >' + val.endpoint + ' </td>' +
                                        '<td >' + val['channel-bundle-id'] + '</td>' +
                                        '<td ">' + val.port + '</td>' +
                                        '<td >' + val.expire + '</td>' +
                                        '<td >' + val.initiator + '</td>' +
                                        '<td >' + val.id + '</td>' +
                                        '</tr>'
                                    );
                                })

                            }
                        });

                    }
                }(result);


                $.each(result.contents, function (index, value) {
                    if (value.name == 'audio') {
                        $('#audio-' + key).click(datadisplay);
                    }
                    else if (value.name == 'video') {
                        $('#video-' + key).click(datadisplay);
                    }
                    else if (value.name == 'data') {
                        $('#data-' + key).click(datadisplay);
                    }
                })


            })

        });


    })
}

function loadBackupList() {
    $("#bak-list").html("Loading backups...");
    $.get('/api/jitsi/config/bak/' + selectedFile.id, function (data) {
        if (data.length == 0) {
            $("#bak-list").html("No backup yet");
        } else {
            var listHtml = '';
            $.each(data, function (ix, val) {
                listHtml += "<li class='list-group-item'><a href='#' onclick=loadBackup('" + val.name + "')>" + val.name + " - " + val.time + "</a></li>"
            });
            $("#bak-list").html("<ul class='list-group'>" + listHtml + "</ul>");
        }
    }).fail(function () {
        $("#bak-list").html("Error in fetching backup list");
    });
}

function loadConfigTimestamp() {
    $("#config-file-timestamp").html('');
    $.get('/api/jitsi/config/current/' + selectedFile.id, function (data) {
        if (data) {
            $("#config-file-timestamp").html(' - ' + data.time);
        }
    })
}

function loadBackup(fileName) {
    $("#configText").val("");
    disableGetSet("Loading " + (fileName ? fileName : selectedFile.fileName) + "...");
    $.get('/api/jitsi/config/content/' + selectedFile.id + '/' + (fileName ? fileName : ''), function (data) {
        $("#configText").val(data);
        enableGetSet("Currently loaded file: <strong>" + (fileName ? fileName : selectedFile.fileName) + "</strong>");
    }).fail(function () {
        enableGetSet("Error in loading config");
    });
}

function disableGetSet(loaderMessage) {
    $("#getSetLoader").html(loaderMessage);
    $("#configText").attr("readonly", "readonly");
    $("#saveConfig").attr("disabled", "disabled");
}

function enableGetSet(loaderMessage) {
    $("#getSetLoader").html(loaderMessage);
    $("#configText").removeAttr("readonly");
    $("#saveConfig").removeAttr("disabled");
}

$('document').ready(function () {

    jellStats();
    statsFetcher = setInterval(function () {
        console.log(refreshInterval,"refreshInterval");
        jellStats();
    }, refreshInterval*1000);

    getStats();
    statsFetcher = setInterval(function () {
        getStats();
    }, refreshInterval*1000 );

    $("#conferenceBtn").click(function () {
        getConference();
        statsFetcher = setInterval(function () {
            getConference();
        }, refreshInterval*5000);
    });

    $(".configBtn").click(function (e) {
        clearInterval(statsFetcher);
        var fileId = $(e.target).attr('data-fileId');
        selectedFile = _.select(configFiles, function (file) {
            return file.id == fileId;
        })[0];
        $(".configFileName").html(selectedFile.fileName);
        loadBackup();
        loadBackupList();
        loadConfigTimestamp();
    });

    $("#saveConfig").click(function () {
        disableGetSet("Saving to " + selectedFile.fileName + "...");
        $.post("/api/jitsi/config/save/" + selectedFile.id, {
            config: $("#configText").val()
        }, function (data) {
            enableGetSet("Saved successfully");
            loadBackupList();
            loadConfigTimestamp();
        }).fail(function () {
            enableGetSet("Error in saving config");
        });
    });

    /**
     * On click of configuration button hide the form and display the list of users
     */

    $("#configurationBtn").click(function () {
        $('#addUserPage').hide();
        $('#refreshInterval').hide();
        //$('#conFigFilesList').hide();
        $('#showAllUsersBtn').click();
    });

    /**
     * On click of "Users" check if it's hidden or not, hit the api only if it's hidden
     */

    $("#showAllUsersBtn").click(function () {
        $('input').removeClass('error');
        $('.spanClass').css('display', 'none');
        $('#username').val('').attr('autocomplete', 'off');
        $('#firstname').val('').attr('autocomplete', 'off');
        $('#lastname').val('').attr('autocomplete', 'off');
        $('#password').val('').attr('autocomplete', 'off');
        if ($('#AllUsersList').is(':hidden') == true) {
            $('#addUserPage').hide();
            $('#refreshInterval').hide();
            //$('#conFigFilesList').hide();
            $('#AllUsersList').show();
            getAllUsers();
        }
    });

    /**
     * On click of "Add user" display the form and hide the list
     */

    $('#addUserBtn').click(function () {
        $('#clientSelectBox').html('');
        $('#loaderList').css('display', 'block');
        $.get('/api/jitsi/clientKeys').done(function (data) {
            if (data.message) {
                alert(data.message);
            } else {
                var keys = data.ApiKey;
                $.each(keys, function (i, key) {
                    $('#clientSelectBox').append($('<option>', {
                        value: key.clientKey,
                        text: key.clientName
                    }));
                });
                $('#loaderList').css('display', 'none');
                $('#AllUsersList').hide();
                $('#refreshInterval').hide();
              //  $('#conFigFilesList').hide();
                $('#addUserPage').show();
            }
        });
    });

    /**
     * On click of 'refresh interval'
     */

    $('#refreshIntervalBtn').click(function () {
        $('#refreshInterval').show();
        $('#addUserPage').hide();
       // $('#conFigFilesList').hide();
        $('#AllUsersList').hide();

    });
    //
    ///**
    // * on click of 'config files'
    // */
    //
    //$('#configFilesBtn').click(function () {
    //    getFiles();
    //    $('#conFigFilesList').show();
    //    $('#refreshInterval').hide();
    //    $('#addUserPage').hide();
    //    $('#AllUsersList').hide();
    //
    //});

});

/**
 * Display tabs on the basis of role
 */

(function () {
    $.get('/api/jitsi/userProfile', function (data) {
        if (data.role == 'ROLE_ADMIN') {
            $('#statsTab').css('visibility', 'visible');
            $('.configFiles').css('visibility', 'visible');
            $('#configurationTab').css('visibility', 'visible');
        } else if (data.message) {
            alert(data.message);
        }
    })
})();

/**
 * Get the list of all users
 */

function getAllUsers() {
    $.get('/api/jitsi/allUsers', function (users) {
        if (users.Users.length > 0) {
            $('#usersListTab').html('');
            for (var i = 0; i < users.Users.length; i++) {
                var rows = $('#usersListTab').html();
                $('#usersListTab').html(rows + '<tr>' +
                '<td style="width: 20%;text-align:center;">' + users.Users[i].userName + '</td>' +
                '<td style="width: 20%;text-align:center;">' + users.Users[i].firstName + '</td>' +
                '<td style="width: 19%;text-align:center;">' + users.Users[i].lastName + '</td>' +
                '<td style="width: 19%;text-align:center;">' + users.Users[i].role + '</td>' +
                '<td style="width: 19%;text-align:center;">' + users.Users[i].clientName + '</td>' +
                '<td style="width: 3%;text-align:center;" >' + '<div class="deleteUser" data-name = ' + users.Users[i].userId + ' >' +
                '<span style="cursor: pointer;color: red;" class="glyphicon glyphicon-remove" onmouseover="changeCss()"> ' +
                '</span>' +
                '</div>' +
                '</td>' +
                '</tr>')
            }
        } else if (users.message) {
            alert(users.message);
        }
        else {
            alert("No Users");
        }
    })
}

/**
 * Hit "Add user" api only if required fields are not empty
 */

function addUser() {
    var userObj = {
        url: '/api/jitsi/addUser',
        username: $('#username').val(),
        firstname: $('#firstname').val(),
        lastname: $('#lastname').val(),
        password: $('#password').val(),
        role: $('#role').val(),
        client: $('#clientSelectBox').val()

    };

    if (userObj.firstname == '' || userObj.lastname == '' || userObj.username == '' || userObj.password == '') {
        if (userObj.firstname == '') {
            $("#firstname").addClass('error');
            $('#firstNameSpan').css('display', 'block');
        } else {
            $('#firstname').removeClass('error');
        }
        if (userObj.lastname == '') {
            $("#lastname").addClass('error');
            $('#lastNameSpan').css('display', 'block');
        } else {
            $('#lastname').removeClass('error');
        }
        if (userObj.username == '') {
            $("#username").addClass('error');
            $('#userNameSpan').css('display', 'block');
        } else {
            $('#username').removeClass('error');
        }
        if (userObj.password == '') {
            $('#password').addClass('error');
            $('#passwordSpan').css('display', 'block');
        } else {
            $('#password').removeClass('error');
        }
    } else {
        if (userObj.role == 'ROLE_ADMIN') {
            if (($('#clientSelectBox').val() != 'admin123')) {
                alert("Client name should be 'admin' ")
            } else {
                addUserFunction(userObj);
            }
        }
        else if (userObj.role == 'ROLE_USER') {
            if (($('#clientSelectBox').val() == 'admin123')) {
                alert("Client name can't be 'admin' ")
            } else {
                addUserFunction(userObj);
            }
        }

    }
}

/**
 * On blur of username text field
 */

function usernameBlur() {
    if ($('#username').val() == '') {
        $('#username').addClass('error');
        $('#userNameSpan').css('display', 'block');

    } else {
        $('#username').removeClass('error');
        $('#userNameSpan').css('display', 'none');
    }
}

/**
 * On blur of firstname text field
 */

function firstNameBlur() {
    if ($('#firstname').val() == '') {
        $('#firstname').addClass('error');
        $('#firstNameSpan').css('display', 'block');
    } else {
        $('#firstname').removeClass('error');
        $('#firstNameSpan').css('display', 'none');
    }
}

/**
 * On blur of lastname text field
 */

function lastNameBlur() {
    if ($('#lastname').val() == '') {
        $('#lastname').addClass('error');
        $('#lastNameSpan').css('display', 'block');
    } else {
        $('#lastname').removeClass('error');
        $('#lastNameSpan').css('display', 'none');
    }
}

/**
 * On blur of password  field
 */

function passwordBlur() {
    if ($('#password').val() == '') {
        $('#password').addClass('error');
        $('#passwordSpan').css('display', 'block');
    } else {
        $('#password').removeClass('error');
        $('#passwordSpan').css('display', 'none');

    }
}

/**
 * First confirm , then delete the user on the basis of ID
 */

$(document).on('click', '.deleteUser', function () {
    var id = $(this).attr('data-name');
    var flag = confirm("Are you sure");
    if (flag == true) {
        $('#loaderList').css('display', 'block');
        var url = '/api/jitsi/deleteUser/' + id;
        $.get(url).done(function (data) {
                if (data.deleteMessage) {
                    alert(data.deleteMessage);
                    $('#loaderList').css('display', 'none');
                }
                else if (data.message) {
                    alert(data.message);
                }
                else {
                    alert("User Deleted");
                    $('#AllUsersList').hide();
                    $('#AllUsersList').show();
                    getAllUsers();
                    $('#loaderList').css('display', 'none');
                }
            }
        )
    }
});

/**
 * Change the color of delete button on hover
 */

function changeCss() {
    $(this).css('color', '#00B7FF');
}

function addUserFunction(userObj) {
    $('#loader').css('display', 'block');
    var data = {
        userName: userObj.username,
        firstName: userObj.firstname,
        lastName: userObj.lastname,
        password: userObj.password,
        role: userObj.role,
        clientKey: userObj.client
    };
    $.ajax({
        url: userObj.url,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data) {
        if (data.message) {
            alert(data.message);
        } else {
            $('#loader').css('display', 'none');
            $('#showAllUsersBtn').click();
        }
    });
}

/**
 * set the refresh interval
 */

function setRefreshInterval(){
    var refreshInterval  = $('#newRefreshInterval').val();
    var url = '/api/jitsi/setRefreshInterval/' + refreshInterval;
    $.get(url).done(function(data){
        console.log(data.message);
    })
}

/**
 * Display config files
 */

//function getFiles() {
//    $('#configFilesListTab').html('');
//    for (var i = 0; i < configFiles.length; i++) {
//        var rows = $('#configFilesListTab').html();
//        $('#configFilesListTab').html(rows + '<tr>' +
//        '<td style="width: 21%;text-align:center;">' + configFiles[i].id + '</td>' +
//        '<td style="width: 21%;text-align:center;" class="editAble'+ configFiles[i].id +'" id ="path'+configFiles[i].id+'">' + configFiles[i].path + '</td>' +
//        '<td style="width: 21%;text-align:center;" class="editAble'+ configFiles[i].id +'" id ="fileName'+configFiles[i].id+'">' + configFiles[i].fileName + '</td>' +
//        '<td style="width: 21%;text-align:center;" class="editAble'+ configFiles[i].id +'" id ="backupFolderName'+configFiles[i].id+'">' + configFiles[i].backupFolderName + '</td>' +
//        '<td style="width: 8%;text-align:center;" >'  +'<div class="makeEditable" data-id = ' + configFiles[i].id + ' >' +
//        '<span style="cursor: pointer;color: red;" class="glyphicon glyphicon-edit"> ' +
//        '</span>' +
//        '</div>'+
//        '</td>' +
//        '<td style="width: 8%;text-align:center;" >'  +'<div class="save" data-id = ' + configFiles[i].id + ' >' +
//        '<span style="cursor: pointer;color: red;" class="glyphicon glyphicon-ok" '  +
//        '</span>' +
//        '</div>'+
//        '</td>' +
//        '</tr>')
//    }
//}
//
//$(document).on('click','.makeEditable',function(){
//   var id = $(this).attr('data-id');
//    //var htmlPath = $('.editPath'+ id +'').html();
//    //var input = $('<input type="text" />');
//    //input.val(htmlPath);
//    //$('.editPath'+ id +'').replaceWith(input);
//    //
//    //
//    //var htmlFileName = $('.editFileName'+ id +'').html();
//    //var input = $('<input type="text" />');
//    //input.val(htmlFileName);
//    //$('.editFileName'+ id +'').replaceWith(input);
//    //
//    //var htmlBackupFolderName = $('.editbackupFolderName'+ id +'').html();
//    //var input = $('<input type="text" />');
//    //input.val(htmlBackupFolderName);
//    //$('.editbackupFolderName'+ id +'').replaceWith(input);
//
//
//    $('#configFilesListTab td').attr('contenteditable','false');
//    $('#configFilesListTab td').css('border','1px solid #ccc');
//    $('.editAble'+ id +'').attr('contenteditable','true');
//    $('.editAble'+ id +'').css('border','3px solid #808080');
//});
//
//$(document).on('click','.save',function(){
//    var id = $(this).attr('data-id');
//    var configFilesUpdated = {
//        path: $('#path'+id+'').text(),
//        fileName:$('#fileName'+id+'').text(),
//        backupFolderName:$('#backupFolderName'+id+'').text()
//    };
//    if($('.editAble'+ id +'').is("[contenteditable='true']")){
//    }
//});
//
//function setRefreshInterval() {
//    refreshInterval = $('#newRefreshInterval').val();
//    console.log("Inside save function", refreshInterval);
//    $('#newRefreshInterval').val(refreshInterval || 5);
//    return refreshInterval;
//}



