<style lang="less">
    @import './system.less';
</style>

<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="ios-keypad"></Icon>
                        渠道管理
                        <Button class="add-button" type="primary" @click="addChannel">添加渠道</Button>
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
        <Modal v-model="addChannelModal" :closable='true' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加渠道</h3>
            <Form ref="addChannelForm" :model="addChannelForm" :label-width="100" label-position="right" :rules='channelValid'>
                <FormItem label="渠道名称" prop="name">
                    <Input v-model="addChannelForm.name" placeholder="请输入渠道名称" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddChannel">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveChannel">保存</Button>
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
                    title: '渠道名称',
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
            addChannelModal: false,
            addChannelForm: {
                name: ''
            },
            saveLoading: false,
            channelValid: {
                name: { required: true, message: '请输入渠道名称', trigger: 'submit' }
            }
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}channels`;
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
        ajaxUpdate (data, msg = '更新') {
            const api = `${this.endPoint}channel`;
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
        addChannel () {
            this.addChannelModal = true;
        },
        cancelAddChannel () {
            this.addChannelModal = false;
        },
        saveChannel () {
            this.$refs['addChannelForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const api = `${this.endPoint}channel`;
                    const options = {
                        credentials: false
                    };
                    const data = {
                        name: this.addChannelForm.name
                    };
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addChannelForm.name = '';
                            this.$Message.success('添加成功');
                            this.editInlineAndCellData.push(res.body);
                            this.addChannelModal = false;
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
