"use strict";(self["webpackChunkvue_event"]=self["webpackChunkvue_event"]||[]).push([[924],{924:function(e,r,s){s.r(r),s.d(r,{default:function(){return g}});s(7658);var t=function(){var e=this,r=e._self._c;return r("div",{staticClass:"login-container"},[r("div",{staticClass:"login-box"},[r("div",{staticClass:"title-box"}),r("el-form",{ref:"loginRef",attrs:{model:e.loginForm,rules:e.loginRules}},[r("el-form-item",{attrs:{prop:"username"}},[r("el-input",{attrs:{placeholder:"请输入用户名"},model:{value:e.loginForm.username,callback:function(r){e.$set(e.loginForm,"username",r)},expression:"loginForm.username"}})],1),r("el-form-item",{attrs:{prop:"password"}},[r("el-input",{attrs:{type:"password",placeholder:"请输入密码"},model:{value:e.loginForm.password,callback:function(r){e.$set(e.loginForm,"password",r)},expression:"loginForm.password"}})],1),r("el-form-item",[r("el-button",{staticClass:"btn-login",attrs:{type:"primary"},on:{click:e.loginFn}},[e._v("登录")]),r("el-link",{attrs:{type:"info"},on:{click:function(r){return e.$router.push("/reg")}}},[e._v("去注册")])],1)],1)],1)])},n=[],o=s(7877),a=s(6294),i={name:"my-login",data(){return{loginForm:{username:"",password:""},loginRules:{username:[{required:!0,message:"请输入用户名",trigger:"blur"},{pattern:/^[a-zA-Z0-9]{1,10}$/,message:"用户名必须是1-10的字母数字",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{pattern:/^\S{6,15}$/,message:"密码必须是6-15的非空字符",trigger:"blur"}]}}},methods:{...(0,a.mapMutations)(["updateToken"]),loginFn(){this.$refs.loginRef.validate((async e=>{if(!e)return!1;{const{data:e}=await(0,o.UO)(this.loginForm);if(0!==e.code)return this.$message.error(e.message);this.$message.success(e.message),this.updateToken(e.token),this.$router.push("/")}}))}}},l=i,u=s(1001),m=(0,u.Z)(l,t,n,!1,null,"1cd567e1",null),g=m.exports}}]);
//# sourceMappingURL=924.d37df27e.js.map