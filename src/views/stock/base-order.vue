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
                        {{ typeName }}
                        <Button class="add-button" type="primary" @click="addPo">添加{{ typeName }}</Button>
                    </p>
                    <Row>
                        <Col span="24">
                            <can-edit-table
                                v-model="editInlineAndCellData" 
                                @on-cell-change="handleCellChange" 
                                @on-change="handleChange"  
                                @on-delete="handleDel"
                                @click-customButton="clickCustomButton"
                                :editIncell="true" 
                                :columns-list="editInlineAndCellColumn"
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
        <Modal v-model="addPoModal" :closable='true' :mask-closable=false :width="1000">
            <h3 slot="header" style="color:#2D8CF0">{{ typeName }}</h3>
            <Collapse v-model="panelValue" accordion>
                <Panel name="basePanel">
                    基本信息
                    <p slot="content">
                        <Row>
                            <Col span="24">
                                <Card>
                                    <Form ref="baseForm" :model="addPoBaseForm" :label-width="80" label-position="right">
                                        <Row>
                                            <Col span="8">
                                                <FormItem label="供货商">
                                                    <Select v-model="addPoBaseForm.supplier_id">
                                                        <Option v-for="supplier in supplierList" :value="supplier.id" :key="supplier.id+supplier.name">{{ supplier.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                                <FormItem label="经手人">
                                                    <Select v-model="addPoBaseForm.user_id">
                                                        <Option v-for="user in userList" :value="user.id" :key="user.id+user.name">{{ user.name }}</Option>
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                                <FormItem label="创建日期">
                                                    <DatePicker format="yyyy-MM-dd" type="date" v-model="addPoBaseForm.create_date" placeholder="创建日期" style="width:100%"></DatePicker>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                                <FormItem label="摘要">
                                                    <Input type="textarea" :rows="4" placeholder="摘要" v-model="addPoBaseForm.note"></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                                <FormItem label="附加说明">
                                                    <Input type="textarea" :rows="4" placeholder="附加说明" v-model="addPoBaseForm.remark"></Input>
                                                </FormItem>
                                            </Col>
                                            <Col span="8">
                                            </Col>
                                            <Col span="4" offset="11">                                          
                                                <Button type="primary" @click="addBase">确定</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card>
                            </Col>
                        </Row>
                    </p>
                </Panel>
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
                    添加产品： <b>{{ chooseedProduct.name }}</b>
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
import moment from 'moment';
export default {
    name: 'base-order',
    components: {
        canEditTable,
        DragableTable
    },
    props: [ 'type' ],
    data () {
        return {
            panelValue: 'basePanel',
            endPoint: this.$store.state.app.endPoint,
            editInlineAndCellColumn: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center',
                    width: 50,
                },
                {
                    title: '供应商',
                    align: 'center',
                    key: 'supplier_name',
                    width: 200,
                    editable: false
                },
                {
                    title: '创建人',
                    align: 'center',
                    key: 'user_name',
                    editable: false
                },
                {
                    title: '总数量',
                    align: 'center',
                    key: 'quantity',
                    editable: false
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'amount',
                    editable: false
                },
                {
                    title: '摘要',
                    align: 'center',
                    key: 'note',
                    editable: false
                },
                {
                    title: '创建时间',
                    align: 'center',
                    key: 'create_date',
                    editable: false
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['', 'delete', 'custom']
                }
            ],
            editInlineAndCellData: [],
            addPoModal: false,
            addPoBaseForm: {
                create_date: moment().format('YYYY-MM-DD'),
            },
            addPoForm: {
                name: ''
            },
            searchProductForm: {
                cate_id: '',
                name: '',
            },
            saveLoading: false,
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
                    title: '单价',
                    align: 'center',
                    key: 'price',
                    editable: true,
                },
                {
                    title: '金额',
                    align: 'center',
                    key: 'amount',
                    editable: true,
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['edit', 'delete']
                }
            ],
            stockListData: [],
            page: 1,
            total: 0,
        };
    },
    methods: {
        getData (params = {}) {
            const api = `${this.endPoint}purchase-orders`;
            const options = {
                credentials: false
            };
            params.page = 1;
            params.type = this.type;
            this.$http.get(api, { params }, options).then(res => {
                this.editInlineAndCellData = res.body.data.rows;
                this.total = res.body.data.count;
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
                po_item: this.stockListData,
                po_base: this.addPoBaseForm,
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
                this.searchProductData = res.body.data.rows;
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
                    editting: true,
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
        addBase () {
            this.panelValue = 'searchPanel';
        },
        changePage (val) {
            this.page = val;
            const params = this.searchForm;
            this.getData(params);
        },
        clickCustomButton (val, index) {
            const po = val[index];
            let argu = { po_id: po.id };
            this.$router.push({
                name: 'po-item',
                params: argu
            });
        },
    },
    computed: {
        categoryList () {
            return this.$store.state.data.categorys; 
        },
        supplierList () {
            return this.$store.state.data.suppliers;
        },
        userList () {
            return this.$store.state.data.users;            
        },
        typeName () {
            if (this.type === 1) {
                return '进货入库单';
            } else if (this.type === 2) {
                return '进货退货单';
            }
        }
    },
    created () {
        this.getData();
        this.$store.dispatch('getCategorys');
        if (this.$store.state.data.suppliers.length === 0) {
            this.$store.dispatch('getMembers', { type: [ 2 ] });
        }
        this.$store.dispatch('getUsers');        
    }
};
</script>
