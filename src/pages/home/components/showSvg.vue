<template>
  <div class="svg-list">
    <div v-for="item in svgList" :key="item.id" class="svg-container">
      <div class="svg-con" v-html="item.svg" />
        <!-- <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="iconShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.28"/>
            </filter>
          </defs>
          <path d="M 1 14.5 L 29 14.5 Q 30 14.5 29.5 12.5 L 26.5 2 Q 26 0 24 0 L 6 0 Q 4 0 3.5 2 L 0.5 12.5 Q 0 14.5 1 14.5 Z" fill="#00d000" filter="url(#iconShadow)"/>
          <svg x="9" y="1.25" width="12" height="12" viewBox="0 0 1024 1024"
               xmlns="http://www.w3.org/2000/svg">
            <path d="M412.08 753.87Q297 855.06 220.14 855.13t-117.27-95.07l309.21-6.24z m202.16 0l309.21 6.19Q883 855.13 806.18 855.13T614.24 753.82zM15.91 489.1q178 95 228.49 125.34t171.89 108.88q-193.1 12-252.75 0.32c-45.49-8.89-80.9-28.29-111.22-58.66Q-8.22 604.44 15.91 489.1z m994.5 0Q1034.56 604.41 974 665c-30.31 30.37-65.72 49.77-111.22 58.66q-59.64 11.7-252.7-0.32 121.27-78.55 171.85-108.88t228.48-125.36zM161.48 228.27q93.08 123.36 127.41 175.94t155 283.38Q205.88 580.55 113 475c-44.49-50.54-44.49-133.46 6-204.23q11-15.4 42.47-42.47z m703.31 0q31.51 27.1 42.47 42.47c50.54 70.77 50.54 153.65 6.06 204.26q-92.88 105.6-331 212.62 120.66-230.8 155-283.43t127.47-175.92zM440.6 84.72q46.51 137.52 52.56 194.1T483.07 659Q280.81 367.83 280.81 236.39T440.6 84.72z m145.21 0Q745.55 105 745.55 236.39T543.34 659q-16.17-323.55-10.09-380.16t52.56-194.1z" fill="#FFFFFF"/>
          </svg>
          <rect x="0" y="15.5" width="30" height="14.5" rx="2" ry="2" fill="#00d000" filter="url(#iconShadow)"/>
          <text x="15" y="22.75" text-anchor="middle" dominant-baseline="central" fill="#ffffff" font-size="8" font-weight="600" font-family="Inter, Arial, sans-serif">2500</text>
        </svg> -->
      <div class="btn-con">
        <DownloadOutlined @click="handleDown(item)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { DownloadOutlined } from '@antdv-next/icons';
import { message } from 'antdv-next';

const props = defineProps({
  svgList: {
    type: Array,
    default: () => []
  },
  filePath: {
    type: String,
    default: ''
  }
});

function handleDown(item) {
  window.electronApi.CreateSvg({
    filePath: props.filePath,
    file: {
      name: item.name + '.svg',
      svg: item.svg
    }
  }).then(res => {
    message.success('导出成功！');
    // 打开文件夹
    window.electronApi.openFolder(props.filePath)
  })
}

</script>

<style scoped>
/* ---------- 列表容器 ---------- */
.svg-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 4px;
  background: transparent;
}

/* ---------- 卡片 ---------- */
.svg-container {
  position: relative;
  background: #ffffff;
  border: 1px solid #e3eef9;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  box-shadow:
    0 1px 3px rgba(22, 119, 255, 0.05),
    0 1px 2px rgba(22, 119, 255, 0.03);
  transition:
    transform 0.28s cubic-bezier(0.34, 1.36, 0.64, 1),
    box-shadow 0.28s ease,
    border-color 0.28s ease;
}

.svg-container:hover {
  transform: translateY(-3px);
  border-color: #a9d4ff;
  box-shadow:
    0 10px 22px -8px rgba(22, 119, 255, 0.35),
    0 4px 10px -4px rgba(22, 119, 255, 0.18);
}

/* ---------- 图标展示区 ---------- */
.svg-con {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* ---------- 下载遮罩层 ---------- */
.btn-con {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    180deg,
    rgba(22, 119, 255, 0.02) 0%,
    rgba(22, 119, 255, 0.42) 100%
  );
  backdrop-filter: blur(1.5px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.24s ease, visibility 0.24s ease;
}

.svg-container:hover .btn-con {
  opacity: 1;
  visibility: visible;
}

/* ---------- 下载按钮（圆形，白底蓝图标） ---------- */
.btn-con :deep(.anticon) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  color: #1677ff;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(22, 119, 255, 0.35);
  transform: translateY(6px);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
    background 0.2s ease,
    color 0.2s ease;
}

.svg-container:hover .btn-con :deep(.anticon) {
  transform: translateY(0);
}

/* 点击遮罩 / 按钮时按钮反色 */
.btn-con:hover :deep(.anticon) {
  background: #1677ff;
  color: #ffffff;
}
</style>