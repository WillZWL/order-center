<style lang="less">
    @import './login.less';
</style>
<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip" v-show="loginError">请输入正确的用户名和密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            endPoint: this.$store.state.app.endPoint,
            loginError: 0,
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.login();
                }
            });
        },
        login () {
            const api = this.endPoint + 'login';
            const options = {
                credentials: false
            };
            const dataObj = {
                userName: this.form.userName,
                password: this.form.password
            };
            this.$http.post(api, dataObj, options).then(res => {
                if (res.status) {
                    if (res.body.status) {
                        Cookies.set('user', res.body.data.name);
                        Cookies.set('uid', res.body.data.id);
                        this.loginError = 0;
                        this.$router.push({
                            name: 'home_index'
                        });
                    }
                }
                this.loginError = 1;
            });
        }
    }
};
</script>

<style>

</style>
