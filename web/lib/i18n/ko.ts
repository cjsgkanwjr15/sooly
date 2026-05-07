/**
 * Sooly · 한국어 사전 (master)
 *
 * 이 파일은 모든 UI 라벨의 single source of truth. en.ts 는 같은 shape 을 강제로 mirror.
 * 새 키를 추가할 땐 ko + en 양쪽 다 채울 것 (타입 시스템이 누락 시 컴파일 에러).
 *
 * 구조 원칙:
 *   - 페이지·컴포넌트별 namespace (header, footer, products, checkin, ...)
 *   - 짧은 라벨은 직접 키 (e.g. "save"), 긴 문장은 의미 기반 키 (e.g. "checkInPrompt")
 *   - 매개변수 치환은 추후 필요할 때 t() 에 두 번째 arg 추가 (지금은 plain string only)
 */
export const ko = {
  header: {
    nav: {
      products: "제품",
      breweries: "양조장",
      journal: "Journal",
    },
    login: "로그인",
    homeAria: "Sooly 홈",
  },
  userMenu: {
    aria: "사용자 메뉴",
    myProfile: "내 프로필",
    settings: "설정",
    signOut: "로그아웃",
  },
  footer: {
    tagline: "한국 전통주·막걸리·소주·과실주 정보 허브.",
    // taglineSub 가 빈 문자열이면 footer 가 두 번째 줄을 렌더하지 않음.
    taglineSub: "Korean alcohol, curated.",
    sections: {
      browse: "둘러보기",
      breweries: "양조장",
      about: "About",
    },
    categories: "카테고리",
    verifiedPlan: "Verified 플랜",
    features: "제공 기능",
    registerInquiry: "등록 문의",
    aboutSooly: "Sooly 소개",
    contact: "문의하기",
    copyright: "© 2026 Sooly · 한국술 정보 허브",
    dataSource: "일부 데이터 출처: 더술닷컴(aT)",
  },
} as const;

/**
 * `as const` 가 ko 의 모든 string 을 literal 로 좁혀서 DotPath 추출이 정확하게 됨.
 * 단 en 은 다른 문자열을 써야 하므로, leaf 의 string literal 만 generic `string` 으로 widen.
 */
type Widen<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: Widen<T[K]> }
    : T;

export type Dict = Widen<typeof ko>;
