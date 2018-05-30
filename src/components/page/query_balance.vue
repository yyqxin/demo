<template>
	<div>
		<el-row>
			<el-col :span="10" >
				<el-input id="input_barcode" v-model="query_barcode" placeholder="请输入条形码" ref="input_barcode" 
	          		@keyup.enter.native="enter_next('barcode')" >
					<template slot="prepend">条形码：</template>
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
					
					<el-table-column prop="siteid" label="店铺编号" width="100"></el-table-column>
					<el-table-column prop="shortname" label="店铺名称" width="100"></el-table-column>
					<el-table-column prop="colorName" label="颜色名称" width="100"></el-table-column>
					<el-table-column  label="XXS" width="64">
			          	<el-table-column prop="s01" label="34" width="64">
				          	<template slot-scope="scope">
				                {{formart(scope.row.s01)}}
				            </template>
			          	</el-table-column>
		          	</el-table-column>
		          	<el-table-column label="XS" width="60" >
		              	<el-table-column prop="s02" label="35" width="60" >
			              	<template slot-scope="scope">
			               		{{formart(scope.row.s02)}}
			            	</template>
			          	</el-table-column>
		          	</el-table-column>
		          	<el-table-column label="S" width="60">
		          		<el-table-column prop="s03" label="36" width="60" >
			              	<template slot-scope="scope">
			               		{{formart(scope.row.s03)}}
			            	</template>
			          	</el-table-column>
		          	</el-table-column>
		          	<el-table-column label="M" width="60">
		            	<el-table-column prop="s04" label="37" width="60" >
			              	<template slot-scope="scope">
			               		{{formart(scope.row.s04)}}
			            	</template>
			          	</el-table-column>
		          	</el-table-column>
		          	<el-table-column label="L" width="60">
		            	<el-table-column prop="s05" label="38" width="60" >
			              	<template slot-scope="scope">
			               		{{formart(scope.row.s05)}}
			            	</template>
			          	</el-table-column>
		          	</el-table-column>
		          	<el-table-column label="XL" width="60">
		            	<el-table-column prop="s06" label="39" width="60" >
			              	<template slot-scope="scope">
			               		{{formart(scope.row.s06)}}
			            	</template>
			          	</el-table-column>
		          	</el-table-column>
		          	<el-table-column label="XXL" width="64">
		            	<el-table-column prop="s07" label="40" width="64" >
			              	<template slot-scope="scope">
			               		{{formart(scope.row.s07)}}
			            	</template>
			          	</el-table-column>
		          	</el-table-column>
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
				query_barcode:'',
				barcode_data: [],
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
				if(this.query_barcode.length < 10) return;
				//增加查询条件
				apiparas.pushPara(jsonparas, 'barcode', this.query_barcode);
				
				let paras = apiparas.getParas('sys_para|query_stock', jsonparas);
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
	        	
		        
		          	this.query();
		          
		          	this.$refs.input_barcode.$refs.input.focus();
		          	this.$refs.input_barcode.$refs.input.select();
		        
	      	},
			formart:function(size)
			{
			    if(size=='0'){
			    	return  '';
			    }else{
			    	return size;
			    }
			},
			},
			created: function() {
				
			}
		}
</script>

<style>

</style>