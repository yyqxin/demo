<template>
	<div>
		<el-row>
			<el-col :span="10" >
				<el-input id="input_barcode" v-model="addbarcode" placeholder="请输入条形码" ref="input_barcode" 
	          		@keyup.enter.native="enter_next('barcode')" >
					<template slot="prepend">条形码：</template>
				</el-input>
			</el-col>

			<el-col :span="4" >
				&nbsp;&nbsp;
				<el-button type="primary" @click="query" >确定</el-button>
			</el-col>
		</el-row>
		<br>
		<el-row>
			<el-col :span="24" >
				<el-table :data="barcode_data" style="width: 100%">
					<el-table-column prop="msg" label="提示信息"></el-table-column>
					<el-table-column prop="time" label="时间"></el-table-column>
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
				barcode_data: [],
				addbarcode:''
			}
		},
		components: {
			//注册组件
		},
		mounted: function() {
			//生命周期
			this.$refs.input_barcode.$refs.input.focus();
	      	this.$refs.input_barcode.$refs.input.select();
		},
		computed: {
			//计算属性
		},
		methods: { //函数
			showdatas: function() {
				//显示数据
				var jsonparas = [];
				if(this.addbarcode.length < 15) return;
				
				//增加查询条件
				apiparas.pushPara(jsonparas, 'barcode', this.addbarcode);

				let paras = apiparas.getParas('sys_para|insert_barcode', jsonparas);
				query(paras).then(response => {
							var json_data = response.result;
							
							//获取当前时间
							var myDate = new Date();
							var mytime=myDate.toLocaleString( 'chinese',{hour12:false} ); 
							json_data[0].time = mytime; 
							
							if(json_data[0].msg==='ok'){
								json_data[0].msg = this.addbarcode+ '添加成功';
							}else{
								json_data[0].msg = '条码'+this.addbarcode+'已存在';
							}
							this.barcode_data.unshift(json_data[0]);
							
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
	        	
		        
		          	this.query();
		          
		          	this.$refs.input_barcode.$refs.input.focus();
		          	this.$refs.input_barcode.$refs.input.select();
		        
	      	},

		},
		created: function() {
				
			}
		}
</script>

<style>

</style>