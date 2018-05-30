<template>
	<div id='login_container'>

	</div>
</template>

<script>
	import ddlogin from '../../js/ddlogin.js';
	export default {
		data: function() {
			return {}
		},
		methods: {
			submitForm(formName) {}
		},
		mounted: function() {
			var obj = DDLogin({
				id: "login_container",
				//这里需要你在自己的页面定义一个HTML标签并设置id，例如<div id="login_container"></div>或<span id="login_container"></span>
				goto: "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=dingoax7ylcmbmyje34zb2&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://easybi.com.cn/#/login",
				style: "border:none;background-color:#FFFFFF;",
				width: "365",
				height: "400"
			});
		}
	}
</script>

<style>

</style>