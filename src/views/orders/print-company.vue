<template>
    <Modal v-model="orderPrintModal" :closable='true' :mask-closable=false :width="800">
        <h3 slot="header" style="color:#2D8CF0">印刷分派</h3>
        <Form ref="orderPrint" :model="orderPrintForm" :label-width="100" label-position="right">
            <Row>
                <Col span="12">
                    <FormItem label="印刷厂">
                        <Select v-model="orderPrintForm.printshop[1]" clearable placeholder="请选择印刷厂">
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
                        <Select v-model="orderPrintForm.printshop[2]" clearable placeholder="请选择热印厂">
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
                        <Select v-model="orderPrintForm.printshop[3]" clearable placeholder="请选择刺绣厂">
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
</template>

<script>
export default {
    name: 'print-company',
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            orderPrintModal: false,
        };
    },
    methods: {
        showOrderPrint() {
            this.orderPrintModal = true;
            if (this.printShops.length === 0) {
                this.$store.dispatch('getMembers', { type: [ 4, 5, 6] });
            }
        },
        cancelPrint() {
            this.orderPrintModal = false;
        },
        confirmOrderPrint() {
            if (!this.orderPrintForm.printshop[1] && !this.orderPrintForm.printshop[2] && !this.orderPrintForm.printshop[3]) {
                this.$Message.error('请至少分派一种印刷');
                return false;
            }
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
                if (res.body.orderPrint) {
                    this.$store.commit('setOrderPrints', res.body.orderPrint);
                    this.$store.commit('setOrderPrintForm', res.body.orderPrint);
                    this.orderPrintModal = false;
                } 
            });
        },
    },
    computed: {
        printShops () {
            return this.$store.state.data.printShops;
        },
        order () {
            return this.$store.state.order.order;
        },
        orderPrintForm () {
            return this.$store.state.order.orderPrintForm;
        },
    }
    
}
</script>
