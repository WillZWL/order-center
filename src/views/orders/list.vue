<style lang="less">
    @import '../../styles/common.less';
</style>
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
                    <Form ref="searchForm" :model="searchForm" :label-width="100" label-position="right">
                        <Row class="margin-top-10">
                            <Col span="6">
                                <FormItem label="订单号">
                                    <Input placeholder="请输入订单号" v-model="searchForm.order_sn"></Input>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="单位名称">
                                    <Input placeholder="请输入单位名称" v-model="searchForm.client_name"></Input>                                            
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="订单开始日期">
                                    <DatePicker format="yyyy-MM-dd" type="date" v-model="searchForm.start_date" placeholder="订单开始日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>
                            <Col span="6">
                                <FormItem label="订单结束日期">
                                    <DatePicker format="yyyy-MM-dd" type="date" v-model="searchForm.end_date" placeholder="订单结束日期" style="width:100%"></DatePicker>
                                </FormItem>
                            </Col>                        
                        </Row>
                        <Row>
                            <Col span="8" offset="11">
                                <Button type="ghost" @click="resetSearchForm">重置</Button>                                                                    
                                <Button type="primary" class="margin-right-10" @click="searchOrder">查询</Button>
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
                        <Col span="24" class="align-right margin-top-10">
                            <Page :total="total" :page-size="20" @on-change="changePage" show-total></Page>
                        </Col>                      
                    </Row>
                </Card>
            </Col>
        </Row>     
        <receipt ref="addReceipt" :orderId="orderId"></receipt>
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
import receipt from './receipt.vue'
import moment from 'moment';
export default {
    name: 'order-list',
    components: {
        canEditTable,
        receipt,
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            orderListColumn: [
                {
                    title: '订单号',
                    key: 'order_sn',
                    align: 'center',
                    width: 155,
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
                    width: 70,
                },
                {
                    title: '订单金额',
                    align: 'center',
                    key: 'amount',
                    width: 75,                    
                },
                {
                    title: '付款金额',
                    align: 'center',
                    key: 'payment_amount',
                    width: 75,                    
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
                },
                {
                    title: '发票',
                    align: 'center',
                    render: (h, params) => {
                        if (params.row.receipt === null) {
                            return h('Button', {
                                props: {
                                    type: 'primary',
                                },
                                on: {
                                    click: () => {
                                        this.addReceipt(params.row.id);
                                    }
                                }
                            }, '补增');
                        }
                    }
                }
            ],
            orderList: [],
            status: 2,
            statusArr: [ '已删除', '已驳回', '待审核', '已审核', '已派单', '已发货' ],
            page: 1,
            total: 0,
            searchForm: {
                order_sn: '',
                cliend_name: '',
                start_date: '',
                end_date: '',
            },
            addReceiptModal: false,
            orderId: 0,
        };
    },
    methods: {
        getData (params = {}) {
            const api = `${this.endPoint}orders`;
            const options = {
                credentials: false
            };
            params.status = this.status,
            params.page = this.page,
            this.$http.get(api, { params }, options).then(res => {
                if (res.body.data) {
                    this.orderList = res.body.data.rows;
                    this.total = res.body.data.count.length;
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
                this.orderListColumn[this.orderListColumn.length-2].handle = [ '', '', 'custom'];
            } else {
                this.orderListColumn[this.orderListColumn.length-2].handle = [ '', 'delete', 'custom'];                
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
        },
        changePage (val) {
            this.page = val;
            const params = this.searchForm;
            this.getData(params);
        },
        resetSearchForm () {
            this.searchForm = {
                order_sn: '',
                cliend_name: '',
                start_data: '',
                end_date: '',
            }      
        },
        searchOrder () {
            if (this.searchForm.start_date) {
                this.searchForm.start_date = moment(this.searchForm.start_date).format('YYYY-MM-DD');
            }
            if (this.searchForm.end_date) {
                this.searchForm.end_date = moment(this.searchForm.end_date).format('YYYY-MM-DD');         
            } 
            const params = this.searchForm;
            this.page = 1;
            this.getData(params);
        }, 
        addReceipt (order_id) {
            this.orderId = order_id;
            this.$refs['addReceipt'].showReceiptModal();
        }      
    },
    created () {
        if (this.$store.state.data.clients.length === 0) {
            this.$store.dispatch('getMembers', { type: [ 1 ] });
        }
        this.getData();
    },
};
</script>
