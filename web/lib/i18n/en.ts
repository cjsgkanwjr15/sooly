import type { Dict } from "./ko";

/**
 * English mirror of ko.ts. Same shape enforced by `Dict` type — missing keys = compile error.
 */
export const en: Dict = {
  header: {
    nav: {
      products: "Products",
      breweries: "Breweries",
      journal: "Journal",
    },
    login: "Sign in",
    homeAria: "Sooly home",
  },
  userMenu: {
    aria: "User menu",
    myProfile: "My profile",
    settings: "Settings",
    signOut: "Sign out",
  },
  footer: {
    tagline:
      "Korean traditional alcohols — makgeolli, cheongju, soju, fruit wines. Curated.",
    // EN 모드에서는 부제 생략 (한 줄로 충분).
    taglineSub: "",
    sections: {
      browse: "Browse",
      breweries: "Breweries",
      about: "About",
    },
    categories: "Categories",
    verifiedPlan: "Verified plan",
    features: "Features",
    registerInquiry: "Register a brewery",
    aboutSooly: "About Sooly",
    contact: "Contact",
    copyright: "© 2026 Sooly · Korean alcohol hub",
    dataSource: "Some data via thesool.com (aT)",
  },
};
