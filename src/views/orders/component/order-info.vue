<style lang="less">
    @import '../../../styles/common.less';
    .order-info .ivu-form-item {
        margin-bottom: 5px;
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
        width: 80px;
        float: left;
        text-align: center;
    }
    .order-info p span {
        font-weight: normal;
    }
    .order-info table {
        widows: 100%;
    }
    .print img {
        max-width: 1100px;
    }
    .order-info .title {
        height: 32px;
        line-height: 32px;
    }
    .order-info .ivu-poptip, .order-info .status-button {
        margin-left: 5px;
        float: right;
    }
</style>
<template>
    <div class="order-info">
        <Card>
            <p slot="title" class="title">
                订单详情&nbsp;&nbsp; <span>编号: {{ order.order_sn }}  状态： {{ order.statusStr }} </span>
                <Poptip v-if="order.status === 2"
                    confirm
                    placement="bottom-end"
                    @on-ok="confirmUpdate(3)"
                    title="确认通过此订单吗？">
                    <Button class="add-button" type="success">通过审核</Button>
                </Poptip>
                <Poptip v-if="order.status === 2"
                    confirm
                    placement="bottom-end"
                    @on-ok="confirmUpdate(1)"
                    title="确认驳回此订单吗？">
                    <Button class="add-button" type="warning">驳回</Button>            
                </Poptip>
                <Button v-if="order.status === 3" class="status-button" type="primary" @click="orderPrint">印刷分派</Button>
                <Button v-if="order.status === 4" class="status-button" type="primary" @click="print">打印</Button>                
                <Button v-if="order.status === 4" class="status-button" type="primary" @click="orderPrint">重新分派</Button>                
            </p>
            <order-info-base 
            :orderPrints="orderPrints"
            :orderItemList="orderItemList"
            :order="order"
            :orderAttachment="orderAttachment"
            :orderReceipt="orderReceipt"
            :isPrint="'0'">
            </order-info-base>
        </Card>
        <order-print-company ref="orderPrint"></order-print-company>
    </div>
</template>

<script>

import orderInfoBase from './order-info-base.vue';
import orderPrintCompany from '../print-company.vue'

export default {
    name: 'order-info',
    components: {
        orderInfoBase,
        orderPrintCompany
    },
    data () {
        return {
            siteUrl: this.$store.state.app.siteUrl,
            frontUrl: 'http://localhost:8080',
            endPoint: this.$store.state.app.endPoint,
            orderItemList: [],
            orderAttachment: [],
            orderReceipt: [],
            orderPrintModal: false,
            orderPrintForm: {
                printshop: [],
                printshopCost: [],
            },
            status: 0,
        };
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
                    this.$store.commit('setOrder', res.body.data.order);
                    this.orderAttachment = res.body.data.orderAttachment;
                    this.orderItemList = res.body.data.orderItem;
                    this.orderReceipt = res.body.data.orderReceipt;
                    this.$store.commit('setOrderPrints', res.body.data.orderPrint);
                    this.$store.commit('setOrderPrintForm', res.body.data.orderPrint);                                 
                }
            });
        }, 
        confirmUpdate(status) {
            const api = `${this.endPoint}order/updateStatus`;
            const options = {
                credentials: false
            };
            const data = this.order;
            data.status = status;
            this.$http.post(api, data, options).then(res => {
                if (res.body.order) {
                    this.order = res.body.order;
                } 
            });
        },
        orderPrint() {
            this.$refs['orderPrint'].showOrderPrint();            
        },
        print() {
            const printUrl = `${this.frontUrl}/#/order-print/${this.order.id}`;
            window.open(printUrl);
        },
    },
    computed: {
        order () {
            return this.$store.state.order.order;
        },
        orderPrints () {
            return this.$store.state.order.orderPrints;
        },
    },
    created() {
        this.init();
    },
    watch: {
        '$route' () {
            this.init();
        }
    }
}
</script>