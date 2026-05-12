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

// ── API KEY ──
function toggleApiPanel() {
  const p = document.getElementById('apiPanel');
  p.classList.toggle('open');
}

function saveApiKey() {
  const val = document.getElementById('apiKeyInput').value.trim();
  if (!val) return;
  localStorage.setItem('velune_api_key', val);
  updateApiStatus();
  document.getElementById('apiPanel').classList.remove('open');
}

function updateApiStatus() {
  const key = localStorage.getItem('velune_api_key');
  const dot = document.getElementById('apiDot');
  const label = document.getElementById('apiPillLabel');
  if (key && key.startsWith('sk-')) {
    dot.classList.add('ok');
    label.textContent = 'API 연결됨';
    document.getElementById('apiKeyInput').value = key;
  } else {
    dot.classList.remove('ok');
    label.textContent = 'API 키 설정';
  }
}

// ── TABS ──
function switchTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pane').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pane-' + tab).classList.add('active');
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

// ── BUILD SYSTEM PROMPT ──
function buildSystem() {
  const g = {
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
  };
  const colorStr = colors.map(c => `${c.name} (${c.hex})`).join(', ');
  const toneStr = tones.join(' / ');
  return `You are a professional creative director and prompt engineer for ${g.name}, a ${g.subtitle} brand.

BRAND: ${g.name} — ${g.subtitle}
SLOGAN: "${g.slogan}"
TONE: ${toneStr}
PHILOSOPHY: ${g.philosophy}
TARGET: ${g.target}
COLORS: ${colorStr}
INGREDIENTS: ${g.ing1name}: ${g.ing1desc} | ${g.ing2name}: ${g.ing2desc}
VISUAL KEYWORDS: ${g.viskeys}
CAMERA: ${g.camera}
REFERENCES: ${g.ref}
EMOTIONAL DIRECTION: ${g.emotion}
AVOID: ${g.avoid}
AIM FOR: ${g.aim}

OUTPUT FORMAT — JSON only, no markdown, no preamble:
{"prompts":[{"tag":"label","text":"prompt"},...]}

Generate 2-3 prompts for the requested tool and scene.
Midjourney: include --ar, --style raw, --v 7
Weave: motion description, duration, camera behavior
C4D: shader settings, simulation approach, render notes
all: one prompt per tool`;
}

// ── GENERATE ──
const toolLabels = {midjourney:'Midjourney', weave:'Weave', c4d:'Cinema 4D', all:'전체 세트'};
const sceneLabels = {product:'제품 샷', texture:'제형 텍스처', model:'모델 클로즈샷', botanical:'보태니컬', atmosphere:'분위기 컷', opening:'오프닝/엔딩'};

async function generate() {
  const apiKey = localStorage.getItem('velune_api_key');
  if (!apiKey || !apiKey.startsWith('sk-')) {
    document.getElementById('apiPanel').classList.add('open');
    document.getElementById('apiKeyInput').focus();
    return;
  }
  const userNote = document.getElementById('userNote').value.trim();
  const btn = document.getElementById('generateBtn');
  const output = document.getElementById('outputArea');
  btn.disabled = true;
  output.innerHTML = `<div class="output-card"><div class="output-body thinking"><div class="spinner"></div>VELUNE 브랜드 기반 생성 중...</div></div>`;

  const userMsg = `Tool: ${toolLabels[selectedTool]}\nScene: ${sceneLabels[selectedScene]}\nDirection: ${userNote || '없음'}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: buildSystem(),
        messages: [{ role: 'user', content: userMsg }]
      })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    const raw = data.content?.map(c => c.text || '').join('');
    const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());

    const allText = parsed.prompts.map(p => p.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(allText).catch(()=>{});

    let html = `<div class="output-card">
      <div class="output-header">
        <div class="output-meta">
          <span class="output-label">${toolLabels[selectedTool]} · ${sceneLabels[selectedScene]}</span>
          <span class="copied-badge show" id="autoBadge">✓ 자동 복사됨</span>
        </div>
        <button class="recopy-btn" onclick="recopyCurrent(this)">다시 복사</button>
      </div>
      <div class="output-body" id="promptOutput">`;
    parsed.prompts.forEach(p => {
      html += `<div class="prompt-block"><span class="prompt-tag">${p.tag}</span><div class="prompt-text">${esc(p.text)}</div></div>`;
    });
    html += `</div></div>`;
    output.innerHTML = html;
    setTimeout(() => {
      const b = document.getElementById('autoBadge');
      if (b) b.classList.remove('show');
    }, 3000);
  } catch(err) {
    output.innerHTML = `<div class="output-card"><div class="output-body thinking" style="color:#E24B4A">오류: ${err.message}</div></div>`;
  }
  btn.disabled = false;
}

function recopyCurrent(btn) {
  const blocks = document.querySelectorAll('.prompt-text');
  const text = Array.from(blocks).map(b => b.textContent).join('\n\n---\n\n');
  navigator.clipboard.writeText(text);
  btn.textContent = '✓ 복사됨';
  setTimeout(() => { btn.textContent = '다시 복사'; }, 1500);
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

// ── INIT ──
loadGuide();
initTags();
renderColors();
updateApiStatus();
