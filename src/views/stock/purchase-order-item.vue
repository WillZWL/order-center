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
                        进货单详情
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
import moment from 'moment';
export default {
    name: 'editable-table',
    components: {
        canEditTable,
    },
    data () {
        return {
            type: 1,
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
                // {
                //     title: '操作',
                //     align: 'center',
                //     key: 'handle',
                //     handle: ['edit', 'delete']
                // }
            ],
            editInlineAndCellData: [],
            saveLoading: false,
            page: 1,
            total: 0,
        };
    },
    methods: {
        getData (params = {}) {
            const po_id = this.$route.params.po_id;
            const api = `${this.endPoint}purchase-order-items`;
            const options = {
                credentials: false
            };
            params.po_id = po_id;
            params.page = 1;
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
        changePage (val) {
            this.page = val;
            const params = this.searchForm;
            this.getData(params);
        }
    },
    computed: {
    },
    created () {
        this.getData();     
    }
};
</script>
