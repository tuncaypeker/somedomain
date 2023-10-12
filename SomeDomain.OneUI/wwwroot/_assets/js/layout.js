!(function () {
    const app = {
        "element": {
            "get_request": "/Request/GetSideRequests",
            "minRequest": 0,
            "lastUnApproved": 0,
            "ringDoubleCount": 0,
            "ringCount": 0,
            ajax_settings: {
                type: "GET"
            },
        },


        bindEvents: () => {
        },

        ringBell: () => {
            var urlSound = '';
            if (type == 1) {
                urlSound = '/_assets/audio/bell.mp3';
            }
            else {
                urlSound = '/_assets/audio/bell_uzun.mp3';
            }
            $("#myAudioElement").attr('src', urlSound);
            $("#myAudioElement")[0].pause();
            $("#myAudioElement")[0].play();
        },

        OpenSocket: () => {
            let socket = new WebSocket("ws://socket.hotpera.com:82/?token=@SessionHelper.CurrentEmployee.WebSocketToken");
            socket.onopen = function (e) {
                console.log("Sockete Bağlandı.");
            };
            socket.onmessage = function (event) {
                var message = event.data;
                if (message == "cmd:update") {
                    app.ShowInfoMessage();
                    app.GetSideRequests();
                }
                else {
                    $("#side").find(".sticky-top-side").html(event.data);
                }
            };

            socket.onclose = function (event) {
                if (event.wasClean) {
                    console.log("Bağlantı sorunsuz kapatıldı, code=" + event.code + " reason=" + event.reason);
                } else {
                    console.log('Bağlantı koptu');
                }
            };

            socket.onerror = function (error) {
                console.log("Hata: " + error.message);
            };
        },

        getRequests: () => {
            app.element.ajax_settings.url = app.element.get_request;
            helper.ajax(app.element.ajax_settings, function (e) {
                if (e.data.sideRequests != null) {
                    app.element.minRequest = localStorage.getItem('lastRequest');
                    app.element.lastUnApproved = localStorage.getItem('lastUnApproved');

                    console.log(app.element.minRequest);
                    console.log(app.element.lastUnApproved);

                    e.data.sideRequests.forEach(function (element) {
                        if (element.Status == 50) {
                            console.log(element);
                            if (element.Id > app.element.minUnApproved) {
                                app.element.minUnApproved = element.Id;
                            }
                        }
                        else {
                            if (element.Id > app.element.minRequest) {
                                app.element.minRequest = element.Id;
                            }
                        }
                    });

                    localStorage.setItem("lastRequest", app.element.minRequest);
                    localStorage.setItem('lastUnApproved', app.element.minUnApproved);

                    $(".requestList").html(template.Requests(e.data.sideRequests));
                    $(".requestCount").html(e.data.sideRequests.length);
                }
            });
        },

        ShowInfoMessage: () => {
            $("#infoMessage").css("visibility", "visible");
            setTimeout(function () {
                app.HideInfoMessage()
            }, 2000);
        },

        HideInfoMessage: () => {
            $("#infoMessage").css("visibility", "collapse");
        },

        init: () => {
            app.OpenSocket();
            app.getRequests();
        }

    }
    const template = {
        Requests: (itm) => {
            let html = "", lastRequest, lastUnApproved, status;
            lastRequest = localStorage.getItem('lastRequest');
            lastUnApproved = localStorage.getItem('lastUnApproved');

            for (let k in itm) {
                let item = itm[k];
                status = item.Status;
                if (status == 45 || status == 50) {
                    html += "<li class='media'>" +
                        "<div class='mr-3'>" +
                        "<a href=" + item.DetailPath + " class='btn bg-transparent border-primary text-primary rounded-round border-2 btn-icon'>" +
                        "<i class='icon-primitive-dot'></i>" +
                        "</a>" +
                        "</div>" +
                        "<div class='media-body'>" +
                        "Drop the IE <a href='#'>specific hacks</a> for temporal inputs" +
                        "<div class='text-muted font-size-sm mb-2'>4 minutes ago</div>" +
                        "<a href='javascript:void(0);' class='mr-1'>" +
                        "<input type='button' onclick='SetUnAprovedStatus(" + ids + ", 1," + status + ");' style='margin:5px;width:84px;' value='@L.CONFRIM' class='btn btn-success btn-sm' />" +
                        "</a>" +
                        "<a href='javascript:void(0);' class='mr-1'>" +
                        "<input type='button' onclick='SetUnAprovedStatus(" + ids + ", 0," + status + ");' style='margin:5px;width:84px;' value='@L.REJECT' class='btn btn-danger btn-sm' />" +
                        "</a>" +
                        "<a href='/Guest/Edit/" + item.GuestId + "'  class='btn btn-warning btn-sm'>@L.EDIT</a>" +
                        "</div>" +
                        "</li>";
                }
                else {
                    html += "<li class='media'>" +
                        "<div class='mr-3'>" +
                        "<a href=" + item.DetailPath + " class='btn bg-transparent text-primary btn-icon'>" +
                        item.StatusIcon +
                        "</a>" +
                        "</div>" +
                        "<div class='media-body'>" +
                        item.RoomNumber + " Numaralı odadan gelen " + item.Summary + " talebi alındı." +
                        "<div class='text-muted font-size-sm'>Oluşturulma zamanı : " + item.CreateTime + "</div>" +
                        "</div>" +
                        "</li>";
                }

                if (status === 50) {
                    if (item.Id > lastUnApproved) {
                        app.ringBell(2);
                        $.getJSON("/Request/GetRequestNotification", function () { });
                        ringDoubleCount++;
                    }
                }
                else {
                    if (item.Id > lastRequest) {
                        app.ringBell(1);
                        $.getJSON("/Request/GetRequestNotification", function () { });
                        ringCount++;
                    }
                }

                for (var i = 0; i < app.element.ringDoubleCount; i++) {
                    app.ringBell(2);
                }
                for (var i = 0; i < app.element.ringCount; i++) {
                    app.ringBell(1);
                }
            }

            return html;
        }
    }
    const helper = {
        ajax: (settings, callback) => {
            let returnOBJ = {};
            $.ajax(settings)
                .done(function (e) {
                    returnOBJ.error = false;
                    returnOBJ.code = "";
                    returnOBJ.data = e;
                    callback(returnOBJ);
                })
                .fail(function (e) {
                    returnOBJ.error = true;
                    returnOBJ.code = "1";
                    returnOBJ.data = "";
                    callback(returnOBJ);
                });
        },
    }
    app.init();
}
    ());