<style lang="less">
    @import '../../styles/common.less';
.list p {
    height: 32px;
    line-height: 32px;
}
.list .add-button {
    float: right;
}
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="document"></Icon>
                        新建退货单
                    </p>
                    <Row class="margin-top-10">
                        <Form ref="addReturnOrderForm" :model="addReturnOrderForm" :label-width="100" label-position="right" :rules='returnOrderValid'>
                            <Col span="24">
                                <Card>
                                    <p slot="title">
                                        <Icon type="ios-edit"></Icon>
                                        基本信息
                                    </p>
                                    <Row>
                                        <Col span="8">
                                            <FormItem label="原订单号" prop="order_no">
                                                <Input v-model="addReturnOrderForm.order_no" placeholder="请输入原订单号"></Input>                               
                                            </FormItem>
                                            <FormItem label="退款金额" prop="amount">
                                                <Input v-model="addReturnOrderForm.amount" placeholder="请输入退款金额"></Input>                                                
                                            </FormItem>
                                            <FormItem label="快递类型">
                                                <Input v-model="addReturnOrderForm.order_no" placeholder="快递类型"></Input>                                                
                                            </FormItem>                                            
                                        </Col>
                                        <Col span="8">
                                            <FormItem label="日期" prop="return_date">
                                                <DatePicker format="yyyy-MM-dd" type="date" v-model="addReturnOrderForm.return_date" placeholder="日期" style="width:100%"></DatePicker>
                                            </FormItem>
                                            <FormItem label="备注" prop="remark">
                                                <Input v-model="addReturnOrderForm.remark" placeholder="备注"></Input>                                    
                                            </FormItem> 
                                            <FormItem label="快递单号">
                                                <Input v-model="addReturnOrderForm.order_no" placeholder="快递单号"></Input>                                                
                                            </FormItem>                             
                                        </Col>
                                        <Col span="8">
                                            <FormItem label="接单人" prop="user_id">
                                                <Select v-model="addReturnOrderForm.user_id" placeholder="请选择接单人">
                                                    <Option v-for="user in users" :value="`${user.id}`" :key="user.id">{{ user.name }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="截图凭证">
                                                <Upload multiple :on-success="uploadSuccess" :on-remove="removeUpload" :action="invoiceUploadUrl">
                                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传截图凭证</Button>
                                                </Upload>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span="24" class="list margin-top-10">
                                <Card>
                                    <p slot="title">
                                        产品&nbsp;&nbsp; 总数量 {{ itemTotal }},  &nbsp;&nbsp; 总金额 {{ itemAmount }}
                                        <Button class="add-button" type="primary" @click="addItem">添加产品</Button>
                                    </p>
                                    <Row>
                                        <Col>
                                            <can-edit-table
                                                ref="orderItemTable"
                                                v-model="orderItemData" 
                                                @on-change="handleChange"  
                                                @on-delete="handleDel"
                                                :editIncell="true" 
                                                :columns-list="orderItemColumn"
                                            ></can-edit-table>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col span="24" class="list margin-top-10">
                                <Card>
                                    <Row>
                                        <Col span="4" offset="11">
                                            <Button type="ghost" @click="createOrderReset">重置</Button>                                            
                                            <Button type="primary" @click="createOrder">创建退货单</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import DragableTable from './../common/components/dragableTable.vue';
import canEditTable from './../common/components/canEditTable.vue';
import moment from 'moment';
export default {
    name: 'return-order',
    components: {
        canEditTable,
        DragableTable,
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            invoiceUploadUrl: this.$store.state.app.endPoint + 'order/invoiceUpload',                        
            addReturnOrderForm: {
                return_date: moment(),
            },
            returnOrderValid: {

            },
            users: [],
            itemTotal: 0,
            itemAmount: 0,
            orderItemData: [],
            orderItemColumn: [
                {
                    title: '型号',
                    key: 'product_code',
                    align: 'center',
                    width: 100,
                },
                {
                    title: '产品名称',
                    key: 'product_name',
                    align: 'center',
                    width: 200,
                },
                {
                    title: '颜色',
                    key: 'color_name',
                    align: 'center',
                },
                {
                    title: 'SS',
                    align: 'center',
                    key: 'ss_quantity',
                    editable: true
                },
                {
                    title: 'S',
                    align: 'center',
                    key: 's_quantity',
                    editable: true
                },
                {
                    title: 'M',
                    align: 'center',
                    key: 'm_quantity',
                    editable: true
                },
                {
                    title: 'L',
                    align: 'center',
                    key: 'l_quantity',
                    editable: true
                },
                {
                    title: 'XL',
                    align: 'center',
                    key: 'xl_quantity',
                    editable: true
                },
                {
                    title: '2XL',
                    align: 'center',
                    key: 'xxl_quantity',
                    editable: true
                },
                {
                    title: '3XL',
                    align: 'center',
                    key: 'xxxl_quantity',
                    editable: true
                },
                {
                    title: '4XL',
                    align: 'center',
                    key: 'xxxxl_quantity',
                    editable: true
                },
                {
                    title: '单价',
                    key: 'price',
                    align: 'center',
                },
                {
                    title: '数量',
                    key: 'total',
                    align: 'center',
                },
                {
                    title: '合计',
                    key: 'amount',
                    align: 'center',
                    editable: true                    
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['edit', 'delete']
                }
            ],
        }
    },
    methods: {
        getUsers () {
            const api = `${this.endPoint}users`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: { type: 1 }}, options).then(res => {
                if (res.body.data) {
                    this.users = res.body.data;
                }
            });
        },
        addItem () {

        },
        createOrderReset () {

        },
        createOrder () {

        },
        handleChange () {

        },
        handleDel () {

        },
        uploadSuccess () {

        },
        removeUpload () {

        }
    },
    created () {
        this.getUsers();        
    }
}
</script>
