<template>
  <div class="create-svg-container">
    <div class="create-svg-editor">
      <div class="panel__head">
        <div class="brand__mark">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 3v18M3 12h18"/>
          </svg>
        </div>
        <div>
          <div class="brand__name">图标配置</div>
          <div class="brand__sub">Icon Studio</div>
        </div>
      </div>
      <div class="panel__body"> 
        <a-form :model="formState" :colon="false" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <a-form-item label="生成方式">
            <a-radio-group v-model:value="formState.createType" button-style="solid">
              <a-radio-button value="1">单个</a-radio-button>
              <a-radio-button value="2">批量</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <template v-if="formState.createType === '1'">
            <a-form-item label="图标类型">
              <a-radio-group v-model:value="formState.type">
                <a-radio value="1">文字</a-radio>
                <a-radio value="2">图标</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="formState.type === '2'" label="图标">
              <a-select
                ref="select"
                v-model:value="formState.icon"
                :options="typeArrs"
              />
            </a-form-item>
            <a-form-item v-else label="上文本">
              <a-input v-model:value="formState.upText" placeholder="图标上方文本" />
            </a-form-item>
            <a-form-item label="下文本">
              <a-input v-model:value="formState.downText" @change="downTextChange" placeholder="图标下方文本" />
            </a-form-item>
            <a-form-item label="文件名称">
              <a-input v-model:value="formState.fileName" placeholder="文件名称" />
            </a-form-item>
          </template>
          <a-form-item label="背景颜色">
            <a-color-picker v-model:value="formState.bgColor" value-format="hex" disabled-alpha show-text />
          </a-form-item>
          <a-form-item label="导出目录">
            <a-space-compact compact>
              <a-input v-model:value="formState.downUrl" disabled style="width: calc(100% - 64px)" placeholder="选择导出目录" />
              <a-button type="primary" @click="chooseDirectory">选择</a-button>
            </a-space-compact>
          </a-form-item>
          <template v-if="formState.createType === '2'">
            <a-form-item label="导入文件">
              <a-button @click="chooseFile">
                <upload-outlined></upload-outlined>
                选择文件
              </a-button>
            </a-form-item>
            <a-form-item label=" "><a-button type="link" @click="handleDown">模版下载</a-button></a-form-item>
          </template>   
        </a-form>
      </div>
      <div class="panel__foot" v-if="formState.createType === '1'">
        <button class="btn" @click="handleCreate">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          生成图标
        </button>
      </div>
    </div>
    <div class="create-svg-preview">
      <div class="is-head">
        <span class="preview-head">图标预览</span>
        <a-button type="primary" @click="handleBatchDown">
          <template #icon>
            <DownloadOutlined />
          </template>
          下载
        </a-button>
      </div>
      <div class="show-svg-list">
        <a-spin :spinning="spinning" description="生成中...">
          <ShowSvg v-if="svgList.length > 0" :svgList="svgList" :filePath="formState.downUrl" />
          <a-empty style="margin-top: 160px;" v-else description="暂无数据" />
        </a-spin>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { reactive, onMounted, ref, toRaw } from 'vue'
  import { DownloadOutlined } from '@antdv-next/icons';
  import ShowSvg from './components/showSvg.vue'
  import { message } from 'antdv-next';
  import { typeArrs } from './utils.js'
  import { generateIcon } from '@/utils/index.js'

  const formState = reactive({
    createType: '1',
    type: '1',
    icon: '',
    upText: '',
    downText: '',
    fileName: '',
    bgColor: '#00d000',
    downUrl: ''
  })
  const spinning = ref(false)
  const svgList = ref([])

  onMounted(async () => {
    let url = await window.electronApi.GetDesktopPath()
    url && (formState.downUrl = url)
    // for (let i = 0; i < 200; i++) {
    //   let svg = await generateIcon(`item${i}`, `it${i}`)
    //   svgList.value.push({
    //     name: i,
    //     svg
    //   })
    // }
  })

  async function chooseDirectory () {
    let { canceled, filePaths } = await window.electronApi.ChooseDirectory({ defaultName: formState.downUrl })
    if (!canceled && filePaths.length > 0) {
      formState.downUrl = filePaths[0]
    }
  }

  function downTextChange (e) { 
    formState.fileName = e.target.value
  }

  async function handleCreate () {
    if (!formState.downUrl) {
      message.warning('请选择导出目录！');
      return
    }
    if (formState.createType = '1') {// 生成单个图标
      if (formState.type === '1') {// 文字图标
        spinning.value = true
        let svg = generateIcon(formState.upText,formState.downText, { bgColor: formState.bgColor })
        svgList.value = [
          {
            id: '1',
            name: formState.fileName,
            svg
          }
        ]
        spinning.value = false
      } else {// 图片图标
        spinning.value = true
        let currentIcon = typeArrs.find(it => it.value === formState.icon)
        let svg = generateIcon(currentIcon.icon,formState.downText, { bgColor: formState.bgColor })
        svgList.value = [
          {
            id: '1',
            name: formState.fileName,
            svg
          }
        ]
        spinning.value = false
      }
    } else {// 生成多个图标
      // window.electronApi.BatchCreateSvg({
      //   filePath: formState.downUrl,
      //   svgList: formState.svgList
      // }).then(res => {
      //   message.success('导出成功！');
      // })
    }
    
  }

  function chooseFile() {
    spinning.value = true
    window.electronApi.parseExcelFile().then(res => {
      if (res.length === 0) return
      svgList.value = res.map((item,index) => {
        if (['文字','图标'].includes(item.type)) {
          let svg = null
          if (item.type === '图标') {
            let currentIcon = typeArrs.find(it => it.label === item.typeName)
            if (!currentIcon) return false
            svg = generateIcon(currentIcon.icon, item.downText, { bgColor: formState.bgColor })
          } else if (item.type === '文字') {
            svg = generateIcon(item.upText, item.downText, { bgColor: formState.bgColor })
          }
          if (!svg) return false
          return {
            id: `${item.fileName || item.downText}-${index}`,
            name: item.fileName || item.downText,
            svg: svg
          }
        }
        return false
      }).filter(Boolean)
    }).catch(err => {
      message.error('解析失败！');
    }).finally(() => {
      spinning.value = false
    })
  }

  async function handleDown(item) {
    try {
      const savedPath = await window.electronApi.downloadPublicFile({
        relativePath: 'templates/文件生成模版.xlsx',  // 相对 public 的路径
        defaultName: '文件生成模版.xlsx', 
      });
      if (savedPath) {
        message.success('下载成功');
      }
    } catch (err) {
      console.error(err);
      message.warn('下载失败');
    }
  }

  function handleBatchDown(item) {
    if (svgList.value.length === 0) {
      message.warn('请选择图标！');
      return
    }
    spinning.value = true
    let fileList = svgList.value.map(item => {
      return {
        name: item.name  + '.svg',
        svg: item.svg
      }
    })
    window.electronApi.BatchCreateSvg({
      filePath: toRaw(formState.downUrl),
      filesList: toRaw(fileList)
    }).then(res => {
      message.success('导出成功！');
      window.electronApi.openFolder(toRaw(formState.downUrl))
    }).finally(() => {
      spinning.value = false
    })
  }
</script>

<style scoped lang="scss">
  // 主色
  $primary:          #1677ff;
  $primary-hover:    #4096ff;
  $primary-active:   #0958d9;
  $primary-bg:       #e6f4ff;
  $primary-border:   #91caff;

  // 中性色
  $text:             rgba(0, 0, 0, .88);
  $text-secondary:   rgba(0, 0, 0, .65);
  $text-tertiary:    rgba(0, 0, 0, .45);
  $text-quaternary:  rgba(0, 0, 0, .25);

  // 边框 & 分割线
  $border:           #d9d9d9;
  $border-secondary: #f0f0f0;

  // 背景
  $bg-layout:        #f5f5f5;
  $bg-container:     #ffffff;
  $bg-fill:          rgba(0, 0, 0, .04);
  $bg-fill-hover:    rgba(0, 0, 0, .06);

  // 圆角 & 阴影
  $radius-sm:        6px;
  $radius:           8px;
  $radius-lg:        12px;
  $shadow-sm:        0 1px 2px 0 rgba(0, 0, 0, .03), 0 1px 6px -1px rgba(0, 0, 0, .02), 0 2px 4px 0 rgba(0, 0, 0, .02);
  $shadow:           0 6px 16px 0 rgba(0, 0, 0, .08), 0 3px 6px -4px rgba(0, 0, 0, .12), 0 9px 28px 8px rgba(0, 0, 0, .05);
  $control-h:        32px;

  .create-svg-container {
    width: 100%;
    height: 100%;
    display: flex;
    .create-svg-editor {
      width: 320px;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      min-height: 0;                          /* 让内部滚动生效 */
      background: $bg-container;
      border-right: 1px solid $border-secondary;
      z-index: 2;

      .panel__head {
        flex: none;
        display: flex;
        align-items: center;
        gap: 10px;
        height: 56px;
        padding: 0 16px;
        border-bottom: 1px solid $border-secondary;
        .brand__mark {
          width: 32px; height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: $radius;
          background: linear-gradient(135deg, #4096ff 0%, #1677ff 100%);
          color: #fff;
          box-shadow: 0 2px 6px rgba(22, 119, 255, .35);
          flex: none;
        }
        .brand__mark svg { width: 17px; height: 17px; }
        .brand__name {
          font-size: 15px;
          font-weight: 600;
          color: $text;
          line-height: 1.3;
        }
        .brand__sub {
          font-size: 11px;
          color: $text-tertiary;
          letter-spacing: .08em;
          text-transform: uppercase;
          line-height: 1.3;
        }
      }
      .panel__body {
        flex: 1;
        padding-top: 16px;
      }
      .panel__foot {
        flex: none;
        padding: 12px 16px;
        background: $bg-container;
        border-top: 1px solid $border-secondary;
      }
      .btn {
        width: 100%;
        height: 40px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 14px;
        font-family: inherit;
        font-weight: 400;
        color: #fff;
        background: $primary;
        border: 1px solid $primary;
        border-radius: $radius-sm;
        cursor: pointer;
        transition: all .2s;
        box-shadow: 0 2px 0 rgba(5, 145, 255, .1);
      }
      .btn:hover {
        background: $primary-hover;
        border-color: $primary-hover;
      }
      .btn:active {
        background: $primary-active;
        border-color: $primary-active;
      }
      .btn svg { width: 15px; height: 15px; }
    }
    .create-svg-preview {
      flex: 1;
      display: flex;
      flex-direction: column;
      .is-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 12px;
        background: $bg-container;
        .preview-head {
          font-weight: 500;
        }
      }
      .show-svg-list {
        flex: 1;
        min-height: 0;                          /* 关键 */
        overflow: auto;                         /* 右侧独立滚动 */
        padding: 10px;
        background: $bg-layout;
      }
    }
  }
</style>