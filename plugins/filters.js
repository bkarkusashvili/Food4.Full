import Vue from 'vue'
import { format, parseISO, isValid } from '@shvelo/date-fns'
import { ka } from '@shvelo/date-fns/locale'


// usage: {{ file.size | prettyBytes }}
Vue.filter('prettyBytes', function (num) {
    // jacked from: https://github.com/sindresorhus/pretty-bytes
    if (typeof num !== 'number' || isNaN(num)) {
        return "";
    }

    var exponent;
    var unit;
    var neg = num < 0;
    var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if (neg) {
        num = -num;
    }

    if (num < 1) {
        return (neg ? '-' : '') + num + ' B';
    }

    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
    num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
    unit = units[exponent];

    return (neg ? '-' : '') + num + ' ' + unit;
});

Vue.filter('date', function (date, formatString) {
    date = parseISO(date);
    if (isValid(date))
        return format(date, formatString || "dd MMM yyyy", { locale: ka });
    return "";
});

Vue.filter('dateTime', function (date, formatString) {
    date = parseISO(date);
    if (isValid(date))
        return format(date, formatString || "dd MMM yyyy HH:mm", { locale: ka });
    return "";
});

Vue.filter('youtubeEmbed', function (url) {
    if (!url) return "";

    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (!match[2]) return "";
    return "https://www.youtube.com/embed/" + match[2];
});