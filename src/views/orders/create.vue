<style lang="less">
    @import '../../styles/common.less';
    @import './order.less';
    .area .ivu-row .ivu-col {
        width: 30%;
    }
</style>
<template>
    <div>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-edit"></Icon>
                        新建订单
                    </p>
                    <Row class="margin-top-10">
                        <Form ref="addOrderForm" :model="addOrderForm" :label-width="100" label-position="right" :rules='orderValid'>
                            <Col span="24">
                                <Card>
                                    <p slot="title">
                                        <Icon type="ios-edit"></Icon>
                                        基本信息
                                    </p>
                                    <Row>
                                        <Col span="8">
                                            <FormItem label="订单日期" prop="order_date">
                                                <DatePicker format="yyyy-MM-dd" type="date" v-model="addOrderForm.order_date" placeholder="订单日期" style="width:100%"></DatePicker>
                                            </FormItem>
                                            <FormItem label="购买单位" prop="client_id">
                                                <Select v-model="addOrderForm.client_id" placeholder="请选择购买单位">
                                                    <Option v-for="client in clients" :value="`${client.id}`" :key="client.id">{{ client.name }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="快递公司" prop="delivery_company_id">
                                                <Select v-model="addOrderForm.delivery_company_id" placeholder="请选择快递公司">
                                                    <Option v-for="delivery in deliverys" :value="`${delivery.id}`" :key="delivery.id">{{ delivery.name }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="订单备注">
                                                <Input v-model="addOrderForm.remark" type="textarea" :rows="4" placeholder="订单备注"></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="8" class="padding-left-10">
                                            <FormItem label="渠道" prop="channel_id">
                                                <Select v-model="addOrderForm.channel_id" placeholder="请选择渠道">
                                                    <Option v-for="channel in channels" :value="`${channel.id}`" :key="channel.id">{{ channel.name }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="票据类型">
                                                <Col span="10">
                                                    <Select v-model="addOrderForm.invoice_type" placeholder="请选择票据类型">
                                                        <Option value="">无</Option>
                                                        <Option v-for="invoice_type in invoiceTypes" :value="`${invoice_type.id}`" :key="invoice_type.id">{{ invoice_type.name }}</Option>
                                                    </Select>
                                                </Col>
                                                <Col span="8" class="margin-left-10">
                                                    <Button v-if="addOrderForm.invoice_type == 1" class="add-receipt" type="primary" @click="addReceipt(1)">添加发票</Button>
                                                    <Button v-if="addOrderForm.invoice_type == 2" class="add-receipt" type="primary" @click="addReceipt(2)">添加收据</Button>                                                               
                                                </Col>
                                            </FormItem>
                                            <FormItem label="收款账号" prop="account_id">
                                                <Select v-model="addOrderForm.account_id" placeholder="请选择收款账号">
                                                    <Option v-for="account in accounts" :value="`${account.id}`" :key="account.id">{{ account.subject }}</Option>
                                                </Select>                                               
                                            </FormItem>
                                            <FormItem label="付款备注">
                                                <Input v-model="addOrderForm.payment_remark" type="textarea" :rows="4" placeholder="付款备注"></Input>
                                            </FormItem>
                                        </Col>
                                        <Col span="8" class="padding-left-10">
                                            <FormItem label="接单人" prop="user_id">
                                                <Select v-model="addOrderForm.user_id" placeholder="请选择接单人">
                                                    <Option v-for="user in users" :value="`${user.id}`" :key="user.id">{{ user.name }}</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem label="发货时间" prop="delivery_time">
                                                <DatePicker format="yyyy-MM-dd" type="date" v-model="addOrderForm.delivery_time" placeholder="发货时间" style="width:100%"></DatePicker>                                                
                                            </FormItem>
                                            <FormItem label="付款金额" prop="pay_amount">
                                                <Input v-model="addOrderForm.pay_amount" placeholder="收款金额"></Input>                                                
                                            </FormItem>
                                            <FormItem label="付款凭证">
                                                <Upload multiple :on-success="uploadSuccess" :on-remove="removeUpload" :action="invoiceUploadUrl">
                                                    <Button type="ghost" icon="ios-cloud-upload-outline">上传付款凭证</Button>
                                                </Upload>
                                            </FormItem>
                                            <FormItem label="是否印刷">
                                                <i-switch v-model="addOrderForm.isPrint">
                                                    <span slot="open">是</span>
                                                    <span slot="close">否</span>
                                                </i-switch>
                                            </FormItem>
                                        </Col>
                                        <Col span="10">
                                            <FormItem label="地址">                                            
                                                <al-selector v-model="addOrderForm.area" data-type="name" level="2" class="area" />
                                            </FormItem>
                                        </Col>
                                        <Col span="14">
                                            <Input v-model="addOrderForm.address" placeholder="请输入详细地址"></Input>                                            
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                            <Col v-if="addOrderForm.isPrint" span="24" class="list margin-top-10">
                                <Card>
                                    <p slot="title">
                                        印刷效果图
                                    </p>
                                    <Row>
                                        <Col>
                                            <Upload multiple type="drag" :on-success="uploadSuccess" :on-remove="removeUpload" :action="printImgUploadUrl">
                                                <div>
                                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                                    <p>点击或者拖拽文件到此上传</p>
                                                </div>
                                            </Upload>
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
                                            <Button type="primary" @click="createOrder">创建订单</Button>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Form>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addItemModal" :closable='true' :mask-closable=false :width="1000">
            <h3 slot="header" style="color:#2D8CF0">添加产品</h3>
            <Form ref="searchProductForm" :model="searchProductForm" :label-width="100" label-position="right">
                <Row>
                    <Col span="8">
                        <FormItem label="分类">
                            <Select v-model="searchProductForm.cate_id" placeholder="请选择分类">
                                <Option v-for="category in categorys" :value="category.id" :key="category.id">{{ category.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="产品名称">
                            <Input v-model="searchProductForm.name" placeholder="请输入产品名称" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="8">
                        <FormItem label="产品编码">
                            <Input v-model="searchProductForm.code" placeholder="请输入产品编码" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="4" offset="12">
                        <Button type="primary" @click="getProductInventorys">搜索</Button>
                    </Col>
                </Row>
            </Form>
            <Row class="margin-top-10">
                <Col span="24">
                    <DragableTable :columnsList="inventoryColumn" v-model="productInventoryData" @on-choose="chooseProduct"></DragableTable>
                </Col>
            </Row>
            <div slot="footer">
                <Button type="primary" @click="finishAddItem">确定</Button>
            </div>
        </Modal>
        <Modal v-model="addReceiptModal" :closable='true' :mask-closable=false :width="1000">
            <h3 slot="header" style="color:#2D8CF0">添加{{ invoiceType === 1 ? '发票' : '收据' }}</h3>
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
                    <Col span="12" v-if="invoiceType === 1">
                        <FormItem label="电话" prop="telphone">
                            <Input v-model="orderReceiptForm.telphone" placeholder="请输入电话" ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col v-if="invoiceType === 1">
                        <FormItem label="地址" prop="address">
                            <Input v-model="orderReceiptForm.address" placeholder="请输入地址" ></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12" v-if="invoiceType === 1">
                        <FormItem label="开户行" prop="opening_bank">
                            <Input v-model="orderReceiptForm.opening_bank" placeholder="请输入开户行" ></Input>
                        </FormItem>
                    </Col>
                    <Col span="12" v-if="invoiceType === 1">
                        <FormItem label="账户" prop="bank_account">
                            <Input v-model="orderReceiptForm.bank_account" placeholder="请输入账户" ></Input>
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
import Vue from 'vue';
import iviewArea from 'iview-area';
Vue.use(iviewArea);
import DragableTable from './../common/components/dragableTable.vue';
import canEditTable from './../common/components/canEditTable.vue';
import Cookies from 'js-cookie';
import moment from 'moment';
export default {
    name: 'create-order',
    components: {
        canEditTable,
        DragableTable,
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            printImgUploadUrl: this.$store.state.app.endPoint + 'order/printImgUpload',
            invoiceUploadUrl: this.$store.state.app.endPoint + 'order/invoiceUpload',
            userId: this.$store.state.user.userId,         
            addItemModal: false,
            addReceiptModal: false,
            saveLoading: false,
            searchProductForm: {
                name: '',
            },
            addOrderForm: {
                isPrint: 0,
                order_date: moment(),
                channel_id: '',
                client_id: '',
                invoice_type: '',
                delivery_time: '',
                delivery_company_id: '',
                remark: '',
                user_id: '',
                payment_remark: '',
                order_items: [],
                printImgs: [],
                invoiceImgs: [],
                account_id: '',
                pay_amount: 0,
                area: [],
                address: '',     
            },
            orderValid: {
                order_date: [
                    { required: true, type:'date', message: '请输入订单日期', trigger: 'change' },
                ],
                channel_id: [
                    { required: true, message: '请选择渠道', trigger: 'change' },
                ],
                user_id: [
                    { required: true, message: '请选择接单人', trigger: 'submit' },
                ],
                client_id: [
                    { required: true, message: '请选择购买单位', trigger: 'change' },
                ],
                delivery_time: [
                    { required: true, type:'date', message: '请选择发货时间', trigger: 'change' },
                ],
                delivery_company_id: [
                    { required: true, message: '请选择快递公司', trigger: 'change' },
                ],
                account_id: [
                    { required: true, message: '请选择收款账号', trigger: 'change' },
                ],
                pay_amount: [
                    { required: true, message: '请输入付款金额', trigger: 'submit' },
                ],
            },
            techniqueList: [
                {
                    name: '丝网印',
                    shop: '印刷厂',
                },
                {
                    name: '热转印',
                    shop: '热印厂',
                },
                {
                    name: '刺绣',
                    shop: '刺绣厂',
                }
            ],
            chooseTech: [],
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
            inventoryColumn: [
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
            ],
            channels: [],
            clients: [],
            invoiceTypes: [],
            deliverys: [],
            printShops: [],
            categorys: [],
            accounts: [],
            users: [],
            productInventoryData: [],
            invoiceType: '',
            receiptValid: {
                create_date: [
                    { required: true, type:'date', message: '请输入发票日期', trigger: 'submit' },
                ],
                user_id: [
                    { required: true, message: '请输入接单人', trigger: 'submit' },
                ],
                client_id: [
                    { required: true, message: '请选择购买单位', trigger: 'submit' },
                ],
                client_name: [
                    { required: true, message: '请输入单位名称', trigger: 'submit' },
                ],
                tax_no: [
                    { required: true, message: '请输入税号', trigger: 'submit' },
                ],
                address: [
                    { required: true, message: '请输入地址', trigger: 'submit' },
                ],
                opening_bank: [
                    { required: true, message: '请输入开户行', trigger: 'submit' },
                ],
                bank_account: [
                    { required: true, message: '请输入账户', trigger: 'submit' },
                ],
                quantity: [
                    { required: true, message: '请输入数量', trigger: 'submit' },
                ],
                amount: [
                    { required: true, message: '请输入金额', trigger: 'submit' },  
                ],
            },
            orderReceiptForm: {
                type: 1,
                user_id: '',
                create_date: '',
                user_id: '',
                client_id: '',
                client_name: '',
                tax_no: '',
                address: '',
                telphone: '',
                opening_bank: '',
                bank_account: '',
                quantity: '',
                amount: '',
                remark: '',
            }
        }
    },
    methods: {
        handleChange (val, index) {
            const product = val[index];
            product.total = parseInt(product.ss_quantity, 10) + parseInt(product.s_quantity, 10) + parseInt(product.m_quantity, 10) + parseInt(product.l_quantity, 10) + parseInt(product.xl_quantity, 10)
            + parseInt(product.xxl_quantity, 10) + parseInt(product.xxxl_quantity, 10) + parseInt(product.xxxxl_quantity, 10);
            if (product.total > 0) {
                product.price = product.amount / product.total;
            }
            val[index] = product;
            this.orderItemData = val;
        },
        handleDel () {

        },
        finishAddItem () {
            this.addItemModal = false;            
        },
        addItem () {
            this.addItemModal = true;
        },
        addItemToOrder () {

        },
        getChannels () {
            const api = `${this.endPoint}channels`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                if (res.body.data) {
                    this.channels = res.body.data;
                }
            });
        },
        getClients () {
            const api = `${this.endPoint}members`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {
                params: {
                    type: 1,
                }
            }, options).then(res => {
                if (res.body.data) {
                    this.clients = res.body.data;
                }
            });
        },
        getInvoiceTypes () {
            const api = `${this.endPoint}invoice-types`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                if (res.body.data) {
                    this.invoiceTypes = res.body.data;
                }
            });
        },
        getDeliverys () {
            const api = `${this.endPoint}members`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {
                params: {
                    type: 3,
                }
            }, options).then(res => {
                if (res.body.data) {
                    this.deliverys = res.body.data;
                }
            });
        },
        getPrintShops () {
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
        getCategorys () {
            const api = `${this.endPoint}categorys`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                if (res.body.data) {
                    this.categorys = res.body.data;
                }
            });
        },
        getAccounts () {
            const api = `${this.endPoint}accounts`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: { type: 1 }}, options).then(res => {
                if (res.body.data) {
                    this.accounts = res.body.data;
                }
            });
        },
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
        getProductInventorys () {
            const api = `${this.endPoint}product-inventorys`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {
                params: this.searchProductForm
            }, options).then(res => {
                if (res.body.data) {
                    this.productInventoryData = res.body.data;
                }
            });
        },
        chooseProduct (from) {
            const product = this.productInventoryData[from];
            if (product.choosed) {
                this.$Message.info(`${product.product_name} - ${product.color_name}已添加到订单, 请不用重复添加`);
            } else {
                product.ss_quantity = 0;
                product.s_quantity = 0;
                product.m_quantity = 0;
                product.l_quantity = 0;
                product.xl_quantity = 0;
                product.xxl_quantity = 0;
                product.xxxl_quantity = 0;
                product.xxxxl_quantity = 0;
                product.total = 0;
                product.amount = 0;
                product.price = 0;
                this.orderItemData.push(product);
            }
            product.choosed = true;
        },
        createOrder () {
            this.$refs['addOrderForm'].validate((valid) => {
                console.log(this.orderItemData.length);
                if (valid) {
                    if (this.orderItemData.length > 0) {
                        if (this.invoiceType > 0 && this.orderReceiptForm.create_date === '') {
                            this.$Message.error('请输入发票信息');
                            return false;
                        }
                        const api = `${this.endPoint}order`;
                        const options = {
                            credentials: false
                        };
                        const orderData = this.addOrderForm;
                        orderData.item_total = this.itemTotal;
                        orderData.item_amount = this.itemAmount;
    
                        const orderReceiptData = this.orderReceiptForm;
                        orderReceiptData.type = this.invoiceType;
                        const data = {
                            orderData,
                            orderItemData: this.orderItemData,
                            orderReceiptData,
                        }
                        this.$http.post(api, data, options).then(res => {
                            if (res.body) {
                                console.log(res.body);
                                const order = res.body.order;
                                this.$Message.success(`${order.order_sn} 创建成功`);
                                this.$refs['addOrderForm'].resetFields();
                                // this.addOrderForm = this.resetForm(orderData);
                            } else {
                                this.$Message.error('创建失败');
                            }
                        }, () => {
                            this.$Message.error('创建失败');
                        });
                    } else {
                        this.$Message.error('请至少选择一件订单产品');
                    }
                } else {
                    this.$Message.error('请输入完创建订单所需信息');                    
                }
            });
        },
        createOrderReset () {
            this.$refs['addOrderForm'].resetFields();
        },
        uploadSuccess(res, file) {
            const type = res.type;
            if (type === 1) {
                this.addOrderForm.printImgs.push(res.path);
            }
            if (type === 2) {
                this.addOrderForm.invoiceImgs.push(res.path);
            }
        },
        removeUpload(file, fileList) {
            const type = file.response.type;
            let list = [];
            if (type === 1) {
                list = this.addOrderForm.printImgs;
            }
            if (type ===2 ) {
                list = this.addOrderForm.invoiceImgs;                
            }
            list.splice(list.indexOf(file.response.path), 1);
        },
        addReceipt(type) {
            this.invoiceType = type;
            this.addReceiptModal = true;
        },
        finishAddReceipt() {
            this.$refs['addOrderReceipt'].validate((valid) => {
                if (valid) {
                    this.addReceiptModal = false;
                }
            });
        },
        cancelAddReceipt() {
            const receiptData = this.orderReceiptForm;
            this.orderReceiptForm = this.resetForm(receiptData);
            this.addReceiptModal = false;
        },
        resetForm(formData) {
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    formData[key] = ''; 
                }
            }
            return formData;
        }
    },
    computed: {
        itemTotal: function() {
            let total = 0;
            this.orderItemData.forEach(item => {
                total += item.total;
            });
            return total;
        },
        itemAmount: function() {
            let amount = 0;
            this.orderItemData.forEach(item => {
                amount += parseInt(item.amount);
            });
            return amount;
        }
    },
    created () {
        this.getChannels();
        this.getClients();
        this.getInvoiceTypes();
        this.getDeliverys();
        this.getPrintShops();
        this.getCategorys();
        this.getAccounts();
        this.getUsers();
        this.addOrderForm.user_id = this.userId;
    }
}
</script>
