import Link from "next/link";
import type { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: t(locale, "forBreweries.metaTitle"),
    description: t(locale, "forBreweries.metaDescription"),
  };
}

export default async function ForBreweriesPage() {
  const locale = await getLocale();

  // mailto prefill — 양조장이 빈칸만 채울 수 있게 양식 미리 들어감.
  const mailto = `mailto:soolyhello@gmail.com?subject=${encodeURIComponent(
    t(locale, "forBreweries.contact.mailtoSubject"),
  )}&body=${encodeURIComponent(t(locale, "forBreweries.contact.mailtoBody"))}`;

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
            {t(locale, "forBreweries.hero.pill")}
          </div>
          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {t(locale, "forBreweries.hero.h1Line1")}
            <br />
            {t(locale, "forBreweries.hero.h1Line2Pre")}
            <em className="not-italic text-primary">
              {t(locale, "forBreweries.hero.h1Line2Highlight")}
            </em>
            {t(locale, "forBreweries.hero.h1Line2Post")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t(locale, "forBreweries.hero.description", {
              breweryCount: 400,
              productCount: 800,
            })}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="#contact" className={buttonVariants({ size: "lg" })}>
              {t(locale, "forBreweries.hero.apply")}
            </Link>
            <Link
              href="#plans"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              {t(locale, "forBreweries.hero.compare")}
            </Link>
          </div>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            {t(locale, "forBreweries.hero.note")}
          </p>
        </div>
      </section>

      {/* 공식 양조장 — 앞으로도 무료 */}
      <section id="features" className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            {t(locale, "forBreweries.features.subtitle")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            {t(locale, "forBreweries.features.h2")}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            {t(locale, "forBreweries.features.description")}
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            <Benefit
              num="01"
              title={t(locale, "forBreweries.features.benefit1Title")}
              desc={t(locale, "forBreweries.features.benefit1Desc")}
            />
            <Benefit
              num="02"
              title={t(locale, "forBreweries.features.benefit2Title")}
              desc={t(locale, "forBreweries.features.benefit2Desc")}
            />
            <Benefit
              num="03"
              title={t(locale, "forBreweries.features.benefit3Title")}
              desc={t(locale, "forBreweries.features.benefit3Desc")}
            />
            <Benefit
              num="04"
              title={t(locale, "forBreweries.features.benefit4Title")}
              desc={t(locale, "forBreweries.features.benefit4Desc")}
            />
            <Benefit
              num="05"
              title={t(locale, "forBreweries.features.benefit5Title")}
              desc={t(locale, "forBreweries.features.benefit5Desc")}
            />
          </ul>

          {/* 신청 절차 */}
          <div className="mt-12 rounded-xl border border-primary/15 bg-primary/[0.03] p-6">
            <h3 className="font-serif text-lg font-medium">
              {t(locale, "forBreweries.steps.h3")}
            </h3>
            <ol className="mt-4 space-y-3 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="font-serif text-primary">1.</span>
                <span>
                  <strong className="text-foreground">
                    {t(locale, "forBreweries.steps.step1Strong")}
                  </strong>
                  {" — "}
                  {t(locale, "forBreweries.steps.step1BodyPre")}
                  <Link href="#contact" className="underline underline-offset-2">
                    {t(locale, "forBreweries.steps.step1Link")}
                  </Link>
                  {t(locale, "forBreweries.steps.step1BodyPost")}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-primary">2.</span>
                <span>
                  <strong className="text-foreground">
                    {t(locale, "forBreweries.steps.step2Strong")}
                  </strong>
                  {t(locale, "forBreweries.steps.step2Body")}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-serif text-primary">3.</span>
                <span>
                  <strong className="text-foreground">
                    {t(locale, "forBreweries.steps.step3Strong")}
                  </strong>
                  {t(locale, "forBreweries.steps.step3Body")}
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
            {t(locale, "forBreweries.plans.subtitle")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            {t(locale, "forBreweries.plans.h2")}
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            {t(locale, "forBreweries.plans.description")}
          </p>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <PlanCard
              tone="muted"
              name={t(locale, "forBreweries.plans.freeName")}
              price={t(locale, "forBreweries.plans.freePrice")}
              priceNote={t(locale, "forBreweries.plans.freePriceNote")}
              tagline={t(locale, "forBreweries.plans.freeTagline")}
              features={[
                t(locale, "forBreweries.plans.freeFeature1"),
                t(locale, "forBreweries.plans.freeFeature2"),
                t(locale, "forBreweries.plans.freeFeature3"),
                t(locale, "forBreweries.plans.freeFeature4"),
              ]}
            />
            <PlanCard
              tone="primary"
              highlight
              badge={t(locale, "forBreweries.plans.officialBadge")}
              name={t(locale, "forBreweries.plans.officialName")}
              price={t(locale, "forBreweries.plans.officialPrice")}
              priceNote={t(locale, "forBreweries.plans.officialPriceNote")}
              tagline={t(locale, "forBreweries.plans.officialTagline")}
              features={[
                t(locale, "forBreweries.plans.officialFeature1"),
                t(locale, "forBreweries.plans.officialFeature2"),
                t(locale, "forBreweries.plans.officialFeature3"),
                t(locale, "forBreweries.plans.officialFeature4"),
                t(locale, "forBreweries.plans.officialFeature5"),
              ]}
            />
            <PlanCard
              tone="dim"
              badge={t(locale, "forBreweries.plans.businessBadge")}
              name={t(locale, "forBreweries.plans.businessName")}
              price={t(locale, "forBreweries.plans.businessPrice")}
              priceNote={t(locale, "forBreweries.plans.businessPriceNote")}
              tagline={t(locale, "forBreweries.plans.businessTagline")}
              features={[
                t(locale, "forBreweries.plans.businessFeature1"),
                t(locale, "forBreweries.plans.businessFeature2"),
                t(locale, "forBreweries.plans.businessFeature3"),
                t(locale, "forBreweries.plans.businessFeature4"),
              ]}
            />
          </div>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            {t(locale, "forBreweries.plans.note")}
          </p>
        </div>
      </section>

      {/* 1기 양조장 약속 */}
      <section className="border-b bg-[color-mix(in_oklab,var(--color-primary)_3%,var(--color-background))] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-widest text-primary/70">
            {t(locale, "forBreweries.cohort.subtitle")}
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            {t(locale, "forBreweries.cohort.h2")}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            {t(locale, "forBreweries.cohort.description")}
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <PromiseCard
              num="01"
              title={t(locale, "forBreweries.cohort.promise1Title")}
              desc={t(locale, "forBreweries.cohort.promise1Desc")}
            />
            <PromiseCard
              num="02"
              title={t(locale, "forBreweries.cohort.promise2Title")}
              desc={t(locale, "forBreweries.cohort.promise2Desc")}
            />
            <PromiseCard
              num="03"
              title={t(locale, "forBreweries.cohort.promise3Title")}
              desc={t(locale, "forBreweries.cohort.promise3Desc")}
            />
            <PromiseCard
              num="04"
              title={t(locale, "forBreweries.cohort.promise4Title")}
              desc={t(locale, "forBreweries.cohort.promise4Desc")}
            />
          </div>

          <div className="mt-10 rounded-xl border border-primary/25 bg-card p-6">
            <h3 className="font-serif text-base font-medium">
              {t(locale, "forBreweries.cohort.eligibilityH3")}
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <li>• {t(locale, "forBreweries.cohort.eligibility1")}</li>
              <li>
                •{" "}
                {t(locale, "forBreweries.cohort.eligibility2Pre")}
                <Link href="#contact" className="underline underline-offset-2">
                  {t(locale, "forBreweries.cohort.eligibility2Link")}
                </Link>
                {t(locale, "forBreweries.cohort.eligibility2Post")}
              </li>
              <li>• {t(locale, "forBreweries.cohort.eligibility3")}</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {t(locale, "forBreweries.cohort.cap")}
            </p>
          </div>
        </div>
      </section>

      {/* 왜 Sooly? */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            {t(locale, "forBreweries.why.h2")}
          </h2>
          <div className="mt-10 space-y-8 text-[1.05rem] leading-relaxed">
            <Point
              num="01"
              title={t(locale, "forBreweries.why.point1Title")}
              body={t(locale, "forBreweries.why.point1Body")}
            />
            <Point
              num="02"
              title={t(locale, "forBreweries.why.point2Title")}
              body={t(locale, "forBreweries.why.point2Body")}
            />
            <Point
              num="03"
              title={t(locale, "forBreweries.why.point3Title")}
              body={t(locale, "forBreweries.why.point3Body")}
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-3xl font-semibold tracking-tight">
            {t(locale, "forBreweries.faq.h2")}
          </h2>
          <div className="mt-10 space-y-5">
            {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((n) => (
              <Faq
                key={n}
                q={t(locale, `forBreweries.faq.q${n}` as const)}
                a={t(locale, `forBreweries.faq.a${n}` as const)}
              />
            ))}
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
            {t(locale, "forBreweries.contact.h2")}
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {t(locale, "forBreweries.contact.description")}
          </p>

          <div className="mt-9 flex justify-center">
            <a href={mailto} className={buttonVariants({ size: "lg" })}>
              {t(locale, "forBreweries.contact.cta")}
            </a>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            {t(locale, "forBreweries.contact.fallbackPrefix")}{" "}
            <a
              href="mailto:soolyhello@gmail.com"
              className="font-medium text-foreground underline underline-offset-2"
            >
              soolyhello@gmail.com
            </a>
          </p>

          <div className="mt-12 rounded-xl border bg-card p-6 text-left">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t(locale, "forBreweries.contact.infoHeader")}
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>{t(locale, "forBreweries.contact.info1")}</li>
              <li>{t(locale, "forBreweries.contact.info2")}</li>
              <li>{t(locale, "forBreweries.contact.info3")}</li>
              <li>{t(locale, "forBreweries.contact.info4")}</li>
              <li>{t(locale, "forBreweries.contact.info5")}</li>
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

function Faq({ q, a }: { q: string; a: string }) {
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
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  );
}
