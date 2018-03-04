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

        <Modal v-model="addReceiptModal" :closable='true' :mask-closable=false :width="800">
            <h3 slot="header" style="color:#2D8CF0">添加发票</h3>
            <Form ref="addOrderReceipt" :model="orderReceiptForm" :label-width="100" label-position="right" :rules='receiptValid'>
                <Row>
                    <Col span="12">
                        <FormItem label="日期" prop="create_date">
                            <DatePicker format="yyyy-MM-dd" type="date" v-model="orderReceiptForm.create_date" placeholder="请选择日期" style="width:100%"></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="接单人" prop="user_id">
                            <Select v-model="orderReceiptForm.user_id" placeholder="请选择接单人">
                                <Option v-for="user in users" :value="`${user.id}`" :key="user.id">{{ user.name }}</Option>
                            </Select>
                        </FormItem>                      
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="购买单位" prop="client_id">   
                            <Select v-model="orderReceiptForm.client_id" placeholder="请选择购买单位">
                                <Option v-for="client in clients" :value="`${client.id}`" :key="client.id">{{ client.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="单位名称" prop="client_name">
                            <Input v-model="orderReceiptForm.client_name" placeholder="请输入购买单位" ></Input>
                        </FormItem>                        
                    </Col>
                </Row>
                <Row>
                    <Col span="12" v-if="invoiceType === 1">
                        <FormItem label="税号" prop="tax_no">
                            <Input v-model="orderReceiptForm.tax_no" placeholder="请输入税号" ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col v-if="invoiceType === 1">
                        <FormItem label="电话与地址">
                            <Input v-model="orderReceiptForm.tel_and_address" placeholder="请输入电话与地址"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="24" v-if="invoiceType === 1">
                        <FormItem label="开户行与账户">
                            <Input v-model="orderReceiptForm.bank_and_account" placeholder="请输入开户行与账户"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="数量" prop="quantity">
                            <Input v-model="orderReceiptForm.quantity" placeholder="请输入数量" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="金额" prop="amount">
                            <Input v-model="orderReceiptForm.amount" placeholder="请输入金额" ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FormItem label="备注">
                            <Input v-model="orderReceiptForm.remark" type="textarea" :rows="2" placeholder="请输入备注" ></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddReceipt">取消</Button>
                <Button type="primary" @click="finishAddReceipt">确定</Button>
            </div>
        </Modal>        
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
import moment from 'moment';
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
                    width: 70,                    
                },
                {
                    title: '付款金额',
                    align: 'center',
                    key: 'payment_amount',
                    width: 70,                    
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
            orderReceiptForm: {
                type: 1,
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
                    this.total = res.body.data.count;
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
            console.log(this.searchForm.start_date);      
            this.searchForm.start_date = moment(this.searchForm.start_date).format('YYYY-MM-DD');
            this.searchForm.end_date = moment(this.searchForm.end_date).format('YYYY-MM-DD');         
            const params = this.searchForm;
            this.page = 1;
            this.getData(params);
        }, 
        addReceipt (order_id) {
            this.addReceiptModal = true;            
            console.log(order_id);
        }      
    },
    created () {
        this.getData();
    },
};
</script>
