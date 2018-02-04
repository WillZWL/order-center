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
                        商品属性管理
                        <Button class="add-button" type="primary" @click="addAttribute">添加属性</Button>
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
                                :customeButtonName="'添加属性值'"
                            ></can-edit-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addAttributeModal" :closable='true' :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加属性</h3>
            <Form ref="addAttributeForm" :model="addAttributeForm" :label-width="100" label-position="right" :rules='formValid'>
                <FormItem label="属性名称" prop="name">
                    <Input v-model="addAttributeForm.name" placeholder="请输入商品属性" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddAttribute">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveAttribute">保存</Button>
            </div>
        </Modal>
        <Modal v-model="addAttributeValueModal" :closable='true' :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加{{ attributeName }}</h3>
            <Form ref="addAttributeValueForm" :model="addAttributeValueForm" :label-width="100" label-position="right" :rules='formValid'>
                <FormItem :label="attributeName" prop="name">
                    <Input v-model="addAttributeValueForm.name" placeholder="请输入属性值" ></Input>
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
            editInlineAndCellColumn: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center'
                },
                {
                    title: '属性名称',
                    align: 'center',
                    key: 'name',
                    editable: true
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    handle: ['edit', 'delete', 'custom']
                },
                {
                    title: '列表',
                    key: 'show_more',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    let query = {
                                        attribute_id: params.row.id,
                                        attribute_name: params.row.name
                                    };
                                    this.$router.push({
                                        name: 'attribute_value',
                                        query: query
                                    });
                                }
                            }
                        }, params.row.name + '列表');
                    }
                }
            ],
            editInlineAndCellData: [],
            addAttributeModal: false,
            addAttributeValueModal: false,
            addAttributeForm: {
                name: ''
            },
            addAttributeValueForm: {
                name: ''
            },
            saveLoading: false,
            formValid: {
                name: { required: true, message: '不允许为空', trigger: 'submit' }
            },
            attributeId: '',
            attributeName: ''
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}attributes`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
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
        clickCustomButton (val, index) {
            this.attributeName = val[index].name;
            this.attributeId = val[index].id;
            this.addAttributeValueModal = true;
        },
        ajaxUpdate (data, msg = '更新') {
            const api = `${this.endPoint}attribute`;
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
        addAttribute () {
            this.addAttributeModal = true;
        },
        cancelAddAttribute () {
            this.addAttributeModal = false;
        },
        saveAttribute () {
            this.$refs['addAttributeForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const api = `${this.endPoint}attribute`;
                    const options = {
                        credentials: false
                    };
                    const data = {
                        name: this.addAttributeForm.name
                    };
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addAttributeForm.name = '';
                            this.$Message.success('添加成功');
                            this.editInlineAndCellData.push(res.body);
                            this.addAttributeModal = false;
                        }
                    });
                }
            });
        },
        cancelAddAttributeValue () {
            this.addAttributeValueModal = false;
        },
        saveAttributeValue () {
            this.$refs['addAttributeValueForm'].validate((valid) => {
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
                        this.addAttributeValueModal = false;
                    }
                });
            });
        }
    },
    created () {
        this.getData();
    }
};
</script>
