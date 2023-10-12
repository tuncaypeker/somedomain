const helpers = (function () {

    const variables = {
        'elements': $(document),
    };

    const services = {
        "api": {
            "base": "http://localhost:54090/",
        }
    };

    const tokenCheck = () => {
        if (variables.app_token) return true;
        else { return location.href = "login.html"; }
    };

    const ajaxHelper = (settings, callback) => {
        let returnOBJ = {};
        $.ajax(settings)
            .done(function (e) {
                returnOBJ.error = false;
                returnOBJ.code = "";
                returnOBJ.data = e;
                callback(e);
            })
            .fail(function (e) {
                returnOBJ.error = true;
                returnOBJ.code = "1";
                returnOBJ.data = "";
                callback(e);
            });
    };

    return {
        tokenCheck: tokenCheck,
        ajaxHelper: ajaxHelper,
        services: services,
    }
}());