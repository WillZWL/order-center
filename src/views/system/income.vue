<style lang="less">
    @import './system.less';    
</style>

<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="8">
                <account-category :type="type"></account-category>
            </Col>
            <Col span="16">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        其他收入管理
                        <Button class="add-button" type="primary" @click="addCash">添加其他收入</Button>                     
                    </p>
                    <Row>
                        <Col span="24">
                            <can-edit-table
                                v-model="editInlineAndCellData" 
                                @on-cell-change="handleCellChange" 
                                @on-change="handleChange"  
                                @on-delete="handleDel"
                                :columns-list="editInlineAndCellColumn"
                            ></can-edit-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addCashModal" :closable='true' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加其他收入</h3>
            <Form ref="addCashForm" :model="addCashForm" :label-width="100" label-position="right" :rules='cashValid'>
                <FormItem label="分类" prop="category">
                    <Select v-model="addCashForm.category">
                        <Option v-for="cate in categoryList" :value="`${cate.id}`" :key="cate.id">{{ cate.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="科目" prop="subject">
                    <Input v-model="addCashForm.subject" placeholder="请输入科目" ></Input>                 
                </FormItem>
                <FormItem label="编号" prop="subject_code">
                    <Input v-model="addCashForm.subject_code" placeholder="请输入科目编号" ></Input>                                     
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="addCashForm.remark" placeholder="请输入备注" ></Input>                                                         
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddCash">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveCash">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import canEditTable from './../common/components/canEditTable.vue';
import accountCategory from './account-category.vue';
export default {
    name: 'editable-table',
    components: {
        canEditTable,
        accountCategory
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            type: 3,
            editInlineAndCellColumn: [
                {
                    title: '序号',
                    type: 'index',
                    align: 'center'
                },
                {
                    title: '分类',
                    align: 'center',
                    key: 'category_name',
                    editable: true
                },
                {
                    title: '科目',
                    align: 'center',
                    key: 'subject',
                    editable: true
                },
                {
                    title: '科目编号',
                    align: 'center',
                    key: 'subject_code',
                    editable: true
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
                    handle: ['edit', 'delete']
                }
            ],
            editInlineAndCellData: [],
            addCashModal: false,
            addCashForm: {
                type: 3,
                category: '',
                category_name: '',
                subject: '',
                subject_code: '',
                remark: ''
            },
            saveLoading: false,
            cashValid: {           
                category: { required: true, message: '请选择分类', trigger: 'submit' },             
                subject: { required: true, message: '请输入科目', trigger: 'submit' },
                subject_code: { required: true, message: '请输入科目编号', trigger: 'submit' },                
            },
            categoryList: [],
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}accounts`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: { type: this.type }}, options).then(res => {
                if (res.body.data) {
                    this.editInlineAndCellData = res.body.data;
                }
            });
        },
        getCategoryList () {
            const api = `${this.endPoint}account-categorys`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {params: { type: this.type }}, options).then(res => {
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
            const selectedCategory = this.getSelectedCategory(data.category);
            data.category_name = selectedCategory.name;
            this.ajaxUpdate(data);
        },
        handleChange (val, index) {
            const data = val[index];
            const selectedCategory = this.getSelectedCategory(data.category);         
            data.category_name = selectedCategory.name;            
            this.ajaxUpdate(data);
        },
        ajaxUpdate (data, msg = '更新') {
            const api = `${this.endPoint}account`;
            const options = {
                credentials: false
            };
            this.saveLoading = true;
            this.$http.post(api, data, options).then(res => {
                this.saveLoading = false;
                if (res.body.id) {
                    this.$Message.success(`${msg}成功`);
                } else {
                    this.$Message.error(`${msg}失败`);
                }
            });
        },
        addCash () {
            this.addCashModal = true;
        },
        cancelAddCash () {
            this.addCashModal = false;
        },
        saveCash () {
            this.$refs['addCashForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const api = `${this.endPoint}account`;
                    const options = {
                        credentials: false
                    };
                    const data = this.addCashForm;
                    const selectedCategory = this.getSelectedCategory(this.addCashForm.category);
                    data.category_name = selectedCategory.name;
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addCashForm.name = '';
                            this.$Message.success('添加成功');
                            this.editInlineAndCellData.push(res.body);
                            this.addCashModal = false;
                        }
                    });
                }
            });
        },
        getSelectedCategory (category) {
            const list = this.categoryList.filter(cate => {
                return cate.id == category;
            });
            return list[0];
        },
    },
    created () {
        this.getData();
        this.getCategoryList();
    }
};
</script>
