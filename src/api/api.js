import axios from 'axios';
import { Cookie } from '../js/common' ;

export const getjson = params => {return axios.get('/static/json/' + params +'.json').then(res=>res.data) ; }
export const getmd = params => {return axios.get('/static/md/' + params +'.md').then(res=>res.data) ; }

export const getreport = params => { return axios.post('/api/RPT/getReport/0', params).then(res => res.data).catch(res => res);};
export const getfilter = params => { return axios.post('/api/RPT/getFilter/0', params).then(res => res.data).catch(res => res); };
export const query = params => { return axios.post('/api/rpt/query/a', params).then(res => res.data).catch(res => res); };
export const login = params => { return axios.post('/api/AUTH/Login/0',params).then(res => res.data).catch(res => res ); };
export const getObjects = params => { return axios.post('/api/erp/getobjects/0',params).then(res => res.data).catch(res=>res);};

//增加
export const entity_add = params => {return axios.post('/api/erp/add/0',params).then(res => res.data).catch(res =>res);};
//导入
export const entity_import = params => {return axios.post('/api/erp/import/0',params).then(res => res.data).catch(res =>res);};
//修改
export const entity_update = params=>{return axios.post('/api/erp/update/0',params).then(res =>res.data).catch(res =>res);};
//删除
export const entity_delete = params =>{return axios.post('/api/erp/delete/0',params).then(res =>res.data).catch(res =>res);};

export const dd_getconfig = params => {
	return axios.get('/api/DD/GetConfig/'+ params).then(res => res.data).catch(res => res);
};
export const dd_getuserinfo = params => {
	return axios.get('/api/DD/GetUserInfo/' + params).then(res => res.data).catch(res => res);
};

export const apiparas = {
	pushPara: function(paras, pname, pvalue) {
		let p = {
			'name': pname,
			'value': pvalue
		};
		paras.push(p);
	},
	
	getParas_rtype: function(rptname,resulttype, rptparas) {
		let token = Cookie.Get('token');
		let p = {
			cmd: rptname,
			paras: rptparas,
			rtype: resulttype,
			token: token
		};
		return p;
	},
	getParas: function(rptname, rptparas) {
		let token = Cookie.Get('token');
		let p = {
			cmd: rptname,
			paras: rptparas,
			token: '1a2eb0eb1516d5d7e1504e53d3ef3e50'
		};
		return p;
	},
	getParas_Objects:function(obj,where,select)
	{
		let token = Cookie.Get('token');
		let p ={
			TypeName : obj,
			Where	:  where,
			Select	:	select,
			token: token
		};
		return p;
	},
	getParas_del:function(obj,keyName,keyValue)
	{
		let token = Cookie.Get('token');
		let p={
			TypeName: obj,
				JsonObj: {
					keyName: keyValue
				},
			token: Cookie.Get("token") 
		};
		return p;	
	},
	getParas_add:function(obj,jsonobj)
	{
		let token = Cookie.Get('token');
		let p={
			TypeName: obj,
			JsonObj:jsonobj,
			token: Cookie.Get("token") 
		};
		return p;
	}
};


