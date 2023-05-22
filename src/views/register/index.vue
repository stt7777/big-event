<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form ref="form" :model="form" :rules="rulesObj" >

          <el-form-item prop="username">
            <el-input v-model="form.username"  placeholder="用户名"></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input type = "password" v-model="form.password"  placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item prop="repassword">
            <el-input type = "password" v-model="form.repassword"  placeholder="请再次确认密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button class="btn-reg " type="primary" @click="registerFn">注册</el-button>
            <el-link type="info" @click="$router.push('/login')">去登陆</el-link>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api/index.js'
export default {

  name: 'my-register',
  data () {
    const samePwdFn = (rule, value, callback) => {
      if (value !== this.form.password) {
        // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
        callback(new Error('两次输入的密码不一致!'))
      } else {
        // 如果验证成功，则直接调用 callback 回调函数即可。
        callback()
      }
    }
    return {
      // 表单的数据对象
      form: {
        username: '',
        password: '',
        repassword: ''
      },
      // 表单的规则校验对象
      rulesObj: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,10}$/,
            message: '用户名必须是1-10的大小写字母数字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            pattern: /^\S{6,15}$/,
            message: '密码必须是6-15的非空字符',
            trigger: 'blur'
          }
        ],
        repassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: samePwdFn, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    registerFn () {
      // console.log('注册的点击事件')
      // JS兜底校验
      this.$refs.form.validate(async valid => {
        if (valid) {
          // 通过校验
          console.log(this.form)
          const { data: res } = await registerAPI(this.form)
          console.log(res)
          // $message是elementUI在Vue的原型链上添加的弹窗提示，$message属性
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          this.$router.push('/login')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>
