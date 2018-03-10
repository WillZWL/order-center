const order = {
    state: {
        order: {},
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
        },
        orderPrints: [],
        orderPrintForm: {
            printshop: [],
            printshopCost: [],
        }
    },
    mutations: {
        setOrderReceipt(state, receipt) {
            state.orderReceipt = receipt;
        },
        setOrder(state, order) {
            state.order = order;
        },
        setOrderPrints(state, orderPrints) {
            state.orderPrints = orderPrints;
        },
        setOrderPrintForm(state, orderPrints) {
            orderPrints.forEach(printshop => {
                if (printshop.type === 1) {
                    state.orderPrintForm.printshop[1] = printshop.printshop_id;
                    state.orderPrintForm.printshopCost[1] = printshop.printcost;
                }
                if (printshop.type === 2) {
                    state.orderPrintForm.printshop[2] = printshop.printshop_id;
                    state.orderPrintForm.printshopCost[2] = printshop.printcost;
                }            
                if (printshop.type === 3) {
                    state.orderPrintForm.printshop[3] = printshop.printshop_id;
                    state.orderPrintForm.printshopCost[3] = printshop.printcost;
                }
            });
        },
    }
}

export default order;