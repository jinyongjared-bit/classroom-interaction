/**
 * 课堂互动系统 - 主应用控制器
 */
const App = {
  state: {
    currentView: 'draw-student',
    currentClassId: null,
    currentBankId: null,
    drawnStudentIds: [],
    drawHistory: [],
    currentQuestion: null,
    classManaging: null,
    poetryGrades: [],
    poetrySemester: 'all',
    poetryCurrentPoem: null,
    poetryRecords: [],
    aiGeneratedQuestions: [],
    aiSettings: null,
    timer: {
      duration: 0,
      remaining: 0,
      running: false,
      paused: false,
      intervalId: null,
    },
  },

  // ========== 初始化 ==========
  async init() {
    try {
      await DB.init();
    } catch (e) {
      console.error('数据库初始化失败:', e);
      this.toast('数据库初始化失败，请刷新重试', 'error');
      return;
    }
    try { this.injectIcons(); } catch(e) { console.error('injectIcons:', e); }
    try { this.bindNavigation(); } catch(e) { console.error('bindNavigation:', e); }
    try { this.bindStudentModule(); } catch(e) { console.error('bindStudentModule:', e); }
    try { this.bindQuestionModule(); } catch(e) { console.error('bindQuestionModule:', e); }
    try { this.bindPoetryModule(); } catch(e) { console.error('bindPoetryModule:', e); }
    try { this.bindTimerModule(); } catch(e) { console.error('bindTimerModule:', e); }
    try { this.bindAIModule(); } catch(e) { console.error('bindAIModule:', e); }
    try { this.bindModals(); } catch(e) { console.error('bindModals:', e); }
    try { this.bindFullscreen(); } catch(e) { console.error('bindFullscreen:', e); }
    try { await this.loadClassSelects(); } catch(e) { console.error('loadClassSelects:', e); }
    try { await this.loadBankSelects(); } catch(e) { console.error('loadBankSelects:', e); }
    try { this.loadPoetryClassSelect(); } catch(e) { console.error('loadPoetryClassSelect:', e); }
    try { this.loadAISettings(); } catch(e) { console.error('loadAISettings:', e); }
    this.toast('系统初始化完成', 'success');
  },

  // 注入所有静态图标
  injectIcons() {
    const map = {
      'navBrandIcon': Icons.graduationCap(22),
      'tabIconDice': Icons.studentCard(16),
      'tabIconBank': Icons.bookOpen(16),
      'tabIconQuestion': Icons.quizCard(16),
      'tabIconScroll': Icons.scroll(16),
      'tabIconSparkles': Icons.lightbulb(16),
      'btnFullscreen': Icons.expand(18),
      'placeholderDrawStudent': Icons.studentCardLarge(64),
      'placeholderPoetry': Icons.scrollLarge(64),
      'placeholderBankEmpty': Icons.bookOpenLarge(64),
      'placeholderDrawQuestion': Icons.examPaperLarge(64),
      'iconResetDraw': Icons.refresh(16),
      'iconImportMD': Icons.upload(16),
      'iconShowAnswer': Icons.eye(18),
      'iconNextQuestion': Icons.arrowRight(18),
      'iconAISettings': Icons.settings(16),
    };
    for (const [id, svg] of Object.entries(map)) {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svg;
    }
    // 模态框关闭按钮
    document.querySelectorAll('.modal-close[data-close]').forEach(btn => {
      btn.innerHTML = Icons.close(14);
    });
  },

  // ========== 导航 ==========
  bindNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        if (tab.disabled) return;
        const view = tab.dataset.view;
        this.switchView(view);
      });
    });
  },

  switchView(viewName) {
    this.state.currentView = viewName;
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.view === viewName));
    document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === `view-${viewName}`));
    if (viewName === 'draw-question') this.loadBankSelects();
    if (viewName === 'draw-student') this.loadClassSelects();
    if (viewName === 'poetry') {
      this.loadPoetryClassSelect();
      this.updatePoetryList();
      this.renderPoetryRecords();
    }
    if (viewName === 'ai-gen') this.loadAITargetBanks();
  },

  // ========== Toast ==========
  toast(msg, type = 'info') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(100%)';
      setTimeout(() => el.remove(), 300);
    }, 2500);
  },

  // ========== 模态框 ==========
  bindModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        // 点击遮罩空白处关闭
        if (e.target === overlay) {
          overlay.classList.remove('active');
          return;
        }
        // 点击带 data-close 的元素（或其子元素）关闭
        const closeEl = e.target.closest('[data-close]');
        if (closeEl) {
          overlay.classList.remove('active');
        }
      });
    });
  },

  openModal(id) {
    document.getElementById(id).classList.add('active');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  // ========== 全屏 ==========
  bindFullscreen() {
    document.getElementById('btnFullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        document.getElementById('btnFullscreen').innerHTML = Icons.contract(18);
      } else {
        document.exitFullscreen();
        document.getElementById('btnFullscreen').innerHTML = Icons.expand(18);
      }
    });
    document.addEventListener('fullscreenchange', () => {
      const btn = document.getElementById('btnFullscreen');
      if (btn) btn.innerHTML = document.fullscreenElement ? Icons.contract(18) : Icons.expand(18);
    });
  },

  // ========== 班级 & 学生模块 ==========
  bindStudentModule() {
    // 班级选择
    document.getElementById('studentClassSelect').addEventListener('change', async (e) => {
      const classId = parseInt(e.target.value);
      this.state.currentClassId = classId;
      this.state.drawnStudentIds = [];
      this.state.drawHistory = [];
      this.renderDrawArea('student', 'placeholder');
      this.renderHistory();
    });

    // 班级管理
    document.getElementById('btnManageClass').addEventListener('click', () => {
      this.openModal('modalClassManage');
      this.renderClassList();
    });

    // 新建班级
    document.getElementById('btnAddClass').addEventListener('click', () => {
      this.openModal('modalNewClass');
      document.getElementById('newClassName').focus();
    });
    document.getElementById('btnConfirmNewClass').addEventListener('click', () => this.confirmNewClass());

    // CSV 上传
    document.getElementById('btnUploadCSV').addEventListener('click', () => {
      document.getElementById('csvFileInput').click();
    });
    document.getElementById('csvFileInput').addEventListener('change', (e) => this.handleCSVUpload(e));

    // 拖放上传
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) this.handleCSVFile(file);
    });

    // 手动添加学生
    document.getElementById('btnAddStudent').addEventListener('click', () => this.addStudent());
    document.getElementById('newStudentNo').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.addStudent(); }
    });
    document.getElementById('newStudentName').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); document.getElementById('newStudentNo').focus(); }
    });

    // 随机抽人
    document.getElementById('btnDrawStudent').addEventListener('click', () => this.drawStudent());
    document.getElementById('btnDrawAgain').addEventListener('click', () => this.drawStudent());

    // 重置已抽
    document.getElementById('btnResetDraw').addEventListener('click', () => {
      this.state.drawnStudentIds = [];
      this.state.drawHistory = [];
      this.renderHistory();
      this.renderDrawArea('student', 'placeholder');
      this.toast('已重置抽取记录', 'success');
    });
  },

  async loadClassSelects() {
    const classes = await DB.getClasses();
    const select = document.getElementById('studentClassSelect');
    if (classes.length === 0) {
      select.innerHTML = '<option value="">请先在"班级管理"中添加班级</option>';
      return;
    }
    select.innerHTML = '<option value="">请选择班级</option>' +
      classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    if (this.state.currentClassId) {
      select.value = this.state.currentClassId;
    }
  },

  async renderClassList() {
    const classes = await DB.getClasses();
    const container = document.getElementById('classListContainer');
    if (classes.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#A0A3B8;padding:20px;">暂无班级，请点击下方按钮创建</p>';
      return;
    }
    container.innerHTML = classes.map(c => `
      <div class="class-item ${c.id === this.state.classManaging ? 'active' : ''}" data-class-id="${c.id}">
        <span class="class-item-name">${c.name}</span>
        <span class="class-item-count" id="classCount-${c.id}">加载中</span>
        <button class="class-item-edit" data-edit-class="${c.id}" title="重命名">${Icons.edit(14)}</button>
        <button class="class-item-delete" data-delete-class="${c.id}" title="删除">${Icons.close(12)}</button>
      </div>
    `).join('');

    // 加载各班人数
    for (const c of classes) {
      const count = await DB.countByIndex('students', 'classId', c.id);
      const el = document.getElementById(`classCount-${c.id}`);
      if (el) el.textContent = `${count} 人`;
    }

    // 绑定点击
    container.querySelectorAll('.class-item').forEach(item => {
      item.addEventListener('click', async (e) => {
        if (e.target.closest('[data-delete-class]') || e.target.closest('[data-edit-class]')) return;
        const classId = parseInt(item.dataset.classId);
        this.state.classManaging = classId;
        await this.renderStudentList(classId);
        container.querySelectorAll('.class-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
      });
    });

    // 重命名班级（内联编辑）
    container.querySelectorAll('[data-edit-class]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const classId = parseInt(btn.dataset.editClass);
        const cls = await DB.get('classes', classId);
        if (!cls) return;

        // 找到班级名 span，替换为输入框
        const nameSpan = btn.parentElement.querySelector('.class-item-name');
        if (!nameSpan) return;
        const oldName = cls.name;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'class-item-name-input';
        input.value = oldName;
        nameSpan.replaceWith(input);
        input.focus();
        input.select();

        // 按 Enter 或失焦时保存
        const save = async () => {
          const newName = input.value.trim();
          if (newName && newName !== oldName) {
            cls.name = newName;
            await DB.put('classes', cls);
            await this.renderClassList();
            await this.loadClassSelects();
            if (this.state.classManaging === classId) {
              await this.renderStudentList(classId);
            }
            this.toast('班级名称已更新', 'success');
          } else {
            // 恢复原样
            await this.renderClassList();
          }
        };

        input.addEventListener('blur', save, { once: true });
        input.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
          if (ev.key === 'Escape') { input.value = oldName; input.blur(); }
        });
      });
    });

    // 删除班级（二次确认，兼容 Electron）
    container.querySelectorAll('[data-delete-class]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const classId = parseInt(btn.dataset.deleteClass);
        const item = btn.closest('.class-item');
        const nameEl = item.querySelector('.class-item-name') || item.querySelector('.class-item-name-input');
        const className = nameEl ? nameEl.textContent || nameEl.value : '';

        // 如果已确认，直接删除
        if (btn.dataset.confirmed === 'true') {
          btn.dataset.confirmed = '';
          await DB.delete('classes', classId);
          await DB.deleteByIndex('students', 'classId', classId);
          this.state.classManaging = null;
          await this.renderClassList();
          document.getElementById('studentListContainer').innerHTML = '';
          await this.loadClassSelects();
          this.toast('班级已删除', 'success');
          return;
        }

        // 第一次点击：改为确认状态
        btn.dataset.confirmed = 'true';
        btn.style.color = 'var(--red)';
        btn.style.background = 'var(--red-bg)';
        btn.title = '再次点击确认删除';
        this.toast(`再次点击删除按钮以确认删除「${className}」`, 'info');
        setTimeout(() => {
          if (btn.dataset.confirmed === 'true') {
            btn.dataset.confirmed = '';
            btn.style.color = '';
            btn.style.background = '';
            btn.title = '删除';
          }
        }, 3000);
      });
    });
  },

  async renderStudentList(classId) {
    const students = await DB.getStudentsByClass(classId);
    const container = document.getElementById('studentListContainer');
    if (students.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#A0A3B8;padding:20px;">暂无学生，请上传名单文件</p>';
      return;
    }
    // 按学号排序
    students.sort((a, b) => a.studentNo.localeCompare(b.studentNo, 'zh'));
    container.innerHTML = `
      <div class="student-list-header">
        <span class="student-col-name">姓名</span>
        <span class="student-col-no">学号</span>
        <span class="student-col-action"></span>
      </div>
    ` + students.map(s => `
      <div class="student-item editable" data-student-id="${s.id}">
        <input class="student-edit-name" value="${this.escapeHTML(s.name)}" data-field="name" data-id="${s.id}" placeholder="姓名">
        <input class="student-edit-no" value="${this.escapeHTML(s.studentNo)}" data-field="studentNo" data-id="${s.id}" placeholder="学号">
        <button class="btn-icon delete student-del-btn" data-del-student="${s.id}" title="删除">${Icons.close(14)}</button>
      </div>
    `).join('');

    // 绑定编辑 — 失焦时自动保存
    container.querySelectorAll('input[data-field]').forEach(input => {
      input.addEventListener('blur', async (e) => {
        const id = parseInt(e.target.dataset.id);
        const field = e.target.dataset.field;
        const val = e.target.value.trim();
        if (!val) { this.toast('不能为空', 'error'); return; }
        const student = await DB.get('students', id);
        if (student[field] !== val) {
          student[field] = val;
          await DB.put('students', student);
          this.toast('已更新', 'success');
        }
      });
    });

    // 绑定删除
    container.querySelectorAll('[data-del-student]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = parseInt(btn.dataset.delStudent);
        await DB.delete('students', id);
        await this.renderStudentList(this.state.classManaging);
        await this.renderClassList();
        this.toast('已删除', 'success');
      });
    });
  },

  async addStudent() {
    if (!this.state.classManaging) { this.toast('请先选择班级', 'error'); return; }
    const nameInput = document.getElementById('newStudentName');
    const noInput = document.getElementById('newStudentNo');
    const name = nameInput.value.trim();
    const studentNo = noInput.value.trim();
    if (!name) { this.toast('请输入学生姓名', 'error'); nameInput.focus(); return; }
    if (!studentNo) { this.toast('请输入学号', 'error'); noInput.focus(); return; }

    await DB.add('students', {
      classId: this.state.classManaging,
      name,
      studentNo,
      createdAt: new Date().toISOString(),
    });
    nameInput.value = '';
    noInput.value = '';
    nameInput.focus();
    await this.renderStudentList(this.state.classManaging);
    await this.renderClassList();
    this.toast('学生添加成功', 'success');
  },

  async confirmNewClass() {
    const name = document.getElementById('newClassName').value.trim();
    if (!name) { this.toast('请输入班级名称', 'error'); return; }
    await DB.add('classes', { name, createdAt: new Date().toISOString() });
    this.closeModal('modalNewClass');
    document.getElementById('newClassName').value = '';
    await this.renderClassList();
    await this.loadClassSelects();
    this.toast('班级创建成功', 'success');
  },

  async handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    await this.handleCSVFile(file);
    e.target.value = '';
  },

  async handleCSVFile(file) {
    try {
      const result = await Parsers.parseStudentFile(file);

      // 多 Sheet 处理：每个 Sheet 创建一个班级
      if (result && result.multiSheet && result.sheets) {
        let total = 0;
        for (const sheet of result.sheets) {
          const className = sheet.name;
          const classId = await DB.add('classes', { name: className, createdAt: new Date().toISOString() });
          const items = sheet.students.map(s => ({
            classId: classId,
            name: s.name,
            studentNo: s.studentNo,
          }));
          const count = await DB.bulkAdd('students', items);
          total += count;
          // 选中最后一个班级
          this.state.classManaging = classId;
        }
        await this.renderClassList();
        await this.loadClassSelects();
        if (this.state.classManaging) await this.renderStudentList(this.state.classManaging);
        this.toast(`成功导入 ${result.sheets.length} 个班级，共 ${total} 名学生`, 'success');
        return;
      }

      // 单 Sheet 或 CSV
      const students = result;
      if (!students || students.length === 0) {
        this.toast('文件解析失败，未找到有效数据，请确认包含"姓名"列', 'error');
        return;
      }

      let classId = this.state.classManaging;
      if (!classId) {
        const className = file.name.replace(/\.(csv|txt|xlsx|xls)$/i, '');
        const result = await DB.add('classes', { name: className, createdAt: new Date().toISOString() });
        classId = result;
        this.state.classManaging = classId;
        await this.renderClassList();
        await this.loadClassSelects();
      }

      const items = students.map(s => ({
        classId: classId,
        name: s.name,
        studentNo: s.studentNo,
      }));
      const count = await DB.bulkAdd('students', items);
      await this.renderStudentList(classId);
      await this.renderClassList();
      this.toast(`成功导入 ${count} 名学生`, 'success');
    } catch (err) {
      this.toast('文件解析失败: ' + err.message, 'error');
    }
  },

  async drawStudent() {
    if (!this.state.currentClassId) {
      this.toast('请先选择班级', 'error');
      return;
    }
    const students = await DB.getStudentsByClass(this.state.currentClassId);
    if (students.length === 0) {
      this.toast('该班级暂无学生', 'error');
      return;
    }

    const noRepeat = document.getElementById('noRepeat').checked;
    let pool = students;
    if (noRepeat) {
      pool = students.filter(s => !this.state.drawnStudentIds.includes(s.id));
      if (pool.length === 0) {
        this.toast('全部学生已抽完，请重置后再抽', 'error');
        return;
      }
    }

    const selected = pool[Math.floor(Math.random() * pool.length)];

    // 滚动动画
    await this.playScrollAnimation('student', students, () => {
      this.renderDrawArea('student', 'result', selected);
    });

    if (noRepeat) {
      this.state.drawnStudentIds.push(selected.id);
    }
    this.state.drawHistory.push(selected);
    this.renderHistory();
  },

  renderDrawArea(type, state, data) {
    const areaId = type === 'student' ? 'studentDrawArea' : 'questionDrawArea';
    const area = document.getElementById(areaId);

    if (state === 'placeholder') {
      area.innerHTML = type === 'student'
        ? `<div class="draw-placeholder"><div class="placeholder-icon">${Icons.studentCardLarge(56)}</div><p>请选择班级后点击下方按钮抽取学生</p></div>`
        : `<div class="draw-placeholder"><div class="placeholder-icon">${Icons.quizCard(56)}</div><p>请选择题库后点击下方按钮抽取题目</p></div>`;
      // 隐藏控制按钮
      if (type === 'student') {
        document.getElementById('btnDrawStudent').style.display = '';
        document.getElementById('btnDrawAgain').style.display = 'none';
      } else {
        document.getElementById('btnDrawQuestion').style.display = '';
        document.getElementById('btnShowAnswer').style.display = 'none';
        document.getElementById('btnNextQuestion').style.display = 'none';
      }
      return;
    }

    if (type === 'student' && state === 'result') {
      area.innerHTML = `
        <div class="draw-result">
          <div class="draw-result-name">${data.name}</div>
          <div class="draw-result-sub">学号：${data.studentNo}</div>
        </div>
      `;
      document.getElementById('btnDrawStudent').style.display = 'none';
      document.getElementById('btnDrawAgain').style.display = '';
    }

    if (type === 'question' && state === 'result') {
      area.innerHTML = `
        <div class="draw-result">
          <div class="draw-result-question">${this.highlightKeywords(data.question)}</div>
        </div>
      `;
      document.getElementById('btnDrawQuestion').style.display = 'none';
      document.getElementById('btnShowAnswer').style.display = '';
      document.getElementById('btnNextQuestion').style.display = 'none';
    }
  },

  async playScrollAnimation(type, pool, callback) {
    const areaId = type === 'student' ? 'studentDrawArea' : 'questionDrawArea';
    const area = document.getElementById(areaId);

    const initialText = type === 'student' ? pool[0].name : (pool[0].question || '...').slice(0, 20) + '...';
    area.innerHTML = `<div class="scrolling"><span class="scrolling-name">${initialText}</span></div>`;
    const nameEl = area.querySelector('.scrolling-name');

    return new Promise(resolve => {
      let elapsed = 0;
      let interval = 60;

      const tick = () => {
        const idx = Math.floor(Math.random() * pool.length);
        if (type === 'student') {
          nameEl.textContent = pool[idx].name;
        } else {
          nameEl.textContent = (pool[idx].question || '...').slice(0, 20) + '...';
        }
        elapsed += interval;
        // 减速：后半段逐渐放慢
        if (elapsed > 1200) {
          interval = 100;
        }
        if (elapsed > 1600) {
          interval = 160;
        }
        if (elapsed > 2000) {
          callback();
          resolve();
          return;
        }
        setTimeout(tick, interval);
      };
      tick();
    });
  },

  renderHistory() {
    const container = document.getElementById('historyChips');
    if (this.state.drawHistory.length === 0) {
      container.innerHTML = '<span class="history-empty">暂无抽取记录</span>';
      return;
    }
    container.innerHTML = this.state.drawHistory.map((s, i) => `
      <span class="history-chip">
        <span class="chip-order">${i + 1}</span>
        ${s.name}（${s.studentNo}）
      </span>
    `).join('');
  },

  // ========== 题库 & 题目模块 ==========
  bindQuestionModule() {
    // 题库选择（题库管理页）
    document.getElementById('bankSelect').addEventListener('change', async (e) => {
      const bankId = parseInt(e.target.value);
      this.state.currentBankId = bankId;
      await this.renderQuestionList(bankId);
      this.toggleBankButtons(bankId);
    });

    // 新建题库
    document.getElementById('btnNewBank').addEventListener('click', () => {
      this.openModal('modalNewBank');
      document.getElementById('newBankName').focus();
    });
    document.getElementById('btnConfirmNewBank').addEventListener('click', () => this.confirmNewBank());

    // 导入题目文件
    document.getElementById('btnImportMD').addEventListener('click', () => {
      document.getElementById('mdFileInput').click();
    });
    document.getElementById('mdFileInput').addEventListener('change', (e) => this.handleMDUpload(e));

    // 下载题库模板
    document.getElementById('btnDownloadTemplate').addEventListener('click', () => this.downloadTemplate());

    // 手动添加题目
    document.getElementById('btnAddQuestion').addEventListener('click', () => {
      this.openModal('modalAddQuestion');
      document.getElementById('questionContent').focus();
    });
    document.getElementById('btnConfirmAddQuestion').addEventListener('click', () => this.confirmAddQuestion());

    // 编辑题目
    document.getElementById('btnConfirmEditQuestion').addEventListener('click', () => this.confirmEditQuestion());

    // 删除题库
    document.getElementById('btnDeleteBank').addEventListener('click', () => this.deleteBank());

    // 随机抽题
    document.getElementById('btnDrawQuestion').addEventListener('click', () => this.drawQuestion());
    document.getElementById('btnShowAnswer').addEventListener('click', () => this.showAnswer());
    document.getElementById('btnNextQuestion').addEventListener('click', () => this.drawQuestion());
  },

  async loadBankSelects() {
    const banks = await DB.getQuestionBanks();
    const options = banks.length === 0
      ? '<option value="">请先创建题库</option>'
      : '<option value="">请选择题库</option>' + banks.map(b => `<option value="${b.id}">${b.name}</option>`).join('');

    // 更新两个下拉框
    document.getElementById('bankSelect').innerHTML = options;
    document.getElementById('questionBankSelect').innerHTML = options;

    if (this.state.currentBankId) {
      document.getElementById('bankSelect').value = this.state.currentBankId;
      document.getElementById('questionBankSelect').value = this.state.currentBankId;
    }
  },

  toggleBankButtons(bankId) {
    const hasBank = !!bankId;
    document.getElementById('btnImportMD').disabled = !hasBank;
    document.getElementById('btnAddQuestion').disabled = !hasBank;
    document.getElementById('btnDeleteBank').disabled = !hasBank;
  },

  async confirmNewBank() {
    const name = document.getElementById('newBankName').value.trim();
    if (!name) { this.toast('请输入题库名称', 'error'); return; }
    try {
      await DB.add('questionBanks', { name, createdAt: new Date().toISOString() });
      this.closeModal('modalNewBank');
      document.getElementById('newBankName').value = '';
      await this.loadBankSelects();
      this.toast('题库创建成功', 'success');
    } catch(e) {
      console.error('confirmNewBank:', e);
      this.toast('创建题库失败: ' + e.message, 'error');
    }
  },

  async deleteBank() {
    if (!this.state.currentBankId) return;
    const btn = document.getElementById('btnDeleteBank');
    if (!btn.dataset.confirmed) {
      btn.dataset.confirmed = 'true';
      btn.textContent = '再次点击确认';
      btn.classList.add('btn-confirm-pending');
      this.toast('再次点击删除按钮以确认', 'info');
      setTimeout(() => {
        if (btn.dataset.confirmed === 'true') {
          btn.dataset.confirmed = '';
          btn.textContent = '删除题库';
          btn.classList.remove('btn-confirm-pending');
        }
      }, 3000);
      return;
    }
    btn.dataset.confirmed = '';
    btn.textContent = '删除题库';
    btn.classList.remove('btn-confirm-pending');
    await DB.delete('questionBanks', this.state.currentBankId);
    await DB.deleteByIndex('questions', 'bankId', this.state.currentBankId);
    this.state.currentBankId = null;
    await this.loadBankSelects();
    document.getElementById('bankContent').innerHTML = `
      <div class="empty-state"><div class="placeholder-icon">${Icons.bookOpenLarge(64)}</div><p>请选择题库或新建题库</p></div>
    `;
    this.toggleBankButtons(null);
    this.toast('题库已删除', 'success');
  },

  async renderQuestionList(bankId) {
    const banks = await DB.getQuestionBanks();
    const bank = banks.find(b => b.id === bankId);
    if (!bankId || !bank) {
      document.getElementById('bankContent').innerHTML = `
        <div class="empty-state"><div class="placeholder-icon">${Icons.bookOpenLarge(64)}</div><p>请选择题库或新建题库</p></div>
      `;
      return;
    }

    const questions = await DB.getQuestionsByBank(bankId);
    const content = document.getElementById('bankContent');

    if (questions.length === 0) {
      content.innerHTML = `
        <div class="bank-stats">
          <span class="stat-item"><strong>0</strong> 题</span>
          <span class="stat-item bank-name-stat">
            题库：<span class="bank-name-text" data-bank-id="${bank.id}">${this.escapeHTML(bank.name)}</span>
            <button class="btn-icon edit bank-name-edit-btn" data-edit-bank="${bank.id}" title="编辑题库名称">${Icons.edit(14)}</button>
          </span>
        </div>
        <div class="empty-state">
          <div class="placeholder-icon">${Icons.examPaperLarge(64)}</div>
          <p>该题库暂无题目</p>
          <div style="margin-top:16px;display:flex;gap:12px;">
            <button class="btn btn-primary" onclick="document.getElementById('btnImportMD').click()">导入文件</button>
            <button class="btn btn-outline" onclick="document.getElementById('btnAddQuestion').click()">手动添加</button>
          </div>
        </div>
      `;
      this.bindBankNameEdit(content);
      return;
    }

    const difficultyMap = { easy: '简单', medium: '中等', hard: '困难' };
    content.innerHTML = `
      <div class="bank-stats">
        <span class="stat-item"><strong>${questions.length}</strong> 题</span>
        <span class="stat-item bank-name-stat">
          题库：<span class="bank-name-text" data-bank-id="${bank.id}">${this.escapeHTML(bank.name)}</span>
          <button class="btn-icon edit bank-name-edit-btn" data-edit-bank="${bank.id}" title="编辑题库名称">${Icons.edit(14)}</button>
        </span>
      </div>
      <div class="question-list">
        ${questions.map((q, i) => `
          <div class="question-card" data-question-id="${q.id}">
            <div class="question-card-header">
              <div style="display:flex;align-items:flex-start;">
                <span class="question-card-number">${i + 1}</span>
              </div>
              <div class="question-card-actions">
                <button class="btn-icon edit" data-edit="${q.id}" title="编辑">${Icons.edit(16)}</button>
                <button class="btn-icon delete" data-delete="${q.id}" title="删除">${Icons.trash(16)}</button>
              </div>
            </div>
            <div class="question-card-text" style="padding-left:0;margin-left:38px;">${this.escapeHTML(q.question)}</div>
            <div class="question-card-answer hidden" id="answer-${q.id}">${this.escapeHTML(q.answer || '（无答案）')}</div>
            <div class="question-card-footer">
              <div style="display:flex;gap:8px;align-items:center;margin-left:0;">
                <span class="difficulty-badge difficulty-${q.difficulty || 'medium'}">${difficultyMap[q.difficulty] || '中等'}</span>
                <span class="source-badge">${q.source || '手动'}</span>
              </div>
              <button class="btn btn-outline" style="min-height:36px;padding:6px 16px;font-size:13px;" data-toggle-answer="${q.id}">显示答案</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // 绑定答案切换
    content.querySelectorAll('[data-toggle-answer]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qId = btn.dataset.toggleAnswer;
        const answerEl = document.getElementById(`answer-${qId}`);
        const isHidden = answerEl.classList.contains('hidden');
        answerEl.classList.toggle('hidden');
        btn.textContent = isHidden ? '隐藏答案' : '显示答案';
      });
    });

    // 绑定编辑
    content.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => this.openEditQuestion(parseInt(btn.dataset.edit)));
    });

    // 绑定删除
    content.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qId = parseInt(btn.dataset.delete);
        if (!btn.dataset.confirmed) {
          btn.dataset.confirmed = 'true';
          btn.style.color = 'var(--red)';
          btn.style.background = 'var(--red-bg)';
          btn.title = '再次点击确认删除';
          setTimeout(() => {
            if (btn.dataset.confirmed === 'true') {
              btn.dataset.confirmed = '';
              btn.style.color = '';
              btn.style.background = '';
              btn.title = '删除';
            }
          }, 3000);
          return;
        }
        await DB.delete('questions', qId);
        await this.renderQuestionList(this.state.currentBankId);
        this.toast('题目已删除', 'success');
      });
    });

    // 绑定题库名编辑
    this.bindBankNameEdit(content);
  },

  bindBankNameEdit(container) {
    container.querySelectorAll('[data-edit-bank]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const bankId = parseInt(btn.dataset.editBank);
        const bank = await DB.get('questionBanks', bankId);
        if (!bank) return;

        const nameSpan = btn.parentElement.querySelector('.bank-name-text');
        if (!nameSpan) return;

        const oldName = bank.name;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'bank-name-input';
        input.value = oldName;
        nameSpan.replaceWith(input);
        input.focus();
        input.select();

        const save = async () => {
          const newName = input.value.trim();
          if (newName && newName !== oldName) {
            bank.name = newName;
            await DB.put('questionBanks', bank);
            await this.loadBankSelects();
            await this.renderQuestionList(bankId);
            this.toast('题库名称已更新', 'success');
          } else {
            await this.renderQuestionList(bankId);
          }
        };

        input.addEventListener('blur', save, { once: true });
        input.addEventListener('keydown', (ev) => {
          if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
          if (ev.key === 'Escape') { input.value = oldName; input.blur(); }
        });
      });
    });
  },

  async confirmAddQuestion() {
    const question = document.getElementById('questionContent').value.trim();
    const answer = document.getElementById('questionAnswer').value.trim();
    const difficulty = document.getElementById('questionDifficulty').value;
    if (!question) { this.toast('请输入题目内容', 'error'); return; }
    if (!this.state.currentBankId) { this.toast('请先选择题库', 'error'); return; }

    await DB.add('questions', {
      bankId: this.state.currentBankId,
      question,
      answer,
      difficulty,
      source: '手动',
      createdAt: new Date().toISOString(),
    });
    this.closeModal('modalAddQuestion');
    document.getElementById('questionContent').value = '';
    document.getElementById('questionAnswer').value = '';
    await this.renderQuestionList(this.state.currentBankId);
    this.toast('题目添加成功', 'success');
  },

  async openEditQuestion(qId) {
    const q = await DB.get('questions', qId);
    if (!q) return;
    document.getElementById('editQuestionId').value = q.id;
    document.getElementById('editQuestionContent').value = q.question;
    document.getElementById('editQuestionAnswer').value = q.answer || '';
    document.getElementById('editQuestionDifficulty').value = q.difficulty || 'medium';
    this.openModal('modalEditQuestion');
  },

  async confirmEditQuestion() {
    const id = parseInt(document.getElementById('editQuestionId').value);
    const question = document.getElementById('editQuestionContent').value.trim();
    const answer = document.getElementById('editQuestionAnswer').value.trim();
    const difficulty = document.getElementById('editQuestionDifficulty').value;
    if (!question) { this.toast('请输入题目内容', 'error'); return; }

    const q = await DB.get('questions', id);
    q.question = question;
    q.answer = answer;
    q.difficulty = difficulty;
    await DB.put('questions', q);
    this.closeModal('modalEditQuestion');
    await this.renderQuestionList(this.state.currentBankId);
    this.toast('题目已更新', 'success');
  },

  async handleMDUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = '';

    if (!this.state.currentBankId) {
      this.toast('请先选择题库', 'error');
      return;
    }

    try {
      const questions = await Parsers.parseQuestionFile(file);
      if (questions.length === 0) {
        this.toast('文件解析失败，未找到有效题目，请检查格式（需含"题目："和"答案："标识）', 'error');
        return;
      }

      const ext = file.name.split('.').pop().toLowerCase();
      const sourceLabel = (ext === 'docx' || ext === 'doc') ? 'Word导入' : 'MD导入';

      const items = questions.map(q => ({
        bankId: this.state.currentBankId,
        question: q.question,
        answer: q.answer || '',
        difficulty: 'medium',
        source: sourceLabel,
        createdAt: new Date().toISOString(),
      }));
      const count = await DB.bulkAdd('questions', items);
      await this.renderQuestionList(this.state.currentBankId);
      this.toast(`成功导入 ${count} 道题目（${sourceLabel}）`, 'success');
    } catch (err) {
      this.toast('文件解析失败: ' + err.message, 'error');
    }
  },

  downloadTemplate() {
    const template = `# 题库名称：示例题库

## 题目：中国四大发明包括哪些？
答案：造纸术、印刷术、火药、指南针

## 题目：《春晓》的作者是谁？
答案：孟浩然，唐代诗人

## 题目：请解释"亡羊补牢"的意思。
答案：羊逃跑后再去修补羊圈，比喻出了问题后想办法补救，可以防止继续受损失。

## 题目：3×4等于多少？
答案：12

## 题目：地球绕太阳公转一周需要多少时间？
答案：约365.25天，即一个回归年

—

格式说明：
1. 每道题以"## 题目："开头，后面写题目内容
2. 下一行以"答案："开头，后面写参考答案
3. 题目之间留一个空行
4. 可用 AI 生成题目后按此格式整理上传
`;
    const blob = new Blob([template], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '题库模板.md';
    a.click();
    URL.revokeObjectURL(url);
    this.toast('模板已下载，请按格式编辑后上传', 'success');
  },

  async drawQuestion() {
    this.stopTimer();
    const bankId = parseInt(document.getElementById('questionBankSelect').value);
    if (!bankId) {
      this.toast('请先选择题库', 'error');
      return;
    }
    const questions = await DB.getQuestionsByBank(bankId);
    if (questions.length === 0) {
      this.toast('该题库暂无题目', 'error');
      return;
    }

    const selected = questions[Math.floor(Math.random() * questions.length)];
    this.state.currentQuestion = selected;

    // 滚动动画
    const pool = questions;
    await this.playScrollAnimation('question', pool, () => {
      this.renderDrawArea('question', 'result', selected);
      document.getElementById('btnShowAnswer').style.display = '';
      document.getElementById('btnNextQuestion').style.display = 'none';
      // 自动启动计时器
      if (this.state.timer.duration > 0) {
        this.startTimer();
      }
    });
  },

  showAnswer() {
    if (!this.state.currentQuestion) return;
    // 答案展示后停止计时
    this.stopTimer();
    const area = document.getElementById('questionDrawArea');
    const answer = this.state.currentQuestion.answer || '（无参考答案）';
    const answerEl = document.createElement('div');
    answerEl.className = 'draw-result-answer';
    answerEl.textContent = '参考答案：' + answer;
    area.querySelector('.draw-result').appendChild(answerEl);
    document.getElementById('btnShowAnswer').style.display = 'none';
    document.getElementById('btnNextQuestion').style.display = '';
  },

  // ========== 古诗词背诵模块 ==========
  bindPoetryModule() {
    // 年级范围选择
    document.querySelectorAll('#poetryRangeChips .range-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        this.updatePoetryRangeFromUI();
        this.updatePoetryList();
      });
    });

    // 学期选择
    document.querySelectorAll('.poetry-semester-filter .range-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.poetry-semester-filter .range-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        this.state.poetrySemester = chip.dataset.semester;
        this.updatePoetryList();
      });
    });

    // 随机抽诗
    document.getElementById('btnDrawPoem').addEventListener('click', () => this.drawPoem());

    // 抽诗 + 抽人
    document.getElementById('btnDrawPoemAndStudent').addEventListener('click', () => this.drawPoemAndStudent());

    // 指定学生随机抽诗
    document.getElementById('btnDrawStudentPoetry').addEventListener('click', () => this.drawStudentForPoetry());

    // 显示全文
    document.getElementById('btnShowPoem').addEventListener('click', () => this.togglePoemFullText());

    // 下一首
    document.getElementById('btnNextPoem').addEventListener('click', () => this.drawPoem());

    // 记录背诵
    document.getElementById('btnPoetryRecord').addEventListener('click', () => this.openPoetryRecord());
  },

  updatePoetryRangeFromUI() {
    const grades = [];
    document.querySelectorAll('#poetryRangeChips .range-chip.active').forEach(chip => {
      grades.push(parseInt(chip.dataset.grade));
    });
    this.state.poetryGrades = grades;
  },

  loadPoetryClassSelect() {
    const select = document.getElementById('poetryClassSelect');
    const currentVal = select.value;
    DB.getClasses().then(classes => {
      if (classes.length === 0) {
        select.innerHTML = '<option value="">请先在班级管理中添加</option>';
        return;
      }
      select.innerHTML = '<option value="">选择班级（可关联抽人）</option>' +
        classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      if (currentVal) select.value = currentVal;
    });
  },

  updatePoetryList() {
    const grades = this.state.poetryGrades;
    const semester = this.state.poetrySemester;

    if (grades.length === 0) {
      document.getElementById('poetryListSection').style.display = 'none';
      document.getElementById('poetryCountDisplay').style.display = 'none';
      this.toast('请至少选择一个年级', 'error');
      return;
    }

    const poems = this.getPoetryPoolRaw();
    const countDisplay = document.getElementById('poetryCountDisplay');
    countDisplay.textContent = `共 ${poems.length} 首`;
    countDisplay.style.display = '';

    // 显示篇目列表
    const section = document.getElementById('poetryListSection');
    section.style.display = '';
    const chips = document.getElementById('poetryChips');
    chips.innerHTML = poems.map((p, i) => `
      <span class="poetry-chip" data-poem-idx="${i}">
        <span class="poetry-chip-num">${i + 1}</span>
        《${p.title}》
      </span>
    `).join('');

    // 点击篇目直接展示
    chips.querySelectorAll('[data-poem-idx]').forEach(chip => {
      chip.addEventListener('click', () => {
        const idx = parseInt(chip.dataset.poemIdx);
        this.state.poetryCurrentPoem = poems[idx];
        this.renderPoetryResult(poems[idx], null);
      });
    });
  },

  getPoetryPoolRaw() {
    const grades = this.state.poetryGrades;
    const semester = this.state.poetrySemester;
    let poems = [];
    for (const g of grades) {
      if (semester === 'all') {
        poems = poems.concat(getPoems(g, '上册'));
        poems = poems.concat(getPoems(g, '下册'));
      } else {
        poems = poems.concat(getPoems(g, semester));
      }
    }
    return poems;
  },

  getPoetryPool() {
    const grades = this.state.poetryGrades;
    if (grades.length === 0) {
      this.toast('请至少选择一个年级', 'error');
      return null;
    }
    const poems = this.getPoetryPoolRaw();
    if (poems.length === 0) {
      this.toast('所选范围暂无诗歌数据', 'error');
      return null;
    }
    return poems;
  },

  async drawPoem() {
    const poems = this.getPoetryPool();
    if (!poems) return;
    const selected = poems[Math.floor(Math.random() * poems.length)];
    this.state.poetryCurrentPoem = selected;

    await this.playPoetryScrollAnimation(poems, () => {
      this.renderPoetryResult(selected, null);
    });
  },

  async drawPoemAndStudent() {
    const poems = this.getPoetryPool();
    if (!poems) return;

    const classId = parseInt(document.getElementById('poetryClassSelect').value);
    if (!classId) {
      this.toast('请先选择班级', 'error');
      return;
    }
    const students = await DB.getStudentsByClass(classId);
    if (students.length === 0) {
      this.toast('该班级暂无学生', 'error');
      return;
    }

    const selectedPoem = poems[Math.floor(Math.random() * poems.length)];
    const selectedStudent = students[Math.floor(Math.random() * students.length)];
    this.state.poetryCurrentPoem = selectedPoem;

    await this.playPoetryScrollAnimation(poems, () => {
      this.renderPoetryResult(selectedPoem, selectedStudent);
    });
  },

  async drawStudentForPoetry() {
    const poems = this.getPoetryPool();
    if (!poems) return;

    const classId = parseInt(document.getElementById('poetryClassSelect').value);
    if (!classId) {
      this.toast('请先选择班级', 'error');
      return;
    }
    const students = await DB.getStudentsByClass(classId);
    if (students.length === 0) {
      this.toast('该班级暂无学生', 'error');
      return;
    }

    // 先抽学生
    const selectedStudent = students[Math.floor(Math.random() * students.length)];
    const selectedPoem = poems[Math.floor(Math.random() * poems.length)];
    this.state.poetryCurrentPoem = selectedPoem;

    await this.playPoetryScrollAnimation(poems, () => {
      this.renderPoetryResult(selectedPoem, selectedStudent);
    });
  },

  renderPoetryResult(poem, student) {
    const area = document.getElementById('poetryDrawArea');
    let html = '<div class="draw-result poetry-result">';

    if (student) {
      html += `<div class="poetry-student-prompt">请 <span class="poetry-student-name">${student.name}</span> 同学背诵</div>`;
    }

    html += `
      <div class="poetry-title">《${this.escapeHTML(poem.title)}》</div>
      <div class="poetry-meta">
        <span class="poetry-dynasty">${this.escapeHTML(poem.dynasty)}</span>
        <span class="poetry-author">· ${this.escapeHTML(poem.author)}</span>
      </div>
      <div class="poetry-content-hidden" id="poetryContentHidden">
        <div class="poetry-hint">${Icons.eyeOff(18)} 全文隐藏中，教师可点击"显示全文"对照检查</div>
      </div>
      <div class="poetry-content-full" id="poetryContentFull" style="display:none;">
      </div>
    `;

    html += '</div>';

    area.innerHTML = html;

    // 用 textContent 安全设置诗词全文，保留 \n 换行
    const fullEl = document.getElementById('poetryContentFull');
    if (fullEl) fullEl.textContent = poem.content;

    document.getElementById('btnShowPoem').style.display = '';
    document.getElementById('btnShowPoem').textContent = '显示全文';
    document.getElementById('btnNextPoem').style.display = 'none';
    document.getElementById('btnPoetryRecord').style.display = student ? '' : 'none';

    // 存储当前学生信息用于记录
    this.state.poetryCurrentStudent = student;
  },

  togglePoemFullText() {
    const hidden = document.getElementById('poetryContentHidden');
    const full = document.getElementById('poetryContentFull');
    if (!hidden || !full) return;
    const isShowing = full.style.display !== 'none';
    if (isShowing) {
      hidden.style.display = '';
      full.style.display = 'none';
      document.getElementById('btnShowPoem').textContent = '显示全文';
    } else {
      hidden.style.display = 'none';
      full.style.display = '';
      document.getElementById('btnShowPoem').textContent = '隐藏全文';
    }
    document.getElementById('btnNextPoem').style.display = '';
  },

  async playPoetryScrollAnimation(pool, callback) {
    const area = document.getElementById('poetryDrawArea');
    area.innerHTML = `<div class="scrolling"><span class="scrolling-name">《${pool[0].title}》</span></div>`;
    const nameEl = area.querySelector('.scrolling-name');

    return new Promise(resolve => {
      let elapsed = 0;
      let interval = 60;

      const tick = () => {
        const idx = Math.floor(Math.random() * pool.length);
        nameEl.textContent = `《${pool[idx].title}》`;
        elapsed += interval;
        if (elapsed > 1200) interval = 100;
        if (elapsed > 1600) interval = 160;
        if (elapsed > 2000) {
          callback();
          resolve();
          return;
        }
        setTimeout(tick, interval);
      };
      tick();
    });
  },

  openPoetryRecord() {
    const poem = this.state.poetryCurrentPoem;
    const student = this.state.poetryCurrentStudent;
    if (!poem) return;

    // 在结果区域内插入评价按钮组（不使用 prompt，兼容 Electron）
    const area = document.getElementById('poetryDrawArea');
    // 移除旧的评价区
    const oldEval = area.querySelector('.poetry-eval');
    if (oldEval) oldEval.remove();

    const evalDiv = document.createElement('div');
    evalDiv.className = 'poetry-eval';
    evalDiv.innerHTML = `
      <div class="poetry-eval-label">评价背诵：</div>
      <div class="poetry-eval-buttons">
        <button class="poetry-eval-btn rating-excellent">${Icons.plus(16)} 优秀</button>
        <button class="poetry-eval-btn rating-good">良好</button>
        <button class="poetry-eval-btn rating-effort">需努力</button>
        <button class="poetry-eval-btn poetry-eval-cancel">取消</button>
      </div>
    `;
    area.appendChild(evalDiv);

    // 滚动到评价区
    evalDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const saveRecord = async (rating) => {
      const record = {
        type: 'poetry',
        poemTitle: poem.title,
        poemAuthor: poem.author,
        studentName: student ? student.name : '',
        studentNo: student ? student.studentNo : '',
        rating: rating,
        date: new Date().toLocaleDateString('zh-CN'),
        timestamp: new Date().toISOString(),
      };
      await DB.add('drawRecords', record);
      this.state.poetryRecords.push(record);
      this.renderPoetryRecords();
      evalDiv.remove();
      this.toast(`已记录：${student ? student.name + ' ' : ''}《${poem.title}》 ${rating}`, 'success');
    };

    evalDiv.querySelector('.rating-excellent').addEventListener('click', () => saveRecord('优秀'));
    evalDiv.querySelector('.rating-good').addEventListener('click', () => saveRecord('良好'));
    evalDiv.querySelector('.rating-effort').addEventListener('click', () => saveRecord('需努力'));
    evalDiv.querySelector('.poetry-eval-cancel').addEventListener('click', () => evalDiv.remove());
  },

  async renderPoetryRecords() {
    const container = document.getElementById('poetryRecordsContainer');
    if (this.state.poetryRecords.length === 0) {
      // 从数据库加载今日记录
      const allRecords = await DB.getAll('drawRecords');
      const today = new Date().toLocaleDateString('zh-CN');
      this.state.poetryRecords = allRecords.filter(r => r.type === 'poetry' && r.date === today);
    }

    if (this.state.poetryRecords.length === 0) {
      container.innerHTML = '<p class="history-empty">暂无背诵记录</p>';
      return;
    }

    container.innerHTML = this.state.poetryRecords.map((r, i) => {
      const ratingClass = r.rating.includes('优') ? 'rating-excellent' :
        r.rating.includes('需') ? 'rating-needs-work' : 'rating-good';
      return `
        <div class="poetry-record-item">
          <span class="record-num">${i + 1}</span>
          <span class="record-student">${r.studentName || '—'}</span>
          <span class="record-poem">《${this.escapeHTML(r.poemTitle)}》</span>
          <span class="record-author">${this.escapeHTML(r.poemAuthor)}</span>
          <span class="record-rating ${ratingClass}">${this.escapeHTML(r.rating)}</span>
        </div>
      `;
    }).join('');
  },

  // ========== 答题计时器模块 ==========
  bindTimerModule() {
    // 预设按钮
    document.querySelectorAll('.timer-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.timer-preset-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.state.timer.duration = parseInt(btn.dataset.seconds);
        this.stopTimer();
        if (this.state.timer.duration > 0) {
          this.showTimerBar();
          this.resetTimer();
        } else {
          this.hideTimerBar();
        }
      });
    });

    // 暂停/继续
    document.getElementById('btnTimerPause').addEventListener('click', () => {
      if (this.state.timer.running && !this.state.timer.paused) {
        this.pauseTimer();
      } else if (this.state.timer.paused) {
        this.resumeTimer();
      }
    });

    // 重置
    document.getElementById('btnTimerReset').addEventListener('click', () => {
      this.resetTimer();
    });
  },

  showTimerBar() {
    document.getElementById('timerBar').style.display = '';
  },

  hideTimerBar() {
    document.getElementById('timerBar').style.display = 'none';
  },

  resetTimer() {
    this.stopTimer();
    this.state.timer.remaining = this.state.timer.duration;
    this.updateTimerDisplay();
  },

  startTimer() {
    this.stopTimer();
    if (this.state.timer.duration === 0) return;
    this.state.timer.remaining = this.state.timer.duration;
    this.state.timer.running = true;
    this.state.timer.paused = false;
    this.updateTimerDisplay();
    document.getElementById('btnTimerPause').textContent = '暂停';

    this.state.timer.intervalId = setInterval(() => {
      if (this.state.timer.paused) return;
      this.state.timer.remaining--;
      this.updateTimerDisplay();
      if (this.state.timer.remaining <= 0) {
        this.stopTimer();
        this.onTimerEnd();
      }
    }, 1000);
  },

  pauseTimer() {
    this.state.timer.paused = true;
    document.getElementById('btnTimerPause').textContent = '继续';
  },

  resumeTimer() {
    this.state.timer.paused = false;
    document.getElementById('btnTimerPause').textContent = '暂停';
  },

  stopTimer() {
    this.state.timer.running = false;
    this.state.timer.paused = false;
    if (this.state.timer.intervalId) {
      clearInterval(this.state.timer.intervalId);
      this.state.timer.intervalId = null;
    }
  },

  updateTimerDisplay() {
    const remaining = this.state.timer.remaining;
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('timerDisplay').textContent = display;

    // 进度环
    const ring = document.getElementById('timerRingFg');
    const circumference = 2 * Math.PI * 24;
    const progress = this.state.timer.duration > 0 ? remaining / this.state.timer.duration : 0;
    const offset = circumference * (1 - progress);
    ring.style.strokeDashoffset = offset;

    // 颜色变化
    const timerDisplay = document.getElementById('timerDisplay');
    ring.classList.remove('warning', 'danger');
    timerDisplay.classList.remove('warning', 'danger');

    if (this.state.timer.duration > 0 && remaining <= 5 && remaining > 0) {
      ring.classList.add('danger');
      timerDisplay.classList.add('danger');
    } else if (this.state.timer.duration > 0 && remaining <= 10 && remaining > 5) {
      ring.classList.add('warning');
      timerDisplay.classList.add('warning');
    }
  },

  onTimerEnd() {
    // 超时闪烁
    const drawArea = document.getElementById('questionDrawArea');
    drawArea.classList.add('timer-timeout-flash');
    setTimeout(() => drawArea.classList.remove('timer-timeout-flash'), 1000);
    this.toast('时间到！', 'error');
    document.getElementById('btnTimerPause').textContent = '暂停';
  },

  // ========== AI 出题模块 ==========
  bindAIModule() {
    // 设置按钮
    document.getElementById('btnAISettings').addEventListener('click', () => {
      this.openModal('modalAISettings');
    });

    // 提供商切换时更新模型默认值
    document.getElementById('aiProvider').addEventListener('change', (e) => {
      const provider = e.target.value;
      const modelInput = document.getElementById('aiModel');
      const urlGroup = document.getElementById('aiCustomUrlGroup');
      const defaults = {
        qianwen: 'qwen-turbo',
        wenxin: 'ernie-bot-turbo',
        deepseek: 'deepseek-chat',
        custom: '',
      };
      if (modelInput.value === '' || Object.values(defaults).includes(modelInput.value)) {
        modelInput.value = defaults[provider] || '';
        modelInput.placeholder = defaults[provider] || '输入模型名称';
      }
      urlGroup.style.display = provider === 'custom' ? '' : 'none';
    });

    // 保存设置
    document.getElementById('btnSaveAISettings').addEventListener('click', () => this.saveAISettings());

    // 恢复默认提示词
    document.getElementById('btnResetPrompt').addEventListener('click', () => {
      document.getElementById('aiSystemPrompt').value = this.defaultSystemPrompt;
      document.getElementById('aiPromptTemplate').value = this.defaultPromptTemplate;
      this.toast('已恢复默认提示词', 'success');
    });

    // 生成题目
    document.getElementById('btnGenerateQuestions').addEventListener('click', () => this.generateQuestions());

    // 全部采纳
    document.getElementById('btnAdoptAll').addEventListener('click', () => this.adoptAllQuestions());

    // 保存已采纳题目
    document.getElementById('btnSaveAdopted').addEventListener('click', () => this.saveAdoptedQuestions());
  },

  loadAISettings() {
    const saved = localStorage.getItem('aiSettings');
    if (saved) {
      this.state.aiSettings = JSON.parse(saved);
      document.getElementById('aiProvider').value = this.state.aiSettings.provider;
      document.getElementById('aiApiKey').value = this.state.aiSettings.apiKey;
      document.getElementById('aiModel').value = this.state.aiSettings.model;
      if (this.state.aiSettings.customUrl) {
        document.getElementById('aiCustomUrl').value = this.state.aiSettings.customUrl;
      }
      if (this.state.aiSettings.proxyUrl) {
        document.getElementById('aiProxyUrl').value = this.state.aiSettings.proxyUrl;
      }
      if (this.state.aiSettings.provider === 'custom') {
        document.getElementById('aiCustomUrlGroup').style.display = '';
      }
      this.updateAIStatus(true);
    }
    // 加载提示词
    const sysPrompt = localStorage.getItem('ai_system_prompt');
    document.getElementById('aiSystemPrompt').value = sysPrompt || this.defaultSystemPrompt;
    const tmpl = localStorage.getItem('ai_prompt_template');
    document.getElementById('aiPromptTemplate').value = tmpl || this.defaultPromptTemplate;
  },

  saveAISettings() {
    const provider = document.getElementById('aiProvider').value;
    const apiKey = document.getElementById('aiApiKey').value.trim();
    const model = document.getElementById('aiModel').value.trim();
    const customUrl = document.getElementById('aiCustomUrl').value.trim();
    const proxyUrl = document.getElementById('aiProxyUrl').value.trim();

    if (!apiKey) {
      this.toast('请输入 API Key', 'error');
      return;
    }

    this.state.aiSettings = { provider, apiKey, model, customUrl, proxyUrl };
    localStorage.setItem('aiSettings', JSON.stringify(this.state.aiSettings));

    // 保存提示词
    const sysPrompt = document.getElementById('aiSystemPrompt').value.trim();
    const tmpl = document.getElementById('aiPromptTemplate').value.trim();
    if (sysPrompt) localStorage.setItem('ai_system_prompt', sysPrompt);
    if (tmpl) localStorage.setItem('ai_prompt_template', tmpl);

    this.closeModal('modalAISettings');
    this.updateAIStatus(true);
    this.toast('AI 设置已保存', 'success');
  },

  updateAIStatus(configured) {
    const el = document.getElementById('aiStatus');
    if (configured) {
      const providerNames = { qianwen: '通义千问', wenxin: '文心一言', deepseek: 'DeepSeek', custom: '自定义' };
      const name = providerNames[this.state.aiSettings.provider] || '自定义';
      el.textContent = `已配置：${name}`;
      el.classList.add('ai-status-active');
    } else {
      el.textContent = '未配置';
      el.classList.remove('ai-status-active');
    }
  },

  async loadAITargetBanks() {
    const banks = await DB.getQuestionBanks();
    const select = document.getElementById('aiTargetBank');
    select.innerHTML = '<option value="">保存到新题库</option>' +
      banks.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
  },

  buildPrompt(bookTitle, author, grade, count, extraPrompt) {
    const gradeText = grade ? `${grade}年级` : '小学';
    // 获取用户自定义提示词，如无则使用内置默认
    let template = this.getDefaultPromptTemplate();

    // 替换占位符
    template = template
      .replace(/\{书名\}/g, bookTitle)
      .replace(/\{作者\}/g, author || '不详')
      .replace(/\{年级\}/g, gradeText)
      .replace(/\{题数\}/g, count);

    if (extraPrompt) {
      template += `\n\n补充要求：${extraPrompt}`;
    }
    return template;
  },

  getDefaultPromptTemplate() {
    // 从 localStorage 读取用户自定义提示词
    const saved = localStorage.getItem('ai_prompt_template');
    if (saved) return saved;
    return this.defaultPromptTemplate;
  },

  defaultSystemPrompt:
`你是一位资深的小学语文教师，拥有丰富的整本书阅读教学经验，擅长根据不同年级学生的认知水平设计层次分明、启发性强的问答题。你出题时注重覆盖全书核心情节、人物形象和主题思想，题目语言简洁、难度适宜，答案准确且逻辑清晰。请严格按照用户要求的格式输出，不输出任何多余内容。`,

  defaultPromptTemplate:
`请根据书籍《{书名}》（作者：{作者}）生成{题数}道适合{年级}学生的整本书阅读问答题。

【出题要求】
一、题目层次（参考布鲁姆认知分类）：
  · 事实记忆层（约30%）：考查对书中具体情节、人物、时间、地点的识记，如"夏洛在网上织了哪些字？"
  · 理解分析层（约40%）：考查对人物性格、因果关系、情节发展的理解与分析，如"威尔伯为什么害怕被杀掉？"
  · 评价创造层（约30%）：考查对人物行为的评价、主题的思考及个人见解的表达，如"你认为夏洛为威尔伯牺牲值得吗？为什么？"

二、覆盖范围：
  · 题目应覆盖全书主要情节（开头、发展、高潮、结局），不要集中在某一章节
  · 涵盖主要人物和关键事件，避免重复或过于琐碎的细节

三、难度与语言：
  · 语言适合{年级}学生的阅读和理解水平，避免成人化表达
  · 问题表述清晰、指向明确，让学生知道要回答什么

四、答案要求：
  · 答案须准确反映书中内容，不得编造情节
  · 答案简洁明了，字数控制在100字以内
  · 评价创造类题目的答案给出要点提示，而非唯一标准答案

五、输出格式（严格遵守）：
每道题按以下格式输出，不输出序号编号、不输出其他任何内容：

## 题目：xxxxx
答案：xxxxx

请现在生成{题数}道题目。`,

  getApiEndpoint() {
    const s = this.state.aiSettings;
    const endpoints = {
      qianwen: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      wenxin: 'https://qianfan.baidubce.com/v2/chat/completions',
      deepseek: 'https://api.deepseek.com/chat/completions',
      custom: s.customUrl,
    };
    return endpoints[s.provider] || s.customUrl;
  },

  async callAI(prompt) {
    const s = this.state.aiSettings;
    const apiUrl = this.getApiEndpoint();
    const model = s.model || 'qwen-turbo';

    // 如果配置了 CORS 代理，通过代理转发请求
    const fetchUrl = s.proxyUrl
      ? s.proxyUrl + encodeURIComponent(apiUrl)
      : apiUrl;

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${s.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: localStorage.getItem('ai_system_prompt') || this.defaultSystemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI 接口返回错误 (${response.status})：${errText.slice(0, 200)}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    if (!content) {
      throw new Error('AI 返回内容为空');
    }
    return content;
  },

  async generateQuestions() {
    const bookTitle = document.getElementById('aiBookTitle').value.trim();
    if (!bookTitle) {
      this.toast('请输入书名', 'error');
      return;
    }
    if (!this.state.aiSettings || !this.state.aiSettings.apiKey) {
      this.toast('请先配置 AI 接口设置', 'error');
      this.openModal('modalAISettings');
      return;
    }

    const author = document.getElementById('aiBookAuthor').value.trim();
    const grade = document.getElementById('aiGrade').value;
    const count = document.getElementById('aiQuestionCount').value;
    const extraPrompt = document.getElementById('aiExtraPrompt').value.trim();

    // 显示加载
    document.getElementById('aiGenResults').style.display = 'none';
    document.getElementById('aiGenLoading').style.display = '';
    document.getElementById('btnGenerateQuestions').disabled = true;

    try {
      const prompt = this.buildPrompt(bookTitle, author, grade, count, extraPrompt);
      const aiResponse = await this.callAI(prompt);

      const questions = Parsers.parseMD(aiResponse);
      if (questions.length === 0) {
        this.toast('AI 生成的格式无法解析，请重试或检查接口配置', 'error');
        return;
      }

      this.state.aiGeneratedQuestions = questions.map((q, i) => ({
        ...q,
        index: i,
        adopted: true,
        source: 'AI生成',
        bookTitle,
      }));

      this.renderAIGeneratedList();
      this.toast(`AI 成功生成 ${questions.length} 道题目`, 'success');
    } catch (err) {
      this.toast('AI 生成失败: ' + err.message, 'error');
    } finally {
      document.getElementById('aiGenLoading').style.display = 'none';
      document.getElementById('btnGenerateQuestions').disabled = false;
    }
  },

  renderAIGeneratedList() {
    const container = document.getElementById('aiQuestionList');
    const resultsDiv = document.getElementById('aiGenResults');
    resultsDiv.style.display = '';

    const difficultyMap = { easy: '简单', medium: '中等', hard: '困难' };

    container.innerHTML = this.state.aiGeneratedQuestions.map((q, i) => `
      <div class="ai-question-card ${q.adopted ? '' : 'not-adopted'}" data-ai-idx="${i}">
        <div class="ai-question-header">
          <span class="ai-question-num">${i + 1}</span>
          <span class="ai-question-badge ${q.adopted ? 'badge-adopted' : 'badge-skipped'}">
            ${q.adopted ? '已采纳' : '已跳过'}
          </span>
          <div class="ai-question-actions">
            <button class="btn-icon edit" data-ai-edit="${i}" title="编辑">${Icons.edit(16)}</button>
            <button class="btn-icon toggle" data-ai-toggle="${i}" title="切换采纳">
              ${q.adopted ? Icons.eye(16) : Icons.plus(16)}
            </button>
          </div>
        </div>
        <div class="ai-question-text" data-ai-q-text="${i}">${this.escapeHTML(q.question)}</div>
        <div class="ai-question-answer" data-ai-a-text="${i}">${this.escapeHTML(q.answer || '（无答案）')}</div>
      </div>
    `).join('');

    // 绑定编辑
    container.querySelectorAll('[data-ai-edit]').forEach(btn => {
      btn.addEventListener('click', () => this.editAIQuestion(parseInt(btn.dataset.aiEdit)));
    });

    // 绑定切换采纳
    container.querySelectorAll('[data-ai-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.aiToggle);
        this.state.aiGeneratedQuestions[idx].adopted = !this.state.aiGeneratedQuestions[idx].adopted;
        this.renderAIGeneratedList();
        this.updateSaveButton();
      });
    });

    this.updateSaveButton();
  },

  editAIQuestion(idx) {
    const q = this.state.aiGeneratedQuestions[idx];
    const qEl = document.querySelector(`[data-ai-q-text="${idx}"]`);
    const aEl = document.querySelector(`[data-ai-a-text="${idx}"]`);

    if (qEl.contentEditable === 'true') {
      qEl.contentEditable = 'false';
      aEl.contentEditable = 'false';
      q.question = qEl.textContent.trim();
      q.answer = aEl.textContent.trim();
      qEl.classList.remove('editing');
      aEl.classList.remove('editing');
      this.toast('题目已更新', 'success');
    } else {
      qEl.contentEditable = 'true';
      aEl.contentEditable = 'true';
      qEl.classList.add('editing');
      aEl.classList.add('editing');
      qEl.focus();
    }
  },

  adoptAllQuestions() {
    this.state.aiGeneratedQuestions.forEach(q => q.adopted = true);
    this.renderAIGeneratedList();
    this.toast('已全部采纳', 'success');
  },

  updateSaveButton() {
    const adopted = this.state.aiGeneratedQuestions.filter(q => q.adopted);
    const btn = document.getElementById('btnSaveAdopted');
    btn.disabled = adopted.length === 0;
    btn.textContent = `保存 ${adopted.length} 道采纳题目`;
  },

  async saveAdoptedQuestions() {
    const adopted = this.state.aiGeneratedQuestions.filter(q => q.adopted);
    if (adopted.length === 0) return;

    const targetBankId = document.getElementById('aiTargetBank').value;
    let bankId;

    if (targetBankId) {
      bankId = parseInt(targetBankId);
    } else {
      const bookTitle = adopted[0].bookTitle || '新题库';
      const result = await DB.add('questionBanks', {
        name: `${bookTitle} - AI出题`,
        createdAt: new Date().toISOString(),
      });
      bankId = result;
    }

    const items = adopted.map(q => ({
      bankId,
      question: q.question,
      answer: q.answer || '',
      difficulty: 'medium',
      source: 'AI生成',
      createdAt: new Date().toISOString(),
    }));

    const count = await DB.bulkAdd('questions', items);
    await this.loadBankSelects();

    document.getElementById('aiGenResults').style.display = 'none';
    document.getElementById('aiBookTitle').value = '';
    document.getElementById('aiBookAuthor').value = '';
    document.getElementById('aiExtraPrompt').value = '';

    this.state.aiGeneratedQuestions = [];
    this.toast(`成功保存 ${count} 道题目到题库`, 'success');

    // 切换到题库管理页
    setTimeout(() => {
      this.switchView('question-bank');
      document.getElementById('bankSelect').value = bankId;
      this.state.currentBankId = bankId;
      this.renderQuestionList(bankId);
      this.toggleBankButtons(bankId);
    }, 800);
  },

  // ========== 工具 ==========
  escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.replace(/\n/g, '<br>');
  },

  highlightKeywords(text) {
    if (!text) return '';
    // 先转义 HTML
    const escaped = this.escapeHTML(text);

    // 定义关键词列表（常见题型关键词 + 疑问词 + 分析动词）
    const keywords = [
      '为什么', '什么', '怎样', '怎么样', '如何', '哪些', '哪', '谁是',
      '是什么', '是什么原因', '请说明', '请分析', '请比较', '请解释',
      '比较', '分析', '解释', '说明', '概括', '总结', '归纳',
      '不同之处', '相同之处', '区别', '联系', '关系',
      '主要', '最重要', '核心', '关键', '根本',
      '体现了', '说明了', '表达了', '反映了',
      '原因', '结果', '影响', '作用', '意义', '目的',
      '特点', '特征', '性质', '表现',
    ];

    // 按长度降序排列，优先匹配长词
    keywords.sort((a, b) => b.length - a.length);

    let result = escaped;
    for (const kw of keywords) {
      // 用正则替换，避免重复替换已高亮的内容
      const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      result = result.replace(regex, `<span class="question-keyword">${kw}</span>`);
    }
    return result;
  },
};

// 启动
window.addEventListener('DOMContentLoaded', () => App.init());
