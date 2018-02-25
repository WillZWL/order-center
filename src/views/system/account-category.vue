<style lang="less">
    @import './system.less';
    @import '../../styles/common.less';    
</style>

<template>
    <div class="list">
        <Row class="margin-right-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        分类管理
                        <Button class="add-button" type="primary" @click="addCategory">添加分类</Button>                        
                    </p>
                    <Row>
                        <Col span="24">
                            <can-edit-table
                                v-model="editInlineAndCellData" 
                                @on-cell-change="handleCellChange" 
                                @on-change="handleChange"  
                                @on-delete="handleDel"
                                :editIncell="false" 
                                :columns-list="editInlineAndCellColumn"
                            ></can-edit-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addCategoryModal" :closable='true' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加分类</h3>
            <Form ref="addCategoryForm" :model="addCategoryForm" :label-width="100" label-position="right" :rules='categoryValid'>
                <FormItem label="分类名称" prop="name">
                    <Input v-model="addCategoryForm.name" placeholder="请输入分类名称" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddCategory">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveCategory">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    props: {
        type:{
            type: Number,
        },
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
                    title: '分类名称',
                    align: 'center',
                    key: 'name',
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
            saveLoading: false,
            categoryValid: {
                name: { required: true, message: '请输入分类名称', trigger: 'submit' }
            },
            addCategoryForm: {
                type: this.type,
                name: '',
            },
            addCategoryModal: false,
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}account-categorys`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: { type: this.type }}, options).then(res => {
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
            const api = `${this.endPoint}account-category`;
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
            this.addCategoryModal = true;
        },
        cancelAddCategory () {
            this.addCategoryModal = false;
        },
        saveCategory () {
            this.$refs['addCategoryForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const data = this.addCategoryForm;
                    const api = `${this.endPoint}account-category`;
                    const options = {
                        credentials: false
                    };
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addCategoryForm.name = '';
                            this.$Message.success('添加成功');
                            this.addCategoryModal = false;
                        }
                    });
                }
            });
        },
    },
    created () {
        this.getData();
    }
};
</script>
