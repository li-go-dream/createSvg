/**
 * 生成上下结构的 SVG 图标
 * @param {string|{icon: string}} param1 - 梯形中的内容：文本 或 { icon: '<path .../>' }
 * @param {string|{icon: string}} param2 - 矩形中的内容：文本 或 { icon: '<path .../>' }
 * @param {object} options - 可选配置
 * @returns {string} SVG 字符串
 */
export function generateIcon(param1, param2, options = {}) {
  const {
    bgColor = '#00d000',
    textColor = '#ffffff',
    iconColor = '#ffffff',
    shadow = true
  } = options;

  // 根据参数类型生成内容
  function renderContent(param, shapeType) {
    const centerX = 15;
    let textSize = 8
    const centerY = shapeType === 'trapezoid' ? 7.25 : 22.75;
    
    // 文本：背景透明
    if (typeof param === 'string') {
      if (param.length > 5) {
        textSize = textSize - (param.length - 5)
      }

      return {
        background: bgColor,
        content: `<text x="${centerX}" y="${centerY}" text-anchor="middle" dominant-baseline="central" fill="${textColor}" font-size="${textSize}" font-weight="600" font-family="Inter, Arial, sans-serif">${param}</text>`,
        filter: 'none'
      };
    }

    // 图标：背景填充，白色图标
    if (param && param.icon) {
      let {
        x = 9,
        y = 1.25,
        width = 12,
        height = 12,
      } = param;
      return {
        background: bgColor,
        // content: `<svg x="${x}" y="${y}" width="${iconSize}" height="${iconSize}"
        //   viewBox="0 0 24 24" fill="${iconColor}">${param.icon}</svg>`,
        content:`<svg x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg">
          ${param.icon}
        </svg>`,
        filter: shadow ? 'url(#iconShadow)' : 'none'
      };
    }

    // 空参数：仅显示形状
    return {
      background: bgColor,
      content: '',
      filter: shadow ? 'url(#iconShadow)' : 'none'
    };
  }

  const trapezoid = renderContent(param1, 'trapezoid');
  const rect = renderContent(param2, 'rect');


  // return `<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
  // <path d="M 1 14.5 L 29 14.5 Q 30 14.5 29.5 12.5 L 26.5 2 Q 26 0 24 0 L 6 0 Q 4 0 3.5 2 L 0.5 12.5 Q 0 14.5 1 14.5 Z" fill="${trapezoid.background}" filter="${trapezoid.filter}"/>
  //   ${trapezoid.content}
    
  //   <rect x="0" y="15.5" width="30" height="14.5" rx="2" ry="2" fill="#00d000" filter="url(#iconShadow)"/>
  //   ${rect.content}
  // </svg>`.trim();
  return `<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- 外描边：上白下深绿 -->
    <linearGradient id="edgeOuter" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#b0eeb0" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#007a00" stop-opacity="0.8"/>
    </linearGradient>

    <!-- 内高光：顶部白，底部无 -->
    <linearGradient id="edgeInner" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#005a00" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- 梯形：外层渐变描边 -->
  <path d="M 1 14.5 L 29 14.5 Q 30 14.5 29.5 12.5 L 26.5 2 Q 26 0 24 0 L 6 0 Q 4 0 3.5 2 L 0.5 12.5 Q 0 14.5 1 14.5 Z"
        fill="#00d000"
        stroke="url(#edgeOuter)"
        stroke-width="1"/>
  <!-- 梯形：内层高光 -->
  <path d="M 2 13.5 L 28 13.5 Q 28.8 13.5 28.3 12 L 25.6 2.6 Q 25.2 1.2 23.6 1.2 L 6.4 1.2 Q 4.8 1.2 4.4 2.6 L 1.7 12 Q 1.2 13.5 2 13.5 Z"
        fill="none"
        stroke="url(#edgeInner)"
        stroke-width="0.7"/>
    ${trapezoid.content}
    
     <!-- 矩形：外层渐变描边 -->
  <rect x="0" y="15.5" width="30" height="14.5" rx="2" ry="2"
        fill="#00d000"
        stroke="url(#edgeOuter)"
        stroke-width="1"/>
  <!-- 矩形：内层高光 -->
  <rect x="0.9" y="16.4" width="28.2" height="12.7" rx="1.3" ry="1.3"
        fill="none"
        stroke="url(#edgeInner)"
        stroke-width="0.7"/>
    ${rect.content}
  </svg>`.trim();

}