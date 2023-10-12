function SeoAnalysis() {
    $(".list-group li").each(function (index) {
        var value = $(this).data('div');
        var isSuccess = false;

        //rule + message
        if (value == "text_minlength") {
            if ($('.note-editable').text().split(' ').length > 300) isSuccess = true;
        }
        else if (value == "text_keyword_exist") { // anahtar kelime geçmesi gerekiyor
            var text = String($('.note-editable').text());
            var keyword = $('input#FocusKeyword').val().toLocaleUpperCase('tr-TR');
            if (keyword != '' && text.toLocaleUpperCase('tr-TR').indexOf(keyword) !== -1) isSuccess = true;
        }
        else if (value == "text_img_exist") { // anahtar kelime geçmesi gerekiyor
            var text = String($('.note-editable').html());
            if (text.indexOf("<img") !== -1) isSuccess = true;
        }
        else if (value == "text_img_alt_exist") { // anahtar kelime geçmesi gerekiyor
            var text = $('.note-editable').html();
            var $ghostDiv = $("<div/>", {
                id: 'foo'
            });
            $ghostDiv.append(text);

            var imgs = $ghostDiv.find("img");
            $.each(imgs, function (index, item) {
                var altAttr = $(item).attr("alt");
                if (altAttr !== undefined && altAttr.length > 0) isSuccess = true;
            });
        }
        else if (value == "text_img_alt_exist_keyword") { // anahtar kelime geçmesi gerekiyor
            var text = $('.note-editable').html();
            var keyword = $('input#FocusKeyword').val().toLocaleUpperCase('tr-TR');
            var $ghostDiv = $("<div/>", {
                id: 'foo'
            });
            $ghostDiv.append(text);

            var imgs = $ghostDiv.find("img");
            $.each(imgs, function (index, item) {
                var altAttr = $(item).attr("alt");
                if (altAttr !== undefined && altAttr.length > 0 && keyword != '' && altAttr.toLocaleUpperCase('tr-TR').indexOf(keyword) !== -1) {
                    isSuccess = true;
                }
            });
        }
        else if (value == "text_required") {
            if ($('.note-editable').text().length > 0) isSuccess = true;
        }
        else if (value == "pagetitle_keyword_exist") {
            var pageTitle = $("input#PageTitle").val().toLocaleUpperCase('tr-TR');
            var keyword = $('input#FocusKeyword').val().toLocaleUpperCase('tr-TR');

            if (keyword != '' && pageTitle.indexOf(keyword) !== -1) isSuccess = true;
        }
        else if (value == "pagetitle_required") {
            if ($('input#PageTitle').val().length > 0) isSuccess = true;
        }
        else if (value == "pagetitle_minlength") {
            if ($('input#PageTitle').val().length >= 25) isSuccess = true;
        }
        else if (value == "pagetitle_maxlength") { // başlığın 60-70 karakterden az olması gerekiyor.
            if ($('input#PageTitle').val().length <= 70) isSuccess = true;
        }
        else if (value == "pagedescription_required") {
            if ($('#PageDescription').val().length > 0) isSuccess = true;
        }
        else if (value == "metatitle_required") {
            if ($('input#MetaTitle').val().length > 0) isSuccess = true;
        }
        else if (value == "metatitle_minlength") {
            if ($('input#MetaTitle').val().length >= 25) isSuccess = true;
        }
        else if (value == "metatitle_maxlength") {
            if ($('input#MetaTitle').val().length <= 70) isSuccess = true;
        }
        else if (value == "metadescription_required") {
            if ($('#MetaDescription').val().length > 0) isSuccess = true;
        }
        else if (value == "metadescription_range") {
            if ($('#MetaDescription').val().length >= 80 && $('#MetaDescription').val().length <= 160) isSuccess = true;
        }
        else if (value == "keyword_required") {
            var keyword = $('input#FocusKeyword').val();

            if (keyword != '' && keyword.length > 0) isSuccess = true;
        }

        if (isSuccess) {
            $(this).removeClass("list-group-item-danger");
            $(this).addClass("list-group-item-success");

            $('#SeoAnaylsisHidden').append($(this).removeClass('selected').hide());
        }
        else {
            $(this).addClass("list-group-item-danger");
            $(this).removeClass("list-group-item-success");

            $('#SeoAnaylsis').append($(this).removeClass('selected').show());
        }
    });
}

$(document).ready(function () {
    $("ul#SeoAnaylsisHidden").click(function () {
        $("li", this).toggle();
    });
});