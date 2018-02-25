<style lang="less">
    @import './product.less';
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
                    editable: true
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
            categoryList: [],
            colorAttributeID: 1,
            sizeAttributeID: 2,
            colorList: [],
            sizeList: [],
            supplierList: [],
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}products`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                if (res.body.data) {
                    this.editInlineAndCellData = res.body.data;
                }
            });
        },
        getCategoryList () {
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
        getSupplierList () {
            const api = `${this.endPoint}members`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {
                params: {
                    type: 2
                }
            }, options).then(res => {
                if (res.body.data) {
                    this.supplierList = res.body.data;
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
        }
    },
    created () {
        this.getData();
        this.getCategoryList();
        this.getColorList();
        this.getSizeList();
        this.getSupplierList();
    }
};
</script>
