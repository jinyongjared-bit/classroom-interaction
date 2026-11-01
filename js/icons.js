/**
 * 教学主题扁平风线性 SVG 图标系统
 * 统一 stroke-width: 1.8, rounded line-cap/join
 * 所有图标通过 currentColor 继承文字色
 */
const Icons = {

  /* ═══════ 品牌图标 ═══════ */

  // 学士帽 — 品牌主图标
  graduationCap: (size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-4.5L22 9 12 13.5 2 9z"/><path d="M22 9v4.5"/><path d="M6 11v4.5c0 1.2 2.7 2.5 6 2.5s6-1.3 6-2.5V11"/><circle cx="22" cy="14.5" r="0.8" fill="currentColor" stroke="none"/></svg>`,

  /* ═══════ 导航图标 ═══════ */

  // 随机抽人 — 学生证卡
  studentCard: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><circle cx="8" cy="11" r="2.2"/><path d="M4.5 16c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5"/><path d="M14 9h4.5M14 12h4.5M14 15h2.5"/></svg>`,

  // 随机抽人占位 — 大号学生证
  studentCardLarge: (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4.5" width="20" height="15" rx="2.5"/><circle cx="7.5" cy="10.5" r="2.2"/><path d="M4 15.5c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5"/><path d="M13.5 9h5M13.5 11.5h5M13.5 14h3"/><path d="M10 19.5v-0.5"/></svg>`,

  // 题库管理 — 打开的书本
  bookOpen: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6C10.5 5 8 4 5 4v14c3 0 5.5 1 7 2 1.5-1 4-2 7-2V4c-3 0-5.5 1-7 2z"/><path d="M12 6v14"/><path d="M7 7.5h2.5M7 10.5h2.5M14.5 7.5H17M14.5 10.5H17"/></svg>`,

  // 题库占位 — 大号书本
  bookOpenLarge: (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6C10 4.5 7 3.5 3.5 3.5v15c3.5 0 6.5 1 8.5 2.5 2-1.5 5-2.5 8.5-2.5v-15C17 3.5 14 4.5 12 6z"/><path d="M12 6v15"/><path d="M6 8h3M6 11h3M6 14h2M15 8h3M15 11h3M15 14h2"/></svg>`,

  // 随机抽题 — 考试卡+问号
  quizCard: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M9.5 10.5a2.5 2.5 0 1 1 3.8 2c-.8.4-.8 1-.8 1.5v.5"/><circle cx="12.5" cy="17" r="0.6" fill="currentColor" stroke="none"/><path d="M7 6.5h1.5" opacity="0.5"/></svg>`,

  // 抽题占位 — 大号考卷
  examPaperLarge: (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M7 7h4M13 7h4M7 10.5h4M13 10.5h4M7 14h4M13 14h4M7 17.5h2M11 17.5h2"/><circle cx="17" cy="17.5" r="0.6" fill="currentColor" stroke="none" opacity="0.5"/></svg>`,

  // 古诗词 — 中式卷轴
  scroll: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="4" cy="12" rx="1.5" ry="7.5"/><ellipse cx="20" cy="12" rx="1.5" ry="7.5"/><rect x="5.5" y="5" width="13" height="14" rx="0.5"/><path d="M8 9h8M8 12h8M8 15h5"/></svg>`,

  // 古诗词占位 — 大号卷轴
  scrollLarge: (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="3.5" cy="12" rx="1.8" ry="8"/><ellipse cx="20.5" cy="12" rx="1.8" ry="8"/><rect x="5.3" y="4.5" width="13.4" height="15" rx="0.5"/><path d="M8 8.5h8M8 11.5h8M8 14.5h8M8 17.5h5"/><path d="M10.5 4.5v-1M13.5 4.5v-1" opacity="0.4"/></svg>`,

  // AI出题 — 灯泡（灵感生成）
  lightbulb: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 18h5M10.5 21h3"/><path d="M12 2.5a7 7 0 0 0-4 12.5c.8.7 1.3 1.5 1.5 2.5h5c.2-1 .7-1.8 1.5-2.5A7 7 0 0 0 12 2.5z"/><path d="M6 8l.4 1.2L7.6 9.6l-1.2.4L6 11.2l-.4-1.2L4.4 9.6l1.2-.4L6 8z" fill="currentColor" stroke="none" opacity="0.5"/></svg>`,

  /* ═══════ 全屏切换 ═══════ */

  expand: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"/></svg>`,

  contract: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v4M9 3H5a2 2 0 0 0-2 2v4M15 21h4a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2 2-2v-4"/></svg>`,

  /* ═══════ 操作按钮 ═══════ */

  // 关闭
  close: (size = 14) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,

  // 编辑（钢笔批改风）
  edit: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 5.5l4.5 4.5M5.5 14L4 20l6-1.5L19 9.5a2.1 2.1 0 0 0-3-3L7 15.5z"/><path d="M13 6.5l4 4"/></svg>`,

  // 删除
  trash: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 7l1 13a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6"/></svg>`,

  // 眼睛（显示答案）
  eye: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12s3.2-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.2 6.5-9.5 6.5S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/></svg>`,

  // 眼睛关闭（隐藏答案）
  eyeOff: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 4.3A10.3 10.3 0 0 1 12 4c6.3 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2 3M5.8 6A17 17 0 0 0 2.5 10.5s3.2 6.5 9.5 6.5a10 10 0 0 0 5.5-1M6 6l12 12"/><path d="M9.8 9.8a2.8 2.8 0 0 0 4 4"/></svg>`,

  // 加号（添加/采纳）
  plus: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,

  // 下一题
  arrowRight: (size = 18) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,

  // 重置
  refresh: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 12a8.5 8.5 0 0 1 14.5-6L20 8M20 3.5V8h-4.5M20.5 12a8.5 8.5 0 0 1-14.5 6L4 16M4 20.5V16h4.5"/></svg>`,

  // 上传文件
  upload: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V4M7.5 8.5l4.5-4.5 4.5 4.5M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>`,

  // 设置
  settings: (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M4.5 4.5l2.1 2.1M17.4 17.4l2.1 2.1M2.5 12h3M18.5 12h3M4.5 19.5l2.1-2.1M17.4 6.6l2.1-2.1"/></svg>`,
};
