import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import user from './modules/user';
import data from './modules/data';
import order from './modules/order';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        app,
        user,
        data,
        order,
    }
});

export default store;
