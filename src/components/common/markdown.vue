<template>
  <div  id = 'markdown-content' class="markdown" style="width: 100%;height: 500px;" ></div>

</template>

<script>	
	import { getmd} from '../../api/api';
	import { markdownFromText} from '../../js/strapdown.js';
export default {
		props: ['filename'],
    data () {
      return {   
				selected: '',
				rtitle: '',
				pageid : '',
				entity_name: '',
				year_month: ''
      }
    },
    watch : {
    	filename : function(val){
	    	getmd(val).then(res=>{
	    		markdownFromText(res,'markdown-content' );
	
	    	});
    		
    	}
    },
    mounted(){
    	getmd(this.filename).then(res=>{
    		markdownFromText(res,'markdown-content' );

    	});
    },
    created:function(){
    	
    }
    
}

</script>
<style>
	
#markdown-content h1,h2,h3,h4,h5,h6,p,blockquote {
    margin: 0;
    padding: 0;
}
#markdown-content body {
    font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;
    font-size: 13px;
    line-height: 18px;
    color: #737373;
    background-color: white;
    margin: 10px 13px 10px 13px;
}
 #markdown-content table {
    margin: 10px 0 15px 0;
    border-collapse: collapse;
}
#markdown-content td,th { 
    border: 1px solid #ddd;
    padding: 3px 10px;
}
#markdown-content th {
    padding: 5px 10px;  
}

#markdown-content a {
    color: #0069d6;
}
#markdown-content a:hover {
    color: #0050a3;
    text-decoration: none;
}
#markdown-content a img {
    border: none;
}
#markdown-content p {
    margin-bottom: 9px;
}
#markdown-content strong {
    color: #003366; 
    /*#404040;*/
}
#markdown-content  h1,h2,h3,h4,h5,h6 {
    color: #003399;
    line-height: 36px;
}
#markdown-content h1 {
    margin-bottom: 18px;
    font-size: 48px;
}
#markdown-content h2 {
    font-size: 24px;
}
#markdown-content h3 {
    font-size: 18px;
}
#markdown-content h4 {
    font-size: 16px;
}
#markdown-content h5 {
    font-size: 14px;
}
#markdown-content h6 {
    font-size: 13px;
}
#markdown-content hr {
    margin: 0 0 19px;
    border: 0;
    border-bottom: 1px solid #ccc;
}
#markdown-content  blockquote {
    padding: 13px 13px 21px 15px;
    margin-bottom: 18px;
    font-family:georgia,serif;
    font-style: italic;
}
#markdown-content blockquote:before {
    content:"\201C";
    font-size:40px;
    margin-left:-10px;
    font-family:georgia,serif;
    color:#eee;
}
#markdown-content blockquote p {
    font-size: 14px;
    font-weight: 300;
    line-height: 18px;
    margin-bottom: 0;
    font-style: italic;
}
#markdown-content code, pre {
    font-family: Monaco, Andale Mono, Courier New, monospace;
}
#markdown-content code {
    background-color: #fee9cc;
    color: rgba(0, 0, 0, 0.75);
    padding: 1px 3px;
    font-size: 12px;
    -webkit-border-radius: 3px;
    -moz-border-radius: 3px;
    border-radius: 3px;
}
#markdown-content pre {
    display: block;
    padding: 14px;
    margin: 0 0 18px;
    line-height: 16px;
    font-size: 11px;
    border: 1px solid #d9d9d9;
    white-space: pre-wrap;
    word-wrap: break-word;
}
#markdown-content pre code {
    background-color: #fff;
    color:#737373;
    font-size: 11px;
    padding: 0;
}
#markdown-content sup {
    font-size: 0.83em;
    vertical-align: super;
    line-height: 0;
}
#markdown-content * {
    -webkit-print-color-adjust: exact;
}
#markdown-content @media screen and (min-width: 914px) {
    body {
        width: 854px;
        margin:10px auto;
    }
}
#markdown-content @media print {
    body,code,pre code,h1,h2,h3,h4,h5,h6 {
        color: black;
    }
    table, pre {
        page-break-inside: avoid;
    }
}

</style>