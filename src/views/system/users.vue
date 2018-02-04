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
                        用户管理
                        <Button class="add-button" type="primary" @click="addUser">添加用户</Button>
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
                                :customeButtonName="'分配权限'"
                            ></can-edit-table>
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
        <Modal v-model="addUserModal" :closable='true' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">添加职员</h3>
            <Form ref="addUserForm" :model="addUserForm" :label-width="100" label-position="right" :rules='categoryValid'>
                <FormItem label="职员姓名" prop="name">
                    <Input v-model="addUserForm.name" placeholder="请输入职员姓名" ></Input>
                </FormItem>
                <FormItem label="职员编号" prop="code">
                    <Input v-model="addUserForm.code" placeholder="请输入职员编号" ></Input>
                </FormItem>
                <FormItem label="职员手机" prop="mobilephone">
                    <Input v-model="addUserForm.mobilephone" placeholder="请输入职员姓名" ></Input>
                </FormItem>
                <FormItem label="权限" prop="roles">
                    <CheckboxGroup v-model="userRoles" @on-change="setUserRole">
                        <p v-for="item in rolesList" :key="item.title">
                            <Checkbox :label="item.id">{{ item.title }}</Checkbox>
                        </p>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancelAddUser">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveUser">保存</Button>
            </div>
        </Modal>
        <Modal v-model="userRoleModal" :closable='true' :width="500">
            <h3 slot="header" style="color:#2D8CF0">分配权限</h3>
            <Form ref="userRoleForm" :model="userRoleForm" :label-width="100" label-position="right">
                <FormItem label="职员姓名" prop="name">
                    <Input v-model="userRoleForm.name" :disabled='true' placeholder="请输入属性值" ></Input>
                </FormItem>
                <FormItem label="权限" prop="roles">
                    <CheckboxGroup v-model="userRoles" @on-change="setUserRole">
                        <p v-for="item in rolesList" :key="item.title">
                            <Checkbox :label="item.id">{{ item.title }}</Checkbox>
                        </p>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" @click="canceluserRole">取消</Button>
                <Button type="primary" :loading="saveLoading" @click="saveUserRole">保存</Button>
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
                    align: 'center',
                    width: 80
                },
                {
                    title: '职员姓名',
                    align: 'center',
                    key: 'name',
                    editable: true
                },
                {
                    title: '职员编号',
                    align: 'center',
                    key: 'code',
                    editable: true
                },
                {
                    title: '职员手机',
                    align: 'center',
                    key: 'mobilephone',
                    editable: true
                },
                {
                    title: '所属部门',
                    align: 'center',
                    key: 'userRoles',
                    width: 300
                },
                {
                    title: '操作',
                    align: 'center',
                    key: 'handle',
                    width: 300,
                    handle: ['edit', 'delete', 'custom']
                }
            ],
            editInlineAndCellData: [],
            addUserModal: false,
            addUserForm: {
                name: '',
                code: '',
                mobilephone: '',
                depart: ''
            },
            userRoleForm: {
                name: ''
            },
            saveLoading: false,
            categoryValid: {
                name: { required: true, message: '请输入职员姓名', trigger: 'submit' },
                code: { required: true, message: '请输入职员编号', trigger: 'submit' },
                mobilephone: { required: true, message: '请输入职员手机', trigger: 'submit' }
            },
            userRoleModal: false,
            userName: '',
            userId: '',
            rolesList: [
                {
                    id: 1,
                    title: '管理员'
                },
                {
                    id: 2,
                    title: '客服'
                },
                {
                    id: 3,
                    title: '财务'
                },
                {
                    id: 4,
                    title: '销售'
                }
            ],
            index: 0,
            userRoles: [], // 常用目录选中的目录
            userRolesSelected: [] // 最后实际选择的目录
        };
    },
    methods: {
        getData () {
            const api = `${this.endPoint}users`;
            const options = {
                credentials: false
            };
            this.$http.get(api, options).then(res => {
                if (res.body.data) {
                    const users = [];
                    const roleList = [ '', '管理员', '客服', '财务', '销售' ];
                    res.body.data.forEach(user => {
                        let roles = user.depart;
                        const userRoles = [];
                        if (roles) {
                            roles = JSON.parse(roles);
                            roles.forEach(role => {
                                userRoles.push(roleList[role]);
                            });
                        }
                        user.userRoles = userRoles;
                        users.push(user);
                    });
                    this.editInlineAndCellData = users;
                }
            });
        },
        clickCustomButton (val, index) {
            this.index = index;
            this.userId = val[index].id;
            this.userRoleForm.name = val[index].name;
            let userRoles = [];
            if (val[index].depart) {
                userRoles = JSON.parse(val[index].depart);
            }
            this.userRoles = userRoles;
            this.userRolesSelected = userRoles;
            this.userRoleModal = true;
        },
        canceluserRole () {
            this.userRoleModal = false;
        },
        saveUserRole () {
            const api = `${this.endPoint}user/userRole`;
            const options = {
                credentials: false
            };
            const data = {
                id: this.userId,
                roles: this.userRolesSelected
            };
            this.$http.post(api, data, options).then(res => {
                if (res.body.id) {
                    this.$Message.success('更新成功');
                } else {
                    this.$Message.error('更新失败');
                }
            }).then(() => {
                this.getData();
            });
            this.userRoleModal = false;
        },
        setUserRole (selectedArray) {
            this.userRolesSelected = selectedArray;
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
            const api = `${this.endPoint}user`;
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
        addUser () {
            this.userRoles = [];
            this.addUserModal = true;
        },
        cancelAddUser () {
            this.addUserModal = false;
        },
        saveUser () {
            this.$refs['addUserForm'].validate((valid) => {
                if (valid) {
                    this.saveLoading = true;
                    const api = `${this.endPoint}user`;
                    const options = {
                        credentials: false
                    };
                    const data = {
                        name: this.addUserForm.name,
                        code: this.addUserForm.code,
                        mobilephone: this.addUserForm.mobilephone,
                        roles: this.userRolesSelected
                    };
                    this.$http.post(api, data, options).then(res => {
                        this.saveLoading = false;
                        if (res.body.status) {
                            this.$Message.error(res.body.message);
                        } else {
                            this.addUserForm.name = '';
                            this.addUserForm.code = '';
                            this.addUserForm.mobilephone = '';
                            this.$Message.success('添加成功');
                            this.editInlineAndCellData.push(res.body);
                            this.addUserModal = false;
                        }
                    }).then(() => {
                        this.getData();
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
