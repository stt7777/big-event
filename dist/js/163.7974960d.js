"use strict";(self["webpackChunkvue_event"]=self["webpackChunkvue_event"]||[]).push([[163],{5163:function(e,r,s){s.r(r),s.d(r,{default:function(){return m}});s(7658);var t=function(){var e=this,r=e._self._c;return r("div",{staticClass:"reg-container"},[r("div",{staticClass:"reg-box"},[r("div",{staticClass:"title-box"}),r("el-form",{ref:"form",attrs:{model:e.form,rules:e.rulesObj}},[r("el-form-item",{attrs:{prop:"username"}},[r("el-input",{attrs:{placeholder:"用户名"},model:{value:e.form.username,callback:function(r){e.$set(e.form,"username",r)},expression:"form.username"}})],1),r("el-form-item",{attrs:{prop:"password"}},[r("el-input",{attrs:{type:"password",placeholder:"密码"},model:{value:e.form.password,callback:function(r){e.$set(e.form,"password",r)},expression:"form.password"}})],1),r("el-form-item",{attrs:{prop:"repassword"}},[r("el-input",{attrs:{type:"password",placeholder:"请再次确认密码"},model:{value:e.form.repassword,callback:function(r){e.$set(e.form,"repassword",r)},expression:"form.repassword"}})],1),r("el-form-item",[r("el-button",{staticClass:"btn-reg",attrs:{type:"primary"},on:{click:e.registerFn}},[e._v("注册")]),r("el-link",{attrs:{type:"info"},on:{click:function(r){return e.$router.push("/login")}}},[e._v("去登陆")])],1)],1)],1)])},a=[],o=s(7877),l={name:"my-register",data(){const e=(e,r,s)=>{r!==this.form.password?s(new Error("两次输入的密码不一致!")):s()};return{form:{username:"",password:"",repassword:""},rulesObj:{username:[{required:!0,message:"请输入用户名",trigger:"blur"},{pattern:/^[a-zA-Z0-9]{1,10}$/,message:"用户名必须是1-10的大小写字母数字",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"},{pattern:/^\S{6,15}$/,message:"密码必须是6-15的非空字符",trigger:"blur"}],repassword:[{required:!0,message:"请再次输入密码",trigger:"blur"},{validator:e,trigger:"blur"}]}}},methods:{registerFn(){this.$refs.form.validate((async e=>{if(!e)return!1;{console.log(this.form);const{data:e}=await(0,o.QV)(this.form);if(console.log(e),0!==e.code)return this.$message.error(e.message);this.$message.success(e.message),this.$router.push("/login")}}))}}},i=l,n=s(1001),u=(0,n.Z)(i,t,a,!1,null,"79dddb54",null),m=u.exports}}]);
//# sourceMappingURL=163.7974960d.js.map