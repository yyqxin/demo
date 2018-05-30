<template>
	<div>
		<div class="buttons">
			<el-button @click="showDelMenu">删除菜单</el-button>
			<el-button @click="showBrotherMenu(0)">添加同级菜单</el-button>
			<el-button @click="showBrotherMenu(1)">添加子菜单</el-button>
		</div>
		<br />
		<el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
		<el-tree class="filter-tree" 
			:data="menuData" 
			:props="defaultProps" 
			:filter-node-method="filterNode" 
			show-checkbox node-key="id"  
			:expand-on-click-node="false"
			:check-strictly="true"
			default-expand-all
			ref="tree">
		</el-tree>
		
		
		<el-dialog :title="addMsg"  :visible.sync="dialogFormVisible" width="30%">
			<el-form :model="form" label-width="100px">
				<el-form-item label="菜单名称：" >
					<el-input v-model="form.menu_name"></el-input>
				</el-form-item>
				<el-form-item label="菜单代码：" >
					<el-input v-model="form.menu_code"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="addBrotherMenu">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { getreport, getfilter, query, apiparas, getObjects , entity_add , entity_delete , entity_update , entity_import } from '../../api/api';
	import { Cookie } from '../../js/common' ;
	export default {
		data() {
			return {
				dialogFormVisible:false,
				form: {
					menu_name:'',
					menu_code:'',
					father_menu:'',
					icon:'setting',
					port:'电脑',
					route_url:'',
					order_index:1
				},
				menu_key :'',
				addMsg:'',
				menuData:[],
				defaultProps: {
					id:'menu_key',
          			children: 'subs',
          			label: 'title'
	        	},
	        	filterText: '',
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
			
			showBrotherMenu:function(type){
				//选择的节点
				let menuitem = this.$refs.tree.getCheckedNodes();
				if(menuitem.length===0){
					this.$message.error('请选择菜单');
					return;
				}else if(menuitem.length>1){
					this.$message.error('仅可以选择一个菜单');
					return;
				}
				
				//判断添加菜单类型  0-同级菜单   1-子菜单
				if(type===0){
					this.addMsg = '添加同级菜单';
					if(menuitem[0].pid===''){
						this.form.father_menu = '00000000000000000000000000000000';
					}else{
						this.form.father_menu = menuitem[0].pid;
					}
				}else{
					this.addMsg = '添加子菜单';
					this.form.father_menu = menuitem[0].id;
				}
				
				this.dialogFormVisible = true;
			},
			addBrotherMenu:function(){
				let token = Cookie.Get('token');
				let obj={
					TypeName: 'y_menu',
						JsonObj: {
							menu_name:this.form.menu_name,
							menu_code:this.form.menu_code,
							father_menu:this.form.father_menu,
							icon:this.form.icon,
							port:this.form.port,
							route_url:this.form.route_url,
							order_index:this.form.order_index
						},
					token: token 
				};
				entity_add(obj).then(response => {
					if(response.errid == 0) {
						this.$message.success('增加菜单成功！');
						this.dialogFormVisible = false;
					} else {
						this.$message.error('增加菜单失败！');
					}
					this.form.menu_name = '';
					this.form.menu_code = '';
					this.form.father_menu = '';
					this.dialogFormVisible = false;
					this.getMenu();
				});
			},
			showDelMenu:function() {
				//删除组别
				let menuitem = this.$refs.tree.getCheckedNodes();
				this.menu_key = menuitem[0].id;
				this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.delMenu();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			delMenu:function() {
				let obj = {
					TypeName:"y_menu",
					JsonObj: {
						menu_key: this.menu_key
					},
					token: Cookie.Get("token"),
				}
				entity_delete(obj).then(response => {
					
					if(response.errid == 0) {
						this.$message.success('删除菜单成功！');
					} else {
						this.$message.error('删除菜单失败！');
					}
					this.getMenu();
				});
			},
			filterNode(value, data) {
        		if (!value) return true;
        		return data.title.indexOf(value) !== -1;
      		},
			refreshPage: function() {
				//刷新页面
			},
			getMenu:function(){
				let jsonparas = [];
				let paras = apiparas.getParas_rtype('menu|getmenu',3,jsonparas);
				query(paras).then(response => {
							let json_data = response.result;
							this.menuData=json_data;
				});
			},
		},
		created: function() {
			this.getMenu();
		},
		watch: {
      		filterText(val) {
        		this.$refs.tree.filter(val);
      		}
    	},
	}
</script>

<style>

</style>