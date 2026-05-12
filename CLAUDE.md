# VELUNE Prompt Agent

## 프로젝트 개요
VELUNE™ 브랜드(Vegan Cooling Skincare)의 콘텐츠 제작을 위한 AI 프롬프트 생성 도구.
Midjourney / Weave / Cinema 4D 프롬프트를 브랜드 가이드 기반으로 생성하고 관리한다.

## 파일 구조
- `velune_prompt_agent.html` — 메인 UI (탭 구조)
- `velune_prompt_agent.js` — 전체 로직
- `velune_prompt_agent.css` — 스타일

## 탭 구조
1. **프롬프트 추가** — 툴/씬 선택 → 프롬프트 직접 입력(붙여넣기) → 메모 → 저장 (API 없음)
2. **히스토리** — 저장된 프롬프트 씬 유형별 필터, 다중 선택 후 클립보드 복사
3. **브랜드 가이드** — 브랜드 정보 편집 (localStorage 저장)

## 데이터 저장 (localStorage)
- `velune_api_key` — 미사용 (API 제거됨)
- `velune_brand_guide` — 브랜드 가이드 JSON
- `velune_history` — 히스토리 배열 (최대 200개)
  - 구조: `{id, tool, scene, note, prompts:[{tag, text}], date}`

## 씬/툴 카테고리
- 씬: `product` / `texture` / `model` / `botanical` / `atmosphere` / `opening`
- 툴: `midjourney` / `weave` / `c4d` / `all`

## Claude API
- 모델: `claude-sonnet-4-20250514`
- 엔드포인트: 직접 브라우저 호출 (`anthropic-dangerous-direct-browser-access: true`)
- 출력 포맷: JSON `{"prompts":[{"tag":"...","text":"..."}]}`

## 주요 함수
- `addPrompt()` — 직접 입력한 프롬프트를 툴/씬 태그와 함께 히스토리에 저장
- `copySelected()` — 히스토리에서 선택한 항목들을 클립보드에 복사
- `saveToHistory(tool, scene, note, prompts)` — localStorage에 저장
- `renderHistory()` — 히스토리 탭 렌더링

## 디자인 시스템
- 폰트: DM Serif Display (헤더), DM Sans (본문)
- 메인 컬러: Cobalt Blue `#1A4FBF`, Botanical Yellow `#C8960A`, Mist Ivory `#F7F4EE`
- CSS 변수: `--cobalt`, `--yellow`, `--ivory`, `--gray`, `--border`, `--radius`
