<style lang="less">
    @import './product.less';
    @import '../../styles/common.less';
</style>

<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        产品管理
                        <Button class="add-button" type="primary" @click="addProduct">添加产品</Button>
                    </p>
                    <Row>
                        <Col span="24">
                            <Form ref="searchForm" :model="searchForm" :label-width="100" label-position="right">
                                <Row class="margin-top-10">
                                    <Col span="12">
                                        <FormItem label="产品名称">
                                            <Input v-model="searchForm.name" placeholder="请输入产品名称"></Input>
                                        </FormItem>
                                    </Col>
                                    <Col span="12">
                                        <FormItem label="产品编号">
                                            <Input v-model="searchForm.code" placeholder="请输入产品编号"></Input>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8" offset="12">
                                        <Button type="primary" @click="searchProduct">查询</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <Row class="margin-top-10">
                        <Col span="24">
                            <can-edit-table
                                v-model="editInlineAndCellData" 
                                @on-cell-change="handleCellChange" 
                                @on-change="handleChange"  
                                @on-delete="handleDel"
                                @click-customButton="clickCustomButton"
                                :columns-list="editInlineAndCellColumn"
                                :customeButtonName="'编辑'"
                            ></can-edit-table>
                        </Col>
                        <Col span="24" class="align-right margin-top-10">
                            <Page :total="total" :page-size="20" @on-change="changePage" show-total></Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addProductModal" :closable='true' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加产品</h3>
            <Form ref="addProductForm" :model="addProductForm" :label-width="100" label-position="right" :rules='productValid'>
                <FormItem label="分类" prop="cate_id">
                    <Select v-model="addProductForm.cate_id">
                        <Option v-for="cate in categoryList" :value="cate.id" :key="cate.id">{{ cate.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="产品名称" prop="name">
                    <Input v-model="addProductForm.name" placeholder="请输入产品名称"></Input>
                </FormItem>
                <FormItem label="商品编码" prop="code">
                    <Input v-model="addProductForm.code" placeholder="请输入商品编码"></Input>
                </FormItem>
                <FormItem label="成本" prop="cost">
                    <Input v-model="addProductForm.cost" placeholder="请输入成本"></Input>
                </FormItem>
                <FormItem label="售价" prop="price">
                    <Input v-model="addProductForm.price" placeholder="请输入售价"></Input>
                </FormItem>
                <FormItem label="属性">
                    <Tabs type="card">
                        <TabPane label="颜色">
                            <CheckboxGroup v-model="addProductForm.color">
                                <Checkbox v-for="color in colorList" :value="color.id" :key="color.id" :label="color.value"></Checkbox>
                            </CheckboxGroup>
                        </TabPane>
                        <TabPane label="尺寸">
                            <CheckboxGroup v-model="addProductForm.size">
                                <Checkbox v-for="size in sizeList" :value="size.id" :key="size.id" :label="size.value"></Checkbox>                                
                            </CheckboxGroup>
                        </TabPane>
                    </Tabs>
                </FormItem>
                <FormItem label="供货信息" prop="supplier_id">
                    <Select v-model="addProductForm.supplier_id">
                        <Option v-for="supplier in supplierList" :value="supplier.id" :key="supplier.id">{{ supplier.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="addProductForm.remark" placeholder="请输入备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddProduct">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveProduct">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
import tableData from './../common/components/table_data.js';
export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            editInlineAndCellColumn: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center'
                },
                {
                    title: '分类',
                    align: 'center',
                    key: 'cate_name',
                    editable: false
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'name',
                    editable: true
                },
                {
                    title: '商品编码',
                    align: 'center',
                    key: 'code',
                    editable: true
                },
                {
                    title: '成本（元）',
                    align: 'center',
                    key: 'cost',
                    editable: true
                },
                {
                    title: '售价（元）',
                    align: 'center',
                    key: 'price',
                    editable: true
                },
                {
                    title: '颜色',
                    align: 'center',
                    key: 'color',
                    editable: false
                },
                {
                    title: '尺码',
                    align: 'center',
                    key: 'size',
                    editable: false
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'quantity',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                on: {
                                    click: () => {
                                        let query = {
                                            product_id: params.row.id,
                                        };
                                        this.$router.push({
                                            name: 'inventory',
                                            query: query
                                        });
                                    }
                                }
                            }, params.row.quantity)
                        ]);
                    }
                },
                {
                    title: '供应商',
                    align: 'center',
                    key: 'supplier_name',
                    editable: false
                },
                {
                    title: '备注',
                    align: 'center',
                    key: 'remark',
                    editable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['', 'delete',  'custom']
                }
            ],
            editInlineAndCellData: [],
            addProductModal: false,
            addProductForm: {
                id: '',
                cate_id: '',
                name: '',
                code: '',
                cost: '',
                price: '',
                color: [],
                size: [],
                supplier_id: '',
                remark: '',
                status: 1,
            },
            saveLoading: false,
            productValid: {
                name: { required: true, message: '请输入商品分类名称', trigger: 'submit' }
            },
            colorAttributeID: 1,
            sizeAttributeID: 2,
            colorList: [],
            sizeList: [],
            searchForm: {
                name: '',
                code: '',
            },
            page: 1,
            total: 0,
        };
    },
    methods: {
        getData (params = {}) {
            const api = `${this.endPoint}products`;
            const options = {
                credentials: false
            };
            params.page = this.page;
            this.$http.get(api, { params }, options).then(res => {
                if (res.body.data) {
                    res.body.data.rows.forEach(product => {
                        product.quantity = 0;
                        if (product.inventory.length > 0) {
                            const inv = product.inventory[0];
                            product.quantity = parseInt(inv.ss_quantity, 10) + parseInt(inv.s_quantity, 10) + parseInt(inv.m_quantity, 10) 
                            + parseInt(inv.l_quantity, 10) + parseInt(inv.xl_quantity, 10) + parseInt(inv.xxl_quantity, 10) + parseInt(inv.xxxl_quantity, 10) + parseInt(inv.xxxxl_quantity, 10);
                        }
                    });
                    this.editInlineAndCellData = res.body.data.rows;
                    this.total = res.body.data.count.length;
                }
            });
        },
        getColorList () {
            this.getAttributeValue(this.colorAttributeID);
        },
        getSizeList () {
            this.getAttributeValue(this.sizeAttributeID);            
        },
        getAttributeValue (attributeID) {
            const api = `${this.endPoint}attribute-values`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: {attribute_id: attributeID}}, options).then(res => {
                if (res.body.data) {
                    if (attributeID === this.colorAttributeID) {
                        this.colorList = res.body.data;
                    }
                    if (attributeID === this.sizeAttributeID) {
                        this.sizeList = res.body.data;
                    }
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
            const api = `${this.endPoint}product`;
            const options = {
                credentials: false
            };
            this.$http.post(api, data, options).then(res => {
                if (res.body.id) {
                    this.$Message.success(`${msg}成功`);
                } else {
                    this.$Message.error(`${msg}失败`);
                }
            });
        },
        addProduct () {
            this.addProductModal = true;
        },
        cancelAddProduct () {
            this.addProductModal = false;
        },
        saveProduct () {
            this.$refs['addProductForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const api = `${this.endPoint}product`;
                    const options = {
                        credentials: false
                    };
                    const data = this.addProductForm;
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (this.addProductForm.id) {
                            this.$Message.success('更新成功');
                            this.getData();                     
                        } else {
                            this.editInlineAndCellData.push(res.body);
                            this.$Message.success('添加成功');
                        }
                        this.addProductModal = false;
                    }).catch((err) => {
                        this.$Message.error('更新失败');
                    });
                }
            });
        },
        clickCustomButton (val, index) {
            this.addProductForm = val[index];
            this.addProductForm.color = val[index].color.split(',');
            this.addProductForm.size = val[index].size.split(',');
            this.addProductModal = true;
        },
        searchProduct () {
            const params = this.searchForm;
            this.page = 1;
            this.getData(params);
        },
        changePage (val) {
            this.page = val;
            const params = this.searchForm;
            this.getData(params);
        }
    },
    computed: {
        categoryList () {
            return this.$store.state.data.categorys; 
        },
        supplierList () {
            return this.$store.state.data.suppliers;
        },
    },
    created () {
        this.getData();
        this.$store.dispatch('getCategorys');
        this.getColorList();
        this.getSizeList();
        if (this.$store.state.data.suppliers.length === 0) {
            this.$store.dispatch('getMembers', { type: [ 2 ] });
        }
    }
};
</script>
