# 프로젝트 컨텍스트: 한국술 정보 글로벌 허브 (서비스명 미정)

> 이 문서는 Claude Code가 이 프로젝트를 작업할 때 항상 먼저 읽어야 하는 프로젝트 바이블이다.
> 프로젝트가 진화하면 이 문서도 함께 업데이트한다.

---

## 1. 나(사용자)에 대해

- **이름**: Kim
- **배경**: 개발자, AI 자동화 시스템 개발 경력 보유
- **핵심 강점**:
  - Playwright 기반 웹 크롤링 (Cloudflare 우회 경험)
  - OpenAI / Azure OpenAI API 통합 및 프롬프트 엔지니어링
  - AWS 인프라 (CloudWatch, Lambda, RDS MySQL)
  - 데이터베이스 설계 및 ETL 파이프라인
  - 이커머스 자동화 (Cafe24 플랫폼 경험)
- **과거 프로젝트 경험**:
  - Yahoo Finance 크롤러 + YouTube Shorts 자동 생성 파이프라인
  - 헬스 보조제 CS 자동화
  - Triconix, Soltice 쇼핑몰 주문 처리 자동화
- **언어**: 한국어 네이티브, 영어 업무 가능
- **현재 상황**: 퇴사 후 6개월 창업 준비 기간
- **기존 자산**: 개인 술 리뷰 Instagram 계정 (팔로워 ~400명, "내가 마신 술만 소개" 컨셉)
- **장기 목표**: 궁극적으로 직접 술 제조 (양조장 창업). 이 플랫폼은 그 전 단계 자산 구축용.

---

## 2. 프로젝트 비전

### 한 줄 정의
한국 전통주·소주·막걸리·과실주를 국내외 사용자가 **발견·기록·구매**할 수 있는 정보 허브 + 양조장 대상 B2B 서비스

### 포지셔닝
**"한국술 정보 글로벌 허브"**
- Untappd(맥주)와 Vivino(와인)의 한국술 버전
- + Vivino식 마켓플레이스 커미션 요소
- + Untappd for Business 같은 B2B SaaS 요소

### 차별점
1. **한/영 이중언어** — 해외 한인 1,000만 + K-culture 팬 시장 선점
2. **정보 허브 + 커뮤니티** — 기존 경쟁사(술담화, 데일리샷)는 이커머스 중심
3. **B2B SaaS 포함** — 소규모 양조장 대상 마케팅·데이터 도구 (Kim의 개발 강점 활용)

### 장기 비전
3~5년 내 한국술 카테고리의 지배적 정보·커뮤니티 플랫폼. 플랫폼이 커진 뒤 Kim이 직접 만든 술을 이 플랫폼을 통해 론칭.

---

## 3. 시장 이해 (의사결정 근거)

### 주요 경쟁사 / 레퍼런스

| 회사 | 모델 | 규모 | 수익 구조 |
|------|------|------|-----------|
| **술담화** | 전통주 구독 박스 | 2022 매출 70억 | Day 1부터 월 39,000원 구독 |
| **데일리샷** | 주류 스마트오더 앱 | MAU 130만, 누적 설치 270만 | 구매 커미션 + B2B 입점 |
| **술마켓** | 전통주 이커머스 | 인스타 11K | 제품 마진 (단순 쇼핑몰) |
| **Untappd** (미국) | 맥주 체크인 SNS | 유저 9M, 체크인 1B | **B2B SaaS (20,000+ venues)** |
| **Vivino** (덴마크→미국) | 와인 마켓플레이스 | 유저 50M, 와인 12M | **와이너리 커미션 + 구독 박스** |

### 한국 주류 규제 핵심 (매우 중요)
- **전통주만 온라인 통신판매 합법** (지역특산주 포함, 2017년~)
- 일반 주류는 **스마트오더**(온라인 주문 + 오프라인 픽업)만 가능
- 자택 배송은 여전히 불가 (전통주 예외)
- 음식점 통한 **음식+주류 배달**은 허용 (주류값 < 음식값 조건)
- 직접 제조는 주류제조면허 필수 (최소 1년 준비, 지금 스코프 아님)

### 시장 빈틈
1. 한국 전통주용 **Untappd/Vivino 포지션이 공석**
2. 양조장 1,300곳 대부분 **IT·마케팅 인력 부재** → B2B 기회
3. 한국술 **영문 정보가 절대 부족** (외국인 검색 유입 경쟁 약함)
4. 전통주는 **온라인 판매 합법** → 마켓플레이스 가능 (타 주종 불가)

---

## 4. 현재 프로젝트 상태

- ✅ 더술닷컴에서 제품 데이터 **1,251개 수집** (Claude Code로)
- ⏳ 데이터 정제 및 AI 한/영 이중화 필요
- ⏳ Supabase 프로젝트 생성 필요
- ⏳ Next.js 프로젝트 초기 세팅 필요
- ⏳ 도메인 구매 필요
- ⏳ Vercel 배포 필요

---

## 5. 제품 로드맵

### Phase 1 — MVP (0~2개월) 🎯 지금 여기
**목표**: 공개 가능한 웹사이트 + 1,251개 제품 데이터베이스 + 기본 유저 기능

- [x] 데이터 수집 (1,251개)
- [ ] 데이터 정제 + AI 한/영 번역
- [ ] Next.js + Supabase 초기 세팅
- [ ] 핵심 페이지 4종 스캐폴드
  - 홈 (검색 + 큐레이션)
  - 제품 리스트 (카테고리·지역·도수 필터)
  - 제품 상세
  - 양조장 상세
- [ ] 유저 인증 (Supabase Auth)
- [ ] 체크인 기능 ("내가 마신 술" 기록, 별점, 한 줄 메모)
- [ ] SEO 필수 세팅 (sitemap, meta tags, schema.org)
- [ ] 한/영 이중언어 지원
- [ ] Vercel 배포 + 도메인 연결

### Phase 2 — 성장 (2~4개월)
- [ ] 블로그 콘텐츠 시스템 (한/영)
- [ ] 구글 Search Console / GA4 분석 기반 콘텐츠 확장
- [ ] 어필리에이트 연동 (데일리샷·술담화 제휴)
- [ ] AI 페어링 추천 (GPT 기반)
- [ ] 플레이스홀더 이미지 → 실제 사진 점진 교체 (양조장 요청 + 본인 촬영)

### Phase 3 — 수익화 (4~6개월+)
- [ ] 양조장 Verified 플랜 베타 (월 9~29만원)
  - 공식 페이지 인증
  - 조회수 / 체크인 데이터 대시보드
  - 신제품 우선 노출
- [ ] 콘텐츠 협찬 판매 (건당 30~50만원)
- [ ] 와디즈 펀딩으로 큐레이션 박스 실험
- [ ] 모바일 최적화 (PWA 고려)

### 만들지 않을 것 (현재 스코프 밖)
- ❌ 네이티브 모바일 앱 (iOS/Android) — 최소 12개월 후
- ❌ 복잡한 추천 알고리즘 — Phase 2 이후
- ❌ 자체 결제 시스템 — 어필리에이트로 대체
- ❌ 자체 배송·재고 — 물류 리스크 회피

---

## 6. 기술 스택 결정

### 프론트엔드
```
Next.js 15 (App Router)
TypeScript (strict mode)
Tailwind CSS
shadcn/ui (디자인 시스템)
Vercel (배포)
```

### 백엔드 / 데이터
```
Supabase
  ├─ Postgres (DB)
  ├─ Auth (이메일 + 구글 OAuth)
  └─ Storage (이미지)

향후 (필요 시):
Railway (백그라운드 워커, 정기 크롤링, B2B 대시보드)
```

### 외부 서비스
- **OpenAI API (GPT-4o-mini)** — 한/영 번역, 맛 노트 정규화, 페어링 추천
- **Cloudflare** — DNS, 기본 보안
- **`@vercel/og`** — 플레이스홀더 이미지 동적 생성

### SEO 필수 요소 (놓치지 말 것)
- `sitemap.xml` 자동 생성 (모든 제품·양조장 페이지)
- `robots.txt`
- 페이지별 dynamic `<title>`, `<meta description>`, Open Graph
- `Schema.org` 구조화 데이터 (`Product`, `Brewery`, `Organization`)
- 한/영 `hreflang` 태그 (dynamic)
- Google Search Console + GA4 연동

### 선택 이유
- **Next.js**: SEO 필수 (SSR/ISR), 1,251개+ 페이지 정적 생성 효율
- **Supabase**: 무료 티어 풍부, Auth 내장, Postgres 기반
- **Vercel**: Next.js 최적, 엣지 CDN으로 글로벌 SEO 유리
- **Tailwind + shadcn/ui**: 디자인 과투자 방지, 빠른 UI 개발

---

## 7. 데이터 스키마 (기본)

```sql
-- 양조장
breweries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko text NOT NULL,
  name_en text,
  region text,              -- 시도 단위
  address text,
  founded_year int,
  story_ko text,
  story_en text,
  website text,
  instagram text,
  is_visiting_brewery boolean DEFAULT false,  -- 찾아가는 양조장
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 제품
products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brewery_id uuid REFERENCES breweries(id),
  name_ko text NOT NULL,
  name_en text,
  category text,            -- 탁주/약주/청주/증류주/과실주/리큐르
  abv numeric,              -- 도수
  volume_ml int,
  price_krw_min int,
  price_krw_max int,
  ingredients text[],
  tasting_notes_ko text,
  tasting_notes_en text,
  pairing_suggestions text[],
  image_url text,           -- null이면 플레이스홀더 fallback
  source_url text,          -- 더술닷컴 원본 링크
  is_online_purchasable boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 수상 이력
awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  award_name text,          -- "대한민국 우리술 품평회" 등
  award_year int,
  award_level text          -- 대상/최우수상/우수상/장려상
);

-- 외부 구매 링크
purchase_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  retailer text,            -- "데일리샷" / "술담화" / "술마켓"
  url text,
  price_krw int,
  is_affiliate boolean DEFAULT false
);

-- 유저는 Supabase Auth 기본 테이블 사용
-- profiles 테이블로 확장
profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE,
  display_name text,
  avatar_url text,
  bio text,
  locale text DEFAULT 'ko', -- ko/en
  created_at timestamptz DEFAULT now()
);

-- 체크인
check_ins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  product_id uuid REFERENCES products(id),
  rating int CHECK (rating >= 1 AND rating <= 5),
  note text,
  drank_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 인덱스
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brewery ON products(brewery_id);
CREATE INDEX idx_check_ins_user ON check_ins(user_id);
CREATE INDEX idx_check_ins_product ON check_ins(product_id);
```

---

## 8. 개발 원칙

### 속도 원칙
- **"부끄러울 정도로 빨리 공개"** — 완벽주의 절대 금지
- MVP는 **1~2주 내** 배포 목표
- 기능은 매주 1~2개씩 추가. 한꺼번에 많이 X
- 디자인에 시간 쏟지 말 것. shadcn/ui 기본 그대로 쓰기

### 코드 원칙
- TypeScript **strict mode**
- 컴포넌트는 작게, 재사용 고려
- Supabase 쿼리: **Server Component 우선**, 필요 시에만 Client
- 환경변수: `.env.local`에 정의, `env.ts` 같은 파일로 타입 선언
- 에러 핸들링: 모든 외부 호출(Supabase, OpenAI, fetch)에 try/catch + fallback
- 이미지: 없으면 `@vercel/og`로 동적 플레이스홀더

### SEO 원칙 (핵심 자산)
- 모든 제품·양조장 페이지는 **서버 렌더링** (SSG/ISR 우선)
- `<title>`은 **키워드 + 브랜드** 패턴 (예: "해창 10도 플러스 - 해남 프리미엄 막걸리 | [서비스명]")
- `<meta description>`은 120~160자
- Open Graph 이미지는 `@vercel/og`로 동적 생성
- 한/영 페이지는 `hreflang` 태그로 연결
- 내부 링크 풍부하게 (제품 ↔ 양조장 ↔ 카테고리)

### 저작권 원칙 (중요)
- 더술닷컴 **제품 설명 텍스트는 AI로 리라이팅** 후 사용
- 더술닷컴 **이미지는 직접 사용 금지**. 대신:
  - 플레이스홀더 (`@vercel/og` 동적 생성) 기본
  - Kim 본인 촬영 사진
  - 양조장 공식 제공 이미지 (허락 받은 것)
- **사실 데이터**(제품명, 도수, 용량, 양조장명, 주소)는 저작권 대상 아님 → 그대로 사용 가능
- Footer에 "일부 데이터 출처: 더술닷컴(aT)" 표기

### 보안 원칙
- Supabase Row Level Security (RLS) 모든 테이블에 적용
- 환경변수에 `NEXT_PUBLIC_` 접두어 주의 (노출되는 것 vs 서버 전용)
- API 라우트에 rate limit 고려 (특히 OpenAI 호출)
- 유저 입력값은 항상 검증 (zod 권장)

---

## 9. 수익 모델 (우선순위)

| 순서 | 모델 | 도입 시점 | 예상 수익 |
|------|------|-----------|-----------|
| 1 | **어필리에이트** (데일리샷·술담화 제휴) | Day 1 | 월 5~30만원 (초기) |
| 2 | **B2B 양조장 Verified 플랜** | 3개월차~ | 월 9~29만원 × 양조장 수 |
| 3 | **콘텐츠 협찬** (신제품 소개 패키지) | 트래픽 쌓이면 | 건당 30~50만원 |
| 4 | **큐레이션 박스** (와디즈 시작) | 6개월차~ | 월 100~500만원 |

**중요**: 유저 10만 기다리지 말 것. 유저 100명부터 수익 실험 시작.

---

## 10. Claude Code 행동 가이드

### 코드 작성 시
- 항상 **TypeScript + 타입 명시**
- Next.js App Router 컨벤션 준수 (`app/` 디렉터리)
- Supabase 쿼리는 **Server Component에서 우선**, 필요 시에만 Client
- 환경변수는 `.env.local`에 정의, 타입 선언 포함 (`env.ts`)
- 에러 상황 대비 (try/catch, fallback UI)

### 설명 시
- **왜 이렇게 했는지** 항상 함께 설명
- 대안이 있으면 trade-off 언급
- 내가 모르는 라이브러리/패턴이면 간단히 배경 설명
- 한국어 기본, 기술 용어는 영문 병기 OK

### 작업 흐름
1. 요청 이해 → 관련 파일/스키마 파악
2. 접근 방식 2~3개 제안 + 추천안 명시
3. 내 확인 받고 구현 시작
4. 구현 후 영향 범위 요약 + 테스트 방법 안내

### 금지 사항
- ❌ "간단한 예시입니다" 수준의 스캐폴드만 주지 말 것 — 실제 사용 가능한 코드로
- ❌ 정해진 스택(Next.js, Supabase, Vercel) 무시하고 다른 거 제안 금지
- ❌ 컨텍스트 설정 없이 복잡한 기능부터 만들지 말 것
- ❌ 확인 없이 임의로 라이브러리 설치 금지
- ❌ 디자인에 과투자 금지 (shadcn 기본 유지)
- ❌ Phase 2, 3 기능을 Phase 1에 섞지 말 것

### 모호할 때
- **먼저 질문**하기, 추측하지 말 것
- 여러 접근이 가능하면 **2~3개 옵션 제시** + Kim 상황 기준 추천
- 에러 상황 대비 포함 (try/catch, fallback)

---

## 11. 서비스 이름·브랜딩 (미정)

### 현재 후보
- **Sooly** (1순위) — 짧고 한/영 발음 쉬움
- **Soolmap** (2순위) — 기능 설명적, SEO 유리
- **Hansool** (3순위) — 직관적, 한국 아이덴티티
- **Jumak** — 감성적, 스토리텔링 강함
- **Nuruk** — 업계인 어필

### 결정 전 체크리스트
- [ ] `.com` 또는 `.io` 도메인 확보 가능 여부
- [ ] KIPRIS 상표 검색 (주류 카테고리, 제32·33류)
- [ ] Instagram 핸들 확보 가능 여부
- [ ] 기존 Kim의 인스타 계정과의 연관성

---

## 12. 주요 의사결정 로그

향후 중요한 결정을 하면 여기 추가하여 맥락을 잃지 않도록 한다.

### 2026-04-XX: 웹 먼저, 앱은 12개월 후
- 이유: SEO 자산 확보, 개발 리소스 집중, 설치 장벽 회피
- Untappd도 웹 먼저, 앱은 2년 뒤 출시한 사례

### 2026-04-XX: Phase 1은 1,251개 데이터로 공개
- 이유: 완벽주의 회피, 트래픽 보면서 우선순위 파악
- 모든 양조장 컨택 전에 사이트 먼저 공개

### 2026-04-XX: 이미지는 플레이스홀더로 시작
- 이유: 저작권 리스크 회피, 론칭 속도 우선
- `@vercel/og`로 카테고리별 동적 생성

### 2026-04-22: 모노레포 구조 (web/ + scripts/ + supabase/)
- 이유: 파이썬 크롤러(기존)와 Next.js 앱 공존, 향후 Railway 워커 확장 대비
- Vercel Root Directory = `web` 으로 배포 설정 필요
- 루트 단일 git repo, `web/` 안에는 git 없음

### 2026-04-22: Next.js 16.2.4 사용 (CLAUDE.md §6 의 "15" 와 다름)
- 이유: `create-next-app@latest` 가 최신 stable(16)을 설치. App Router 호환, 다운그레이드 불필요
- 섹션 6은 "Next.js (App Router, 최신 stable)" 로 읽으면 됨

### 2026-04-22: Supabase dev 프로젝트 생성 완료 (ref: vkglostsjasjuhlpdvtg)
- 0001_init.sql 실행 완료 — 6개 테이블 + RLS + 트리거 적용됨
- 현재 키: publishable/secret (신규 포맷 `sb_publishable_*` / `sb_secret_*`)
- 퍼블릭 오픈 시 prod 프로젝트 별도 생성 필요 (dev 키가 이미 채팅에 노출됨)

### 2026-04-25: Sooly 공식 런칭 (sooly.vercel.app)
- 1,251 → 791 (after dedupe) products + 431 breweries DB 적재 완료
- robots.txt + sitemap.xml (1,235 URL) 자동 생성
- Vercel Production: Root Directory=`web`, Framework=Next.js, env var 3개 (Supabase URL/anon/service-role + auto-detected SITE_URL)
- Search Console 소유권 인증 + sitemap 제출 완료
- GA4 (`G-9Y8QY6L8M6`) production 빌드에서만 로드, 실시간 계측 확인
- Schema.org JSON-LD: WebSite (검색박스) + Product (제품) + Brewery/LocalBusiness (양조장)
- Service role key 2회 로테이션 (1차 채팅 노출로 인해), GitHub repo Private

### 2026-04-25: 브랜드 이메일 = `soolyhello@gmail.com`
- 이유: Google Workspace ($6+/seat/mo) 는 매출 전에 오버킬. Free Gmail 로 Search Console·GA·향후 Instagram 통합. 매출 후 Workspace 마이그레이션 검토.
- 대신 코드(footer, /for-breweries) 의 contact 이메일도 모두 이 주소로 통일.

### 2026-04-25: 도메인 = `sooly.co.kr` 단독 (가비아)
- `sooly.com` 점유, `sooly.kr` 점유 → `sooly.co.kr` available 하고 한국 소비자 대상에 충분
- KIPRIS 주류 32·33류 "Sooly" 등록 없음 ✓
- IG 핸들 `@sooly_kr` 가능 ✓
- `.io` / `.app` 은 글로벌 확장 결정 시점에 재검토 (지금 사봤자 1년 안에 결심 안 서면 매몰)
- **현재 상태**: 결정만, 구매·DNS 연결은 다음 세션
- 글로벌 확장 시점에 영문 콘텐츠는 `sooly.co.kr/en` 경로 또는 별도 .io/.com 도메인 검토

### 2026-04-25: SITE_URL 우선순위 정의 (web/lib/env.ts)
1. `NEXT_PUBLIC_SITE_URL` 명시
2. `VERCEL_PROJECT_PRODUCTION_URL` (stable, 예: sooly.vercel.app)
3. `VERCEL_URL` (deployment-specific, fallback)
- 이유: `VERCEL_URL` 만 쓰면 sitemap·robots 에 배포 hash 박혀서 SEO 신호 분산.

### 2026-04-28: Phase 1 사실상 완성 (Auth + 체크인 + 도메인 + AI 번역 + Locale)
- **유저 Auth 풀세트** (매직 링크) — Next 16 의 `proxy.ts` (구 middleware) + /login + /auth/callback + 헤더 user-menu + /u/[username] 프로필
- **체크인 풀세트** — 별점·페어링·메모·날짜·6축 맛 프로필·여러 체크인 허용·인라인 수정/삭제 (마이그레이션 0004~0008)
- **도메인 sooly.co.kr** — 가비아 + Vercel + 308 redirect + Search Console + NEXT_PUBLIC_SITE_URL → sitemap·robots 통일
- **AI 한/영 번역** — Gemini 2.5-flash + fallback chain. 786/791 = 99% 성공 (~91분 background)
- **Locale toggle 코드** — `pick(locale, ko, en)` + product/brewery detail 페이지 영문 칼럼 사용 (ko fallback safe)
- **콘텐츠 다듬기** — welcome.md 입니다 체 + 회사 소개 톤 / /for-breweries 솔직 가격 모드 + FAQ + mailto prefill

### 2026-04-28: 양조장 Verified 가격 = 솔직 모드
- 9~29만원 미리 락인 X. 첫 5~10 양조장 cohort 와 가격·기능 협의 후 결정
- 얼리어답터 6개월 무료 + 평생 가격 락인
- 본인 CLAUDE.md §10 "Phase 2/3 기능을 Phase 1 에 섞지 말 것" 준수: 풀 인증 시스템은 Phase 3, 지금은 mailto + Kim 수동 인증

### 2026-04-28: 1제품 1체크인 → 여러 체크인 허용 (Untappd 스타일)
- 0005 unique 추가 후 0006 에서 제거. 같은 술 다른 술자리 = 다른 별점·다른 메모, 시간순 누적
- 본인 체크인은 RecentCheckIns 에서 인라인 수정·삭제 (MyCheckInRow 클라이언트 컴포넌트)

### 2026-04-28: API 키 채팅 노출 패턴 = 메모리 룰 추가
- 4-25 service_role 2회 + 4-28 Gemini 1회 노출. 매번 burned 후 로테이션
- `feedback_secret_in_chat.md` 메모리 추가 — 다음 세션부터 키 받기 *직전* 사전 차단

---

## 13. 참고 외부 리소스

### 데이터 소스
- 더술닷컴: https://thesool.com (이미 크롤링 완료)
- 찾아가는 양조장: https://thesool.com/front/visitingBrewery/M000000072/mapList.do
- 우리술 품평회: https://thesool.com/front/publication/M000000090/list.do
- 공공누리 (저작권 프리 이미지): https://www.kogl.or.kr

### 경쟁사 학습
- 술담화: https://sooldamhwa.com
- 데일리샷: https://dailyshot.co
- 술마켓: https://www.soolmarket.com
- Untappd: https://untappd.com
- Vivino: https://www.vivino.com

### 기술 문서
- Next.js 15: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com
- `@vercel/og`: https://vercel.com/docs/functions/og-image-generation

---

## 14. 빠른 세션 시작 템플릿

새 Claude Code 세션 시작 시 이 템플릿으로 시작:

```
CLAUDE.md 읽고 프로젝트 맥락 파악해줘.

마지막 세션에서 한 것:
- [뭘 했는지 2~3줄]

이번 세션 목표:
- [오늘 할 일]

관련 파일:
- [경로들]

먼저 관련 파일 구조 파악하고,
작업 시작 전에 접근 방식 확인받아줘.
```

---

_이 문서는 프로젝트가 진화할수록 함께 업데이트한다. 중요한 결정이 내려질 때마다 섹션 12에 추가할 것._
