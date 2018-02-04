import Cookies from 'js-cookie';

const user = {
    state: {
        userId: Cookies.get('uid'),
        userName: Cookies.get('user'),
    },
    mutations: {
        logout (state, vm) {
            Cookies.remove('user');
            Cookies.remove('access');
        }
    }
};

export default user;
