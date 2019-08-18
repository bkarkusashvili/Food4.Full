import Vue from 'vue'
import Notifications from 'vue-notification/dist/ssr.js'

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
}

Vue.use(Notifications);

// Set up shorthand functions
"primary link info success warning danger".split(' ').forEach((type) => {
    Vue.prototype['$notify' + capitalize(type)] = function (obj) {
        return this.$notify(Object.assign({
            group: "main",
            type: "is-" + type
        }, obj));
    }
});

// Set up aliases
Vue.prototype.$notifyError = Vue.prototype.$notifyDanger;