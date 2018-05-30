<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入尺码组名称" v-model="sizeGroupName"  @keyup.enter.native="querySizeGroup">
					<template slot="prepend">尺码组名称:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="querySizeGroup">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
				<el-button type="primary" @click="centerDialogVisible = true">导入</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="size_group_code" label="尺码组编码" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="size_group_name" label="尺码组名称">
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditGroup(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showDelGroup(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加尺码组" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="尺码组编码：" :label-width="formLabelWidth">
					<el-input v-model="form.size_group_code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="尺码组名称：" :label-width="formLabelWidth">
					<el-input v-model="form.size_group_name" auto-complete="off"></el-input>
				</el-form-item>			 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveGroup">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除尺码组" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delGroup">确 定</el-button>
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
				sizeGroupName: '',
				dialogFormVisible:false,
				centerDialogVisible:false,
				rules:{},
				form: {
					size_group_code:'',
					size_group_name:''
				},
				formLabelWidth:'120px',
				size_group_key :'',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false,
				xlsData: {},
				dataHead: [{"name":"dd","value":"dd"}],
				size_group_colname:['尺码组编码','尺码组名称'],
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
						console.log(_this.xlsData,'1');

						_this.dataHead = [];
						var colIndex = []; //找到列对应的位置
						var t_col = [];
						var row_start = 1;
						for(var i = 0; i < _this.xlsData[0].length; i++) {
							apiparas.pushPara(_this.dataHead , _this.xlsData[0][i], _this.xlsData[0][i]);
						}
						t_col = _this.size_group_colname;
						console.log(_this.dataHead,'3');  
						
						for(var i = 0; i < t_col.length; i++) {
							for(var j = 0; j < _this.dataHead.length; j++) {

								if(_this.dataHead[j]['name'] == t_col[i]) //找需要导入数据列的对应列顺序
								{
									colIndex.push(j);
									continue;
								}
							}

						}
						var objs = [];
						for(var i = row_start; i < _this.xlsData.length; i++) {
							if(_this.xlsData[i][colIndex[0]] != undefined  && _this.xlsData[i][colIndex[1]] != undefined) {
								let obj = {
									"size_group_code": _this.xlsData[i][colIndex[0]],
									"size_group_name": _this.xlsData[i][colIndex[1]],
								}
								objs.push(obj);
							}
						}
						console.log(objs,'10');
						let paras = {
							"TypeName": "b_size_group",
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
				let paras = apiparas.getParas_Objects('b_size_group', '', 'size_group_key,size_group_code,size_group_name,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
				});
			},
			querySizeGroup:function(){
				if(this.sizeGroupName===''){
					this.showData();
				}else{
					let paras = apiparas.getParas_Objects('b_size_group', 'size_group_name.Contains( \''+this.sizeGroupName+'\')', 'size_group_key,size_group_code,size_group_name,create_time,update_time');
					getObjects(paras).then(response => {
						// success callback
						var json_data = response.result;
						if(json_data.length===0){
							this.$message.warning('没有查询到该尺码组！');
						}
						this.data = json_data;
					});
				}
			},
			refreshPage: function() {
				//刷新页面
			},
			saveGroup:function(){
				//保存尺码组
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'b_size_group',
						JsonObj: {
							size_group_key:this.size_group_key,
							size_group_code:this.form.size_group_code,
							size_group_name:this.form.size_group_name
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改尺码组成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('修改尺码组失败！');
					}

					this.form.size_group_code = '';
					this.form.size_group_name = '';
					this.size_group_key = '';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加尺码组成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('增加尺码组失败！');
					}

					this.form.size_group_code = '';
					this.form.size_group_name = '';
					this.size_group_key = '';
					this.showData();

				});
				}
				
			},
			showEditGroup: function(index,row) {
				//编辑组别
				this.size_group_key = row.size_group_key;
				this.form.size_group_code = row.size_group_code;
				this.form.size_group_name = row.size_group_name;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showDelGroup: function(index,row) {
				//删除组别
				this.size_group_key = row.size_group_key;
				this.delMsg = '您确定要删除尺码组代码：' + row.size_group_code;
				this.delMsg += '尺码组名称：' + row.size_group_name;
				this.delDialogVisible = true;
			},
			delGroup()
			{
				
				let obj = {
					TypeName: "b_size_group",
					JsonObj: {
						size_group_key: this.size_group_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除尺码组成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.success('删除尺码组失败！');
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