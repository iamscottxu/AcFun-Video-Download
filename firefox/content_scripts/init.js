$(function () {
    let loadScript_main = function () {
        loadScript('main');
    }

    let loadScript_m3u8_parser = function () {
        loadScript('m3u8-parser.min', loadScript_main);
    }

    let loadHtml_tip = function () {
        loadHtml('tip', function (result) {
            $('.qrcode-download > p').append(result);
            loadScript_m3u8_parser();
        });
    }

    let loadHtml_window = function () {
        loadHtml('window', function (result) {
            $('body').append(result);
            loadHtml_tip();
        });
    }

    let loadStyle_window = function () {
        loadStyle('window');
    }

    let loadStyle_resource = function () {
        loadStyle('resource');
    }

    if ($.cookie('userGroupLevel') >= 1 && $.cookie('auth_key_ac_sha1')) {
        loadStyle_window();
        loadStyle_resource();
        loadHtml_window();
    }

    function loadScript(scriptName, success) {
        let url = browser.extension.getURL('scripts/' + scriptName + '.js');
        $.get(url, function (result) {
            let id = scriptName.replace(/\//g, '-').replace(/\./g, '_');
            $('head').append('<script id="___script_' + id + '">' + result + '</script>');
            if (success) success();
        }, 'text');
    }

    function loadStyle(styleName, success) {
        let url = browser.extension.getURL('styles/' + styleName + '.css');
        $.get(url, function (result) {
            $('head').append('<style>' + result + '</style>');
            if (success) success();
        }, 'text');
    }

    function loadHtml(htmlName, success) {
        let url = browser.extension.getURL('html/' + htmlName + '.html');
        $.get(url, function (result) {
            if (success) success(result);
        }, 'html');
    }
});