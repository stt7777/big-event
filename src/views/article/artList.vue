<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option v-for = "obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px;">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="chooseFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn">发表文章</el-button>
      </div>
      <!-- 文章表格区域 -->
      <el-table :data="artList" style="width: 100%;" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="removeFn(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <el-dialog title="发表文章"
    :visible.sync="pubDialogVisible"
    fullscreen
    :before-close="handleClose"
    @close = "dialogCloseFn">
      <!-- 发布文章的对话框 -->
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%;">
            <el-option v-for = "obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <!-- 用来显示封面的图片 -->
          <img src="../../assets/images/cover.jpg" alt="" class="cover-img" ref="imgRef" />
          <br />
          <!-- 文件选择框，默认被隐藏 -->
          <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="changeCoverFn" />
          <!-- 选择封面的按钮 -->
          <el-button type="text" @click="selCoverFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
            <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 文章详情区 -->
    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>

      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ $formatDate(artDetail.pub_date) }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img v-if="artDetail.cover_img" :src="baseURLR+artDetail.cover_img" alt="" />

      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI, getArtListAPI, getArtDetailAPI, delArticleAPI } from '@/api'
import imgObj from '../../assets/images/cover.jpg'
import { baseURL } from '@/utils/request.js'
export default {
  name: 'ArtList',
  data () {
    return {
      baseURLR: baseURL,
      state: '', // 值只能为已发布或者草稿
      cateList: [], // 用来接收返回的文章分类列表
      artList: [], // 用来接收返回的文章列表
      total: 0, // 保存现有文章的总数
      // 查询参数对象
      q: {
        pagenum: 1, // 请求的页数
        pagesize: 2, // 每页的文章数量
        cate_id: '',
        state: ''
      },
      artDetail: {}, // 用来保存文章详情
      pubDialogVisible: false, // 控制发布文章对话框的出现/隐藏
      detailVisible: false, // 用来控制文章详情的内容显示
      pubForm: { // 发布文章-表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 保存文章内容
        cover_img: null // 用户选择的封面图片（null 表示没有选择任何封面）
      },
      pubFormRules: { // 发布文章-表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章标题', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
        cover_img: [{ required: true, message: '请选择文章封面', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getCateListfn()
    this.getArticleListFn()
  },
  methods: {
    // 发布文章的对话框,关闭前的回调
    async handleClose (done) { // done的作用：调用就会关闭对话框
      const confirmResult = await this.$confirm('此操作将导致文章信息丢失, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 取消了关闭-阻止住, 什么都不干
      if (confirmResult === 'cancel') return
      // 确认关闭
      done()
    },
    // 展示发布文章的对话框
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 得到文章分类列表
    async getCateListfn () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
      // console.log(res)
    },
    // 选择封面点击事件，出现文件选择框
    selCoverFn () {
      this.$refs.iptFileRef.click()
    },
    // 前端预览用户选择的头像文件
    changeCoverFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        // 用户没有选择封面
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', imgObj)
      } else {
        // 用户选择了封面
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 新增文章后，对话框关闭后清空表单
    dialogCloseFn () {
      this.$refs.pubFormRef.resetFields()
      // 给封面标签img重新设置一个值，因为没有受到v-model的影响
      this.$refs.imgRef.setAttribute('src', imgObj)
    },
    // 表单里点击按钮事件，点击发布或存为草稿，准备调用后端接口
    pubArticleFn (str) {
      // str的值为已发布或草稿
      this.pubForm.state = str
      // console.log(this.pubForm)
      // 兜底校验
      this.$refs.pubFormRef.validate(async valid => {
        if (valid) {
          // 校验通过
          const fd = new FormData()
          fd.append('title', this.pubForm.title)
          fd.append('cate_id', this.pubForm.cate_id)
          fd.append('content', this.pubForm.content)
          fd.append('cover_img', this.pubForm.cover_img)
          fd.append('state', this.pubForm.state)
          const { data: res } = await uploadArticleAPI(fd)
          if (res.code !== 0) return this.$message.error('发布文章失败')
          this.$message.success('发布文章成功')
          // 关闭对话框
          this.pubDialogVisible = false
          this.getArticleListFn()
        } else {
          return false
        }
      })
    },
    // 富文本编辑器内容改变触发此事件方法
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // 获取文章列表
    async getArticleListFn () {
      const { data: res } = await getArtListAPI(this.q)
      this.artList = res.data
      this.total = res.total
    },
    // 分页->每页条数改变触发,参数：当前每页需要显示的条数
    // 改变q属性的值再次进行改变
    handleSizeChangeFn (sizes) {
      this.q.pagenum = 1
      this.getArticleListFn()
    },
    // 当前页码改变时触发，参数：当前要看的第几页，页数
    handleCurrentChangeFn (nowPage) {
      this.getArticleListFn()
    },
    // 筛选的点击事件
    chooseFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArticleListFn()
    },
    // 重置按钮的点击事件
    resetFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.state = ''
      this.q.cate_id = ''
      this.getArticleListFn()
    },
    // 文章的点击显示详情的点击事件
    async showDetailFn (artId) {
      this.detailVisible = true
      const { data: res } = await getArtDetailAPI(artId)
      this.artDetail = res.data
    },
    // 文章删除
    async removeFn (artID) {
      const { data: res } = await delArticleAPI(artID)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success('删除文章成功')
      // artList中只保存了前端所展示的数据
      if (this.artList.length === 1) {
        if (this.q.pagenum > 1) {
          this.q.pagenum--
        }
      }
      // 分页和删除都要重置
      this.getArticleListFn()
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .ql-editor {
  min-height: 300px;
}
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>
