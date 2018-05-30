<template>
	<div>
		<el-row>
			<el-col :span="6">
				<el-input placeholder="请输入品牌名称" v-model="brandName"  @keyup.enter.native="queryBrand">
					<template slot="prepend">品牌名称:</template>
				</el-input>
			</el-col>
			<el-col :span="4">
				<el-button type="primary" @click="queryBrand">查询</el-button>
				<el-button type="primary"  @click="dialogFormVisible = true;isAdd = true">增加</el-button>
			</el-col>
		</el-row>
		<el-table :data="data.slice((currentPage-1)*pagesize,currentPage*pagesize)" showOverflowTooltip style="width: 100%" border ref="multipleTable">
			<el-table-column prop="brand_name" label="品牌名称" show-overflow-tooltip>
			</el-table-column>
			
			<el-table-column label="操作" width="240">
				<template slot-scope="scope">
					<el-button size="small" type="primary" @click="showEditBrand(scope.$index,scope.row)">编辑</el-button>
					<el-button size="small" type="primary" @click="showDelBrand(scope.$index,scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="this.currentPage" :page-sizes="[15, 20, 50, 100]" :page-size="this.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="data.length">
		</el-pagination>

	<el-dialog title="增加公司" :rules="rules" :visible.sync="dialogFormVisible">
			<el-form :model="form">
				<el-form-item label="品牌名称：" :label-width="formLabelWidth">
					<el-input v-model="form.brand_name" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveBrand">确 定</el-button>
			</div>

		</el-dialog>

		<el-dialog title="删除公司" :visible.sync="delDialogVisible" width="30%" center>
			<span>{{ delMsg }}</span>
			<span slot="footer" class="dialog-footer">
				    <el-button @click="delDialogVisible = false">取 消</el-button>
				    <el-button type="primary" @click="delBrand">确 定</el-button>
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
				brandName: '',
				dialogFormVisible:false,
				rules:{},
				form: {
					brand_name:''
				},
				formLabelWidth:'120px',
				company_key :'7e4d4d9248f34af48e8cd434661f6793',
				brand_key:'',
				delMsg:'',
				delDialogVisible :false,
				isAdd:false,
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
				let paras = apiparas.getParas_Objects('b_brand', 'company_key=\''+this.company_key+'\'', 'brand_key,brand_name,create_time,update_time');
				getObjects(paras).then(response => {
					// success callback
					var json_data = response.result;
					this.data = json_data;
				});
			},
			queryBrand:function(){
				if(this.brandName===''){
					this.showData();
				}else{
					let paras = apiparas.getParas_Objects('b_brand', 'brand_name.Contains( \''+this.brandName+'\') and company_key=\''+this.company_key+'\'', 'brand_key,brand_name,create_time,update_time');
					getObjects(paras).then(response => {
						// success callback
						var json_data = response.result;
						if(json_data.length===0){
							this.$message.warning('没有查询到该品牌！');
						}
						this.data = json_data;
					});
				}
			},
			refreshPage: function() {
				//刷新页面
			},
			saveBrand:function(){
				//保存尺码组
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'b_brand',
						JsonObj: {
							brand_key:this.brand_key,
							company_key:this.company_key,
							brand_name:this.form.brand_name
						},
					token: token 
				};
				
				if (!this.isAdd)
				{
					entity_update(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('修改品牌成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('修改品牌失败！');
					}

					this.form.brand_name = '';
					this.showData();

				});
				}
				else
				{
					entity_add(obj).then(response => {

					if(response.errid == 0) {
						this.$message.success('增加品牌成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('增加品牌失败！');
					}

					this.form.brand_name = '';
					this.showData();

				});
				}
				
			},
			showEditBrand: function(index,row) {
				//编辑组别
				this.brand_key = row.brand_key;
				this.form.brand_name = row.brand_name;
				this.dialogFormVisible = true;
				this.isAdd = false;
			},
			showDelBrand: function(index,row) {
				//删除组别
				this.brand_key = row.brand_key;
				this.delMsg = '您确定要删除品牌名称：' + row.brand_name;
				this.delDialogVisible = true;
			},
			delBrand()
			{
				
				let obj = {
					TypeName: "b_brand",
					JsonObj: {
						brand_key: this.brand_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除品牌成功！');
						this.delDialogVisible = false;
					} else {
						this.$message.error('删除品牌失败！');
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