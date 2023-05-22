<template>
  <div>
    <el-card class="box-card">
          <div slot="header" class="clearfix header-box">
            <span>文章分类</span>
            <el-button type="primary" size="mini" @click="addCateShowDialogFn">添加分类</el-button>
          </div>
          <el-table :data = "cateList" style="width: 100%" border stripe>
            <!-- type是table的内置属性，使用index意思是第一个单元格使用索引值 -->
            <el-table-column type="index" label="序号" width="100"></el-table-column>
            <el-table-column prop="cate_name" label="分类名称"></el-table-column>
            <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
                <el-button type="danger" size="mini" @click="delCateFn(scope.row)">删除</el-button>
              </template>

            </el-table-column>
          </el-table>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      @close="dialogCloseFn">
      <!-- 添加的表单 -->
        <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, saveArtCateAPI, updateArtCateAPI, delArtCateAPI } from '@/api/index.js'

export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [], // 用来保存渲染回来的数据
      dialogVisible: false,
      isEdit: false, // false表示新增状态，true表示修改状态
      editID: '', // 保存正在编辑的数据的id值
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: { // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      }
    }
  },

  created () {
    this.getArtCateListFn()
  },
  methods: {
    async getArtCateListFn () {
      const res = await getArtCateListAPI()
      // if (res.code !== 0) return this.$message.error('获取文章列表失败')
      // this.$message.success(res.message)
      // console.log(res)
      this.cateList = res.data.data
    },
    addCateShowDialogFn () {
      this.isEdit = false
      this.editID = ''
      this.dialogVisible = true
    },
    confirmFn () {
      this.$refs.addRef.validate(async valid => {
        if (valid) {
          if (this.isEdit) {
            this.addForm.id = this.editID
            const { data: res } = await updateArtCateAPI(this.addForm)
            // 也可以不加属性，然后updateArtCateAPI（id：this.editID,...this.addForm)
            // console.log(res)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          } else {
            const { data: res } = await saveArtCateAPI(this.addForm)
            if (res.code !== 0) return this.$message.error(res.message)
            this.$message.success(res.message)
          }

          // 在重新请求一次文章列表，拿到最新数据，更新文章列表
          this.getArtCateListFn()
          this.dialogVisible = false
        } else {
          return false
        }
      })
    },
    cancelFn () {
      this.dialogVisible = false
    },
    dialogCloseFn () {
      this.$refs.addRef.resetFields()
    },
    updateCateBtnFn (obj) {
      this.isEdit = true
      this.editID = obj.id
      this.dialogVisible = true
      this.$nextTick(() => {
        this.addForm.cate_name = obj.cate_name
        this.addForm.cate_alias = obj.cate_alias
      })
    },
    async delCateFn (obj) {
      const { data: res } = await delArtCateAPI(obj.id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getArtCateListFn()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
