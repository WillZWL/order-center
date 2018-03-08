<template>
<div>
    <Modal v-model="addReceiptModal" :closable='true' :mask-closable=false :width="800">
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
                            <Option v-for="user in users" :value="`${user.id}`" :key="`${user.id}${user.name}`">{{ user.name }}</Option>
                        </Select>
                    </FormItem>                      
                </Col>
            </Row>
            <Row>
                <Col span="12">
                    <FormItem label="购买单位" prop="client_id">   
                        <Select v-model="orderReceiptForm.client_id" placeholder="请选择购买单位">
                            <Option v-for="client in clients" :value="`${client.id}`" :key="`${client.id}${client.name}`">{{ client.name }}</Option>
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
    export default {
        name: 'order-receipt',
        props: {
            invoiceType: {
                type: Number,
                default: 1,
            },
            orderId: {
                type: Number,
                default: 0,
            }
        },
        data () {
            return {
                endPoint: this.$store.state.app.endPoint,
                addReceiptModal: false,
                receiptValid: {
                    create_date: [
                        { required: true, type:'date', message: '请输入发票日期', trigger: 'change' },
                    ],
                    user_id: [
                        { required: true, message: '请输入接单人', trigger: 'change' },
                    ],
                    client_id: [
                        { required: true, message: '请选择购买单位', trigger: 'change' },
                    ],
                    client_name: [
                        { required: true, message: '请输入单位名称', trigger: 'change' },
                    ],
                    tax_no: [
                        { required: true, message: '请输入税号', trigger: 'change' },
                    ],
                    quantity: [
                        { required: true, message: '请输入数量', trigger: 'change' },
                    ],
                    amount: [
                        { required: true, message: '请输入金额', trigger: 'change' },  
                    ],
                },
            }
        },
        computed: {
            clients () {
                return this.$store.state.data.clients;
            },
            users () {
                return this.$store.state.data.users;
            },
            orderReceiptForm () {
                return this.$store.state.order.orderReceipt;
            }
        },
        methods: {
            showReceiptModal() {
                this.addReceiptModal = true;
            },
            finishAddReceipt() {
                this.$refs['addOrderReceipt'].validate((valid) => {
                    if (valid) {
                        this.orderReceiptForm.type = this.invoiceType;
                        if (this.orderId === 0) {
                            this.$store.commit('setOrderReceipt', this.orderReceiptForm);
                        } else {
                            this.orderReceiptForm.order_id = this.orderId;
                            const data = this.orderReceiptForm;
                            const options = {
                                credentials: false
                            };
                            const api = `${this.endPoint}order/receipt`;
                            this.$http.post(api, data, options).then(res => {
                                if (res.body) {
                                    const receipt = res.body.receipt;
                                    console.log(receipt);
                                } else {
                                    this.$Message.error('补增失败');
                                }
                            }, () => {
                                this.$Message.error('补增失败');
                            });
                        }
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
        created () {
            this.$store.dispatch('getUsers');   
        }
    }
</script>