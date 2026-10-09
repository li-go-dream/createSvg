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

  let { dark0, dark1, dark2 } =  generateColors(bgColor)
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
      <stop offset="40%" stop-color="${dark0}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="${dark1}" stop-opacity="0.8"/>
    </linearGradient>

    <!-- 内高光：顶部白，底部无 -->
    <linearGradient id="edgeInner" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/>
      <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="${dark2}" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- 梯形：外层渐变描边 -->
  <path d="M 1 14.5 L 29 14.5 Q 30 14.5 29.5 12.5 L 26.5 2 Q 26 0 24 0 L 6 0 Q 4 0 3.5 2 L 0.5 12.5 Q 0 14.5 1 14.5 Z"
        fill="${trapezoid.background}"
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
        fill="${rect.background}"
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


function generateColors(hex) {
  // HEX -> RGB (0-1)
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  // RGB -> HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // 转为百分比
  h *= 360;
  s *= 100;
  l *= 100;

  // 计算三种颜色的 HSL
  const light = {
    h,
    s: s * 0.6457,
    l: l + (100 - l) * 0.6822
  };
  const dark1 = {
    h,
    s,
    l: l * 0.5865
  };
  const dark2 = {
    h,
    s,
    l: l * 0.4327
  };

  // HSL -> HEX
  function hslToHex(h, s, l) {
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  }

  return {
    dark0: hslToHex(light.h, light.s, light.l),
    dark1: hslToHex(dark1.h, dark1.s, dark1.l),
    dark2: hslToHex(dark2.h, dark2.s, dark2.l)
  };
}