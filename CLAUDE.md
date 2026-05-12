# VELUNE Prompt Agent

## 프로젝트 개요
VELUNE™ 브랜드(Vegan Cooling Skincare)의 콘텐츠 제작에 사용한 프롬프트를 저장·분류·관리하는 라이브러리 도구.
Midjourney / Weave / Cinema 4D 프롬프트를 툴·씬 유형별로 태깅해 히스토리로 누적하고, 필요할 때 꺼내 복사한다.
**외부 API 미사용. 모든 데이터는 브라우저 localStorage에만 저장.**

---

## 파일 구조
```
velune_prompt_agent.html   메인 UI (탭 구조)
velune_prompt_agent.js     전체 로직
velune_prompt_agent.css    스타일
CLAUDE.md                  프로젝트 문서
```

---

## 탭 구조

### 1. 프롬프트 추가
- 툴 선택 → 씬 유형 선택 → 프롬프트 텍스트 붙여넣기 → 메모(선택) → 저장
- 저장 시 `{tool, scene, note, prompts:[{tag, text}], date}` 형태로 히스토리에 추가
- 저장 후 입력 필드 초기화 + "✓ 저장됨" 토스트 표시

### 2. 히스토리
- 씬 유형별 필터 버튼 (전체 / 제품 샷 / 제형 텍스처 / 모델 클로즈샷 / 보태니컬 / 분위기 컷 / 오프닝·엔딩)
- 각 항목: 씬 태그 + 툴 태그 + 날짜 + 프롬프트 미리보기
- **Midjourney 프롬프트**: 본문과 `--파라미터` 자동 분리 표시 (아래 참고)
- 항목 클릭으로 다중 선택 → 2개 이상 선택 시 "복사" 바 등장
- 복사: 선택된 프롬프트 전체를 `---` 구분자로 이어 클립보드에 복사
- 항목 × 버튼으로 개별 삭제 (confirm 확인)
- 최대 200개 유지

### 3. 브랜드 가이드
- 브랜드 아이덴티티 / 톤 & 슬로건 / 핵심 성분 / 컬러 시스템 / 비주얼 디렉션 / 피해야 할 것
- 수정 시 dirty 인디케이터 표시
- 저장/초기화 (localStorage)

---

## Midjourney 파라미터 파싱
저장 시 원문 그대로 보존, 렌더링 시 `parseMJParams()`로 파싱.

| 구분 | 파라미터 | 표시 |
|------|---------|------|
| 일반 | `--ar`, `--v`, `--style`, `--q`, `--s`, `--chaos` 등 | 회색 pill |
| 강조 | `--seed`, `--p`, `--profile`, `--sref`, `--cref`, `--no`, `--iw` | 코발트 블루 pill |

- 본문(cleanText)은 미리보기에, 파라미터는 별도 pill 행에 표시
- Weave / Cinema 4D 프롬프트는 파라미터 파싱 미적용

---

## 데이터 구조 (localStorage)

**`velune_history`** — 배열, 최대 200개
```json
{
  "id": 1716000000000,
  "tool": "midjourney",
  "scene": "product",
  "note": "새벽 공기 느낌",
  "prompts": [{ "tag": "Midjourney", "text": "full prompt text --ar 16:9 --seed 1234" }],
  "date": "05/12"
}
```

**`velune_brand_guide`** — 브랜드 가이드 전체 JSON

---

## 씬 / 툴 카테고리

| 씬 key | 레이블 |
|--------|--------|
| `product` | 제품 샷 |
| `texture` | 제형 텍스처 |
| `model` | 모델 클로즈샷 |
| `botanical` | 보태니컬 |
| `atmosphere` | 분위기 컷 |
| `opening` | 오프닝/엔딩 |

| 툴 key | 레이블 |
|--------|--------|
| `midjourney` | Midjourney |
| `weave` | Weave |
| `c4d` | Cinema 4D |
| `all` | 전체 세트 |

---

## 주요 함수

| 함수 | 역할 |
|------|------|
| `addPrompt()` | 입력된 프롬프트를 히스토리에 저장, 입력 초기화 |
| `saveToHistory(tool, scene, note, prompts)` | localStorage에 항목 추가 |
| `loadHistory()` | localStorage에서 배열 로드 |
| `renderHistory()` | 히스토리 탭 전체 렌더링 |
| `parseMJParams(text)` | `--param value` 파싱 → `{cleanText, params[]}` 반환 |
| `handleHistClick(event, id)` | 항목 선택/해제 토글 |
| `copySelected()` | 선택 항목 클립보드 복사 |
| `deleteHistItem(id)` | 항목 삭제 |
| `clearHistSelection()` | 전체 선택 해제 |
| `saveGuide() / loadGuide()` | 브랜드 가이드 저장/불러오기 |
| `esc(s)` | HTML 이스케이프 유틸 |

---

## 디자인 시스템

**폰트**: DM Serif Display (헤더), DM Sans (본문), DM Mono (파라미터 pill)

**CSS 변수**
```css
--cobalt: #1A4FBF       /* 메인 블루 */
--cobalt-light: #EBF0FA  /* 블루 배경 */
--cobalt-mid: #3460CC
--yellow: #C8960A       /* 보태니컬 옐로우 */
--yellow-light: #FDF6E0
--ivory: #F7F4EE        /* 배경 */
--gray: #6B6B6B
--gray-light: #F0EEE9
--dark: #1A1A1A
--border: rgba(26,79,191,0.12)
--border-soft: rgba(0,0,0,0.07)
--radius: 10px
--radius-lg: 16px
```
