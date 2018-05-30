<template>
  	<div>
    	<el-row>
      		<el-col :span="10" >
	        	<el-input id="input_style" v-model="query_style" placeholder="请输入款号" ref="input_style" 
	          		@keyup.enter.native="enter_next('style')" >
	          		<template slot="prepend">款号：</template>
	        	</el-input>
      		</el-col>

      		<el-col :span="10" >
        		<el-input  id="input_size" v-model="query_size" placeholder="请输入尺码"  ref="input_size"
          			@keyup.enter.native="enter_next('size')" >
          				<template slot="prepend">尺码：</template>
        		</el-input>
      		</el-col>

	      	<el-col :span="4" >
		        &nbsp;&nbsp;
		        <el-button type="primary" @click="query" >搜索</el-button>
	      	</el-col>
    	</el-row>
    	<br>
    	<el-row>
	      	<el-col :span="24" >
	        	<el-table :data="barcode_data" style="width: 100%">
		          	<el-table-column prop="barcode" label="条码" width="200"></el-table-column>
		          	<el-table-column prop="style" label="款号" width="200"></el-table-column>
		          	<el-table-column prop="color" label="颜色编码" width="200"></el-table-column>
		          	<el-table-column prop="name" label="颜色名称" width="200"></el-table-column>
		          	<el-table-column prop="size" label="尺码"></el-table-column>
	        	</el-table>
	      	</el-col>
    	</el-row>
  	</div>
</template>

<script>
  	import { query, apiparas } from '../../api/api';

  	export default {
   	 	data() {
      		return {
		        query_style: '',
		        query_size: '',
		        style_focus:false,
		        size_focus:false,
		        barcode_data: []
		    }
    	},
	    components: {
	      //注册组件
	    },
	    mounted: function() {
	      //生命周期
	      	this.$refs.input_style.$refs.input.focus();
	      	this.$refs.input_style.$refs.input.select();
	    },
	    computed: {
	      //计算属性
	    },
	    methods: { //函数
	      	showdatas: function() {
	        	//显示数据
	        	var jsonparas = [];
	        	if(this.query_style.length < 3) return;
	
	        	//增加查询条件
	        	apiparas.pushPara(jsonparas, 'style', this.query_style);
	        	apiparas.pushPara(jsonparas, 'size', this.query_size);
	
	        	let paras = apiparas.getParas('sys_para|query_barcode', jsonparas);
	        	query(paras).then(response => {
	              	var json_data = response.result;
	              	this.barcode_data = json_data;
	        	});
	      	},
	      	refreshPage: function() {
	            //刷新页面
	      	},
	      	query:function()
	      	{
	        	this.showdatas();
	     	},
	      	enter_next:function(e)
	      	{
	        	if(e=="style")
		        {
		          	this.$refs.input_size.$refs.input.focus();  
		          	this.$refs.input_size.$refs.input.select();
		        }
		        else
		        {
		          	this.query();
		          
		          	this.$refs.input_style.$refs.input.focus();
		          	this.$refs.input_style.$refs.input.select();
		        }
	      	}
	      
	   	},
	    created: function() {
	       
	    }
    }
</script>

<style>

</style>