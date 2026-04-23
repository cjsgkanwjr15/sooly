import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "양조장을 위한 Sooly",
  description:
    "Sooly 는 한국술 정보 허브입니다. 양조장 Verified 플랜으로 공식 페이지 인증, 데이터 분석, 신제품 노출 기회를 제공합니다.",
};

export default function ForBreweriesPage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[color-mix(in_oklab,var(--color-primary)_8%,var(--color-background))] to-background" />
        <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
          <p className="font-kr-serif text-xs tracking-[0.3em] text-primary/70 uppercase">
            For Breweries
          </p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            양조장의 이야기를<br />
            <em className="not-italic text-primary">직접</em> 들려주세요.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sooly 는 한국 전통주 {400}개 이상의 양조장과 {800}종 제품을 담은 정보 허브입니다.
            Verified 플랜에 참여하시면 양조장 공식 페이지를 직접 관리하고, 소비자 데이터를
            받아보고, 신제품을 우선 노출할 수 있습니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#contact"
              className={buttonVariants({ size: "lg" })}
            >
              등록 문의하기
            </Link>
            <Link
              href="#features"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              제공 기능 보기
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            💡 현재 얼리어답터 양조장을 찾고 있습니다. 초기 3개월 무료 이용 혜택.
          </p>
        </div>
      </section>

      {/* 현재 가능한 것 */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            지금 당장 — 무료로 가능한 것
          </h2>
          <p className="mt-4 text-muted-foreground">
            Sooly 에 이미 등록된 양조장이라면, 문의 주시면 아래를 바로 반영해드립니다.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            <Benefit
              title="공식 페이지 인증"
              desc="양조장 페이지에 'Verified' 뱃지. 진짜 사장님이 관리하는 공간임을 명시."
            />
            <Benefit
              title="양조장 이야기·소개글 등재"
              desc="양조장의 역사·철학·대표의 이야기. 유저가 제품을 선택할 때 결정타."
            />
            <Benefit
              title="공식 사진 업로드"
              desc="양조장 전경, 설비, 대표 사진. 플레이스홀더 이미지 대체."
            />
            <Benefit
              title="제품 정보 수정"
              desc="도수·용량·원재료 등 크롤링 시점 이후 변경된 정보 업데이트."
            />
          </ul>
        </div>
      </section>

      {/* 곧 출시 — Verified 플랜 */}
      <section id="features" className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            Verified Plan · 2026 Q3 론칭 예정
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            Verified 플랜에서 추가되는 것
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <Feature
              badge="Dashboard"
              title="대시보드 · 조회수 & 체크인 분석"
              desc="양조장·제품별 조회수, 유저 체크인 평균 별점, 월별 트렌드. 어떤 제품이 어느 지역에서 인기인지 실시간으로."
            />
            <Feature
              badge="Publishing"
              title="양조장 공지 & 뉴스피드"
              desc="신제품 출시, 이벤트, 양조장 방문 안내를 직접 공지. 팔로워에게 자동 알림."
            />
            <Feature
              badge="Promotion"
              title="신제품 우선 노출"
              desc="홈 & 카테고리 페이지 '이번 주 신제품' 섹션 배치. 유저 첫인상을 선점."
            />
            <Feature
              badge="Verified"
              title="공식 Verified 뱃지"
              desc="검색 결과 & 양조장 페이지에 인증 마크. 신뢰도 지표로 작동."
            />
          </div>
          <div className="mt-10 rounded-xl border border-primary/20 bg-primary/[0.04] p-6">
            <p className="font-serif text-lg font-medium">예상 가격: 월 9만원 ~ 29만원</p>
            <p className="mt-2 text-sm text-muted-foreground">
              양조장 규모 & 원하는 기능에 따라 3개 플랜. 얼리어답터는 <strong className="text-foreground">초기 3개월 무료</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* 왜 Sooly? */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            왜 지금 Sooly 인가
          </h2>
          <div className="mt-10 space-y-8 text-[1.05rem] leading-relaxed">
            <Point
              num="01"
              title="한국술에는 아직 Untappd·Vivino 같은 허브가 없습니다"
              body="맥주엔 Untappd(유저 900만), 와인엔 Vivino(유저 5천만). 한국 전통주는? 이커머스 몇 곳은 있어도 '발견·기록·공유'가 통합된 플랫폼은 공석입니다."
            />
            <Point
              num="02"
              title="해외 한인 1,000만 + K-culture 팬을 타겟"
              body="Sooly 는 한/영 이중언어 설계. 영문 정보가 절대 부족한 한국술 시장에서 검색 유입을 선점합니다."
            />
            <Point
              num="03"
              title="양조장은 IT·마케팅 리소스 부족"
              body="대부분의 양조장이 공식 홈페이지가 없거나 관리되지 않습니다. Sooly 가 그 인프라를 대신 제공."
            />
          </div>
        </div>
      </section>

      {/* 문의 */}
      <section id="contact" className="border-b bg-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            함께 만들 양조장을 찾습니다
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            초기 합류 양조장에는 Verified 플랜 <strong className="text-foreground">초기 3개월 무료</strong> 및
            제품 기획 단계에서 의견이 반영되는 기회를 드립니다.
          </p>
          <div className="mt-8 inline-flex flex-col items-center gap-3 rounded-xl border bg-card px-8 py-6">
            <p className="text-sm text-muted-foreground">문의 채널</p>
            <a
              href="mailto:hello@sooly.kr"
              className="font-serif text-xl font-medium text-primary underline underline-offset-4"
            >
              hello@sooly.kr
            </a>
            <p className="text-xs text-muted-foreground">
              양조장명 · 대표 연락처 · 하시고 싶은 질문을 함께 보내주세요
            </p>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            곧 온라인 신청 폼이 이 자리에 추가됩니다.
          </p>
        </div>
      </section>

    </main>
  );
}

function Benefit({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="text-primary" aria-hidden>✓</span>
        <h3 className="font-serif text-base font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function Feature({ badge, title, desc }: { badge: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] uppercase tracking-wider text-primary">
        {badge}
      </span>
      <h3 className="mt-4 font-serif text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function Point({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="flex gap-5">
      <span className="font-serif text-lg text-primary/70">{num}</span>
      <div>
        <h3 className="font-serif text-xl font-medium">{title}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
