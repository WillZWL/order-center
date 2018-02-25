<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        订单列表
                    </p>
                    <Tabs type="card" @on-click="switchTab" :value="status">
                        <TabPane v-for="status in statusArr" :label="status" :key="status"></TabPane>
                    </Tabs>
                    <Form :label-width="100" label-position="right">
                        <Row class="margin-top-10">
                            <Col span="6">
                                <FormItem label="订单号">
                                    <Input placeholder="请输入订单号"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="单位名称">
                                    <Input placeholder="请输入单位名称"></Input>                                            
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="订单开始日期">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单开始日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="订单结束日期">
                                    <DatePicker format="yyyy-MM-dd" type="date" placeholder="订单结束日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>                        
                        </Row>
                        <Row>
                            <Col span="8" offset="12">              
                                <Button type="primary" class="margin-right-10">查询</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row class="margin-top-10">
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
                    title: '接单人',
                    align: 'center',
                    key: 'creator',
                    width: 80,
                },
                {
                    title: '渠道',
                    align: 'center',
                    key: 'channel_name',
                    width: 80,
                },
                {
                    title: '订单日期',
                    align: 'center',
                    key: 'order_date',
                    width: 100,                    
                },
                {
                    title: '发货日期',
                    align: 'center',
                    key: 'delivery_time',
                    width: 100,                    
                },
                {
                    title: '单位名称',
                    align: 'center',
                    key: 'client_name',
                    width: 200,
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'item_quantity',
                },
                {
                    title: '订单金额',
                    align: 'center',
                    key: 'amount',
                },
                {
                    title: '付款金额',
                    align: 'center',
                    key: 'payment_amount',
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
                    handle: [ '', '', 'custom']
                }
            ],
            orderList: [],
            status: 2,
            statusArr: [ '已删除', '已驳回', '待审核', '已审核', '已派单', '已发货' ],
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
