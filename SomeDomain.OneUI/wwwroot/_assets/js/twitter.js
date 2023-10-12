const twitter = (function () {

    const variables = {
        "element": {
            "getData": "/Twitter/GetData",
            "getAccountData": "/Twitter/GetAccountData",
            "dataId": 0,
            "dataType":"", 
            ajax_settings: {
                type: "GET"
            },
        }
    };
    function bindEvents() {
        $("body").on("click", ".load-data", dataLoader);
        $("body").on("click", "#nextPath", loadNextData);
        $(".loadMoreBtn").removeClass("d-flex").addClass("d-none");
    }

    function dataLoader() {
        variables.element.dataId = $(this).attr("data-id");
        variables.element.dataType = $(this).attr("data-type");
        $(".load-data").filter(".btn-primary").removeClass("btn-primary").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-primary");
        loadData(variables.element.dataId, variables.element.dataType);
    }

    function loadData(id, type) {
        //console.log("geldi");
        if (variables.element.dataId !== 0) {
            //console.log("girdi");
            layoutJsHelper.showBlock();
            //if (id === "") console.log("idboş");
            variables.element.ajax_settings.url = variables.element.getData;
            var postData = {};
            postData.id = variables.element.dataId;
            postData.type = variables.element.dataType;
            postData.nextPath = "";
            variables.element.ajax_settings.data = postData;
            variables.element.ajax_settings.type = "POST";
            helpers.ajaxHelper(variables.element.ajax_settings, function (data) {
                //console.log(data);
                var isNext;
                if (data.NextPath !== "") { $(".loadMoreBtn").removeClass("d-none").addClass("d-flex"); isNext = true; }
                else { isNext = false; $(".loadMoreBtn").removeClass("d-flex").addClass("d-none"); }

                $(".data-result").html(Template(data, isNext));
                workMasonary(1000, 0);
                layoutJsHelper.hideBlock();
            });
        }
        else {
            layoutJsHelper.showBlock();
            variables.element.ajax_settings.type = "GET";
            variables.element.ajax_settings.url = variables.element.getAccountData;
            helpers.ajaxHelper(variables.element.ajax_settings, function (data) {
                //console.log(data);
                var isNext;
                if (data.NextPath !== "") { $(".loadMoreBtn").removeClass("d-none").addClass("d-flex"); isNext = true; }
                else { isNext = false; $(".loadMoreBtn").removeClass("d-flex").addClass("d-none"); }

                $(".data-result").html(Template(data, isNext));
                workMasonary(1000, 0);
                layoutJsHelper.hideBlock();
            });
        }
    }

    function loadNextData() {
        var next = $(this).attr("data-next");
       
        layoutJsHelper.showBlock();
        variables.element.ajax_settings.url = variables.element.getData;
        var postData = {};
        postData.id = variables.element.dataId;
        postData.type = variables.element.dataType;
        postData.nextPath = next;
        variables.element.ajax_settings.data = postData;
        variables.element.ajax_settings.type = "POST";
        helpers.ajaxHelper(variables.element.ajax_settings, function (data) {
            //console.log(data);
            var isNext;
            if (data.NextPath !== "") { $(".loadMoreBtn").removeClass("d-none").addClass("d-flex"); isNext = true; }
            else { isNext = false; $(".loadMoreBtn").removeClass("d-flex").addClass("d-none"); }
            $(".grid").append(TemplateAppend(data, isNext));
            workMasonary(1500, 1);
            $("[data-next='" + next + "']").remove();
            layoutJsHelper.hideBlock();
        });
    }

    function workMasonary(interval, again) {
        setTimeout(function () {
            var xWrapper = "grid";
            var xMasonaryElement = "col-xl-3";
            var elem = document.querySelector('.' + xWrapper);
            var msnry = new Masonry(elem, {
                itemSelector: '.' + xMasonaryElement,
            });
            if (again === 1) {
                workMasonary(3000, 0);
            }
        }, interval);
    }

    function Template(data,isNext) {
            let html = "";
            html += '<div class="grid" style="width:100%;">';
            var count = data.Statuses.length;
            //console.log(count);
            for (k in data.Statuses) {
                var item = data.Statuses[k];
                html += '<div class="col-xl-3 col-sm-6 float-left">' +
                            '<div class="card">' +
                                '<div class="card-header border-bottom p-2 mb-2">' +
                                    '<div class="media">' +
                                        '<div class="mr-3">' +
                                            '<img src="' + item.User.ImageUrlHttps + '" width="38" height="38" class="rounded-circle" alt="">' +
                                        '</div>' +
                                    '<div class="media-body">' +
                                        '<div class="media-title font-weight-semibold">' + item.User.Name + '</div>' +
                                        '<div class="font-size-xs opacity-50">' +
                                        item.User.ScreenName +
                                    '</div>' +
                                '</div>' +
                                '<div class="ml-3 align-self-center">' +
                                    '<a href="https://twitter.com/hotpera/status/' + item.Id + '/" target="_blank" class="text-dark"><i class="icon-arrow-right5 icon-2x"></i></a>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                if (item.Medias.length > 0) {
                    if (item.Medias.length > 1) {
                        html += '<div id="carouselExampleControls-' + item.Id + '" class="carousel slide" data-ride="carousel-1"><div class="carousel-inner">';
                        var counter = 0;
                        for (p in item.Medias) {
                            counter = counter + 1;
                            var media = item.Medias[p];
                            if (counter === 1) {
                                html += '<div class="card-body">' + item.Text + '</div><div class="carousel-item active">' +
                                    '<img class="d-block w-100" src="' + media.MediaUrlHttps + '" alt="First slide">' +
                                    '</div>';
                            }
                            else {
                                html += '<div class="carousel-item">' +
                                    '<img class="d-block w-100" src="' + media.MediaUrlHttps + '" alt="First slide">' +
                                    '</div>';
                            }

                        }
                        html += '</div>' +
                            '<a class="carousel-control-prev" href="#carouselExampleControls-' + item.Id + '" role="button" data-slide="prev">' +
                            '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
                            '<span class="sr-only">Previous</span>' +
                            '</a>' +
                            '<a class="carousel-control-next" href="#carouselExampleControls-' + item.Id + '" role="button" data-slide="next">' +
                            '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
                            '<span class="sr-only">Next</span>' +
                            '</a>' +
                            '</div>';
                    }
                    else {
                        var media = item.Medias[0];
                        if (media.Type === "photo") {
                            html += '<div class="card-body overflow-hidden text-center">' +
                                '<div class="card-img-actions d-inline-block mb-3">' +
                                '<a href="' + media.MediaUrlHttps + '" data-popup="lightbox">' +
                                '<img async src="' + media.MediaUrlHttps + '" height="170">' +
                                '</a>' +
                                '</div>' +
                                '<div class="row">' + item.Text + '</div>' +
                                '</div>';
                        }
                        else {
                            html += '<div class="card-body overflow-hidden text-center">' +
                                '<div class="card-img-actions d-inline-block mb-3">' +
                                '<video class="w-100" controls src="' + media.VideoUrl + '" poster="' + media.MediaUrlHttps + '">' +
                                '</div>' +
                                '<div class="row">' + item.Text + '</div>' +
                                '</div>';
                        }
                    }
                }
                else {
                    var text = "";
                    if (item.Urls.length > 0) {
                        text = item.Text.replace(item.Urls[0], "<a href='" + item.Urls[0] + "' target='_blank'>" + item.Urls[0] + "</a>");
                    }
                    else {
                        text = item.Text;
                    }
                    html += '<div class="card-body overflow-hidden text-center">' +
                        text +
                        '</div>';
                }
                html += '<div class="card-footer text-center p-2">' +
                    '<div class="list-icons list-icons-extended">' +
                    '<span class="navbar-nav-link caret-0 text-grey">' +
                    '<i class="icon-reply-all mr-2"></i>' +
                    '<span class="d-md-none ml-2">ReTweet</span>' +
                    item.RetweetCount +
                    '</span>' +
                    '<span class="navbar-nav-link caret-0 text-grey">' +
                    '<i class="icon-heart5 mr-2"></i>' +
                    '<span class="d-md-none ml-2">Favori</span>' +
                    item.FavoriteCount +
                    '</span>' +
                    '<span class="navbar-nav-link caret-0 text-grey">' +
                    '<i class="icon-share3 mr-2"></i>' +
                    '<span class="d-md-none ml-2">TimeAgo</span>' +
                    item.TimeAgo + ' ago' +
                    '</span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
            html += "</div>";

            if(data.Statuses.length === 20){
                //console.log("ss");
                $(".page-item").attr("data-next", data.Statuses[data.Statuses.length - 1].Id).attr("id", "nextPath");
            }

            return html;
        }

    function TemplateAppend(data, isNext) {
        let html = "";
        for (k in data.Statuses) {
            var item = data.Statuses[k];
            html += '<div class="col-xl-3 col-sm-6 float-left">' +
                '<div class="card">' +
                '<div class="card-header border-bottom p-2 mb-2">' +
                '<div class="media">' +
                '<div class="mr-3">' +
                '<img src="' + item.User.ImageUrlHttps + '" width="38" height="38" class="rounded-circle" alt="">' +
                '</div>' +
                '<div class="media-body">' +
                '<div class="media-title font-weight-semibold">' + item.User.Name + '</div>' +
                '<div class="font-size-xs opacity-50">' +
                item.User.ScreenName +
                '</div>' +
                '</div>' +
                '<div class="ml-3 align-self-center">' +
                '<a href="https://twitter.com/hotpera/status/' + item.Id + '/" target="_blank" class="text-dark"><i class="icon-arrow-right5 icon-2x"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>';
            if (item.Medias.length > 0) {
                if (item.Medias.length > 1) {
                    html += '<div id="carouselExampleControls-' + item.Id + '" class="carousel slide" data-ride="carousel-1"><div class="carousel-inner">';
                    var counter = 0;
                    for (p in item.Medias) {
                        counter = counter + 1;
                        var media = item.Medias[p];
                        if (counter === 1) {
                            html += '<div class="card-body">' + item.Text + '</div><div class="carousel-item active">' +
                                '<img class="d-block w-100" src="' + media.MediaUrlHttps + '" alt="First slide">' +
                                '</div>';
                        }
                        else {
                            html += '<div class="carousel-item">' +
                                '<img class="d-block w-100" src="' + media.MediaUrlHttps + '" alt="First slide">' +
                                '</div>';
                        }

                    }
                    html += '</div>' +
                        '<a class="carousel-control-prev" href="#carouselExampleControls-' + item.Id + '" role="button" data-slide="prev">' +
                        '<span class="carousel-control-prev-icon" aria-hidden="true"></span>' +
                        '<span class="sr-only">Previous</span>' +
                        '</a>' +
                        '<a class="carousel-control-next" href="#carouselExampleControls-' + item.Id + '" role="button" data-slide="next">' +
                        '<span class="carousel-control-next-icon" aria-hidden="true"></span>' +
                        '<span class="sr-only">Next</span>' +
                        '</a>' +
                        '</div>';
                }
                else {
                    var media = item.Medias[0];
                    if (media.Type === "photo") {
                        html += '<div class="card-body overflow-hidden text-center">' +
                            '<div class="card-img-actions d-inline-block mb-3">' +
                            '<a href="' + media.MediaUrlHttps + '" data-popup="lightbox">' +
                            '<img async src="' + media.MediaUrlHttps + '" height="170">' +
                            '</a>' +
                            '</div>' +
                            '<div class="row">' + item.Text + '</div>' +
                            '</div>';
                    }
                    else {
                        html += '<div class="card-body overflow-hidden text-center">' +
                            '<div class="card-img-actions d-inline-block mb-3">' +
                            '<video class="w-100" controls src="' + media.VideoUrl + '" poster="' + media.MediaUrlHttps + '">' +
                            '</div>' +
                            '<div class="row">' + item.Text + '</div>' +
                            '</div>';
                    }
                }
            }
            else {
                var text = "";
                if (item.Urls.length > 0) {
                    text = item.Text.replace(item.Urls[0], "<a href='" + item.Urls[0] + "' target='_blank'>" + item.Urls[0] + "</a>");
                }
                else {
                    text = item.Text;
                }
                html += '<div class="card-body overflow-hidden text-center">' +
                    text +
                    '</div>';
            }
            html += '<div class="card-footer text-center p-2">' +
                '<div class="list-icons list-icons-extended">' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-reply-all mr-2"></i>' +
                '<span class="d-md-none ml-2">ReTweet</span>' +
                item.RetweetCount +
                '</span>' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-heart5 mr-2"></i>' +
                '<span class="d-md-none ml-2">Favori</span>' +
                item.FavoriteCount +
                '</span>' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-share3 mr-2"></i>' +
                '<span class="d-md-none ml-2">TimeAgo</span>' +
                item.TimeAgo + ' ago' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        if (data.Statuses.length === 20) {
            $(".page-item").attr("data-next", data.Statuses[data.Statuses.length-1].Id).attr("id", "nextPath");
        }
        return html;
    }

    function init() {
        bindEvents();
        loadData();
    }

    return {
        init: init,
        workMasonary: workMasonary,
    };

}());