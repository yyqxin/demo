<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                	<i class="el-icon-setting"></i> 欢迎</el-breadcrumb-item>
            </el-breadcrumb>
				<el-button type="primary" @click="printtest">搜索</el-button>
				<el-button type="primary" @click="printtest1">打印</el-button>
        </div>
        <div id = "printarea" class="ms-doc">
        	
            <h3>
                	<icon name="pencil" x="50" y="50"> </icon> 看板平台</h3>
            <article>
                <h1>欢迎使用报表平台</h1>
                <p></p>
            </article>
        </div>

    </div>
</template>

<script>
	import {getLodop } from "../../js/clodop.js"
    export default {
 
        data: function(){
            return {}
        },
        methods:{
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
        	}
        }
    }
</script>

<style scoped>
    .ms-doc{
        width:100%;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }
    .ms-doc h3{
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }
    .ms-doc article{
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }
    .ms-doc article h1{
        font-size:32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }
    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }
    .ms-doc article p{
        margin-bottom: 15px;
        line-height: 1.5;
    }
    .ms-doc article .el-checkbox{
        margin-bottom: 5px;
    }
</style>