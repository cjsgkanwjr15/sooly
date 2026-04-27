import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "양조장을 위한 Sooly",
  description:
    "Sooly 는 한국술 정보 허브입니다. 양조장 인증 페이지·공식 데이터 등록·향후 분석 도구를 무료로 시작하세요.",
};

// mailto prefill — 양조장이 빈칸만 채울 수 있게 양식 미리 들어감.
// URL encode 안 한 한글 OK (브라우저가 자동 처리). %0A = 줄바꿈.
const MAILTO = (() => {
  const subject = "[Sooly Verified] 양조장 등록 문의";
  const body = [
    "1. 양조장명 (한글):",
    "2. 양조장명 (영문, 있으면):",
    "3. 신청자 이름 + 직책 (예: 홍길동 / 대표):",
    "4. 연락처 (휴대폰 또는 이메일):",
    "5. 인증 자료 (택1):",
    "   ㄱ. 사업자등록증 사본 첨부",
    "   ㄴ. 양조장 공식 도메인 이메일 (예: kim@brewery.co.kr)",
    "   ㄷ. 양조장 공식 인스타·홈페이지 운영자임을 증명할 자료",
    "6. 하고 싶은 것 (제품 정보 수정 / 사진 업로드 / 양조장 스토리 추가 등):",
    "",
    "",
    "(추가로 궁금한 점이 있으시면 자유롭게 적어주세요.)",
  ].join("\n");
  return `mailto:soolyhello@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
})();

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
            지금 인증 신청하시면 양조장 페이지를 직접 관리하고, 사용자가 발견하는 첫 인상을
            바꿀 수 있어요.
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
              지금 무료로 가능한 것
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            💡 현재 얼리어답터 양조장과 함께 가격·기능을 결정합니다. 합류 시 의견이 곧바로
            반영돼요.
          </p>
        </div>
      </section>

      {/* 지금 무료로 가능한 것 */}
      <section id="features" className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            지금, 무료로 — 양조장이 직접 할 수 있는 것
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            아래 네 가지는 메일 한 통으로 시작합니다. 결제 없음, 약정 없음.
            인증 후 24시간 내 반영됩니다.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            <Benefit
              num="01"
              title="공식 페이지 인증"
              desc="양조장 페이지에 'Verified ✓' 뱃지. 진짜 운영자가 관리하는 공간임을 사용자에게 명시."
            />
            <Benefit
              num="02"
              title="양조장 이야기·소개글 등재"
              desc="역사·철학·대표 인터뷰. 사용자가 제품 선택 시 결정타가 되는 컨텍스트."
            />
            <Benefit
              num="03"
              title="공식 사진 업로드"
              desc="양조장 전경·설비·대표 사진. 현재 플레이스홀더 자리를 진짜 사진으로."
            />
            <Benefit
              num="04"
              title="제품 정보 수정"
              desc="크롤링 시점 이후 변경된 도수·용량·원재료·페어링 업데이트."
            />
          </ul>

          {/* 신청 절차 */}
          <div className="mt-12 rounded-xl border border-primary/15 bg-primary/[0.03] p-6">
            <h3 className="font-serif text-lg font-medium">신청 절차 — 3 step</h3>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="font-serif text-primary">1.</span>
                <span>
                  <strong className="text-foreground">메일 작성</strong> —
                  아래{" "}
                  <Link href="#contact" className="underline underline-offset-2">
                    등록 문의
                  </Link>{" "}
                  버튼을 누르면 메일 양식이 자동으로 채워져요. 빈칸만 채워서 보내세요.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-primary">2.</span>
                <span>
                  <strong className="text-foreground">검증</strong> — Sooly 가
                  보내주신 자료로 양조장 운영자 본인임을 확인합니다 (보통 1영업일).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-primary">3.</span>
                <span>
                  <strong className="text-foreground">반영</strong> — 인증 완료
                  후 양조장 페이지에 Verified 뱃지 + 보내주신 정보·사진이 24시간 내 게재됩니다.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Verified 플랜 — 솔직 모드 */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            Verified Plan · 가격 결정 단계
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            유료 플랜 — 첫 양조장과 함께 결정합니다
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Sooly 는 양조장에게 정말 필요한 도구만 만들고 가격도 정직하게 매기고 싶어요.
            그래서 첫 5~10 양조장 cohort 와 직접 대화해서 무엇을 만들지·얼마면 합리적인지
            함께 정합니다. 지금 합류하시면:
          </p>
          <ul className="mt-6 space-y-3 text-[1rem] leading-relaxed">
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>가격·기능 의사결정에 직접 참여</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>유료 출시 시 첫 6개월 무료 (얼리어답터 혜택)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary">→</span>
              <span>출시 후에도 평생 얼리어답터 가격 락인</span>
            </li>
          </ul>

          <div className="mt-10">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              개발 중인 것 (cohort 의견 기반으로 우선순위 정함)
            </h3>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <Feature
                badge="Dashboard"
                title="조회수 & 체크인 분석"
                desc="양조장·제품별 조회수, 평균 별점, 어떤 제품이 어느 지역·연령대에서 인기인지."
              />
              <Feature
                badge="Publishing"
                title="양조장 공지 & 뉴스피드"
                desc="신제품 출시·이벤트·방문 안내를 직접 공지. 양조장 팔로워에게 자동 알림."
              />
              <Feature
                badge="Promotion"
                title="신제품 우선 노출"
                desc="홈 & 카테고리 '이번 주 신제품' 섹션 배치."
              />
              <Feature
                badge="Insights"
                title="검색 키워드 리포트"
                desc="사용자가 양조장·제품을 어떤 검색어로 발견하는지. SEO 인사이트."
              />
            </div>
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

      {/* FAQ */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">자주 묻는 질문</h2>
          <div className="mt-10 space-y-5">
            <Faq q="지금 무료로 가능한 것 — 정말 무료인가요?">
              네. 결제 없음, 카드 등록 없음, 약정 없음. 양조장 페이지 인증·소개글 등재·사진 업로드·제품 수정은 양조장 운영자라면 누구나 무료로 사용할 수 있어요.
            </Faq>
            <Faq q="Verified 플랜 가격은 얼마인가요?">
              아직 정해지지 않았어요. 첫 5~10 양조장 cohort 와 직접 만나서 정직한 가격을 함께 정할 계획입니다. 지금 합류하시면 그 의사결정에 참여하고, 유료 출시 시 첫 6개월 무료 + 얼리어답터 가격 락인을 받으실 수 있어요.
            </Faq>
            <Faq q="인증은 어떻게 검증하나요?">
              사업자등록증 사본 / 양조장 공식 도메인 이메일 / 양조장 공식 인스타·홈페이지 운영 증명 중 하나면 됩니다. Sooly 가 직접 확인 후 1영업일 내 답신드려요.
            </Faq>
            <Faq q="제품 정보 수정·사진 업로드는 양조장이 직접 하나요?">
              지금은 메일로 보내주시면 Sooly 가 반영합니다 (24시간 내). Verified 플랜에는 양조장 운영자가 직접 수정할 수 있는 인터페이스가 포함될 예정이에요.
            </Faq>
            <Faq q="저희 양조장이 Sooly 에 이미 등록돼 있나요?">
              전국 1,300곳 양조장 중 약 400곳, 제품 791종이 이미 카탈로그에 있습니다. 메일로 양조장명 알려주시면 등록 여부 + 페이지 URL 을 답신드려요. (없으면 신규 등록도 무료입니다.)
            </Faq>
            <Faq q="중간에 그만두고 싶으면 어떻게 하나요?">
              언제든. 지금은 메일 한 통이면 인증 해제·정보 비공개 모두 가능합니다. 데이터는 즉시 삭제 또는 비공개 처리됩니다.
            </Faq>
          </div>
        </div>
      </section>

      {/* 문의 */}
      <section
        id="contact"
        className="border-b bg-[color-mix(in_oklab,var(--color-primary)_4%,var(--color-background))] px-6 py-20"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            함께 만들 양조장을 찾습니다
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            등록 문의 버튼을 누르면 메일 양식이 자동으로 채워져요.
            빈칸만 채워서 보내주시면 1영업일 내 답신드립니다.
          </p>

          <div className="mt-9 flex justify-center">
            <a
              href={MAILTO}
              className={buttonVariants({ size: "lg" })}
            >
              ✉️ 등록 문의하기 (메일 양식 자동 채움)
            </a>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            메일 클라이언트가 안 열리면 직접 보내주세요 →{" "}
            <a
              href="mailto:soolyhello@gmail.com"
              className="font-medium text-foreground underline underline-offset-2"
            >
              soolyhello@gmail.com
            </a>
          </p>

          <div className="mt-12 rounded-xl border bg-card p-6 text-left">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              메일에 함께 보내주실 정보
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>1. 양조장명 (한글) + 영문 표기</li>
              <li>2. 신청자 이름 + 직책 (예: 홍길동 / 대표)</li>
              <li>3. 연락처 — 휴대폰 또는 이메일</li>
              <li>
                4. 인증 자료 — 사업자등록증 사본 / 공식 도메인 이메일 / 공식 인스타·홈페이지
                운영 증명 중 하나
              </li>
              <li>5. 하고 싶은 것 (제품 수정 / 사진 / 양조장 스토리 등)</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

function Benefit({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-sm text-primary/70">{num}</span>
        <h3 className="font-serif text-base font-medium">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </div>
  );
}

function Feature({
  badge,
  title,
  desc,
}: {
  badge: string;
  title: string;
  desc: string;
}) {
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

function Point({
  num,
  title,
  body,
}: {
  num: string;
  title: string;
  body: string;
}) {
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

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-lg border bg-card p-5 transition-colors open:border-primary/30">
      <summary className="cursor-pointer list-none">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-base font-medium">{q}</h3>
          <span
            aria-hidden
            className="mt-0.5 shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
          >
            +
          </span>
        </div>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </details>
  );
}
