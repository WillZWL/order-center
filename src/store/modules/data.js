import Vue from 'vue';
import VueResouce from 'vue-resource';
Vue.use(VueResouce);

const data = {
    state: {
        endPoint: 'http://127.0.0.1:7001/api/',
        categorys: [],
        accounts: [],
        users: [],
        channels: [],
        invoiceTypes: [],
        clients: [],
        deliverys: [],
        suppliers: [],
    },
    mutations: {
        setCategorys (state, list) {
            state.categorys = list;
        },
        setAccounts (state, list) {
            state.accounts = list;
        },
        setUsers (state, list) {
            state.users = list;
        },
        setChanels (state, list) {
            state.channels = list;
        },
        setInvoiceTypes (state, list) {
            state.invoiceTypes = list;
        },
        pushClients (state, client) {
            state.clients.push(client);
        },
        pushDeliverys (state, delivery) {
            state.deliverys.push(delivery);
        },
        pushSuppliers (state, supplier) {
            state.suppliers.push(supplier);
        }
    },
    actions: {
        getCategorys ({ commit, state }) {
            const api = `${state.endPoint}categorys`;
            const options = {
                credentials: false
            };
            Vue.http.get(api, options).then(res => {
                if (res.body.data) {
                    commit('setCategorys', res.body.data);
                }
            });
        },
        getAccounts ({ commit, state }) {
            const api = `${state.endPoint}accounts`;
            const options = {
                credentials: false
            };
            Vue.http.get(api, {params: { type: 1 }}, options).then(res => {
                if (res.body.data) {
                    commit('setAccounts', res.body.data);                   
                }
            });
        },
        getUsers ({ commit, state }) {
            const api = `${state.endPoint}users`;
            const options = {
                credentials: false
            };
            Vue.http.get(api, {params: { type: 1 }}, options).then(res => {
                if (res.body.data) {
                    commit('setUsers', res.body.data);                  
                }
            });
        },
        getChannels ({ commit, state }) {
            const api = `${state.endPoint}channels`;
            const options = {
                credentials: false
            };
            Vue.http.get(api, options).then(res => {
                if (res.body.data) {
                    commit('setChanels', res.body.data);                   
                }
            });
        },
        getInvoiceTypes ({ commit, state }) {
            const api = `${state.endPoint}invoice-types`;
            const options = {
                credentials: false
            };
            Vue.http.get(api, options).then(res => {
                if (res.body.data) {
                    commit('setInvoiceTypes', res.body.data);
                }
            });
        },
        getMembers ({ commit, state }, params) {
            const api = `${state.endPoint}members`;
            const options = {
                credentials: false
            };
            Vue.http.get(api, { params }, options).then(res => {
                if (res.body.data) {
                    res.body.data.forEach(item => {
                        if (item.type === 1) {
                            commit('pushClients', item);
                        }
                        if (item.type === 2) {
                            commit('pushSuppliers', item);
                        }
                        if (item.type === 3) {
                            commit('pushDeliverys', item);
                        }
                    });
                }
            });
        }
    }
}

export default data;