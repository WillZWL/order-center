<style lang="less">
@import '../../../styles/common.less';
html, body {
    overflow: visible;
}
.margin-top-10 {
    margin-top: 5px;
}
.order-info .ivu-form-item {
    margin-bottom: 0px;
}
.order-info .ivu-form .ivu-form-item-label {
    font-size: 14px;
    font-weight: bold;
}
.order-info .ivu-form .ivu-form-item-content {
    font-size: 14px;        
}
.item-total {
    text-align: right;
}
.item-total ul {
    display: block;
    float: right;
}
.item-total ul li {
    width: 60px;
    float: left;
    text-align: center;
}
.ivu-card-body {
    max-width: 1100px;
    padding: 0;
}
.ivu-table th {
    height: 30px;
}
.ivu-form .ivu-form-item-label {
    padding: 5px;
}
.ivu-form-item-content {
    line-height: 25px;
}
table {
    max-width: 754px;
}
.ivu-table-cell {
    padding: 0;
}
.ivu-table td, .ivu-table th {
    text-align: center;
    height: 30px;
}
.ivu-card-head {
    padding: 5px;
}
img {
    max-width: 700px;
}
h1 {
    text-align: center;
}
</style>

<template>
    <div class="order-info">
        <h1>加工工艺单</h1>
        <Card>
            <order-info-base 
            :orderPrints="orderPrints"
            :orderItemList="orderItemList"
            :order="order"
            :orderAttachment="orderAttachment"
            :orderReceipt="orderReceipt"
            :isPrint="'1'">
            </order-info-base>
        </Card>
    </div>
</template>
<script>

import orderInfoBase from './order-info-base.vue';

export default {
    name: 'order-print',
    components: {
        orderInfoBase
    },
    data () {
        return {
            siteUrl: this.$store.state.app.siteUrl,
            endPoint: this.$store.state.app.endPoint,
            orderPrints: [],
            orderItemList: [],
            order: {},
            orderAttachment: [],
            orderReceipt: [],
        }
    },
    methods: {
        init () {
            const orderId = this.$route.params.order_id;
            if (orderId) {
                this.getOrderDetail(orderId);
            }
        },
        getOrderDetail (orderId) {
            const api = `${this.endPoint}order`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: {id: orderId}}, options).then(res => {
                if (res.body.data) {
                    this.order = res.body.data.order;
                    this.orderAttachment = res.body.data.orderAttachment;
                    this.orderItemList = res.body.data.orderItem;
                    this.orderReceipt = res.body.data.orderReceipt;
                    this.orderPrints = res.body.data.orderPrint;               
                }
            });
        }, 
    },
    mounted() {
        this.init();
    },
};
</script>