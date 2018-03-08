const order = {
    state: {
        orderReceipt: {
            type: 1,
            order_id: 0,
            user_id: '',
            create_date: '',
            user_id: '',
            client_id: '',
            client_name: '',
            tax_no: '',
            tel_and_address: '',
            bank_and_account: '',
            quantity: '',
            amount: '',
            remark: '',
        }
    },
    mutations: {
        setOrderReceipt(state, receipt) {
            state.orderReceipt = receipt;
        }
    }
}

export default order;