import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "양조장을 위한 Sooly",
  description:
    "Sooly 는 한국술 정보 허브입니다. 1기 양조장 5~10곳을 모집해 함께 가격·기능을 정합니다. 공식 양조장 등록과 페이지 직접 관리는 앞으로도 무료, 비즈니스 도구만 정식 출시 시 유료입니다.",
};

// mailto prefill — 양조장이 빈칸만 채울 수 있게 양식 미리 들어감.
// URL encode 안 한 한글 OK (브라우저가 자동 처리). %0A = 줄바꿈.
const MAILTO = (() => {
  const subject = "[Sooly] 1기 양조장 등록 문의";
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
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            1기 양조장 5~10곳 모집 중
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            양조장의 이야기를<br />
            <em className="not-italic text-primary">직접</em> 들려주세요.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sooly 는 양조장 {400}곳 이상과 제품 {800}종을 담은 한국술 정보 허브입니다.
            1기 양조장과 함께 가격·기능을 정직하게 정하고, 공식 양조장 페이지 운영은 앞으로도
            무료로 운영합니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="#contact"
              className={buttonVariants({ size: "lg" })}
            >
              1기 양조장 신청
            </Link>
            <Link
              href="#plans"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              플랜 비교
            </Link>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            💡 1기 양조장은 정식 출시 후 6개월 무료 + 평생 가격 락인 + 의사결정 직접 참여.
            선착순 5~10곳 모집 후 마감합니다.
          </p>
        </div>
      </section>

      {/* 공식 양조장 — 앞으로도 무료 */}
      <section id="features" className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            공식 양조장 · 앞으로도 무료
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            양조장이 직접 페이지를 관리합니다
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            공식 양조장으로 등록되면 페이지를 직접 관리할 수 있는 다섯 가지 기능을 쓰실 수 있어요.
            결제·약정 없고, 정식 출시 이후에도 영구 무료로 운영합니다. 메일 한 통이면 시작합니다.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            <Benefit
              num="01"
              title="공식 ✓ 뱃지"
              desc="양조장 페이지에 '공식 ✓' 뱃지. 진짜 운영자가 관리하는 공간임을 사용자에게 명시."
            />
            <Benefit
              num="02"
              title="양조장 이야기 등재"
              desc="역사·철학·대표 인터뷰. 사용자가 제품을 선택할 때 결정타가 되는 컨텍스트."
            />
            <Benefit
              num="03"
              title="공식 사진 업로드"
              desc="양조장 전경·설비·대표 사진. 현재 플레이스홀더 자리를 진짜 사진으로."
            />
            <Benefit
              num="04"
              title="제품 정보 수정"
              desc="크롤링 시점 이후 변경된 도수·용량·원재료·페어링 직접 업데이트."
            />
            <Benefit
              num="05"
              title="체크인에 양조장 답변"
              desc="사용자가 남긴 체크인·평가에 양조장 입장에서 답글. 팬과 직접 대화하는 채널."
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
                  <strong className="text-foreground">본인 확인</strong> — Sooly 가
                  보내주신 자료로 양조장 운영자 본인임을 확인합니다 (보통 1영업일).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-primary">3.</span>
                <span>
                  <strong className="text-foreground">반영</strong> — 본인 확인
                  완료 후 양조장 페이지에 공식 ✓ 뱃지 + 보내주신 정보·사진이 24시간 내 게재됩니다.
                </span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* 플랜 비교 — 3-tier */}
      <section id="plans" className="border-b px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            플랜 비교
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            세 가지 단계 — 어디까지 무료, 어디부터 유료
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Sooly 는 모든 양조장이 기본 등재되고, 운영자 본인 확인 후 공식 양조장이 되면 페이지를
            직접 관리할 수 있고 (앞으로도 무료), 비즈니스 도구는 정식 출시 시 유료로 전환됩니다.
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <PlanCard
              tone="muted"
              name="기본"
              price="무료"
              priceNote="자동 등재 — 신청 불필요"
              tagline="Sooly 카탈로그에 양조장·제품 자동 노출. 운영자 신청 없이도 누구나 발견 가능."
              features={[
                "카탈로그·검색 자동 등재",
                "사용자 체크인·별점 노출",
                "Schema.org 구조화 데이터",
                "한/영 페이지 자동 생성",
              ]}
            />
            <PlanCard
              tone="primary"
              highlight
              badge="앞으로도 무료"
              name="공식"
              price="0원"
              priceNote="정식 출시 후에도 영구 무료"
              tagline="양조장 운영자가 페이지를 직접 관리. 사용자에게 '진짜 양조장이 운영하는 페이지' 신호."
              features={[
                "공식 ✓ 뱃지",
                "양조장 이야기·소개글 등재",
                "공식 사진 업로드",
                "제품 정보 수정",
                "체크인에 양조장 답변",
              ]}
            />
            <PlanCard
              tone="dim"
              badge="개발 중"
              name="비즈니스"
              price="가격 미정"
              priceNote="1기 양조장과 함께 정함 (정식 출시 시 유료)"
              tagline="양조장 마케팅·데이터 도구. 사용자 행동 분석 + 능동적 홍보 채널."
              features={[
                "조회수·체크인 통계 (양조장·제품별)",
                "신제품 우선 노출 (홈·카테고리)",
                "양조장 공지·뉴스피드 (팔로워 알림)",
                "검색 키워드 리포트 (SEO 인사이트)",
              ]}
            />
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            * 플랜 이름과 가격은 1기 양조장 5~10곳과 협의 후 정식 출시 시 확정됩니다. 위 표는 현재
            계획안이며, 1기 양조장 의견에 따라 변경될 수 있습니다.
          </p>
        </div>
      </section>

      {/* 1기 양조장 약속 */}
      <section className="border-b bg-[color-mix(in_oklab,var(--color-primary)_3%,var(--color-background))] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            1기 양조장 모집 · 선착순 5~10곳
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            함께 시작할 양조장과 가격·기능을 정합니다
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Sooly 는 양조장에게 정말 필요한 도구만 만들고 가격도 정직하게 매기고 싶어요.
            그래서 첫 5~10 양조장과 직접 대화해서 무엇을 만들지·얼마면 합리적인지 함께
            정합니다. 1기 양조장에 합류하시면 네 가지를 약속드립니다.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <PromiseCard
              num="01"
              title="의사결정 직접 참여"
              desc="분석·홍보 도구의 기능 우선순위, 가격 구조, 약관까지 양조장 의견을 그대로 반영합니다."
            />
            <PromiseCard
              num="02"
              title="정식 출시 후 6개월 무료"
              desc="유료 전환 시점에도 1기 양조장은 첫 6개월 동안 모든 도구를 무료로 사용하세요."
            />
            <PromiseCard
              num="03"
              title="평생 가격 락인"
              desc="6개월 이후 가격이 인상되어도 1기 양조장은 처음 정한 가격이 평생 유지됩니다."
            />
            <PromiseCard
              num="04"
              title="1기 양조장 표기"
              desc="양조장 페이지와 Sooly 공식 채널에 '1기 양조장' 표기. 함께 시작한 기여가 남습니다."
            />
          </div>

          <div className="mt-10 rounded-xl border border-primary/25 bg-card p-6">
            <h3 className="font-serif text-base font-medium">신청 자격</h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• 한국 내 양조 면허를 보유한 양조장</li>
              <li>
                • 양조장 운영자 본인 (대표·실장·마케팅 담당) — 인증 자료는{" "}
                <Link href="#contact" className="underline underline-offset-2">
                  하단
                </Link>{" "}
                참조
              </li>
              <li>
                • 사이트가 양조장 페이지를 보강할 수 있도록 기본 정보 (이야기·사진 1~2장) 제공
                의사
              </li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              5~10곳이 채워지면 모집을 마감하고 정식 출시 준비에 들어갑니다.
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

      {/* FAQ */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">자주 묻는 질문</h2>
          <div className="mt-10 space-y-5">
            <Faq q="공식 양조장 등록은 정말 영구 무료인가요?">
              네. 결제·카드 등록·약정 없음. 공식 ✓ 뱃지·양조장 이야기 등재·사진 업로드·제품 정보 수정·체크인 답변은 양조장 운영자라면 누구나 영구 무료로 쓰실 수 있습니다. 정식 출시 후에도 이 정책은 유지됩니다.
            </Faq>
            <Faq q="유료 플랜 (비즈니스) 가격은 얼마인가요?">
              아직 정해지지 않았어요. 1기 양조장 5~10곳과 직접 만나서 정직한 가격을 함께 정할 계획입니다. 1기 양조장에 합류하시면 그 의사결정에 직접 참여하고, 정식 출시 시 첫 6개월 무료 + 평생 가격 락인 + 1기 양조장 표기를 받으실 수 있습니다.
            </Faq>
            <Faq q="지금 무료인 기능이 나중에 유료로 옮겨질 가능성도 있나요?">
              없습니다. 공식 양조장의 다섯 가지 기능 (공식 ✓ 뱃지·이야기 등재·사진·제품 수정·체크인 답변) 은 Sooly 의 커뮤니티 자산이라 영구 무료입니다. 유료화는 비즈니스 도구에만 적용됩니다.
            </Faq>
            <Faq q="운영자 본인 확인은 어떻게 하나요?">
              사업자등록증 사본 / 양조장 공식 도메인 이메일 / 양조장 공식 인스타·홈페이지 운영 증명 중 하나면 됩니다. Sooly 가 직접 확인 후 1영업일 내 답신드려요.
            </Faq>
            <Faq q="제품 정보 수정·사진 업로드는 양조장이 직접 하나요?">
              지금은 메일로 보내주시면 Sooly 가 24시간 내 반영합니다. 양조장 운영자가 직접 수정할 수 있는 관리 인터페이스는 1기 양조장과 함께 정식 출시 시점에 도입 예정입니다.
            </Faq>
            <Faq q="저희 양조장이 Sooly 에 이미 등록돼 있나요?">
              전국 1,300곳 양조장 중 약 400곳, 제품 791종이 이미 카탈로그에 있습니다. 메일로 양조장명 알려주시면 등록 여부 + 페이지 URL 을 답신드려요. 미등록 양조장도 신규 등록은 무료입니다.
            </Faq>
            <Faq q="1기 양조장 모집은 언제 마감되나요?">
              5~10곳이 채워지면 마감하고 정식 출시 준비에 들어갑니다. 정확한 마감일은 정해두지 않았고, 신청 순서대로 본인 확인 후 합류해주세요. 마감 후에는 일반 공식 양조장 신청은 계속 받지만 1기 혜택 (6개월 무료·평생 락인·1기 표기) 은 적용되지 않습니다.
            </Faq>
            <Faq q="중간에 그만두고 싶으면 어떻게 하나요?">
              언제든. 메일 한 통이면 공식 등록 해제·정보 비공개 모두 가능하고, 데이터는 즉시 삭제 또는 비공개 처리됩니다. 1기 양조장도 마찬가지입니다.
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
            1기 양조장 신청하기
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            아래 버튼을 누르면 메일 양식이 자동으로 채워져요.
            빈칸만 채워서 보내주시면 1영업일 내 답신드립니다. 1기 양조장 이외 일반 인증
            신청도 같은 메일로 받습니다 — 본문에 알려주세요.
          </p>

          <div className="mt-9 flex justify-center">
            <a
              href={MAILTO}
              className={buttonVariants({ size: "lg" })}
            >
              ✉️ 1기 양조장 신청하기 (메일 양식 자동)
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

function PlanCard({
  name,
  price,
  priceNote,
  tagline,
  features,
  tone,
  highlight,
  badge,
}: {
  name: string;
  price: string;
  priceNote: string;
  tagline: string;
  features: string[];
  tone: "muted" | "primary" | "dim";
  highlight?: boolean;
  badge?: string;
}) {
  // tone 마다 bg / border / 헤더 텍스트 색이 달라져 어떤 게 "지금 여기" (공식) 인지 시각적으로
  // 강조. dim 은 "아직 개발 중" 느낌, primary 는 운영 중인 권장 플랜.
  const containerCls =
    tone === "primary"
      ? "border-primary/40 bg-card shadow-sm"
      : tone === "dim"
        ? "border-border/60 bg-card/40"
        : "border-border/60 bg-card";
  const priceCls =
    tone === "primary"
      ? "text-primary"
      : tone === "dim"
        ? "text-muted-foreground"
        : "text-foreground";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 ${containerCls} ${highlight ? "lg:-translate-y-2" : ""}`}
    >
      {badge && (
        <span
          className={`absolute -top-3 left-7 rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
            tone === "primary"
              ? "bg-primary text-primary-foreground"
              : "bg-foreground/80 text-background"
          }`}
        >
          {badge}
        </span>
      )}
      <div>
        <h3 className="font-serif text-xl font-semibold">{name}</h3>
        <div className="mt-3 flex items-baseline gap-2">
          <span className={`font-serif text-3xl font-medium ${priceCls}`}>
            {price}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{priceNote}</p>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          {tagline}
        </p>
      </div>
      <ul className="mt-6 space-y-2.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex gap-2.5 leading-relaxed">
            <span aria-hidden className="text-primary/70">
              ✓
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PromiseCard({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-baseline gap-3">
        <span className="font-serif text-sm text-primary/70">{num}</span>
        <h3 className="font-serif text-base font-medium">{title}</h3>
      </div>
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
