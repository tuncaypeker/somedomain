const instagram = (function () {

    const variables = {
        "element": {
            "getData": "/Instagram/GetData",
            "getAccountData": "/Instagram/GetAccountData",
            "addLocation": "/Instagram/InsertLocation",
            "dataId": 0,
            "dataType": "",
            ajax_settings: {
                type: "GET"
            },
        }
    };
    function bindEvents() {
        $("body").on("click", ".load-data", dataLoader);
        $("body").on("click", "#nextPath", loadNextData);
        $("body").on("click", ".addLocation", AddLocation);
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
        if (variables.element.dataId !== 0) {
            layoutJsHelper.showBlock();
            if (id === "") console.log("idboş");

            variables.element.ajax_settings.url = variables.element.getData;
            var postData = {};
            postData.id = variables.element.dataId;
            postData.type = variables.element.dataType;
            postData.nextPath = "";
            variables.element.ajax_settings.data = postData;
            variables.element.ajax_settings.type = "POST";
            helpers.ajaxHelper(variables.element.ajax_settings, function (data) {
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
            variables.element.ajax_settings.url = variables.element.getAccountData;
            helpers.ajaxHelper(variables.element.ajax_settings, function (data) {
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

    function Template(data, isNext) {
        let html = "";
        html += '<div class="grid" style="width:100%;">';
        for (k in data.Medias) {
            var item = data.Medias[k];

            html += '<div class="col-xl-3 col-sm-6 float-left">' +
                '<div class="card">' +
                '<div class="card-header border-bottom p-2 mb-2">' +
                '<div class="media">' +
                '<div class="mr-3">' +
                '<img src="' + item.User.Avatar.Path + '" width="38" height="38" class="rounded-circle" alt="">' +
                '</div>' +
                '<div class="media-body">' +
                '<div class="media-title font-weight-semibold">' + item.User.FullName + '</div>' +
                '<div class="font-size-xs opacity-50">' +
                item.User.Username +
                '</div>' +
                '</div>' +
                '<div class="ml-3 align-self-center">' +
                '<a href="https://www.instagram.com/p/' + item.Code + '/" target="_blank" class="text-dark"><i class="icon-arrow-right5 icon-2x"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="card-body overflow-hidden text-center">' +
                '<div class="card-img-actions d-inline-block mb-3">' +
                '<a href="' + item.ImageHigh.Path + '" data-popup="lightbox">' +
                '<img async src="' + item.ImageLow.Path + '" height="170">' +
                '</a>' +
                '</div>' +
                '<div class="row">' + item.Caption.Text + '</div>' +
                '</div>';
            if (item.Location !== null) {
                html += '<div class="card-body overflow-hidden text-center">' +
                    '<span class="m-0 mr-3">' + item.Location.Name + '</span>' +
                    '<span class="addLocation" data-id="' + item.Location.Id + '" data-name="' + item.Location.Name + '" data-long="' + item.Location.Longitude + '" data-lat="' + item.Location.Latitude + '"><i class="icon-floppy-disk cursor-pointer"></i></span>' +
                    '</div>';
            }
            html += '<div class="card-footer text-center p-2">' +
                '<div class="list-icons list-icons-extended">' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-bubbles4 mr-2"></i>' +
                '<span class="d-md-none ml-2">Yorumlar</span>' +
                item.CommentCount +
                '</span>' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-heart5 mr-2"></i>' +
                '<span class="d-md-none ml-2">Beğeni</span>' +
                item.LikeCount +
                '</span>' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-share3 mr-2"></i>' +
                '<span class="d-md-none ml-2">Paylaşım</span>' +
                item.ShareCount +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }

        if (isNext === true) {
            $(".page-item").attr("data-next", data.NextPath).attr("id", "nextPath");
        }
        else {
            $(".page-item").css("display", "none!important");
        }

        html += "</div>";
        return html;
    }

    function TemplateAppend(data, isNext) {
        let html = "";
        for (k in data.Medias) {
            var item = data.Medias[k];
            html += '<div class="col-xl-3 col-sm-6 float-left">' +
                '<div class="card">' +
                '<div class="card-header border-bottom p-2 mb-2">' +
                '<div class="media">' +
                '<div class="mr-3">' +
                '<img src="' + item.User.Avatar.Path + '" width="38" height="38" class="rounded-circle" alt="">' +
                '</div>' +
                '<div class="media-body">' +
                '<div class="media-title font-weight-semibold">' + item.User.FullName + '</div>' +
                '<div class="font-size-xs opacity-50">' +
                item.User.Username +
                '</div>' +
                '</div>' +
                '<div class="ml-3 align-self-center">' +
                '<a href="https://www.instagram.com/p/' + item.Code + '/" target="_blank" class="text-dark"><i class="icon-arrow-right5 icon-2x"></i></a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="card-body overflow-hidden text-center">' +
                '<div class="card-img-actions d-inline-block mb-3">' +
                '<a href="' + item.ImageHigh.Path + '" data-popup="lightbox">' +
                '<img async src="' + item.ImageLow.Path + '" height="170">' +
                '</a>' +
                '</div>' +
                '<div class="row">' + item.Caption.Text + '</div>' +
                '</div>';
            if (item.Location !== null) {
                html += '<div class="card-body overflow-hidden text-center">' +
                    '<span class="m-0 mr-3">' + item.Location.Name + '</span>' +
                    '<span class="addLocation" data-id="' + item.Location.Id + '" data-name="' + item.Location.Name + '" data-long="' + item.Location.Longitude + '" data-lat="' + item.Location.Latitude + '"><i class="icon-floppy-disk cursor-pointer"></i></span>' +
                    '</div>';
            }
            html += '<div class="card-footer text-center p-2">' +
                '<div class="list-icons list-icons-extended">' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-bubbles4 mr-2"></i>' +
                '<span class="d-md-none ml-2">Yorumlar</span>' +
                item.CommentCount +
                '</span>' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-heart5 mr-2"></i>' +
                '<span class="d-md-none ml-2">Beğeni</span>' +
                item.LikeCount +
                '</span>' +
                '<span class="navbar-nav-link caret-0 text-grey">' +
                '<i class="icon-share3 mr-2"></i>' +
                '<span class="d-md-none ml-2">Paylaşım</span>' +
                item.ShareCount +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
        if (isNext) {
            $(".page-item").attr("data-next", data.NextPath).attr("id", "nextPath");
        }
        return html;
    }

    function AddLocation() {
        let id = $(this).attr("data-id");
        let long = $(this).attr("data-long");
        let lati = $(this).attr("data-lat");
        let name = $(this).attr("data-name");
        variables.element.ajax_settings.url = variables.element.addLocation;
        var postData = {};
        postData.Locid = id;
        postData.Loclong = long;
        postData.Loclat = lati;
        postData.Locname = name;
        variables.element.ajax_settings.data = postData;
        variables.element.ajax_settings.type = "POST";
        helpers.ajaxHelper(variables.element.ajax_settings, function (data) {
            if (data.IsSucceed) {
                new PNotify({
                    title: 'Başarılı',
                    text: 'Lokasyon başarı ile kaydedildi.',
                    addclass: 'alert alert-success alert-styled-right',
                    type: 'success'
                });
            }
            else {
                new PNotify({
                    title: 'Hata',
                    text: data.Messages[0],
                    addclass: 'alert alert-warning alert-styled-right',
                    type: 'error'
                });
            }
        });
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