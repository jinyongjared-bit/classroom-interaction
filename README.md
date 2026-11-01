# 课堂互动系统

面向中小学课堂的互动教学工具，纯网页实现，无需安装，浏览器打开即可使用。

## 在线使用

部署到 GitHub Pages 后，用任意浏览器（含教室一体机）访问即可：

```
https://<你的GitHub用户名>.github.io/classroom-interaction/
```

## 功能

| 模块 | 说明 |
| --- | --- |
| 随机抽人 | 上传学生名单（Excel/CSV），支持多 Sheet 多班级，随机抽取学生，可设置不重复 |
| 题库管理 | 新建题库、导入 Markdown/Word 题目文件、手动添加题目、题库重命名 |
| 随机抽题 | 从题库随机抽取题目，大字号显示，题目关键词红色高亮 |
| 古诗词背诵 | 内置统编教材 1-6 年级上下册古诗词，可按年级筛选、指定学生随机抽诗、记录背诵评价 |
| AI 出题 | 输入整本书阅读书目，调用 AI 自动生成问答题，内置可编辑的出题提示词 |

## 本地使用

直接用浏览器打开 `index.html` 即可，无需任何服务器。

## AI 出题配置

在「AI 出题 → 接口设置」中填写：

- 接口提供商：DeepSeek / 通义千问 / 文心一言 / 自定义
- API Key
- 模型名称（如 `deepseek-chat`、`qwen-turbo`）
- CORS 代理地址（可选）

若浏览器提示跨域错误，可部署 `cors-proxy-worker.js` 到 Cloudflare Workers（免费），
将获得的地址（形如 `https://your-worker.workers.dev/?url=`）填入 CORS 代理地址即可。

系统提示词与出题模板均可在界面中自由修改，并保存在浏览器本地。

## 数据存储

所有数据（班级、学生、题库、背诵记录、AI 设置）保存在浏览器的 IndexedDB 和 localStorage 中，
不会上传到任何服务器。清除浏览器数据会丢失记录，重要数据请及时备份。

## 学生名单格式

支持 `.xlsx`、`.xls`、`.csv`。程序会遍历所有 Sheet，每个 Sheet 生成一个班级。
表头可包含「姓名」「学号」等列名，程序会自动识别列顺序；无表头时会根据数据特征自动判断。

示例见 [sample-students.csv](sample-students.csv)。

## 题库格式

支持 `.md`、`.markdown`、`.txt`、`.docx`、`.doc`。示例见 [sample-questions.md](sample-questions.md)。

```markdown
## 题目1
题干内容

**答案：** 参考答案

## 题目2
...
```

## 部署到你自己的 GitHub Pages

1. Fork 或克隆本仓库
2. 仓库 Settings → Pages → Source 选择 `main` 分支、根目录
3. 等待构建完成，访问 `https://<用户名>.github.io/classroom-interaction/`

## 技术栈

原生 HTML / CSS / JavaScript，无构建步骤。第三方库通过 CDN 加载：

- [SheetJS](https://sheetjs.com/) — Excel/CSV 解析
- [Mammoth.js](https://github.com/mwilliamson/mammoth.js) — Word 文档解析

## License

MIT
