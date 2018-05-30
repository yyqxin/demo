<template>
	<div>
		<!--<el-table :data="salesmanlist" border height="320" ref="singleTable" highlight-current-row style="width: auto;">
			<el-table-column type="index"></el-table-column>
			<el-table-column label="销售员">
				<template slot-scope="scope">
					<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.staff_name }}</div>
				</template>
			</el-table-column>
		</el-table>
		<br />
		<el-form>
			<el-form-item>
				<el-input id="salesman" placeholder="销售员" ref="salesman" v-model="salesmanselect" @keyup.enter.native="salesmanChange()">
					<template slot="prepend">销售员：</template>
				</el-input>
			</el-form-item>
			<el-row type="flex" class="row-bg" justify="center">
  				<el-button @click="close()">取 消</el-button>
				<el-button type="primary" ref="confirm" @click="salesmanChange()" @keyup.enter.native="salesmanChange()">确 定</el-button>
			</el-row>
		</el-form>-->
		<el-form>
			<el-form-item label="销售员" :label-width="formLabelWidth">
				<el-select v-model="salesmanselect" placeholder="请选择" ref="salesman">
					<el-option v-for="item in salesmanlist" :key="item.staff_name" :value="item.staff_name" ></el-option>
				</el-select>
			</el-form-item>
			<el-row type="flex" class="row-bg" justify="center">
  				<el-button @click="close()">取 消</el-button>
				<el-button type="primary" ref="confirm" @click="salesmanChange()" @keyup.enter.native="salesmanChange()">确 定</el-button>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import { query, apiparas } from '../../api/api';
	
	export default {
		props: ['dialogSalesmanVisible','salesman','currentPage'],
		data() {
			return {
				formLabelWidth: '120px',
				currentRow:null,
				currentRowIndex:null,
				salesmanselect:'',
				salesmanlist:[]
			}
		},
		mounted: function() {
			//生命周期
			this.getSalesmanlist();
			this.$refs.salesman.focus();
			this.salesmanselect=this.salesman;
		},
		computed: {
			//计算属性
		},
		methods: { //函数
			setCurrent(row) {
      			this.currentRow=row;
        		this.$refs.singleTable.setCurrentRow(row);
      		},
      		handleRow(index,row) {
      			this.currentRowIndex = index;
        		this.currentRow = row;
        		this.salesmanselect=this.currentRow.staff_name;
	       },
			close:function(){
				this.$emit('onchange',this.salesman);
			},
			salesmanChange:function(){
				this.$emit('onchange',this.salesmanselect);
			},
//			visibleChange:function(val){
//				if(val===false){
//					this.salesmanChange();
//				}
//			},
			getSalesmanlist: function() {
				//显示数据
				var jsonparas = [];
				let paras = apiparas.getParas('staff|get_staff',jsonparas);
				query(paras).then(response => {
							this.salesmanlist = response.result;
				});
			},
			keyup_top1:function(){
	        	if(this.currentRowIndex!=null&&this.currentRowIndex!=0){
	        		this.currentRowIndex--;
	        		this.setCurrent(this.salesmanlist[this.currentRowIndex]);
	        	}else if(this.currentRowIndex===null){
	        		this.currentRowIndex=0;
	        		this.setCurrent(this.salesmanlist[this.currentRowIndex]);
	        	}else{
	        		this.currentRowIndex=this.salesmanlist.length-1;
	        		this.setCurrent(this.salesmanlist[this.currentRowIndex]);
	        	}
	        	this.salesmanselect=this.currentRow.staff_name;
	        },
	        keyup_down1:function(){
	        	if(this.currentRowIndex!=null&&this.currentRowIndex<this.salesmanlist.length-1){
	        		this.currentRowIndex++;
	        		this.setCurrent(this.salesmanlist[this.currentRowIndex]);
	        	}else{
	        		this.currentRowIndex=0;
	        		this.setCurrent(this.salesmanlist[this.currentRowIndex]);
	        	}
	        	this.salesmanselect=this.currentRow.staff_name;
	        },
		},
		created:function(){
//  		let page = this;
//  		document.onkeyup = function(e){
//  			let key = window.event.keyCode;
//  			if(page.currentPage===1){
//  				if(key===38){
//	    				page.keyup_top1();
//	    			}
//	    			else if(key===40){
//	    				page.keyup_down1();
//	    			}
//  			}
//  		}
    	},
		update:function(){
			
		},
		watch: {
			dialogSalesmanVisible:function (newval, oldval){
				if(newval===true){
					this.$refs.salesman.focus();
					this.salesmanselect=this.salesman;
				}
			}
		}

	}
</script>

<style>
</style>