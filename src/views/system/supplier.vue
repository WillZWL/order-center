<style lang="less">
    @import './system.less';
    .list table button {
        margin-top: 5px;
    }
</style>

<template>
    <div class="list">
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title">
                    <Icon type="ios-keypad"></Icon>
                    供应商管理
                    <Button class="add-button" type="primary" @click="addMember">添加供应商</Button>
                </p>
                <Row>
                    <Col span="24">
                    <can-edit-table :size="'small'" v-model="editInlineAndCellData" @on-cell-change="handleCellChange" @on-change="handleChange" @on-delete="handleDel" @click-customButton="clickCustomButton" :columns-list="editInlineAndCellColumn" :customeButtonName="'更新地址'"></can-edit-table>
                    </Col>
                </Row>
            </Card>
            </Col>
        </Row>
        <Modal v-model="addClientModal" :closable='true' :mask-closable=false :width="600">
            <h3 slot="header" style="color:#2D8CF0">添加供应商</h3>
            <Form ref="addClientForm" :model="addClientForm" :label-width="100" label-position="right" :rules='clientValid'>
                <FormItem label="单位名称" prop="name">
                    <Input v-model="addClientForm.name" placeholder="请输入单位名称"></Input>
                </FormItem>
                <FormItem label="单位编号" prop="code">
                    <Input v-model="addClientForm.code" placeholder="请输入单位编号"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contacts_name">
                    <Input v-model="addClientForm.contacts_name" placeholder="请输入联系人"></Input>
                </FormItem>
                <FormItem label="电话" prop="mobilephone">
                    <Input v-model="addClientForm.mobilephone" placeholder="请输入联系电话"></Input>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Col>
                    <Card v-if="addClientModal">
                        <al-selector v-model="area" data-type="name" level="2" />
                    </Card>
                    </Col>
                    <Input v-model="addClientForm.address" placeholder="请输入详细地址"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="addClientForm.remark" placeholder="备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddClient">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveCleint">保存</Button>
            </div>
        </Modal>
        <Modal v-model="areaModal" :closable='true' :mask-closable=false :width="600">
            <h3 slot="header" style="color:#2D8CF0">更新地址</h3>
            <Form ref="addClientForm" :model="addClientForm" :label-width="100" label-position="right">
                <FormItem label="地址" prop="address">
                    <Col>
                    <Card v-if="areaModal">
                        <al-selector v-model="area" data-type="name" level="2" />
                    </Card>
                    </Col>
                    <Input v-model="addClientForm.address" placeholder="请输入详细地址"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelUpdateArea">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveArea">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import Vue from 'vue';
import iviewArea from 'iview-area';
Vue.use(iviewArea);
import canEditTable from './../common/components/canEditTable.vue';
export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            type: 2,
            editInlineAndCellColumn: [{
                title: '序号',
                type: 'index',
                width: 50,
                align: 'center'
            },
            {
                title: '单位名称',
                align: 'center',
                key: 'name',
                editable: true
            },
            {
                title: '单位编号',
                align: 'center',
                key: 'code',
                width: 100,
                editable: true
            },
            {
                title: '联系人',
                align: 'center',
                key: 'contacts_name',
                width: 100,
                editable: true
            },
            {
                title: '电话',
                align: 'center',
                key: 'mobilephone',
                width: 120,
                editable: true
            },
            {
                title: '地址',
                align: 'center',
                key: 'addressFull'
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
                width: 180,
                handle: ['edit', 'delete', 'custom']
            }
            ],
            editInlineAndCellData: [],
            addClientModal: false,
            addClientForm: {
                type: 2,
                name: '',
                code: '',
                contacts_name: '',
                mobilephone: '',
                province: '',
                city: '',
                district: '',
                address: '',
                remark: ''
            },
            saveLoading: false,
            clientValid: {
                name: {
                    required: true,
                    message: '请输入单位名称',
                    trigger: 'submit'
                },
                code: {
                    required: true,
                    message: '请输入单位编号',
                    trigger: 'submit'
                },
                contacts_name: {
                    required: true,
                    message: '请输入联系人',
                    trigger: 'submit'
                },
                mobilephone: {
                    required: true,
                    message: '请输入联系电话',
                    trigger: 'submit'
                }

            },
            areaModal: false,
            area: [],
            updateArea: [],
            client: {}
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}members`;
            const options = {
                credentials: false
            };
            this.$http.get(api, {
                params: {
                    type: this.type
                }
            }, options).then(res => {
                if (res.body.data) {
                    const clients = [];
                    res.body.data.forEach(client => {
                        client.addressFull = client.province + client.city + client.district + client.address;
                        clients.push(client);
                    });
                    this.editInlineAndCellData = clients;
                }
            });
        },
        clickCustomButton (val, index) {
            const client = val[index];
            this.client = client;
            this.area = [client.province, client.city, client.district];
            this.addClientForm.address = client.address;
            this.areaModal = true;
        },
        cancelUpdateArea () {
            this.areaModal = false;
        },
        saveArea () {
            this.client.province = this.area[0];
            this.client.city = this.area[1];
            this.client.district = this.area[2];
            this.address = this.addClientForm.address;
            this.ajaxUpdate(this.client, '地址更新');
            this.areaModal = false;
            this.area = [];
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
            const api = `${this.endPoint}member`;
            const options = {
                credentials: false
            };
            this.$http.post(api, data, options).then(res => {
                if (res.body.id) {
                    this.$Message.success(`${msg}成功`);
                } else {
                    this.$Message.error(`${msg}失败`);
                }
            }).then(() => {
                this.getData();
            });
        },
        addMember () {
            this.addClientModal = true;
        },
        cancelAddClient () {
            this.addClientModal = false;
        },
        saveCleint () {
            this.$refs['addClientForm'].validate((valid) => {
                if (valid) {
                    console.log(this.area);
                    this.saveLoading = true;
                    const api = `${this.endPoint}member`;
                    const options = {
                        credentials: false
                    };

                    this.addClientForm.province = this.area[0];
                    this.addClientForm.city = this.area[1];
                    this.addClientForm.district = this.area[2];
                    const data = this.addClientForm;
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addClientForm.name = '';
                            this.$Message.success('添加成功');
                            this.editInlineAndCellData.push(res.body);
                            this.addClientModal = false;
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
