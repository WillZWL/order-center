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

        <Modal v-model="orderPrintModal" :closable='true' :mask-closable=false :width="800">
            <h3 slot="header" style="color:#2D8CF0">印刷分派</h3>
            <Form ref="orderPrint" :model="orderPrintForm" :label-width="100" label-position="right">
                <Row>
                    <Col span="12">
                        <FormItem label="印刷厂">
                            <Select v-model="orderPrintForm.printshop[1]" placeholder="请选择印刷厂">
                                <Option v-for="printshop in printShops" v-if="printshop.type === 4" :value="printshop.id" :key="printshop.id">{{ printshop.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem  label="印刷费">
                            <Input v-model.number="orderPrintForm.printshopCost[1]" placeholder="印刷费"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="热转印">
                            <Select v-model="orderPrintForm.printshop[2]" placeholder="请选择热印厂">
                                <Option v-for="printshop in printShops" v-if="printshop.type === 5" :value="printshop.id" :key="printshop.id">{{ printshop.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem  label="印刷费">
                            <Input v-model.number="orderPrintForm.printshopCost[2]" placeholder="印刷费"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="刺绣厂">
                            <Select v-model="orderPrintForm.printshop[3]" placeholder="请选择刺绣厂">
                                <Option v-for="printshop in printShops" v-if="printshop.type === 6" :value="printshop.id" :key="printshop.id">{{ printshop.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem  label="印刷费">
                            <Input v-model.number="orderPrintForm.printshopCost[3]" placeholder="印刷费"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelPrint">取消</Button>
                <Button type="primary" @click="confirmOrderPrint">确定</Button>
            </div>
        </Modal>
    </div>
</template>

<script>

import orderInfoBase from './order-info-base.vue';

export default {
    name: 'order-info',
    components: {
        orderInfoBase
    },
    data () {
        return {
            siteUrl: this.$store.state.app.siteUrl,
            frontUrl: 'http://localhost:8080',
            endPoint: this.$store.state.app.endPoint,
            orderPrints: [],
            orderItemList: [],
            order: {},
            orderAttachment: [],
            orderReceipt: [],
            orderPrintModal: false,
            orderPrintForm: {
                printshop: [],
                printshopCost: [],
            },
            printShops: [],
            status: 0,
        };
    },
    methods: {
        init () {
            const orderId = this.$route.params.order_id;
            if (orderId) {
                this.getOrderDetail(orderId);            }
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
            this.orderPrintModal = true;
            this.getPrintShops();
        },
        cancelPrint() {
            this.orderPrintModal = false;
        },
        confirmOrderPrint() {
            const api = `${this.endPoint}order/orderPrint`;
            const data = {
                order_id: this.order.id,
                order_sn: this.order.order_sn,
                orderPrintData: this.orderPrintForm,
            };
            const options = {
                credentials: false
            };
            this.$http.post(api, data, options).then(res => {
                if (res.body.order) {
                    this.order = res.body.order;
                    this.orderPrintModal = false;                    
                } 
            });
        },
        getPrintShops() {
            const api = `${this.endPoint}members`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {
                params: {
                    type: [ 4, 5, 6],
                }
            }, options).then(res => {
                if (res.body.data) {
                    this.printShops = res.body.data;
                }
            });
        },
        print() {
            const printUrl = `${this.frontUrl}/#/order-print/${this.order.id}`;
            window.open(printUrl);
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