<template>
	<el-container>
		<el-header style="height: 60px;">
			<div class="header-left">收银台</div>
			<div class="header-right">
				店名：{{ entity }}
				<br>收银员：{{ salesman }}
			</div>
			<div class="header-right">
				销售日期：{{ date }}
				<!--<br>模式：销售-->
				<br>禁止促销：true
			</div>
		</el-header>
		<el-container>
			<el-container>
				<el-main>
					<div>
						<el-table :data="tableData" 
							border 
							height="320"
							ref="singleTable"
							highlight-current-row
							style="width: auto;">
							<el-table-column type="index"></el-table-column>
							<el-table-column label="商品名称">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.name }}</div>
								</template>
							</el-table-column>
							<el-table-column label="颜色">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.color }}</div>
								</template>
							</el-table-column>
							<el-table-column label="尺寸">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.size }}</div>
								</template>
							</el-table-column>
							<el-table-column label="吊牌价">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.price }}</div>
								</template>
							</el-table-column>
							<el-table-column label="折扣">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.discount }}</div>
								</template>
							</el-table-column>
							<el-table-column label="折后单价">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.price_after_discount }}</div>
								</template>
							</el-table-column>
							<el-table-column label="数量">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.count }}</div>
								</template>
							</el-table-column>
							<el-table-column label="金额">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.amt }}</div>
								</template>
							</el-table-column>
							<el-table-column label="导购">
								<template slot-scope="scope">
									<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.salesman }}</div>
								</template>
							</el-table-column>
						</el-table>
					</div>
					
					<div style="height: 250px;">
						<div style="height:100%;width: 62%;float:left;">
							<div style="height: 170px;">
								<div class="details">会员积分:</div>
								<div class="details">促销信息:</div>
							</div>
							<div class="barcodeinput">
								<div class="footer-left">{{ salesman }}</div>
								<div class="footer-left">{{ sale_type }}</div>
								<div class="footer-right">
									<el-row>
										<el-col :span="23" >
											<el-input id="inputBarcode"  placeholder="请输入条形码" ref="inputBarcode" v-model="barcode"
								          		@keyup.enter.native="getData()">
												<template slot="prepend">条形码：</template>
											</el-input>
										</el-col>
										<el-col :span="1" >
											<el-button type="primary" @click="getData">搜索</el-button>
										</el-col>
									</el-row>
									
									<!--<el-input id="inputBarcode"  placeholder="请输入条形码" ref="inputBarcode" 
								        @keyup.enter.native="enter_next('barcode')">
									</el-input>
									<el-button type="primary" @click="getData" style="float:left">搜索</el-button>-->
									
								</div>
							</div>
						</div>
						<div class="total">
							<div style="height: 170px;border-bottom:2px dashed #E9EEF3 ;">
								<div style="height:100%;width: 48%;border-right:2px dashed #E9EEF3 ;float:left;text-align:center">
									<div style="line-height: 30px;">数量（件）</div>
									<div style="font-size: 60px; line-height: 130px;">{{ count }}</div>
								</div>
								<div style="height:100%;width: 48%;float:left;text-align:center">
									<div style="line-height: 30px;">金额（元）</div>
									<div style="font-size: 60px; line-height: 130px;">{{ amt }}</div>
								</div>
							</div>
							<div style="height: 70px;width: 100%;float:left;text-align:center">
								<div style="width:50%;float: left;line-height: 35px;">
									自动优惠：无
									<br>手工优惠：无
								</div>
								<div style="width:50%;float: left;line-height: 35px;">
									已优惠：无
									<br>[空格键]结算
								</div>
							</div>
						</div>
					</div>
					<div>
						
					</div>
				</el-main>
			</el-container>
			<el-aside width="200px" >
				<div class="shortcutmenu ">
					<h3>快捷功能</h3>
					F2:销售/退货
					<br> F8:选择销售员
					<br> F9:收款结算
					<br> F10:重打小票
					<br> ↑:上一行
					<br> ↓:下一行
					<br> ←:数量减1
					<br> →:数量加1
					<br> "+":会员选择
					<br> "-":折扣(改价,改折扣)
					<br> "/":整单打折
					<br> Del:删除行
					<br> Insert:清单,重开新单
					<br>
				</div>
			</el-aside>
		</el-container>
		
		<el-dialog title="收款" :visible.sync="dialogAmtVisible" @close=close()>
			<v-amtDialog :count=count :amt=amt v-on:onchange="settleAccounts"></v-amtDialog>
		</el-dialog>
		
		<el-dialog title="选择品牌" :visible.sync="dialogdetailVisible">
			<el-table :data="commodityData" border height="320" ref="" highlight-current-row style="width: auto;">
				<el-table-column type="index"></el-table-column>
				<el-table-column label="品牌">
					<template slot-scope="scope">
						<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.brand_name }}</div>
					</template>
				</el-table-column>
				<el-table-column label="商品名称">
					<template slot-scope="scope">
						<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.style_name }}</div>
					</template>
				</el-table-column>
				<el-table-column label="颜色">
					<template slot-scope="scope">
						<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.color_name }}</div>
					</template>
				</el-table-column>
				<el-table-column label="尺寸">
					<template slot-scope="scope">
						<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.size_name }}</div>
					</template>
				</el-table-column>
				<el-table-column label="吊牌价">
					<template slot-scope="scope">
						<div class="td" @click=handleRow(scope.$index,scope.row)>{{ scope.row.list_price }}</div>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" @click="handleEdit(scope.$index, scope.row)" type="primary">选择</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		
		<el-dialog title="选择销售员" :visible.sync="dialogSalesmanVisible" @close=close()>
			<v-salesman :dialogSalesmanVisible=dialogSalesmanVisible :salesman=salesman :currentPage=currentPage v-on:onchange="changesalesman"></v-salesman>
		</el-dialog>
		<el-dialog title="修改折扣" :visible.sync="dialogDiscountVisible" @close=close()>
			<v-discount :currentRow=currentRow :dialogDiscountVisible=dialogDiscountVisible v-on:onchange="changediscount"></v-discount>
		</el-dialog>
		<el-dialog title="整单打折" :visible.sync="dialogAllDiscountVisible" @close=close()>
			<v-alldiscount :tableData=tableData :detailsData=detailsData :dialogAllDiscountVisible=dialogAllDiscountVisible v-on:onchange="changealldiscount"></v-alldiscount>
		</el-dialog>
		<el-dialog title="会员选择" :visible.sync="dialogVipVisible" @close=close()>
			<v-vipDialog :dialogVipVisible=dialogVipVisible :currentPage=currentPage v-on:onchange="selectVip"></v-vipDialog>
		</el-dialog>	
		
	</el-container>
	
</template>

<script>
	import { query, apiparas, entity_add } from '../../api/api';
	import vSalesman from '../pos/Salesman.vue';
	import vDiscount from '../pos/Discount.vue';
	import vAlldiscount from '../pos/Alldiscount.vue';
	import vVipDialog from '../pos/VipDialog.vue';
	import vAmtDialog from '../pos/AmtDialog.vue';
	import {getLodop } from "../../js/clodop.js"
	
	export default {
		components:{
			vSalesman,
			vDiscount,
			vAlldiscount,
			vVipDialog,
			vAmtDialog
		},
		data() {
			return {
				currentPage:0,				//当前页标识。0-主页面	1-dailog页面
				tableData: [],			//销售明细(明细)
				detailsData:[],			//销售明细(key+明细）
				keyData:[],				//销售明细（key）
				currentRow: null,
				currentRowIndex: null,
				formLabelWidth: '60px',
				sale_type:'销售'	,			//销售类型(正常销售/退货)
				date:'',					//销售日期
				entity:'测试门店',
				barcode:'E7R04AH212J012',	//条形码
				commodityData:[],			//扫码商品明细
				currentpage:0,
				vipdata:{},					//vip资料
				salesman:'月月',				//销售员
				print_num:0,				//小票打印次数
				dialogdetailVisible:false,
				dialogAmtVisible:false,
				dialogDiscountVisible:false,
				dialogAllDiscountVisible:false,
				dialogSalesmanVisible:false,
				dialogVipVisible:false,
			}
		},
		mounted: function() {
			//生命周期
			this.getDate();
			this.$refs.inputBarcode.$refs.input.focus();
	      	this.$refs.inputBarcode.$refs.input.select();
		},
		computed: {
		    // 计算属性的 getter
		    count(){
		    	//销售总数量
		    	let count = 0;
		    	for(let i=0;i<this.tableData.length;i++){
		    		count=count+Number(this.tableData[i].count);
		    	}
		    	return count;
		    },
		    amt(){
		    	//销售总金额
		    	let amt = 0;
		    	for(let i=0;i<this.tableData.length;i++){
		    		amt=amt+Number(this.tableData[i].amt);
		    	}
		    	return amt;
		    }
		},
		methods: {
			printtest:function(){
        		console.log("test")
        		//var obj=this.lodopobj 
		var LODOP = getLodop() //window.CLODOP2015_7028;  
		LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
		LODOP.SET_PRINT_STYLE("FontSize",18);
		LODOP.SET_PRINT_STYLE("Bold",1);
		LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容");
		LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById("printarea").innerHTML);
		
		LODOP.PREVIEW();	
        	},
        	printtest1:function(){
        		console.log("test")
        		//var obj=this.lodopobj 
		var LODOP = getLodop() //window.CLODOP2015_7028;  
		LODOP.PRINT_INIT("打印控件功能演示_Lodop功能_表单一");
		LODOP.SET_PRINT_STYLE("FontSize",18);
		LODOP.SET_PRINT_STYLE("Bold",1);
		LODOP.ADD_PRINT_TEXT(50,231,260,39,"打印页面部分内容");
		LODOP.ADD_PRINT_HTM(88,200,350,600,document.getElementById("printarea").innerHTML);
		
		LODOP.PREVIEW();	
        	},
			close:function(){
				//关闭dialog回调函数，回到主页面，使currentPage=0
				this.currentPage=0;
			},
			selectVip:function(val){
				this.currentPage=0;
				this.dialogVipVisible=false;
				this.vipdata=val;
				
			},
			changesalesman:function(val){
				this.salesman=val;
				this.dialogSalesmanVisible=false;
				this.currentPage=0;
			},
			changediscount:function(val){
				this.currentRow = val;
				this.detailsData[this.currentRowIndex].unit_price = val.price_after_discount;
				this.detailsData[this.currentRowIndex].qmt = val.amt;
				this.dialogDiscountVisible=false;
				this.currentPage=0;
				console.log(this.detailsData,"1");
			},
			changealldiscount:function(val){
				this.tableData = val;
				this.dialogAllDiscountVisible=false;
				this.currentPage=0;
			},
			settleAccounts:function(cashiersval,factval,giveval){
				let JsonObj = {
					doc_no:"retail2018033101",
			  		entity_key:"7e4d4d9248f34af48e8cd434661f6793",
			  		sale_person:this.salesman,
			  		sale_type:this.sale_type,
			  		cashier:this.salesman,
			  		work_date:this.date,
			  		vip_key:this.vipdata.vip_key,
			  		amt:this.amt,
			  		fact_amt:factval,
			  		give_amt:giveval,
			  		qty:this.count,
			  		print_num:this.print_num,
			  		details:this.detailsData,
			  		cashiers:cashiersval
				}
				let paras = apiparas.getParas_add("r_retail_master",JsonObj);
				entity_add(paras).then(response =>{
					console.log(response.result);
				});
			},
			getData:function(){
				if(this.salesman===""){
					this.$notify.error({
          				title: '错误',
          				message: '请选择销售员'
        			});
					return;
				}
				var jsonparas = [];
				var jsondata = {};
				apiparas.pushPara(jsonparas, 'bar_code', this.barcode);
				let paras = apiparas.getParas('style|get_style_barcode', jsonparas);
					query(paras).then(response => {
						if(response.result.length === 1) {
							jsondata = response.result[0];
							let p1 = {
								product_key:jsondata.product_key,
								style_key: jsondata.style_key,
								color_key: jsondata.color_key,
								size_group_key: jsondata.size_group_key,
								size_key: jsondata.size_key,
								bar_code: jsondata.bar_code
							}
							let str = JSON.stringify(p1);
							let bool = false;
							let index = 0; 
							for(let i = 0; i < this.keyData.length; i++) {
								if(str === JSON.stringify(this.keyData[i])) {
									bool=true;
									index = i;
									break;
								}
							}
							this.getjson(bool,index,jsondata,p1);
						} else if(response.result.length === 0){
							this.$notify.error({
		          				title: '错误',
		          				message: '请输入正确的条形码'
		        			});
						}
						else {
							this.commodityData = response.result;
							this.dialogdetailVisible = true;
						}
					});
				},
			getjson: function(bool,index,val,keyval) {
				//
				if(bool){
					this.tableData[index].count++;
					this.tableData[index].amt=this.tableData[index].count*this.tableData[index].price;
					this.detailsData[index].qty++;
					this.detailsData[index].unit_price = this.tableData[index].price_after_discount;
					this.detailsData[index].qmt = this.tableData[index].amt;
				}
				else{
					let p = {
						name: val.style_name,
						price: val.list_price,
						color: val.color_name,
						size: val.size_name,
						discount:'100%',
						price_after_discount:val.list_price*1,
						count:1,
						amt:val.list_price,
						salesman:this.salesman,
					};
					if(this.sale_type==='退货'){
						p.count=-1;
						p.amt=-val.list_price;
					};
					
					let p1 = {
						style_key: val.style_key,
						color_key: val.color_key,
						size_group_key: val.size_group_key,
						size_key: val.size_key,
						bar_code: val.bar_code,
						unit_price:val.list_price,
						list_price:val.list_price,
						qty:1,
						qmt:val.list_price
					}
					
					this.tableData.push(p);
					this.keyData.push(keyval);
					this.detailsData.push(p1);
					
				}
			},
			handleEdit(index, row) {
				let p1 = {
					product_key:this.commodityData[index].product_key,
					style_key: this.commodityData[index].style_key,
					color_key: this.commodityData[index].color_key,
					size_group_key: this.commodityData[index].size_group_key,
					size_key: this.commodityData[index].size_key,
					bar_code: this.commodityData[index].bar_code
				}
				let str = JSON.stringify(p1);
				let bool = false;
				let index1 = 0; 
				for(let i = 0; i < this.keyData.length; i++) {
					if(str === JSON.stringify(this.keyData[i])) {
						bool=true;
						index1 = i;
						break;
					}
				}
				this.getjson(bool,index1,this.commodityData[index],p1);
        		this.dialogdetailVisible=false;
      		},
			enter_next:function(){
	      		this.getData();
		        this.$refs.inputBarcode.$refs.input.focus();
		        this.$refs.inputBarcode.$refs.input.select();
	      	},
	      	
			getDate:function(){
				//获取当前如期(格式为YYYY-MM-DD)
				let myDate = new Date();
		        let year = myDate.getFullYear();
		        let month = myDate.getMonth() + 1;
		        let strDate = myDate.getDate();
		        if (month >= 1 && month <= 9) {
		            month = "0" + month;
		        }
		        if (strDate >= 0 && strDate <= 9) {
		            strDate = "0" + strDate;
		        }
		        let mytime = year + "-" + month + "-" + strDate;
				
				this.date=mytime;
			},
      		setCurrent(row) {
      			this.currentRow=row;
        		this.$refs.singleTable.setCurrentRow(row);
      		},
      		handleRow(index,row) {
      			this.currentRowIndex = index;
        		this.currentRow = row;
	        },
	        keyup_top:function(){
	        	if(this.currentRowIndex!=null&&this.currentRowIndex!=0){
	        		this.currentRowIndex--;
	        		this.setCurrent(this.tableData[this.currentRowIndex]);
	        	}else if(this.currentRowIndex===null){
	        		this.currentRowIndex=0;
	        		this.setCurrent(this.tableData[this.currentRowIndex]);
	        	}else{
	        		this.currentRowIndex=this.tableData.length-1;
	        		this.setCurrent(this.tableData[this.currentRowIndex]);
	        	}
	        },
	        keyup_down:function(){
	        	if(this.currentRowIndex!=null&&this.currentRowIndex<this.tableData.length-1){
	        		this.currentRowIndex++;
	        		this.setCurrent(this.tableData[this.currentRowIndex]);
	        	}else{
	        		this.currentRowIndex=0;
	        		this.setCurrent(this.tableData[this.currentRowIndex]);
	        	}
	        },
      		keyup_right:function(){
      			if(this.currentRow!=null){
      				this.currentRow.count++;
      				this.currentRow.amt=this.currentRow.count*this.currentRow.price_after_discount;
      				this.detailsData[this.currentRowIndex].qty++;
      				this.detailsData[this.currentRowIndex].qmt = this.currentRow.count*this.currentRow.price_after_discount;
      			}
      		},
      		keyup_left:function(){
      			if(this.currentRow!=null){
      				this.currentRow.count--;
      				this.currentRow.amt=this.currentRow.count*this.currentRow.price_after_discount;
      				this.detailsData[this.currentRowIndex].qty--;
      				this.detailsData[this.currentRowIndex].qmt = this.currentRow.count*this.currentRow.price_after_discount;
      			}
      		},
      		keyup_delete:function(){
      			if(this.currentRowIndex!=null){
      				this.tableData.splice(this.currentRowIndex,1);
      				this.detailsData.splice(this.currentRowIndex,1);
      				this.keyData.splice(this.currentRowIndex,1);
      				if(this.currentRowIndex>=this.tableData.length-1){
      					this.currentRowIndex-=1;
      				}
      				this.setCurrent(this.tableData[this.currentRowIndex]);
      			}
      		},
      		keyup_insert:function(){
      			if(this.tableData.length>0){
      				this.$confirm('此操作将删除此订单, 是否继续?', '提示', {
	          			confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning'
	        		}).then(() => {
	          			this.$message({
	            			type: 'success',
	            			message: '删除成功!'
	          			});
	          			this.tableData=[];
	      			}).catch(() => {
	          			this.$message({
		            		type: 'info',
		            		message: '已取消删除'
	          			});          
	        		});
	      		}
      		},
      		keyup_subtract:function(){
      			if(this.currentRow!=null){
      				this.currentPage=1;
      				this.dialogDiscountVisible=true;
    			}
      		},
      		keyup_divide:function(){
      			this.currentPage=1;
      			this.dialogAllDiscountVisible=true;
      		},
      		keyup_add:function(){
      			this.currentPage=1;
      			this.dialogVipVisible=true;
      		},
      		keyup_f2:function(){
      			if(this.sale_type==='退货'){
      				this.sale_type='销售';
      			}else{
      				this.sale_type='退货';
      			}
      		},
      		keyup_f8:function(){
      			this.currentPage=1;
      			this.dialogSalesmanVisible=true;
      			
      		},
      		keyup_f9:function(){
      			if(JSON.stringify(this.vipdata) === "{}"){
      				this.$notify.error({
          				title: '错误',
          				message: '请选择会员'
        			});
      			}else{
      				this.currentPage=1;
      				this.dialogAmtVisible = true;
      			}
      		}
    	},
    	created:function(){
    		let component = this;
    		document.onkeyup = function(e){
    			let key = window.event.keyCode;
    			if(component.currentPage===0){
    				if(key===37){
	    				component.keyup_left();
	    			}
	    			else if(key===38){
	    				component.keyup_top();
	    			}
	    			else if(key===39){
	    				component.keyup_right();
	    			}
	    			else if(key===40){
	    				component.keyup_down();
	    			}
	    			else if(key===46){
	    				component.keyup_delete();
	    			}
	    			else if(key===45){
	    				component.keyup_insert();
	    			}
	    			else if(key===107){
	    				component.keyup_add();
	    			}
	    			else if(key===109||key===189){
	    				component.keyup_subtract();
	    			}
	    			else if(key===111){
	    				component.keyup_divide();
	    			}
	    			else if(key===113){
	    				component.keyup_f2();
	    			}
	    			else if(key===119){
	    				component.keyup_f8();
	    			}
	    			else if(key===120||key===34){
	    				component.keyup_f9();
	    			}
	    		}
    		}
    	},
    	watch: {
		    // 如果 `barcode` 发生改变，这个函数就会运行
		    barcode: function (newval, oldval) {
		    	let str = newval.charAt(newval.length-1);
		    	if(str==="-"){
		    		this.keyup_subtract();
		    	}else if(str==="+"){
		    		this.keyup_add();
		    	}else if(str==="/"){
		    		this.keyup_divide();
		    	}
		    },
		    currentPage:function(newval,oldval){
		    	if (newval===0) {
		    		this.$refs.inputBarcode.$refs.input.focus();
		        	this.$refs.inputBarcode.$refs.input.select();
		    	}
		    }
		 },
	}
</script>


<style>
	*{
		-moz-box-sizing: border-box;  /*Firefox3.5+*/
	  	-webkit-box-sizing: border-box; /*Safari3.2+*/
	  	-o-box-sizing: border-box; /*Opera9.6*/
	  	-ms-box-sizing: border-box; /*IE8*/
	  	box-sizing: border-box;
	}
  .el-header {
    background-color: #409EFF;
    color: #333;
    text-align: left;
  }
  .header-left{
  		width: 20%;
  		font-size: larger;
		float: left;
		 line-height: 60px;
  }
  .header-right{
  		width: 20%;
		float: left;
		 line-height: 30px;
  }
  .footer-left{
  		width: 12%;
  		height: 60px;
  		font-size: larger;
		float: left;
		line-height: 60px;
  }
  .footer-right{
		float: left;
		height: 60px;
		 line-height: 60px;
  }
    .el-aside {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    line-height: 40px;
    padding: 10px;
  }
  .shortcutmenu{
  	background-color:#FFFFFF;
  	padding: 10px;
  }
    .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    padding: 0px;
  }
  .el-table{
  	margin-top: 10px;
  	margin-left: 10px;
  }
  .el-table td{
  	padding: 0px;
  }
  .el-table .cell{
  	padding: 0px;
  }
  .el-table th>.cell{
  	padding-left: 10px;
  }
  .td{
  	padding: 10px;
  }
  .details{
  	height:100%;
  	width: 48%;
  	background-color:#FFFFFF;
  	float:left;
  	margin-top: 10px;
  	margin-left: 10px;
  	padding: 10px;
  }
  .barcodeinput{
  	height: 70px;
  	width: 98%;
  	background-color:#FFFFFF;
  	float:left;
  	margin-top: 10px;
  	margin-left: 10px;
  	padding-left: 10px;
  }
  .total{
  	height:100%;
  	width: 37%;
  	background-color:#FFFFFF;
  	float:left;
  	margin-top: 10px;
  	margin-left: 10px;
  	padding: 10px;
  }
   .boy>.el-container {
    margin-bottom: 40px;
  }
</style>