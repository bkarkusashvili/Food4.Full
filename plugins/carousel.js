import Vue from 'vue'
import {
    Hooper,
    Slide,
    Progress,
    Pagination,
    Navigation
} from 'hooper';
import 'hooper/dist/hooper.css';

Vue.component('hooper', Hooper);
Vue.component('hooper-slide', Slide);
Vue.component('hooper-progress', Progress);
Vue.component('hooper-pagination', Pagination);
Vue.component('hooper-navigation', Navigation);