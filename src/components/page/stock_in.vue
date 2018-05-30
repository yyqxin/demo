<template>
	<div>
		<el-row>
			<el-col :span="2">
				<el-button type="primary" icon="el-icon-circle-check-outline" @click="onSubmit"> 确 认</el-button>
			</el-col>
			<el-col :span="2">
				<el-button type="primary" icon="el-icon-close" @click="test"> 取 消</el-button>
			</el-col>
		</el-row>

		<br />

		<el-form ref="form" :model="form" label-width="100px">
			<el-col :span="7">
				<el-form-item label="单号：" >
					<el-input v-model="form.no"  :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="日期：" >
					<el-date-picker type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
						 placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
				</el-form-item>
			</el-col>
			<el-col :span="7">
				<el-form-item label="目标店铺：">
					<el-select v-model="form.entity" placeholder="请选择目标店铺">
						<el-option v-for="item in options" :key="item.entity_key" :label="item.entity_name" :value="item.entity_key" />
					</el-select>
				</el-form-item>

				<el-form-item label="类型：">
					<el-select v-model="form.category"  placeholder="请选择类型"  :disabled="true">
						<el-option v-for="item in action_type" :key="item.value" :label="item.value" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="10">
				<el-form-item label="备注：">
					<el-input type="textarea" v-model="form.remarks" :rows="4"></el-input>
				</el-form-item>
			</el-col>
		</el-form>

		<el-table :data="tableData" style="width: 100%"  v-show="radio==1" border>
			<el-table-column type="index"></el-table-column>
			<el-table-column prop="style_id" label="款号"> </el-table-column>
			<el-table-column prop="style_name" label="款式"> </el-table-column>
			<el-table-column prop="size_name" label="尺码"> </el-table-column>
			<el-table-column prop="color_name" label="颜色"> </el-table-column>
			<el-table-column prop="brand_name" label="品牌"> </el-table-column>
			<el-table-column prop="list_price" label="吊牌价"> </el-table-column>
			<el-table-column prop="sale_price" label="销售价"> </el-table-column>
			<el-table-column prop="qty" label="数量"> </el-table-column>

			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="small" @click.native.prevent="deleteRow(scope.$index, tableData)" type="danger" >移除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-table :data="second_tableData" style="width: 100%" v-show="radio==2" border>
			<el-table-column type="index"></el-table-column>
			<el-table-column prop="style_id" label="款号" width="120"> </el-table-column>
			<el-table-column prop="color_name" label="颜色"> </el-table-column>
			<el-table-column prop="xxsSize" label="XXS" :formatter="formatter"> </el-table-column>
			<el-table-column prop="xsSize" label="XS" :formatter="formatter"> </el-table-column>
			<el-table-column prop="sSize" label="S" :formatter="formatter"> </el-table-column>
			<el-table-column prop="mSize" label="M" :formatter="formatter"> </el-table-column>
			<el-table-column prop="lSize" label="L" :formatter="formatter"> </el-table-column>
			<el-table-column prop="xlSize" label="XL" :formatter="formatter"> </el-table-column>
			<el-table-column prop="otherSize" label="其他尺码" :formatter="formatter"> </el-table-column>
			<el-table-column prop="list_price" label="吊牌价"> </el-table-column>
			<el-table-column prop="skje" label="总金额"> </el-table-column>
		</el-table>

		<br />

		<el-row>
			<el-col :span='12'>
				<el-radio-group v-model="radio">
					<el-radio label="1" border >一维表</el-radio>
					<el-radio label="2" border @change="showSecondTable">二维表</el-radio>
				</el-radio-group>
			</el-col>
			<el-col :span='10'>
				<el-input  v-model="scan" id="scan_input" ref="scan_input" @keyup.enter.native="add">
					<template slot="prepend" >扫描区</template>
				</el-input>
			</el-col>
			<el-col :span='2'>
				<el-button type="primary" icon="el-icon-circle-check-outline" @click="add"> 录入</el-button>
			</el-col>
		</el-row>
		
		<el-dialog title="请选择" :visible.sync="dialogVisible" width="30%">
  			<el-table :data="multi_table" @row-click="select">
  				<el-table-column type="index"></el-table-column>
    			<el-table-column property="brand_name" label="店铺"></el-table-column>		
  			</el-table>
		</el-dialog>


	</div>
</template>

<script>
	import {apiparas,query,stockIn} from '../../api/api';
	
	export default {
		data() {
			return {
				form: {
					no: new Date().getTime(),
					entity:'',
					category: '调入',
					remarks: '',
					date1:new Date()
				},
				action_type:[{value:'调入'},{value:'调出'}],
				radio: '1',
				scan:'E7R04AH212J012',
				second_tableData:[],
				tableData:[],
				multi_table:[],
				dialogVisible: false,
				options:[]
			}
		},
		components: {
			//注册组件
		},
		mounted: function() {
			//获取焦点
			this.$refs.scan_input.$refs.input.focus();
			//加载二维表数据
			this.showSecondTable();
			//获取店铺信息
			this.get_Entity();
		},
		computed: {
			//计算属性
		},
		methods: {
			test(){
				console.log(this.form.date1);
			},
			//加载店铺信息
			get_Entity(){
				let jsonparas = [];
				let paras = apiparas.getParas('entity|get_entity',jsonparas);
				query(paras).then(response => {
					this.options = response.result;
				});
			},
			
			//确认按钮，提交
			onSubmit(){
				//将表格内容转换为需要的json格式
				if(this.tableData.length==0){
					this.$message('没有数据！');
					return;
				}
				
				if(this.form.entity==null || this.form.entity==""){
					this.$message('请选择目标店铺！');
					return;
				}
				
				var submitJson = new Array();
				for(var i=0; i<this.tableData.length; i++){
					var obj={};
					obj.style_key = this.tableData[i].style_key;
					obj.color_key = this.tableData[i].color_key;
					obj.size_group_key = this.tableData[i].size_group_key;
					obj.size_key = this.tableData[i].size_key;
					obj.qty = this.tableData[i].qty;
					submitJson.push(obj);
				}
				var newJson = {
						TypeName: "r_adjust_master",
						JsonObj: {
					    			doc_no:this.form.no,
	            					from_entity:"7e4d4d9248f34af48e8cd434661f6793",
	            					to_entity:this.form.entity,
	            					adjust_type:this.form.category,
	            					work_date:this.formatDate(this.form.date1),
	            					remark:this.form.remarks,
	            					details:submitJson
								},
				};
				stockIn(newJson).then(response => {
					var json_data = response.result;
				});
			},
			
			//添加表格数据
			add(){
				let jsonparas = [];
				let t = this.scan.trim();
				if(t==""){
					this.$message('请输入条形码！');
					return;
				}
				apiparas.pushPara(jsonparas, 'bar_code', t);
				let paras = apiparas.getParas('style|get_style_barcode',jsonparas);
				query(paras).then(response => {
					let temp = response.result;
					this.addToTable(temp);
					this.scan = "";
				});
			},
			addToTable(tempJson){
				let jsonArray = eval(tempJson);
				if(jsonArray.length==1){
					//一个条形码查询到一条记录
					let obj = jsonArray[0];
					this.addJsonToTable(obj);
				}else if(jsonArray.length>=2){
					//一个条形码查询到多条记录
					this.multi_table = jsonArray;
					this.dialogVisible = true;
				}
			},
			select(row, event, column){
				this.addJsonToTable(row);
				this.dialogVisible = false;
			},
			//将新增的数据添加进table
      		addJsonToTable(obj){
				obj.qty = 1;
				var tdata = this.tableData;
				//判断新增的数据与一维表中的数据是否重复，重复则增加数量
				var temp = true;//是否相同款号颜色的标识，true为不相同
				for(let i=0; i<tdata.length; i++){
					if(obj.style_id==tdata[i].style_id && obj.color_name==tdata[i].color_name 
						&& obj.size_key==tdata[i].size_key && obj.brand_name==tdata[i].brand_name){
						tdata[i].qty = parseInt(tdata[i].qty)+1;
						temp = false;
					}
				}
				//不重复，添加一行新的数据
				if(temp){
					tdata.push(obj);
				}
				this.tableData = tdata;
				this.showSecondTable();
				//若当前显示的为二维表，更新二维表的数据
				if(this.radio==2){
					this.radio="1";
					this.radio="2";
				}
				this.$message('数据添加完成！');
      		},
			showSecondTable() {
				var data = this.tableData;
				var array = new Array();
				for(let i = 0; i < data.length; i++) {
					if(i == 0) {//第一款衣服不会重复，直接加入二维表数组
         				var cloth = {};
         				cloth.style_id = data[0].style_id;
                		cloth.color_name =data[0].color_name;
                		cloth.list_price = data[0].list_price;
                		cloth.skje = data[0].qty*data[0].list_price;
                		cloth.xxsSize=0;
                		cloth.xsSize=0;
                		cloth.sSize=0;
                		cloth.mSize=0;
                		cloth.lSize=0;
                		cloth.xlSize=0;
                		cloth.otherSize=0;
						switch(data[0].size_name){
    						case 'XXS':
    							cloth.xxsSize=parseInt(data[0].qty);
        						break;
    						case 'XS':
    							cloth.xsSize=parseInt(data[0].qty);
        						break;
    						case 'S':
    							cloth.sSize=parseInt(data[0].qty);
        						break;
    						case 'M':
    							cloth.mSize=parseInt(data[0].qty);
        						break;
    						case 'L':
    							cloth.lSize=parseInt(data[0].qty);
        						break;
    						case 'XL':
    							cloth.xlSize=parseInt(data[0].qty);
        						break;
   	 						default:
        						cloth.otherSize=parseInt(data[0].qty);
						}            		
               			array.push(cloth);
        			}else{
        				//遍历二维表数组,判断是否存在款号与颜色相同的服装，有则增加数量
        				let temp = true;
        				for(let y=0; y<array.length; y++){
        					//款号、颜色相同时
        					if(array[y].style_id==data[i].style_id && array[y].color_name==data[i].color_name){
        						//判断是哪个尺码，并+qty
								switch(data[i].size_name){
		    						case 'XXS':
		    							array[y].xxsSize+=parseInt(data[i].qty);
		        						break;
		    						case 'XS':
		    							array[y].xsSize+=parseInt(data[i].qty);
		        						break;
		    						case 'S':
		    							array[y].sSize+=parseInt(data[i].qty);
		        						break;
		    						case 'M':
		    							array[y].mSize+=parseInt(data[i].qty);
		        						break;
		    						case 'L':
		    							array[y].lSize+=parseInt(data[i].qty);
		        						break;
		    						case 'XL':
		    							array[y].xlSize+=parseInt(data[i].qty);
		        						break;
		   	 						default:
		        						array[y].otherSize+=parseInt(data[i].qty);
								}
								array[y].skje = array[y].skje+parseInt(data[i].qty)*array[y].list_price;
								temp = false;
        					}
        				}
        				//不存在该款号与颜色相同的服装
        				if(temp){
        					//新记录
		         			var cloth = {};
		         			cloth.style_id = data[i].style_id;
		         			cloth.color_name = data[i].color_name;
		         			cloth.list_price = data[i].list_price;
		         			cloth.skje = parseInt(data[i].qty) * data[i].list_price;
		         			cloth.xxsSize = 0;
		         			cloth.xsSize = 0;
		         			cloth.sSize = 0;
		         			cloth.mSize = 0;
		         			cloth.lSize = 0;
		         			cloth.xlSize = 0;
		         			cloth.otherSize = 0;
		         			switch(data[i].size_name) {
		         				case'XXS':
		    						cloth.xxsSize=parseInt(data[i].qty);
		        					break;
		    					case 'XS':
		    						cloth.xsSize=parseInt(data[i].qty);
		        					break;
		    					case 'S':
		    						cloth.sSize=parseInt(data[i].qty);
		        					break;
		    					case 'M':
		    						cloth.mSize=parseInt(data[i].qty);
		        					break;
		    					case 'L':
		    						cloth.lSize=parseInt(data[i].qty);
		        					break;
		    					case 'XL':
		    						cloth.xlSize=parseInt(data[i].qty);
		        					break;
		   	 					default:
		        					cloth.otherSize=parseInt(data[i].qty);
		        			}
		        			array.push(cloth);
        				}

        			}
         		}
        		this.second_tableData=array;
        		console.log(this.second_tableData);
      		},
			formatter(row, column,cellValue) {
				switch (cellValue){
					case 0:
						return "";
						break;
					default:
						return cellValue;
						break;
				}
      		},
			deleteRow(index, rows) {
        		rows.splice(index, 1);
      	},
      		formatDate(datavalue){
      			var year = ""+datavalue.getFullYear();
      			var month = datavalue.getMonth()+1+"";
      			if(month.length==1){
      				month = "0"+month;
      			}
      			var day = ""+datavalue.getDate();
      			if(day.length==1){
      				day = "0"+day;
      			}
      			return year+"-"+month+"-"+day;
      		}
		}
	}
</script>

<style>

</style>