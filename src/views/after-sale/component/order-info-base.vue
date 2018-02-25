<template>
    <div>
        <Form>
            <Row>
                <Col span="8">
                    <Card>
                        <FormItem label="订单日期">
                            {{ order.order_date}}
                        </FormItem>
                        <FormItem label="购买单位">
                            {{ order.client_name }}
                        </FormItem>
                        <FormItem label="订单来源">
                            {{ order.channel_name }}
                        </FormItem>
                        <FormItem label="接单人">
                            {{ order.creator }}
                        </FormItem>
                    </Card>
                </Col>
                <Col span="8" class="padding-left-8">
                    <Card>
                        <FormItem label="票据类型">
                            {{ invoiceType }}
                        </FormItem>
                        <FormItem label="快递公司">
                            {{ order.delivery_company_name }}
                        </FormItem>
                        <FormItem label="发货时间">
                            {{ order.delivery_time }}
                        </FormItem>
                        <FormItem label="应收尾款">
                            {{ order.amount - order.payment_amount }}
                        </FormItem>
                    </Card>                
                </Col>
                <Col span="8" class="padding-left-8">
                    <Card>
                        <Table v-if="orderPrints.length>0" :columns="printCol" :data="orderPrints" border></Table>                        
                    </Card>          
                </Col>
            </Row>
            <Row class="margin-top-10 item-total">
                <Card>
                    <Table :columns="itemCol" :data="orderItemList" border></Table>
                    <div class="margin-top-10">合计
                        <ul>
                            <li>{{ order.item_quantity }}</li>
                            <li v-if="isPrint === '0'">{{ parseInt(order.amount / order.item_quantity, 10) }}</li>
                            <li v-if="isPrint === '0'">{{ order.amount }}</li>                                
                        </ul>
                    </div>
                </Card>
            </Row>
            <Row class="margin-top-10 print">
                <Card v-if="order.status <= 1">
                    <p slot="title">
                        付款凭证            
                    </p>
                    <div v-for="attach in orderAttachment" :key="attach.id" v-if="attach.type === 2">
                        <img :src="`${siteUrl}${attach.path}`" :alt="attach.order_sn">
                    </div>
                </Card>
                <Card v-if="order.status > 1">
                    <p slot="title">
                        印刷图            
                    </p>
                    <div v-for="attach in orderAttachment" :key="attach.id" v-if="attach.type === 1">
                        <img :src="`${siteUrl}${attach.path}`" v-if="isPrint === '1'" @load="imageLoaded" :alt="attach.order_sn">
                        <img :src="`${siteUrl}${attach.path}`" v-else :alt="attach.order_sn">                        
                    </div>
                </Card>

            </Row>
            <Row class="margin-top-10">
                <Card>
                    特殊备注：{{ order.remark }}
                </Card>
            </Row>
        </Form>
    </div>
</template>
<script>

const invoiceTypeArr = [ '', '发票', '收据' ];
const printCol = [
    {
        title: '印刷工艺',
        key: 'typeStr',
        align: 'center',
    },
    {
        title: '印刷厂',
        key: 'printshop_name',
        align: 'center',
    },
    {
        title: '印刷费用',
        key: 'printcost',
        align: 'center',
    }
];
const itemCol = [
    {
        title: '型号',
        key: 'product_id',
    },
    {
        title: '产品简称',
        key: 'product_name',
    },
    {
        title: '颜色',
        key: 'color'
    },
    {
        title: 'SS',
        key: 'ss_quantity',
    },
    {
        title: 'S',
        key: 's_quantity',                    
    },
    {
        title: 'M',
        key: 'm_quantity',
    },
    {
        title: 'L',
        key: 'l_quantity',
    },
    {
        title: 'XL',
        key: 'xl_quantity',
    },
    {
        title: '2XL',
        key: 'xxl_quantity',
    },
    {
        title: '3XL',
        key: 'xxxl_quantity',
    },
    {
        title: '4XL',
        key: 'xxxxl_quantity',
    },
    {
        title: '数量',
        key: 'total_quantity',
        width: 80,                    
    },
    {
        title: '单价',
        key: 'price',
        width: 80,                    
    },
    {
        title: '合计',
        key: 'amount',
        width: 80,
    },
];

export default {
    name: 'order-info-base',
    props: [ 'order', 'orderItemList', 'orderAttachment', 'orderReceipt', 'orderPrints', 'isPrint' ],
    data() {
        return {
            siteUrl: this.$store.state.app.siteUrl,
            printCol: printCol,
            itemCol: itemCol,
            loadedImages: 0,
        }
    },
    methods: {
        init () {
            if (this.isPrint === '1') {
                this.itemCol =  [
                    {
                        title: '型号',
                        key: 'product_id',
                        width: 65,
                    },
                    {
                        title: '产品简称',
                        key: 'product_name',
                        width: 200,
                        
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        width: 45,                     
                    },
                    {
                        title: 'SS',
                        key: 'ss_quantity',
                        width: 45,                        
                    },
                    {
                        title: 'S',
                        width: 45,                        
                        key: 's_quantity',                  
                    },
                    {
                        title: 'M',
                        width: 45,                        
                        key: 'm_quantity',
                    },
                    {
                        title: 'L',
                        width: 45,                        
                        key: 'l_quantity',
                    },
                    {
                        title: 'XL',
                        width: 45,                        
                        key: 'xl_quantity',
                    },
                    {
                        title: '2XL',
                        width: 45,                        
                        key: 'xxl_quantity',
                    },
                    {
                        title: '3XL',
                        width: 45,                        
                        key: 'xxxl_quantity',
                    },
                    {
                        title: '4XL',
                        width: 45,                        
                        key: 'xxxxl_quantity',
                    },
                    {
                        title: '数量',
                        key: 'total_quantity',
                        width: 45,                    
                    },
                ];
                this.printCol = [
                    {
                        title: '印刷工艺',
                        key: 'typeStr',
                        width: 80,
                        align: 'center',
                    },
                    {
                        title: '印刷厂',
                        key: 'printshop_name',
                        width: 80,                        
                        align: 'center',
                    },
                    {
                        title: '印刷费用',
                        key: 'printcost',
                        width: 80,                        
                        align: 'center',
                    }
                ];
            } else {
                this.itemCol = itemCol;
                this.printCol = printCol;
            }
        },
        imageLoaded () {
            if (this.isPrint === '1') {
                this.loadedImages += 1;
                if (this.loadedImages >= this.printImgsCount) {
                    window.print();
                }
            }
        }
    },
    computed: {
        invoiceType: function() {
          return invoiceTypeArr[this.order.invoice_type];  
        },
        printImgsCount: function () {
            let count = 0;
            this.orderAttachment.forEach(attach => {
                if (attach.type === 1) {
                    count += 1;
                }
            });
            return count;
        }
    },
    watch: {
        isPrint () {
            this.init();
        },
    },
    created() {     
        this.init();
    },
    activated () {
        this.init();
    },
}
</script>