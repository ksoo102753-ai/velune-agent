// ── STATE ──
let selectedTool = 'midjourney';
let selectedScene = 'product';
let currentSection = 'identity';
const dirtyMap = {};
let tones = ['Minimal','Botanical','Sensory','Cooling','Soft Luxury'];
let colors = [
  {hex:'#1A4FBF', name:'Cobalt Blue'},
  {hex:'#C8960A', name:'Botanical Yellow'},
  {hex:'#F7F4EE', name:'Mist Ivory'},
  {hex:'#9E9E9E', name:'Mineral Gray'},
  {hex:'#EAF4FB', name:'Watery White'},
];

// ── TABS ──
function switchTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pane-' + tab).classList.add('active');
  if (tab === 'history') renderHistory();
}

// ── SECTION ──
const sectionIds = ['identity','tone','ingredients','colors','visual','avoid'];
function switchSection(sec) {
  currentSection = sec;
  document.querySelectorAll('.guide-nav-item').forEach((n,i) => {
    n.classList.toggle('active', sectionIds[i] === sec);
  });
  document.querySelectorAll('.guide-editor').forEach(e => e.classList.remove('active'));
  document.getElementById('editor-' + sec).classList.add('active');
}

function markDirty(sec, idx) {
  dirtyMap[sec] = true;
  const navItems = document.querySelectorAll('.guide-nav-item');
  if (navItems[idx]) navItems[idx].classList.add('dirty');
}

// ── TONE TAGS ──
function initTags() {
  const wrap = document.getElementById('toneTagWrap');
  wrap.innerHTML = '';
  tones.forEach((t, i) => {
    const el = document.createElement('span');
    el.className = 'tag';
    el.innerHTML = `${t}<button onclick="removeTag(${i})" aria-label="삭제">×</button>`;
    wrap.appendChild(el);
  });
  const inp = document.createElement('input');
  inp.className = 'tag-input-inline';
  inp.placeholder = '+ 추가';
  inp.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ',') && inp.value.trim()) {
      tones.push(inp.value.trim());
      markDirty('tone', 1);
      initTags();
    }
  });
  wrap.appendChild(inp);
}

function removeTag(i) { tones.splice(i, 1); markDirty('tone', 1); initTags(); }

// ── COLORS ──
function renderColors() {
  const list = document.getElementById('colorList');
  list.innerHTML = '';
  colors.forEach((c, i) => {
    const row = document.createElement('div');
    row.className = 'color-row-item';
    row.innerHTML = `
      <input type="color" class="color-picker-input" value="${c.hex}" oninput="colors[${i}].hex=this.value;markDirty('colors',3)">
      <input class="g-input color-name-input" value="${c.name}" oninput="colors[${i}].name=this.value;markDirty('colors',3)">
      <button class="del-btn" onclick="removeColor(${i})" aria-label="삭제">×</button>`;
    list.appendChild(row);
  });
}

function addColor() { colors.push({hex:'#AAAAAA', name:'New Color'}); markDirty('colors',3); renderColors(); }

function removeColor(i) { colors.splice(i,1); markDirty('colors',3); renderColors(); }

// ── SAVE / RESET ──
function saveGuide() {
  const data = {
    name: document.getElementById('g-name').value,
    subtitle: document.getElementById('g-subtitle').value,
    philosophy: document.getElementById('g-philosophy').value,
    target: document.getElementById('g-target').value,
    slogan: document.getElementById('g-slogan').value,
    emotion: document.getElementById('g-emotion').value,
    ing1name: document.getElementById('g-ing1name').value,
    ing1desc: document.getElementById('g-ing1desc').value,
    ing2name: document.getElementById('g-ing2name').value,
    ing2desc: document.getElementById('g-ing2desc').value,
    viskeys: document.getElementById('g-viskeys').value,
    camera: document.getElementById('g-camera').value,
    ref: document.getElementById('g-ref').value,
    avoid: document.getElementById('g-avoid').value,
    aim: document.getElementById('g-aim').value,
    tones, colors
  };
  localStorage.setItem('velune_brand_guide', JSON.stringify(data));
  Object.keys(dirtyMap).forEach(k => delete dirtyMap[k]);
  document.querySelectorAll('.guide-nav-item').forEach(n => n.classList.remove('dirty'));
  const toast = document.getElementById('saveToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function resetGuide() {
  if (!confirm('브랜드 가이드를 초기값으로 되돌릴까요?')) return;
  localStorage.removeItem('velune_brand_guide');
  location.reload();
}

function loadGuide() {
  const raw = localStorage.getItem('velune_brand_guide');
  if (!raw) return;
  try {
    const d = JSON.parse(raw);
    if (d.name) document.getElementById('g-name').value = d.name;
    if (d.subtitle) document.getElementById('g-subtitle').value = d.subtitle;
    if (d.philosophy) document.getElementById('g-philosophy').value = d.philosophy;
    if (d.target) document.getElementById('g-target').value = d.target;
    if (d.slogan) document.getElementById('g-slogan').value = d.slogan;
    if (d.emotion) document.getElementById('g-emotion').value = d.emotion;
    if (d.ing1name) document.getElementById('g-ing1name').value = d.ing1name;
    if (d.ing1desc) document.getElementById('g-ing1desc').value = d.ing1desc;
    if (d.ing2name) document.getElementById('g-ing2name').value = d.ing2name;
    if (d.ing2desc) document.getElementById('g-ing2desc').value = d.ing2desc;
    if (d.viskeys) document.getElementById('g-viskeys').value = d.viskeys;
    if (d.camera) document.getElementById('g-camera').value = d.camera;
    if (d.ref) document.getElementById('g-ref').value = d.ref;
    if (d.avoid) document.getElementById('g-avoid').value = d.avoid;
    if (d.aim) document.getElementById('g-aim').value = d.aim;
    if (d.tones) tones = d.tones;
    if (d.colors) colors = d.colors;
  } catch(e) {}
}

// ── HISTORY ──
let historySelected = new Set();
let histFilter = 'all';

function saveToHistory(tool, scene, note, prompts) {
  const history = JSON.parse(localStorage.getItem('velune_history') || '[]');
  history.unshift({
    id: Date.now(),
    tool, scene, note,
    prompts,
    date: new Date().toLocaleDateString('ko-KR', {month:'2-digit', day:'2-digit'})
  });
  if (history.length > 200) history.splice(200);
  localStorage.setItem('velune_history', JSON.stringify(history));
}

function loadHistory() {
  return JSON.parse(localStorage.getItem('velune_history') || '[]');
}

function renderHistory() {
  const history = loadHistory();
  const list = document.getElementById('histList');
  const filtered = histFilter === 'all' ? history : history.filter(h => h.scene === histFilter);

  if (filtered.length === 0) {
    list.innerHTML = `<div class="hist-empty">${histFilter === 'all' ? '아직 생성된 프롬프트가 없어요.' : '이 카테고리에 저장된 프롬프트가 없어요.'}</div>`;
    updateSelCount();
    return;
  }

  list.innerHTML = filtered.map(item => {
    const checked = historySelected.has(item.id);
    const preview = item.prompts[0]?.text?.slice(0, 90) + (item.prompts[0]?.text?.length > 90 ? '…' : '') || '';
    return `
    <div class="hist-item${checked ? ' selected' : ''}" onclick="handleHistClick(event,${item.id})">
      <div class="hist-check-visual${checked ? ' checked' : ''}"></div>
      <div class="hist-body">
        <div class="hist-meta">
          <span class="hist-tag scene-tag">${sceneLabels[item.scene]}</span>
          <span class="hist-tag tool-tag">${toolLabels[item.tool]}</span>
          <span class="hist-date">${item.date}</span>
        </div>
        <div class="hist-preview">${esc(preview)}</div>
        ${item.note ? `<div class="hist-note">"${esc(item.note)}"</div>` : ''}
      </div>
      <button class="hist-del" onclick="event.stopPropagation();deleteHistItem(${item.id})" aria-label="삭제">×</button>
    </div>`;
  }).join('');

  updateSelCount();
}

function handleHistClick(event, id) {
  if (historySelected.has(id)) historySelected.delete(id);
  else historySelected.add(id);
  renderHistory();
}

function updateSelCount() {
  const count = historySelected.size;
  document.getElementById('selCount').textContent = `${count}개 선택됨`;
  document.getElementById('recombineBar').classList.toggle('visible', count >= 2);
}

function clearHistSelection() {
  historySelected.clear();
  renderHistory();
}

function deleteHistItem(id) {
  if (!confirm('이 프롬프트를 히스토리에서 삭제할까요?')) return;
  const history = loadHistory().filter(h => h.id !== id);
  localStorage.setItem('velune_history', JSON.stringify(history));
  historySelected.delete(id);
  renderHistory();
}

function copySelected() {
  const history = loadHistory();
  const selected = history.filter(h => historySelected.has(h.id));
  if (selected.length === 0) return;
  const text = selected.map(h => h.prompts.map(p => p.text).join('\n')).join('\n\n---\n\n');
  navigator.clipboard.writeText(text);
  const btn = document.getElementById('recombineBtn');
  btn.textContent = '✓ 복사됨';
  setTimeout(() => { btn.textContent = '복사'; }, 1500);
}

// ── ADD PROMPT ──
const toolLabels = {midjourney:'Midjourney', weave:'Weave', c4d:'Cinema 4D', all:'전체 세트'};
const sceneLabels = {product:'제품 샷', texture:'제형 텍스처', model:'모델 클로즈샷', botanical:'보태니컬', atmosphere:'분위기 컷', opening:'오프닝/엔딩'};

function addPrompt() {
  const text = document.getElementById('promptInput').value.trim();
  if (!text) {
    document.getElementById('promptInput').focus();
    return;
  }
  const note = document.getElementById('userNote').value.trim();
  saveToHistory(selectedTool, selectedScene, note, [{tag: toolLabels[selectedTool], text}]);
  document.getElementById('promptInput').value = '';
  document.getElementById('userNote').value = '';
  const toast = document.getElementById('addToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── TOOL & SCENE GRID ──
document.getElementById('toolGrid').addEventListener('click', e => {
  const b = e.target.closest('.tool-btn'); if (!b) return;
  selectedTool = b.dataset.tool;
  document.querySelectorAll('.tool-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
});

document.getElementById('sceneGrid').addEventListener('click', e => {
  const b = e.target.closest('.scene-btn'); if (!b) return;
  selectedScene = b.dataset.scene;
  document.querySelectorAll('.scene-btn').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
});

// ── HIST FILTER ──
document.getElementById('histFilter').addEventListener('click', e => {
  const b = e.target.closest('.hist-cat'); if (!b) return;
  histFilter = b.dataset.cat;
  document.querySelectorAll('.hist-cat').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  renderHistory();
});

// ── INIT ──
loadGuide();
initTags();
renderColors();
