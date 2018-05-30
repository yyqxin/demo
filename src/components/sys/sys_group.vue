<template>
	<div>
		<el-row>
			<el-col :span="4">
				<el-input placeholder="请输入组别" v-model="p_name">
					<template slot="prepend">组别:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="showData">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="group_code" label="组别编码" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="group_name" label="组别名称">
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间">
			</el-table-column>
			<el-table-column prop="update_time" label="修改时间">
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

	<el-dialog title="增加组别" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="组别代码：" :label-width="formLabelWidth">
					<el-input v-model="form.group_code" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组别名称：" :label-width="formLabelWidth">
					<el-input v-model="form.group_name" auto-complete="off"></el-input>
				</el-form-item>
			 
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveGroup">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除组别" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delGroup">确 定</el-button>
				  </span>
		</el-dialog>



	</div>
</template>

<script>
	import { getreport, getfilter, query, apiparas, getObjects , entity_add , entity_delete , entity_update } from '../../api/api';
	import { Cookie } from '../../js/common' ;
	export default {
		data() {
			return {
				data: [],
				currentPage: 1,
				pagesize: 15,
				p_name: '',
				dialogFormVisible:false,
				rules:{},
				form: {
					group_code:'',
					group_name:''
				},
				formLabelWidth:'120px',
				group_key :'',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false
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
				let paras = apiparas.getParas_Objects('y_group', '', 'group_key,group_code,group_name,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
				});
			},
			refreshPage: function() {
				//刷新页面
			},
			saveGroup:function(){	 
				//保存组别
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'y_group',
						JsonObj: {
							group_key:this.group_key,
							group_code:this.form.group_code,
							group_name:this.form.group_name
						},
					token: token 
				};				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改组别成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('修改组别失败！');
					}
					this.form.group_code = '';
					this.form.group_name = '';
					this.group_key = '';
					this.showData();
				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加组别成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.success('增加组别失败！');
					}

					this.form.group_code = '';
					this.form.group_name = '';
					this.group_key = '';
					this.showData();

				});
				}
				
			},
			showEditGroup: function(index,row) {
				//编辑组别
				this.group_key = row.group_key;
				this.form.group_code = row.group_code;
				this.form.group_name = row.group_name;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showDelGroup: function(index,row) {
				//删除组别
				this.group_key = row.group_key;
				this.delMsg = '您确定要删除组别代码：' + row.group_code;
				this.delMsg += '组别名称：' + row.group_name;
				this.delDialogVisible = true;
			},
			delGroup()
			{
				
				let obj = {
					TypeName: "y_group",
					JsonObj: {
						group_key: this.group_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除用户成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.success('删除用户失败！');
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