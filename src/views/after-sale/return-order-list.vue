<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        退货／退款单列表
                    </p>
                    <Tabs type="card" @on-click="switchTab" :value="status">
                        <TabPane v-for="status in statusArr" :label="status" :key="status"></TabPane>
                    </Tabs>
                    <Row>
                        <Col span="24">
                            <can-edit-table
                                v-model="orderList"  
                                @on-delete="handleDel"
                                @click-customButton="clickCustomButton"
                                :columns-list="orderListColumn"
                                :customeButtonName="'详情'"
                            ></can-edit-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
export default {
    name: 'order-list',
    components: {
        canEditTable
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            orderListColumn: [
                {
                    title: '订单号',
                    key: 'order_sn',
                    align: 'center',
                    width: 160,
                },
                {
                    title: '客户名称',
                    align: 'center',
                    key: 'client_name',
                    width: 200,
                },
                {
                    title: '接单人',
                    align: 'center',
                    key: 'creator',
                    width: 80,
                },
                {
                    title: '时间',
                    align: 'center',
                    key: 'order_date',
                    width: 100,                    
                },
                {
                    title: '渠道',
                    align: 'center',
                    key: 'channel_name',
                    width: 80,
                },
                {
                    title: '退款金额',
                    align: 'center',
                    key: 'amount',
                    width: 100, 
                },
                {
                    title: '备注',
                    align: 'center',
                    key: 'remark',        
                },
                {
                    title: '状态',
                    align: 'center',
                    key: 'statusStr',
                    width: 80,
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: [ '', '', 'custom'],
                    width: 100,                    
                }
            ],
            orderList: [],
            status: 2,
            statusArr: [ '已删除', '已驳回', '待财务审核退款', '待仓库审核收货', '已完成' ],
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}orders`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: {status: this.status}}, options).then(res => {
                if (res.body.data) {
                    this.orderList = res.body.data;
                }
            });
        },
        handleDel (val, index) {
            const data = val[index];
            data.status = 0;
            this.ajaxUpdate(data, '删除');
        },
        ajaxUpdate (data, msg = '更新') {
            const api = `${this.endPoint}order/updateStatus`;
            const options = {
                credentials: false
            };
            this.$http.post(api, data, options).then(res => {
                if (res.body.id) {
                    this.$Message.success(`${msg}成功`);
                } else {
                    this.$Message.error(`${msg}失败`);
                }
            }, () => {
                this.$Message.error(`${msg}失败`);
            });
        },
        switchTab (tab) {
            this.status = tab;
            this.orderList = [];
            if (tab !== 1) {
                this.orderListColumn[this.orderListColumn.length-1].handle = [ '', '', 'custom'];
            } else {
                this.orderListColumn[this.orderListColumn.length-1].handle = [ '', 'delete', 'custom'];                
            }
            this.getData();
        },
        clickCustomButton (val, index) {
            const order = val[index];
            let argu = { order_id: order.id };
            this.$router.push({
                name: 'order-info',
                params: argu
            });
        }
    },
    created () {
        this.getData();
    },
};
</script>
