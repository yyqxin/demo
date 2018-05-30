<template>
	<div class="login-wrap">
		<div class="ms-title">辽宁紫涵</div>
		<div class="ms-login">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
				<el-form-item prop="username">
					<el-input v-model="ruleForm.username" placeholder="username"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
				<div class="login-btn">
					<el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
				</div>
				<p style="font-size:12px;line-height:30px;color:#999;">Tips : 初始用户名与密码都是手机号码。</p>
			</el-form>
		</div>
	</div>
</template>

<script>
	import { login, apiparas, query, apicheckuser } from '../../api/api';
	import { Cookie } from '../../js/common';
	export default {
		data: function() {
			return {
				ruleForm: {
					username: '',
					password: ''
				},
				rules: {
					username: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			submitForm(formName) {

				var jsonparas = [];
				apiparas.pushPara(jsonparas, 'user', this.ruleForm.username);
				apiparas.pushPara(jsonparas, 'pwd', this.ruleForm.password);

				let paras = {
					user: this.ruleForm.username,
					pwd: this.ruleForm.password
				};

				login(paras).then(response => {
					if(response.errid == 0) { //错误信息(如果返回错误信息为空，则认证通过)
						Cookie.Set("token", response.token, 0);
						Cookie.Set("uname", response.uname, 0);
						// localStorage.setItem('ms_username', response.uname);
						//window.location.href="/";
						this.$router.push('/welcome'); //登录成功，进入系统首面
					} else {
						alert('用户名或密码错误');
					}
				}).catch(res => {
					alert('网络错误,请重新刷新');
					//alert(res.response.status);
				});

				/*
				
				login(paras1).then(response => {
				 	alert('dfd');
				 	alert(response.response.status);
				 	if(response.errcode ==0)
				 	{
				 		alert(response.token);
				 	}
				 	
				 }).catch( res=>{
				 	alert('网络错误');
					alert(res.response.status);
				 });
				
			
                /*
                self.$refs[formName].validate((valid) => {
                    if (valid) {   //页验证通过
                    		localStorage.setItem('ms_username',self.ruleForm.username);
           					self.$router.push('/welcome');//登录成功，进入系统首面
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
				
                
                */
			}
		}
	}
</script>

<style scoped>
	.login-wrap {
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.ms-title {
		position: absolute;
		top: 50%;
		width: 100%;
		margin-top: -230px;
		text-align: center;
		font-size: 30px;
		color: #fff;
	}
	
	.ms-login {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 300px;
		height: 160px;
		margin: -150px 0 0 -190px;
		padding: 40px;
		border-radius: 5px;
		background: #fff;
	}
	
	.login-btn {
		text-align: center;
	}
	
	.login-btn button {
		width: 100%;
		height: 36px;
	}
</style>