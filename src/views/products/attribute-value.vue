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
                        商品{{ attributeName }}管理
                        <Button class="add-button" type="primary" @click="addCategory">添加{{ attributeName }}</Button>
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
        <Modal v-model="addAttributeValueModal" :closable='true' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加{{ attributeName }}</h3>
            <Form ref="addAttributeValueForm" :model="addAttributeValueForm" :label-width="100" label-position="right" :rules='valid'>
                <FormItem :label="attributeName" prop="name">
                    <Input v-model="addAttributeValueForm.name" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddAttributeValue">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveAttributeValue">保存</Button>
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
            attributeName: this.$route.query.attribute_name,
            attributeId: this.$route.query.attribute_id,
            editInlineAndCellColumn: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center'
                },
                {
                    title: '属性',
                    align: 'center',
                    key: 'attribute_name'
                },
                {
                    title: '属性值',
                    align: 'center',
                    key: 'value',
                    editable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['edit', 'delete']
                }
            ],
            editInlineAndCellData: [],
            addAttributeValueModal: false,
            addAttributeValueForm: {
                name: ''
            },
            saveLoading: false,
            valid: {
                name: { required: true, message: '不允许为空', trigger: 'submit' }
            }
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}attribute-values`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: {attribute_id: this.attributeId}}, options).then(res => {
                if (res.body.data) {
                    this.editInlineAndCellData = res.body.data;
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
            const api = `${this.endPoint}attribute-value`;
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
        addCategory () {
            this.addAttributeValueModal = true;
        },
        cancelAddAttributeValue () {
            this.addAttributeValueModal = false;
        },
        saveAttributeValue () {
            this.$refs['addAttributeValueForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const api = `${this.endPoint}attribute-value`;
                    const options = {
                        credentials: false
                    };
                    const data = {
                        attribute_id: this.attributeId,
                        attribute_name: this.attributeName,
                        value: this.addAttributeValueForm.name
                    };
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addAttributeValueForm.name = '';
                            this.$Message.success('添加成功');
                            this.editInlineAndCellData.push(res.body);
                            this.addAttributeValueModal = false;
                        }
                    });
                }
            });
        }
    },
    created () {
        this.getData();
    }
};
</script>
