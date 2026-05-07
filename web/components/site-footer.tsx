import Link from "next/link";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function SiteFooter() {
  const locale = await getLocale();
  const taglineSub = t(locale, "footer.taglineSub");

  return (
    <footer className="mt-auto border-t bg-[color-mix(in_oklab,var(--color-primary)_2%,var(--color-background))]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-serif text-lg font-semibold text-primary">Sooly</div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t(locale, "footer.tagline")}
              {taglineSub && (
                <>
                  <br />
                  {taglineSub}
                </>
              )}
            </p>
          </div>

          <FooterCol
            title={t(locale, "footer.sections.browse")}
            links={[
              { href: "/products", label: t(locale, "header.nav.products") },
              { href: "/breweries", label: t(locale, "header.nav.breweries") },
              { href: "/categories/탁주", label: t(locale, "footer.categories") },
              { href: "/blog", label: t(locale, "header.nav.journal") },
            ]}
          />

          <FooterCol
            title={t(locale, "footer.sections.breweries")}
            links={[
              { href: "/for-breweries", label: t(locale, "footer.verifiedPlan") },
              { href: "/for-breweries#features", label: t(locale, "footer.features") },
              { href: "/for-breweries#contact", label: t(locale, "footer.registerInquiry") },
            ]}
          />

          <FooterCol
            title={t(locale, "footer.sections.about")}
            links={[
              { href: "/blog/welcome", label: t(locale, "footer.aboutSooly") },
              { href: "mailto:soolyhello@gmail.com", label: t(locale, "footer.contact") },
            ]}
          />
        </div>

        <div className="mt-10 border-t pt-6 text-xs text-muted-foreground">
          <p>{t(locale, "footer.copyright")}</p>
          <p className="mt-1">{t(locale, "footer.dataSource")}</p>
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
