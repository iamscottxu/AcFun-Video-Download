$(function () {
    let videoInfo = {
        videoId: pageInfo.videoId ? pageInfo.videoId : (bgmInfo.videoId ? bgmInfo.videoId : pageInfo.video.videos[0].videoId),
        coverImage: pageInfo.coverImage ? pageInfo.coverImage : (bgmInfo.image ? bgmInfo.image : pageInfo.video.videos[0].image)
    } //视频基本信息

    let config = {
        ek: {
            a1: 'bf',
            a8: 'f',
            x2: 'Kz0mooZM'
        },
        mk: {
            a3: '1z4i',
            a4: '86rv',
            a5: 'f45',
            k3: 'b7',
            nk: 'm1uN9G6c'
        },
        ctype: '86',
        ev: 4
    }

    function decode64(a) {
        if (!a) return '';
        a = a.toString();
        var b, c, d, e, f, g, h,
            i = new Array(- 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, - 1, 62, - 1, - 1, - 1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, - 1, - 1, - 1, - 1, - 1, - 1, - 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, - 1, - 1, - 1, - 1, - 1, - 1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, - 1, - 1, - 1, - 1, - 1);
        for (g = a.length, f = 0, h = ''; f < g;) {
            do {
                b = i[255 & a.charCodeAt(f++)]
            } while (f < g && - 1 == b);
            if (- 1 == b) break;
            do {
                c = i[255 & a.charCodeAt(f++)]
            } while (f < g && - 1 == c);
            if (- 1 == c) break;
            h += String.fromCharCode(b << 2 | (48 & c) >> 4);
            do {
                if (61 == (d = 255 & a.charCodeAt(f++))) return h;
                d = i[d]
            } while (f < g && - 1 == d);
            if (- 1 == d) break;
            h += String.fromCharCode((15 & c) << 4 | (60 & d) >> 2);
            do {
                if (61 == (e = 255 & a.charCodeAt(f++))) return h;
                e = i[e]
            } while (f < g && - 1 == e);
            if (- 1 == e) break;
            h += String.fromCharCode((3 & d) << 6 | e)
        }
        return h
    }

    function jie(a, b) {
        for (var c, d = [
        ], e = 0, f = '', g = 0; g < 256; g++) d[g] = g;
        for (g = 0; g < 256; g++) e = (e + d[g] + a.charCodeAt(g % a.length)) % 256,
            c = d[g],
            d[g] = d[e],
            d[e] = c;
        g = 0,
            e = 0;
        for (var h = 0; h < b.length; h++) g = (g + 1) % 256,
            e = (e + d[g]) % 256,
            c = d[g],
            d[g] = d[e],
            d[e] = c,
            f += String.fromCharCode(b.charCodeAt(h) ^ d[(d[g] + d[e]) % 256]);
        return f
    }

    function getSizeText(size) {
        if (size >= 1099511627776) return (size / 1099511627776).toFixed(2) + 'TB';
        if (size >= 1073741824) return (size / 1073741824).toFixed(2) + 'GB';
        if (size >= 1048576) return (size / 1048576).toFixed(2) + 'MB';
        if (size >= 1024) return (size / 1024).toFixed(2) + 'KB';
        return size + 'B';
    }

    function pad(num, n) {
        num = num.toString();
        let len = num.length;
        while (len++ < n) num = "0" + num;
        return num;
    }

    function getTimeLeftText(second) {
        second = Math.round(second);
        let hour = Math.floor(second / 3600);
        second = second % 3600;
        let minute = Math.floor(second / 60);
        second = second % 60;
        return ((hour === 0) ? '' : pad(hour, 2) + ':') + pad(minute, 2) + ':' + pad(second, 2);
    }

    function loadRadiobtn() {
        $(".ACVideoDownload_radiobtn").click(function () {
            $(this).siblings(".ACVideoDownload_radiobtn").removeClass("selected");
            $(this).addClass("selected");
        });
    }

    function reset() {
        $("#ACVideoDownload_div").hide();
        $("#ACVideoDownload_download").hide();
        $("#ACVideoDownload_load").show();
        $("#ACVideoDownload_select").show();
        $("#ACVideoDownload_message").hide();
        $("#ACVideoDownload_radiobtnsGroupStreams").empty();
        $("#ACVideoDownload_btnWindowCancel").removeClass("disable");
        $("#ACVideoDownload_btnWindowCancel").unbind();
        $("#ACVideoDownload_progressText").text('0.00');
        $(".ACVideoDownload_progressBar_bar").css("width", '0%');
        $("#ACVideoDownload_sizeLoadedText").text('0B');
        $("#ACVideoDownload_sizeTotalText").text('0B');
        $("#ACVideoDownload_speedText").text('0B');
        $("#ACVideoDownload_timeLeftText").text('00:00');
    }

    function error(xhr) {
        $("#ACVideoDownload_message").show();
        $("#ACVideoDownload_messageType").text("错误");
        $("#ACVideoDownload_messageContext").text('网络错误：\n    状态码：' + xhr.status + '\n    状态信息：' + xhr.statusText);
    }

    $("#ACVideoDownload_tipLink").click(function () {
        let loadedSuccess = function (result) {
            window.ACVideoDownload_videoData = result;
            let firstItem = true;
            for (i in result.stream) {
                let item = result.stream[i];
                if (item.m3u8) {
                    let radiobtn = $("<div class='ACVideoDownload_radiobtn' style='min-width:145px;'></div>");
                    let quality = '';
                    if (item.width / item.height == 16 / 9) quality = item.height + 'p';
                    else if (item.height / item.width == 16 / 9) quality = item.width + 'p';
                    else quality = item.width + 'x' + item.height;
                    radiobtn.text(quality + ' ' + getSizeText(item.total_size));
                    if (firstItem) radiobtn.addClass("selected");
                    radiobtn.attr("data-index", i);
                    $("#ACVideoDownload_radiobtnsGroupStreams").append(radiobtn);
                    firstItem = false;
                }
            }
            loadRadiobtn();
        }
        $("#ACVideoDownload_div").show();
        //加载视频
        $.ajax({
            type: "GET",
            url: "http://api.aixifan.com/plays/youku/" + videoInfo.videoId,
            dataType: "json",
            headers: {
                deviceType: 2
            },
            success: function (result) {
                $("#ACVideoDownload_load").show();
                $.ajax({
                    type: "GET",
                    url: "http://player.acfun.cn/js_data",
                    dataType: "jsonp",
                    data: {
                        sign: result.data.embsig,
                        vid: result.data.sourceId,
                        ct: config.ctype,
                        ev: config.ev
                    },
                    success: function (result) {
                        if (result.encrypt = '1') {
                            result.data = JSON.parse(jie(config.mk.nk + config.ek.x2, decode64(result.data)));
                        }
                        loadedSuccess(result.data);
                    },
                    complete: function () {
                        $("#ACVideoDownload_load").hide();
                    },
                    error: error
                });
            },
            complete: function () {
                $("#ACVideoDownload_load").hide();
            },
            error: error
        });
    });



    $(".ACVideoDownload_btnWindowClose").click(reset);

    $("#ACVideoDownload_btnDownload").click(function () {
        let saveVideo = function (arraybuffers) {
            let blob = new Blob(arraybuffers, {
                type: 'application/octet-stream'
            });
            let eleLink = document.createElement('a');
            eleLink.download = 'ac' + pageInfo.id + '_' + videoInfo.videoId + '.ts';
            eleLink.style.display = 'none';
            eleLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
            reset();
        }
        let downloadVideo = function (m3u8, streamItem) {
            let arraybuffers = new Array();
            let xhr;
            $("#ACVideoDownload_btnWindowCancel").click(function () {
                $(this).addClass("disable");
                xhr.abort();
                $("#ACVideoDownload_btnWindowCancel").unbind();
            });
            let lastTotal = 0;
            let nowTotal = 0;
            let timer = setInterval(function () {
                let speed = nowTotal - lastTotal;
                lastTotal = nowTotal;
                let leftTime = (streamItem.total_size - nowTotal) / speed;
                $("#ACVideoDownload_speedText").text(getSizeText(speed));
                if (leftTime != NaN) $("#ACVideoDownload_timeLeftText").text(getTimeLeftText(leftTime));
            }, 1000);
            $("#ACVideoDownload_sizeTotalText").text(getSizeText(streamItem.total_size));
            let getNextSegment = function (segmentIndex, loadedSize) {
                xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                        if ($("#ACVideoDownload_btnWindowCancel").hasClass("disable")) {
                            reset();
                            return;
                        }
                        arraybuffers.push(xhr.response);
                        if (segmentIndex < m3u8.segments.length - 1) getNextSegment(++segmentIndex, loadedSize + xhr.response.byteLength);
                        else {
                            clearInterval(timer);
                            saveVideo(arraybuffers);
                        }
                    }
                }
                xhr.onabort = function () {
                    clearInterval(timer);
                    reset();
                }
                xhr.onerror = function () {
                    clearInterval(timer);
                    error(xhr);
                }
                xhr.onprogress = function (event) {
                    nowTotal = loadedSize + event.loaded;
                    let progressValue = (nowTotal / streamItem.total_size * 100).toFixed(2);
                    $("#ACVideoDownload_progressText").text(progressValue);
                    $(".ACVideoDownload_progressBar_bar").css("width", progressValue + '%');
                    $("#ACVideoDownload_sizeLoadedText").text(getSizeText(nowTotal));
                }
                xhr.open('GET', m3u8.segments[segmentIndex].uri, true);
                xhr.responseType = "arraybuffer";
                xhr.withCredentials = true;
                xhr.send('');
            }
            getNextSegment(0, 0, new Date().getTime());
        }

        $("#ACVideoDownload_load").show();
        let selectedItemIndex = $("#ACVideoDownload_radiobtnsGroupStreams > .selected").data("index");
        $.ajax({
            type: "GET",
            url: window.ACVideoDownload_videoData.stream[selectedItemIndex].m3u8,
            success: function (result) {
                $("#ACVideoDownload_download").show();
                $("#ACVideoDownload_select").hide();
                let parser = new m3u8Parser.Parser();
                parser.push(result);
                parser.end();
                downloadVideo(parser.manifest, window.ACVideoDownload_videoData.stream[selectedItemIndex]);
            },
            complete: function () {
                $("#ACVideoDownload_load").hide();
            },
            error: error
        });
    });
});