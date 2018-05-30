import Vue from 'vue';
import App from './App';
import router from './router';
//import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
//import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";

import store from './vuex/store'
Vue.prototype.$store = store 
//import Vuex from 'vuex'
//Vue.use(Vuex)

import echarts from 'echarts';
Vue.prototype.$echarts = echarts

Vue.use(ElementUI);

import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons/'

Vue.component('icon', Icon)

Vue.directive('focus', function (el, option) {
        var defClass = 'el-input', defTag = 'input';
        var value = option.value || true;
        if (typeof value === 'boolean')
            value = { cls: defClass, tag: defTag, foc: value };
        else
            value = { cls: value.cls || defClass, tag: value.tag || defTag, foc: value.foc || false };
        if (el.classList.contains(value.cls) && value.foc)
            el.getElementsByTagName(value.tag)[0].focus();
	});


import { Cookie } from './js/common';
	
router.beforeEach((to, from, next) => {

  var user = Cookie.Get('token');
  
if(process.env.NODE_ENV =='development'){
	Cookie.Set('token', '6783ee2879bb546f8043a7ec2045ecca');
	Cookie.Set('uname', '测试用户');
	user = '6783ee2879bb546f8043a7ec2045ecca'; 
}

  if (!user && to.path.substr(0,6) != '/auth/' && to.path != '/login') {
  	//console.log(to.path)
    next({ path: '/login' })
  } else {
  	//console.log(user);
    next()
  }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');