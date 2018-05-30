<template>
	<div>
		<el-form>
			<el-form-item label="整单折扣" :label-width="formLabelWidth">
				<el-input type="number" ref="alldiscountChange" v-model="discount" auto-complete="off" @keyup.enter.native="alldiscountChange()"></el-input>
			</el-form-item>
			<el-form-item label="减免金额" :label-width="formLabelWidth">
				<el-input type="number" ref="amtChange" v-model="free_amt" auto-complete="off" @keyup.enter.native="alldiscountChange()"></el-input>
			</el-form-item>
		</el-form>
		
		<el-row type="flex" class="row-bg" justify="center">
  			<el-button @click="close()">取 消</el-button>
			<el-button type="primary" @click="alldiscountChange()">确 定</el-button>
		</el-row>
	</div>
</template>

<script>
	
	export default {
		props: ['tableData','dialogAllDiscountVisible','detailsData'],
		
		data() {
			return {
				formLabelWidth: '120px',
				discount:'',
				free_amt:''
			}
		},
		mounted: function() {
			//生命周期
			this.$refs.alldiscountChange.focus();
		},
		computed: {
			//计算属性
			amt(){
		    	let amt = 0;
		    	for(let i=0;i<this.tableData.length;i++){
		    		amt=amt+Number(this.tableData[i].amt);
		    	}
		    	return amt;
		    }
		},
		methods: { //函数
			close:function(){
				this.$emit('onchange', this.tableData,this.amt);
			},
			alldiscountChange(){
	        	let dc = this.discount;
				let free_amt;
				
      			if(this.free_amt===''){
      				free_amt=0;
      			}else{
      				free_amt = this.free_amt;
      			}
				let amt = this.amt;
				for(let i=0;i<this.tableData.length;i++){
	        		let free_amt1=free_amt*(this.tableData[i].amt/amt);
	        		if(this.discount===''){
	      				dc=this.tableData[i].discount.substring(0,this.tableData[i].discount.length-1);
	      			}
	        		
	        		if(dc>0&&dc<10){
		        		this.tableData[i].price_after_discount = Number( ( this.tableData[i].price_after_discount*( dc*10/100 ) - ( free_amt1/this.tableData[i].count ) ).toFixed(2) );		        		
		        		this.tableData[i].discount = (this.tableData[i].price_after_discount/this.tableData[i].price).toFixed(2)*100+"%";
	      				this.tableData[i].amt = Number( (this.tableData[i].count*this.tableData[i].price_after_discount).toFixed(2) ) ;
		        	}else if(dc>10&&dc<=100){
		        		this.tableData[i].price_after_discount = Number( (this.tableData[i].price_after_discount*(dc/100) - ( free_amt1/this.tableData[i].count ) ).toFixed(2) );
	      				this.tableData[i].discount = (this.tableData[i].price_after_discount/this.tableData[i].price).toFixed(2)*100+"%";
	      				this.tableData[i].amt = Number( (this.tableData[i].count*this.tableData[i].price_after_discount).toFixed(2) );
		        	}
		        	this.detailsData[i].unit_price = this.tableData[i].price_after_discount;
		        	this.detailsData[i].qmt = this.tableData[i].amt;
	        	}
	        	this.$emit('onchange', this.tableData);
	        }
		},
		created: function() {
			
		},
		update:function(){
			
		},
		watch: {
			dialogAllDiscountVisible:function (newval, oldval){
				if(newval===true){
					this.$refs.alldiscountChange.focus();
					this.discount='';
					this.free_amt='';
				}
			}
		}

	}
</script>

<style>
</style>