<template>
	<div>
		<p>正在登录中,请稍侯......</p>
	</div>
</template>

<script>
	import dingtalk from '../../js/dingtalk.js';
	import { dd_getconfig, dd_getuserinfo } from '../../api/api';
	import { Cookie } from '../../js/common';

	export default {
		name: 'auth',
		props: ['agentkey','href'],

		data() {
			return {
				msg: 'Welcome to Your Vue.js App'
			}
		},
		methods: {

			loginFromDing: function() {

				console.log('auth from ding begin...');

				let token = Cookie.Get('token');
				var myhref = this.href;

				if(token != "" && token != null){
					
					window.location.href="/#/"+myhref;
					return;
				}

				dd_getconfig(this.agentkey).then(res => {
					var _config = res;
					

					DingTalkPC.config({
						agentId: _config.agentId,
						corpId: _config.corpId,
						timeStamp: _config.timeStamp,
						nonceStr: _config.nonceStr,
						signature: _config.signature,
						jsApiList: ['runtime.info', 'biz.contact.choose',
							'device.notification.confirm', 'device.notification.alert',
							'device.notification.prompt', 'biz.ding.post',
							'biz.util.openLink'
						]
					});

					DingTalkPC.ready(function() {
						console.log('point 2');
					
						DingTalkPC.runtime.permission.requestAuthCode({
							corpId: _config.corpId,
							onSuccess: function(info) { //成功获得code值,code值在info中
								
										console.log( info.code);
								dd_getuserinfo(info.code).then(res => {
							    //dd_getuserinfo(info.code+'|'+ this.agentkey).then(res => {
									if(res.errcode == 0) {
										console.log( res.name);
										Cookie.Set("token", res.token, 0);
										Cookie.Set("uname", res.name, 0);
										window.location.href="/#/"+myhref;

									} else {
										console.log('获取用户失败,请用钉钉打开此页面或刷新页面 ' );
										alert("获取用户失败,请用钉钉打开此页面或刷新页面!");
									}

								});

							},
							onFail: function(err) { //获得code值失败
								
								console.log('fail: ' + JSON.stringify(err));
								alert('fail: ' + JSON.stringify(err));
							}
						});
						
						//console.log('point 3');

					});

					DingTalkPC.error(function(err) {
						console.log('error: ' + JSON.stringify(err));
						alert('dd error: ' + JSON.stringify(err));
					});
				})

			}

		},
		created: function() {

			//console.log('auth mounted begin...');
			 this.loginFromDing();
			

		}
	}
</script>

<style>

</style>