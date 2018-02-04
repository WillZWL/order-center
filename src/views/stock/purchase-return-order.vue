<style lang="less">
    @import '../../styles/common.less';
    @import './stock.less';
</style>
<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        进货退货单
                        <Button class="add-button" type="primary" @click="addPo">添加进货退货单</Button>
                    </p>
                    <Row>
                        <Col span="24">
                            <can-edit-table
                                v-model="editInlineAndCellData" 
                                @on-cell-change="handleCellChange" 
                                @on-change="handleChange"  
                                @on-delete="handleDel"
                                :editIncell="true" 
                                :columns-list="editInlineAndCellColumn"
                            ></can-edit-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addPoModal" :closable='true' :mask-closable=false :width="800">
            <h3 slot="header" style="color:#2D8CF0">进货退货单</h3>
            <Collapse v-model="panelValue" accordion>
                <Panel name="searchPanel">
                    搜索选择产品
                    <p slot="content">
                        <Row>
                            <Col span="24">
                                <Card>
                                    <Form ref="searchProductForm" :model="addPoForm" :label-width="80" label-position="right">
                                        <Row>
                                            <Col span="8">
                                                <FormItem label="分类">
                                                    <Select v-model="searchProductForm.cate_id">
                                                        <Option v-for="cate in categoryList" :value="cate.id" :key="cate.id">{{ cate.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                                <FormItem label="产品名称">
                                                    <Input v-model="searchProductForm.name" placeholder="请输入产品名称, 支持模糊搜索" ></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                                <FormItem label="产品编码">
                                                    <Input v-model="searchProductForm.code" placeholder="请输入产品编码, 支持模糊搜索" ></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span="4" offset="11">
                                                <Button type="primary" @click="searchProduct">搜索</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                        <Row class="margin-top-10">
                            <Col span="24">
                                <Card>
                                    <p slot="title">
                                        搜索结果
                                    </p>
                                    <DragableTable :columnsList="searchColumnsList" v-model="searchProductData" @on-choose="chooseProduct"></DragableTable>
                                </Card>
                            </Col>
                        </Row>
                    </p>
                </Panel>
                <Panel name="stockPanel">
                    添加库存： <b>{{ chooseedProduct.name }}</b>
                    <p slot="content">
                        <Row>
                            <Col span="24">
                                <can-edit-table
                                    v-model="stockListData"
                                    :editIncell="true" 
                                    :columns-list="stockColumsList"
                                ></can-edit-table>
                            </Col>
                        </Row>
                    </p>
                </Panel>
            </Collapse>
            
            <div slot="footer">
                <Button type="text" @click="cancelAddPo">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="savePo">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import DragableTable from './../common/components/dragableTable.vue';
import canEditTable from './../common/components/canEditTable.vue';
export default {
    name: 'editable-table',
    components: {
        canEditTable,
        DragableTable
    },
    data () {
        return {
            type: 1,
            panelValue: 'searchPanel',
            endPoint: this.$store.state.app.endPoint,
            editInlineAndCellColumn: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 50,
                },
                {
                    title: '编号',
                    align: 'center',
                    key: 'product_code',
                    editable: false
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'product_name',
                    width: 200,
                    editable: false
                },
                {
                    title: '分类',
                    align: 'center',
                    key: 'cate_name',
                    editable: false
                },
                {
                    title: '颜色',
                    align: 'center',
                    key: 'color_name',
                    editable: false
                },
                {
                    title: '单价',
                    align: 'center',
                    key: 'price',
                    editable: false
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
                    title: '金额',
                    align: 'center',
                    key: 'amount',
                    editable: false
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['edit', 'delete']
                }
            ],
            editInlineAndCellData: [],
            addPoModal: false,
            addPoForm: {
                name: ''
            },
            searchProductForm: {
                cate_id: '',
                name: '',
            },
            saveLoading: false,
            categoryList: [],
            searchColumnsList: [
                {
                    title: '分类名称',
                    align: 'center',
                    key: 'cate_name',
                },
                {
                    title: '产品名称',
                    align: 'center',
                    key: 'name',
                },
                {
                    title: '成本',
                    align: 'center',
                    key: 'cost',
                },
                {
                    title: '售价',
                    align: 'center',
                    key: 'price',
                }
            ],
            searchProductData: [],
            chooseedProduct: {
                id: '',
                name: '',
                color: [],
            },
            stockColumsList: [
                {
                    title: '颜色',
                    align: 'center',
                    key: 'color',
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
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['edit', 'delete']
                }
            ],
            stockListData: [],
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}purchase-orders`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                this.editInlineAndCellData = res.body.data;
            });
        },
        getCategorys () {
            const api = `${this.endPoint}categorys`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                if (res.body.data) {
                    this.categoryList = res.body.data;
                }
            });
        },
        handleDel (val, index) {
            const data = val[index];
            data.status = 0;
            this.ajaxUpdate(data, '删除');
        },
        handleCellChange (val, index, key) {
            const data = val[index];
            this.ajaxUpdate(data);
        },
        handleChange (val, index) {
            const data = val[index];
            this.ajaxUpdate(data);
        },
        ajaxUpdate (data, msg = '更新') {
            const api = `${this.endPoint}purchase-order`;
            const options = {
                credentials: false
            };
            this.$http.post(api, data, options).then(res => {
                if (res.body.id) {
                    this.$Message.success(`${msg}成功`);
                    this.getData();
                } else {
                    this.$Message.error(`${msg}失败`);
                }
            });
        },
        addPo () {
            this.addPoModal = true;
        },
        cancelAddPo () {
            this.addPoModal = false;
        },
        savePo () {
            this.saveLoading = true;
            const api = `${this.endPoint}purchase-order`;
            const options = {
                credentials: false
            };
            const data = {
                product_id: this.chooseedProduct.id,
                stock_list: this.stockListData,
            };
            this.$http.post(api, data, options).then(res => {
                this.saveLoading = false;
                if (res.body.status) {
                    this.$Message.error(res.body.message);
                } else {
                    this.addPoForm.name = '';
                    this.$Message.success('添加成功');
                    this.getData();
                    this.addPoModal = false;
                }
            });
        },
        searchProduct () {
            const api = `${this.endPoint}products`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                this.searchProductData = res.body.data;
            });
        },
        chooseProduct (from) {
            this.chooseedProduct.id = this.searchProductData[from].id;
            this.chooseedProduct.name = this.searchProductData[from].name;
            this.chooseedProduct.color = this.searchProductData[from].color.split(',');
            this.getStockListData();
            this.addStock();
        },
        getStockListData () {
            this.stockListData = [];
            this.chooseedProduct.color.forEach(color => {
                const stock = {
                    color: color,
                    ss_quantity: 0,
                    s_quantity: 0,
                    m_quantity: 0,
                    l_quantity: 0,
                    xl_quantity: 0,
                    xxl_quantity: 0,
                    xxxl_quantity: 0,
                    xxxxl_quantity: 0,
                };
                this.stockListData.push(stock);
            }) 
        },
        addStock () {
            this.panelValue = 'stockPanel';
        },
    },
    created () {
        this.getData();
        this.getCategorys();
    }
};
</script>
