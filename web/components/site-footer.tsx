import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-[color-mix(in_oklab,var(--color-primary)_2%,var(--color-background))]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-serif text-lg font-semibold text-primary">Sooly</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              한국 전통주·막걸리·소주·과실주 정보 허브.
              <br />
              Korean alcohol, curated.
            </p>
          </div>

          <FooterCol
            title="둘러보기"
            links={[
              { href: "/products", label: "제품" },
              { href: "/breweries", label: "양조장" },
              { href: "/categories/탁주", label: "카테고리" },
              { href: "/blog", label: "Journal" },
            ]}
          />

          <FooterCol
            title="양조장"
            links={[
              { href: "/for-breweries", label: "Verified 플랜" },
              { href: "/for-breweries#features", label: "제공 기능" },
              { href: "/for-breweries#contact", label: "등록 문의" },
            ]}
          />

          <FooterCol
            title="About"
            links={[
              { href: "/blog/welcome", label: "Sooly 소개" },
              { href: "mailto:soolyhello@gmail.com", label: "문의하기" },
            ]}
          />
        </div>

        <div className="mt-10 border-t pt-6 text-xs text-muted-foreground">
          <p>© 2026 Sooly · 한국술 정보 허브</p>
          <p className="mt-1">일부 데이터 출처: 더술닷컴(aT)</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
