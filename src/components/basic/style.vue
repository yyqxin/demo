<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入款号" v-model="styleID" @keyup.enter.native="queryStyle">
					<template slot="prepend">款号:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="queryStyle">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
				<el-button type="primary" @click="centerDialogVisible = true">导入</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="style_id" label="款号" show-overflow-tooltip fixed width="150">
			</el-table-column>
			<el-table-column prop="style_name" label="款名称" fixed width="150">
			</el-table-column>
			<el-table-column prop="style_sex" label="款性别">
			</el-table-column>
			<el-table-column prop="style_ys_name" label="款年季" width="120">
			</el-table-column>
			<el-table-column prop="season_name" label="款季节">
			</el-table-column>
			<el-table-column prop="style_year" label="款年份">
			</el-table-column>
			<el-table-column prop="month_phase" label="款波段">
			</el-table-column>
			<el-table-column prop="class01_name" label="大类">
			</el-table-column>
			<el-table-column prop="class02_name" label="中类">
			</el-table-column>
			<el-table-column prop="class03_name" label="小类">
			</el-table-column>
			<el-table-column prop="old_list_price" label="原吊牌价">
			</el-table-column>
			<el-table-column prop="list_price" label="吊牌价">
			</el-table-column>
			<el-table-column prop="sale_price" label="销售价">
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditStyle(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showdelStyle(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加款" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="款号：" :label-width="formLabelWidth">
					<el-input v-model="form.style_id" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="款名称" :label-width="formLabelWidth">
					<el-input v-model="form.style_name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="款性别：" :label-width="formLabelWidth">
					<el-input v-model="form.style_sex" auto-complete="off"></el-input>
				</el-form-item>	
				<el-form-item label="款年季：" :label-width="formLabelWidth">
					<el-input v-model="form.style_ys_name" auto-complete="off"></el-input>
				</el-form-item>	
				<el-col :span="8">
					<el-form-item label="款季节：" :label-width="formLabelWidth">
						<el-input v-model="form.season_name" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="款年份：" :label-width="formLabelWidth">
						<el-input v-model="form.style_year" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="款波段：" :label-width="formLabelWidth">
						<el-input v-model="form.month_phase" auto-complete="off"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="大类：" :label-width="formLabelWidth">
						<el-input v-model="form.class01_name" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="中类：" :label-width="formLabelWidth">
						<el-input v-model="form.class02_name" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="小类：" :label-width="formLabelWidth">
						<el-input v-model="form.class03_name" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="原吊牌价：" :label-width="formLabelWidth">
						<el-input v-model="form.old_list_price" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="吊牌价：" :label-width="formLabelWidth">
						<el-input v-model="form.list_price" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
				<el-col :span="8">
					<el-form-item label="销售价：" :label-width="formLabelWidth">
						<el-input v-model="form.sale_price" auto-complete="off"></el-input>
					</el-form-item>	
				</el-col>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveStyle">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除颜色" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delStyle">确 定</el-button>
				  </span>
		</el-dialog>
		
		<el-dialog title="尺码组导入" :visible.sync="centerDialogVisible" width="30%" center>
			<span>
			  	<el-upload  action="http://39.108.64.181/api/erp/upfile" :on-preview="handlePreview" :on-change="handleChange" :on-success="handleSuccess"
			  		:on-remove="handleRemove"  :before-remove="beforeRemove"  multiple  :limit="3"  :on-exceed="handleExceed"  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" > 
			  		<el-button size="small" type="primary">点击上传</el-button> 
				</el-upload>
		  	</span>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="centerDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="importBill">确 定</el-button>
			  </span>
		</el-dialog>




	</div>
</template>

<script>
	import { getreport, getfilter, query, apiparas, getObjects , entity_add , entity_delete , entity_update , entity_import } from '../../api/api';
	import { Cookie } from '../../js/common' ;
	export default {
		data() {
			return {
				data: [],
				currentPage: 1,
				pagesize: 15,
				styleID: '',
				dialogFormVisible:false,
				centerDialogVisible:false,
				rules:{},
				form: {
					style_id:'',
					style_name:'',
					style_sex:'',
					style_ys_name:'',
					season_name:'',
					style_year:'',
					month_phase:'',
					class01_name:'',
					class02_name:'',
					class03_name:'',
					old_list_price:'',
					list_price:'',
					sale_price:''
				},
				formLabelWidth:'120px',
				style_key :'',
				brand_key:'ee5b760e4dc1450f8094f3d52d66101c',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false,
				xlsData: {},
				dataHead: [{"name":"dd","value":"dd"}],
				style_colname:['款号','款名称','款性别','款年季','款季节','款年份','款波段','大类','中类','小类','原吊牌价','吊牌价','销售价'],
				paras:{}
			}
		},
		components: {
			//注册组件
		},
		mounted: function() {
			//生命周期
		
		},
		
		computed: {
			//计算属性
		},
		methods: { //函数
			handleRemove(file, fileList) {
				console.log(file, fileList,"handleRemove");
			},
			handlePreview(file) {
				console.log(file,"handlePreview");
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleSuccess(response, file, fileList) {
				this.$message({
					message: '成功上传文件,数据已成功导入!',
					type: 'success'
				});

			},
			handleChange(file, fileList) {

				if(file.status != "ready") return;

				//console.log(BASE_API);
				let _this = this;
				let inputDOM = this.$refs.inputer;
				// 通过DOM取文件数据
				this.file = event.currentTarget.files[0];
				var rABS = false; //是否将文件读取为二进制字符串
				var f = this.file;
				var reader = new FileReader();
				//if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function(f) {
					var binary = "";
					var rABS = false; //是否将文件读取为二进制字符串
					var pt = this;
					var wb; //读取完成的数据
					var outdata;
					var reader = new FileReader();
					
					reader.onload = function(e) {
						var bytes = new Uint8Array(reader.result);
						var length = bytes.byteLength;
						for(var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						var XLSX = require('xlsx');
						if(rABS) {
							wb = XLSX.read(btoa(fixdata(binary)), { //手动转化
								type: 'base64'
							});
						} else {
							wb = XLSX.read(binary, {
								type: 'binary'
							});
						}

						outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
							header: 1
						}); //outdata就是你想要的东西
						_this.xlsData = [...outdata];

						_this.dataHead = [];
						var colIndex = []; //找到列对应的位置
						var t_col = [];
						var row_start = 1;
						for(var i = 0; i < _this.xlsData[0].length; i++) {
							apiparas.pushPara(_this.dataHead , _this.xlsData[0][i], _this.xlsData[0][i]);
						}
						t_col = _this.style_colname; 
						
						for(var i = 0; i < t_col.length; i++) {
							for(var j = 0; j < _this.dataHead.length; j++) {

								if(_this.dataHead[j]['name'] == t_col[i]) //找需要导入数据列的对应列顺序
								{
									colIndex.push(j);
									break;
								}
							}

						}
						var objs = [];
						for(var i = row_start; i < _this.xlsData.length; i++) {
							if(_this.xlsData[i][colIndex[0]] != undefined  && _this.xlsData[i][colIndex[1]] != undefined) {
								let obj = {
									"brand_key":_this.brand_key,
									"style_id": _this.xlsData[i][colIndex[0]],
									"style_name": _this.xlsData[i][colIndex[1]],
									"style_sex": _this.xlsData[i][colIndex[2]],
									"style_ys_name": _this.xlsData[i][colIndex[3]],
									"season_name": _this.xlsData[i][colIndex[4]],
									"style_year": _this.xlsData[i][colIndex[5]],
									"month_phase": _this.xlsData[i][colIndex[6]],
									"class01_name": _this.xlsData[i][colIndex[7]],
									"class02_name": _this.xlsData[i][colIndex[8]],
									"class03_name": _this.xlsData[i][colIndex[9]],
									"old_list_price": _this.xlsData[i][colIndex[10]],
									"list_price": _this.xlsData[i][colIndex[11]],
									"sale_price": _this.xlsData[i][colIndex[12]],
								}
								objs.push(obj);
							}
						}
						let paras = {
							"TypeName": "b_style",
							"JsonObjs": objs
						}
						_this.paras = paras;
						

//						let para = {
//							withList: JSON.stringify(this.da)
//							//withList: arr
//						}
						
						_this.$message({
							message: '请耐心等待导入成功',
							type: 'success'
						});
						
					}
					reader.readAsArrayBuffer(f);
				}
				if(rABS) {
					reader.readAsArrayBuffer(f);
				} else {
					reader.readAsBinaryString(f);
				}
			}, 
			importBill: function() {
				//this.$message(this.dataHead.length);
				entity_import(this.paras).then(response => {
							var json_data = response.result;
							this.$message({
								message: '成功导入数据' + json_data + "条",
								type: 'success'
							});

					});
				this.centerDialogVisible = false;
				this.showData();
				//  this.$message(this.centerDialogTitle); 		
			},
			
			tableRowClassName(row, rowIndex) {
				return '';
			},
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			
			showData: function() {
				//显示数据
				let paras = apiparas.getParas_Objects('b_style', '', 'style_key,style_id,style_name,style_sex,style_ys_name,season_name,style_year,month_phase,class01_name,class02_name,class03_name,old_list_price,list_price,sale_price,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
				});
			},
			queryStyle:function(){
				if(this.styleID===''){
					this.showData();
				}else{
					let paras = apiparas.getParas_Objects('b_style', 'style_id.Contains( \''+this.styleID+'\')', 'style_key,style_id,style_name,style_sex,style_ys_name,season_name,style_year,month_phase,class01_name,class02_name,class03_name,old_list_price,list_price,sale_price,create_time,update_time');
					
					getObjects(paras).then(response => {
						// success callback
						var json_data = response.result;
						if(json_data.length===0){
							this.$message.warning('没有查询到该款号！');
						}
						this.data = json_data;
					});
				}
			},
			refreshPage: function() {
				//刷新页面
			},
			saveStyle:function(){
				//保存尺码组
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'b_style',
						JsonObj: {
							style_key:this.style_key,
							brand_key:this.brand_key,
							style_id:this.form.style_id,
							style_name:this.form.style_name,
							style_sex:this.form.style_sex,
							style_ys_name:this.form.style_ys_name,
							season_name:this.form.season_name,
							style_year:this.form.style_year,
							month_phase:this.form.month_phase,
							class01_name:this.form.class01_name,
							class02_name:this.form.class02_name,
							class03_name:this.form.class03_name,
							old_list_price:this.form.old_list_price,
							list_price:this.form.list_price,
							sale_price:this.form.sale_price
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改款成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('修改款失败！');
					}

					this.form.style_id = '';
					this.form.style_name = '';
					this.form.style_sex = '';
					this.form.style_ys_name = '';
					this.form.season_name = '';
					this.form.style_year = '';
					this.form.month_phase = '';
					this.form.class01_name = '';
					this.form.class02_name = '';
					this.form.class03_name = '';
					this.form.old_list_price = '';
					this.form.list_price = '';
					this.form.sale_price = '';
					this.style_key = '';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加款成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('增加款失败！');
					}

					this.form.style_id = '';
					this.form.style_name = '';
					this.form.style_sex = '';
					this.form.style_ys_name = '';
					this.form.season_name = '';
					this.form.style_year = '';
					this.form.month_phase = '';
					this.form.class01_name = '';
					this.form.class02_name = '';
					this.form.class03_name = '';
					this.form.old_list_price = '';
					this.form.list_price = '';
					this.form.sale_price = '';
					this.style_key = '';
					this.showData();

				});
				}
				
			},
			
			
			
			showEditStyle: function(index,row) {
				//编辑组别
				this.style_key = row.style_key;
				this.form.style_id = row.style_id;
				this.form.style_name = row.style_name;
				this.form.style_sex = row.style_sex;
				this.form.style_ys_name = row.style_ys_name;
				this.form.season_name = row.season_name;
				this.form.style_year = row.style_year;
				this.form.month_phase = row.month_phase;
				this.form.class01_name = row.class01_name;
				this.form.class02_name = row.class02_name;
				this.form.class03_name = row.class03_name;
				this.form.old_list_price = row.old_list_price;
				this.form.list_price = row.list_price;
				this.form.sale_price = row.sale_price;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showdelStyle: function(index,row) {
				//删除组别
				this.style_key = row.style_key;
				this.delMsg = '您确定要删除款号：' + row.style_id;
				this.delMsg += '款名称：' + row.style_name;
				this.delDialogVisible = true;
			},
			delStyle()
			{
				
				let obj = {
					TypeName: "b_style",
					JsonObj: {
						style_key: this.style_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除款成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.success('删除款失败！');
					}
					this.showData();
				});
			}
		},
		created: function() {
			this.showData();
			
		}
	}
</script>

<style>

</style>