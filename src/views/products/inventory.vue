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
                        库存查询
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
                                        <Button type="primary" @click="searchInventory">查询</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                        <Col span="24" class="margin-top-10">
                            <can-edit-table
                                v-model="editInlineAndCellData"
                                :columns-list="editInlineAndCellColumn"
                            ></can-edit-table>
                        </Col>
                        <Col span="24" class="align-right margin-top-10">
                            <Page :total="total" :page-size="20" @on-change="changePage" show-total></Page>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
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
            ],
            editInlineAndCellData: [],
            searchProductForm: {
                cate_id: '',
                name: '',
            },
            saveLoading: false,
            categoryList: [],
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
            const api = `${this.endPoint}product/inventorys`;
            const options = {
                credentials: false
            };
            params.page = this.page;            
            this.$http.get(api, { params }, options).then(res => {
                this.editInlineAndCellData = res.body.data.rows;
                this.total = res.body.data.count;
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
        searchInventory () {
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
    created () {
        this.getData();
        this.getCategorys();
    }
};
</script>
