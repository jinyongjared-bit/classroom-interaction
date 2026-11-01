/**
 * 文件解析器 - CSV / Excel 学生名单 & Markdown 问答题
 */
const Parsers = {

  /**
   * 解析 Excel 文件（.xlsx / .xls）
   * 支持多 Sheet，自动识别每个 Sheet 中的学生数据
   */
  parseExcel(arrayBuffer) {
    if (typeof XLSX === 'undefined') {
      throw new Error('Excel 解析库未加载');
    }
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });

    // 遍历所有 Sheet，收集每个 Sheet 的学生数据
    const sheets = [];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      if (rows.length === 0) continue;
      const students = this._parseRows(rows);
      if (students.length > 0) {
        sheets.push({ name: sheetName, students });
      }
    }

    // 如果只有一个 Sheet 有数据，直接返回学生数组
    if (sheets.length === 0) return [];
    if (sheets.length === 1) return sheets[0].students;

    // 多 Sheet：合并所有学生，用 Sheet 名作为班级名
    // 返回带班级信息的结构
    return { multiSheet: true, sheets };
  },

  /**
   * 从二维数组解析学生名单
   * 自动识别表头行（可能在第1~3行），跳过标题行，识别列序
   */
  _parseRows(rows) {
    if (rows.length === 0) return [];

    // 表头关键词
    const nameKeywords = ['姓名', 'name', '学生姓名', '名字'];
    const noKeywords = ['学号', '序号', 'id', 'no', 'studentno', 'student_no', '学籍号', '编号', '座号'];

    // 在前5行中搜索表头行（因为表头可能不在第一行）
    let headerRowIdx = -1;
    let nameIdx = -1, noIdx = -1;

    for (let r = 0; r < Math.min(5, rows.length); r++) {
      const row = rows[r].map(c => String(c).trim().toLowerCase());
      let tempName = -1, tempNo = -1;
      for (let i = 0; i < row.length; i++) {
        if (tempName === -1 && nameKeywords.some(k => row[i].includes(k))) tempName = i;
        if (tempNo === -1 && noKeywords.some(k => row[i].includes(k))) tempNo = i;
      }
      if (tempName !== -1 || tempNo !== -1) {
        headerRowIdx = r;
        nameIdx = tempName;
        noIdx = tempNo;
        break;
      }
    }

    // 确定数据起始行
    let dataStart = headerRowIdx !== -1 ? headerRowIdx + 1 : 0;

    // 如果表头中只找到了姓名列但没有学号列，检查表头行是否有"序号"
    // 如果只找到序号没找到姓名，也继续（序号即学号）
    // 如果都找到了，正常处理

    // 无表头时：通过数据内容自动判断列序
    if (headerRowIdx === -1 && rows.length > 0) {
      // 扫描前几行找到第一行有实质数据的
      for (let r = 0; r < Math.min(5, rows.length); r++) {
        const row = rows[r];
        if (!row || row.length < 2) continue;
        const col0 = String(row[0] || '').trim();
        const col1 = String(row[1] || '').trim();
        if (!col0 && !col1) continue;

        const isNumericLike = (s) => /^[\dA-Za-z]+$/.test(s) && /\d/.test(s);
        const hasChinese = (s) => /[\u4e00-\u9fa5]/.test(s);

        if (isNumericLike(col0) && (hasChinese(col1) || !isNumericLike(col1))) {
          noIdx = 0; nameIdx = 1;
        } else if (isNumericLike(col1) && (hasChinese(col0) || !isNumericLike(col0))) {
          nameIdx = 0; noIdx = 1;
        } else if (hasChinese(col0) && !isNumericLike(col1)) {
          // col0 是中文，col1 不是数字 → col0 姓名列，col1 可能是其他
          nameIdx = 0;
          if (noIdx === -1) noIdx = 1;
        } else {
          nameIdx = 0;
          if (noIdx === -1) noIdx = 1;
        }
        dataStart = r + 1;
        break;
      }
    }

    // 如果只找到姓名没找到学号，用序号列或自动生成
    let hasNoColumn = (noIdx !== -1);
    if (noIdx === -1) {
      // 没有学号列，检查是否有序号列
      for (let r = 0; r <= (headerRowIdx !== -1 ? headerRowIdx : 0); r++) {
        const row = rows[r] ? rows[r].map(c => String(c).trim().toLowerCase()) : [];
        for (let i = 0; i < row.length; i++) {
          if (noKeywords.some(k => row[i].includes(k))) { noIdx = i; hasNoColumn = true; break; }
        }
        if (noIdx !== -1) break;
      }
    }

    if (nameIdx === -1) nameIdx = 0;
    if (noIdx === -1) noIdx = 1;

    // 非学生数据行关键词
    const invalidNameKeywords = ['姓名', 'name', '学生姓名', '名字', '序号', '学号', '编号', 'id', 'no', 'studentno', '事项', '日期', '座号'];
    const invalidNoKeywords = ['姓名', 'name', '学生姓名', '名字', '序号', '学号', '编号', '事项', '日期'];

    const isInvalidName = (name) => {
      const lower = name.toLowerCase().trim();
      if (!lower) return true;
      // 纯数字跳过（可能是序号误入姓名列）
      if (/^\d+$/.test(name)) return false;
      return invalidNameKeywords.some(k => lower === k || lower === k + '：' || lower === k + ':');
    };

    const isInvalidNo = (no) => {
      const lower = no.toLowerCase().trim();
      if (!lower) return false;
      return invalidNoKeywords.some(k => lower === k || lower === k + '：' || lower === k + ':');
    };

    // 判断一个值是否是无效数据（说明文字等）
    const isInstructionalText = (s) => {
      const t = s.trim();
      if (!t) return false;
      // 含有换行、长文本（>15字符）、包含"课代表""排序""标记"等
      if (t.length > 15) return true;
      if (/课代表|排序|标记|登记|表现|作业|红笔|请假|转学/.test(t)) return true;
      return false;
    };

    const students = [];

    for (let i = dataStart; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue;

      const name = String(row[nameIdx] || '').trim();
      const studentNo = String(row[noIdx] || '').trim();

      // 跳过说明文字行
      if (isInstructionalText(name)) continue;
      if (isInstructionalText(studentNo)) continue;

      // 跳过空姓名
      if (isInvalidName(name)) continue;
      // 跳过表头文字
      if (isInvalidNo(studentNo)) continue;

      // 确保姓名不是纯数字（序号误入姓名列）
      if (/^\d+$/.test(name)) continue;

      // 使用原始学号，如果为空则留空（后面统一编号）
      students.push({ name, studentNo: studentNo || '' });
    }

    // 如果学号列为空或学号不连续，统一重新编号 1,2,3...
    if (students.length > 0) {
      const hasValidNo = students.some(s => s.studentNo && /^\d+$/.test(s.studentNo));
      if (hasValidNo) {
        let needRenumber = false;
        for (let i = 0; i < students.length; i++) {
          const no = parseInt(students[i].studentNo);
          if (isNaN(no) || no !== i + 1) {
            needRenumber = true;
            break;
          }
        }
        if (needRenumber) {
          students.forEach((s, i) => { s.studentNo = String(i + 1); });
        }
      } else {
        students.forEach((s, i) => { s.studentNo = String(i + 1); });
      }
    }

    return students;
  },

  /**
   * 解析 CSV 学生名单
   */
  parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length === 0) return [];

    const splitLine = (line) => {
      if (line.includes('\t')) return line.split('\t');
      return line.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
    };

    const rows = lines.map(splitLine);
    return this._parseRows(rows);
  },

  readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file, 'UTF-8');
    });
  },

  readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  },

  /**
   * 统一的文件解析入口
   */
  async parseStudentFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'xlsx' || ext === 'xls') {
      const buf = await this.readFileAsArrayBuffer(file);
      return this.parseExcel(buf);
    }
    const text = await this.readFile(file);
    return this.parseCSV(text);
  },

  /**
   * 解析 Word (.docx) 文件为问答题
   */
  async parseDocx(file) {
    if (typeof mammoth === 'undefined') {
      throw new Error('Word 解析库未加载');
    }
    const arrayBuffer = await this.readFileAsArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    if (!text || text.trim().length === 0) {
      throw new Error('Word 文档内容为空');
    }
    return this.parseMD(text);
  },

  /**
   * 题目文件统一解析入口
   */
  async parseQuestionFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'docx') {
      return this.parseDocx(file);
    }
    const text = await this.readFile(file);
    return this.parseMD(text);
  },

  /**
   * 解析 Markdown 问答题
   */
  parseMD(text) {
    const questions = [];

    const titlePattern = /^(#{1,4})\s*(.+)$/;
    const lines = text.split(/\r?\n/);

    let currentQ = null;
    let currentA = null;
    let mode = null;

    for (const line of lines) {
      const titleMatch = line.match(titlePattern);

      if (titleMatch) {
        const title = titleMatch[2].trim();

        if (/^(题目|问题|Q|Question|q)[:：]?/i.test(title)) {
          if (currentQ) {
            questions.push({ question: currentQ, answer: currentA || '' });
          }
          currentQ = title.replace(/^(题目|问题|Q|Question|q)[:：]?/i, '').trim() || null;
          currentA = null;
          mode = 'q';
          continue;
        }

        if (/^(答案|参考答案|答|A|Answer|a)[:：]?/i.test(title)) {
          currentA = '';
          mode = 'a';
          continue;
        }

        if (currentQ && mode === 'a') {
          questions.push({ question: currentQ, answer: currentA?.trim() || '' });
          currentQ = title;
          currentA = null;
          mode = 'q';
          continue;
        }

        if (!currentQ) {
          currentQ = title;
          mode = 'q';
          continue;
        }
      }

      const inlineAnswer = line.match(/^(答案|参考答案|答|A|Answer)[:：](.*)$/i);
      if (inlineAnswer) {
        currentA = inlineAnswer[2].trim();
        mode = 'a';
        continue;
      }

      const inlineQuestion = line.match(/^(题目|问题|Q|Question)[:：](.*)$/i);
      if (inlineQuestion) {
        if (currentQ) {
          questions.push({ question: currentQ, answer: currentA?.trim() || '' });
        }
        currentQ = inlineQuestion[2].trim();
        currentA = null;
        mode = 'q';
        continue;
      }

      if (mode === 'q' && line.trim()) {
        if (currentQ) {
          currentQ += '\n' + line.trim();
        } else {
          currentQ = line.trim();
        }
      } else if (mode === 'a' && line.trim()) {
        if (currentA) {
          currentA += '\n' + line.trim();
        } else {
          currentA = line.trim();
        }
      }
    }

    if (currentQ) {
      questions.push({ question: currentQ, answer: currentA?.trim() || '' });
    }

    if (questions.length === 0) {
      const qaPattern = text.split(/\r?\n/);
      let tempQ = null;
      for (const line of qaPattern) {
        const qMatch = line.match(/^(Q|题目|问题)[:：](.+)$/i);
        const aMatch = line.match(/^(A|答案|答)[:：](.+)$/i);
        if (qMatch) {
          if (tempQ) questions.push(tempQ);
          tempQ = { question: qMatch[2].trim(), answer: '' };
        } else if (aMatch && tempQ) {
          tempQ.answer = aMatch[2].trim();
          questions.push(tempQ);
          tempQ = null;
        }
      }
      if (tempQ) questions.push(tempQ);
    }

    return questions;
  },

  exportJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'export.json';
    a.click();
    URL.revokeObjectURL(url);
  }
};
