/**
 * Sooly · 한국어 사전 (master)
 *
 * 이 파일은 모든 UI 라벨의 single source of truth. en.ts 는 같은 shape 을 강제로 mirror.
 * 새 키를 추가할 땐 ko + en 양쪽 다 채울 것 (타입 시스템이 누락 시 컴파일 에러).
 *
 * 구조 원칙:
 *   - 페이지·컴포넌트별 namespace (header, footer, products, checkin, ...)
 *   - 짧은 라벨은 직접 키 (e.g. "save"), 긴 문장은 의미 기반 키 (e.g. "checkInPrompt")
 *   - 매개변수 치환은 t() 의 vars 옵션 사용: t(locale, "key", { name: "x" })
 *     placeholder 는 `{name}` 형식.
 *   - DB 한국어 값을 key 로 쓰는 매핑 (categories, taste) 은 한국어 key 그대로.
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
    verifiedPlan: "양조장 신청",
    features: "제공 기능",
    registerInquiry: "등록 문의",
    aboutSooly: "Sooly 소개",
    contact: "문의하기",
    copyright: "© 2026 Sooly · 한국술 정보 허브",
    dataSource: "일부 데이터 출처: 더술닷컴(aT)",
  },

  /** 공통 라벨 (여러 페이지에서 재사용) */
  common: {
    save: "저장",
    saving: "저장 중...",
    cancel: "취소",
    delete: "삭제",
    edit: "수정",
    back: "뒤로",
    loading: "로딩 중...",
    error: "오류가 발생했어요",
    retry: "다시 시도",
    optional: "선택",
    required: "필수",
    viewAll: "전체 보기 →",
    seeMore: "더 보기 →",
    apply: "적용",
    reset: "초기화",
    close: "닫기",
    submit: "제출",
    submitting: "전송 중...",
    or: "또는",
    yes: "예",
    no: "아니오",
  },

  /** 카테고리 매핑 — DB column `category` 의 한국어 값을 locale 별 표시명으로. */
  categories: {
    탁주: "탁주",
    약주: "약주",
    청주: "청주",
    증류주: "증류주",
    과실주: "과실주",
    리큐르: "리큐르",
  },
  categoryHints: {
    탁주: "막걸리의 뿌리",
    약주: "맑고 우아한",
    청주: "한국의 정수",
    증류주: "강렬한 향기",
    과실주: "계절의 단맛",
    리큐르: "조화의 술",
  },

  /** 6축 맛 매핑 — check-in 폼 + 양조장 라인업의 taste 차트. */
  taste: {
    단맛: "단맛",
    산미: "산미",
    쓴맛: "쓴맛",
    감칠맛: "감칠맛",
    향: "향",
    목넘김: "목넘김",
  },
  tasteRadar: {
    emptyHint: "맛 프로필은 체크인 누적 후 표시됩니다",
  },
  ratingDisplay: {
    noCheckIns: "아직 체크인 없음",
    countSuffix: "체크인 {count}회",
  },
  photoPlaceholder: {
    primary: "사진 준비중이에요",
    secondary: "Photo coming soon",
  },
  brewerySlot: {
    productTitle: "양조장이 직접 전하는 이야기",
    breweryTitle: "{brewery} 의 공식 소식",
    breweryDefault: "양조장",
    productDesc:
      "이 제품을 만든 양조장이 곧 직접 전하는 이야기·신제품·이벤트가 이 공간에 업데이트됩니다.",
    breweryDesc:
      "이 양조장이 직접 업데이트하는 공지·신제품 소식·이벤트가 이 공간에 쌓입니다.",
    cta: "양조장이신가요? 공식 등록 문의 →",
    soon: "· 곧 출시 예정",
  },

  search: {
    placeholder: "제품·양조장 검색",
    aria: "검색",
    noResults: "검색 결과가 없어요",
    resultsForLabel: "검색 결과",
  },

  pagination: {
    prev: "이전",
    next: "다음",
    pageOf: "{page} / {total}",
  },

  filters: {
    category: "카테고리",
    region: "지역",
    clearAll: "필터 모두 해제",
    clear: "해제",
  },

  checkIn: {
    ratingLabel: "별점",
    ratingRequired: "*",
    ratingButtonAria: "{n}점",
    ratingSelected: "{n}점",
    ratingHint: "별 1~5개를 눌러주세요",
    pairingLabel: "함께 한 음식",
    pairingPlaceholder: "감자전, 보쌈, 회…",
    noteLabel: "한 줄 메모",
    notePlaceholder: "어떤 맛이었나요? 누구랑 마셨나요?",
    drankAtLabel: "마신 날",
    tasteLabel: "맛 프로필",
    tasteHint:
      "이 술의 맛을 1~5 로 평가해보세요. 다른 사람들의 평가와 합쳐져 육각형 차트로 표시됩니다.",
    tasteClearAll: "모두 지우기",
    tasteAxisAria: "{label} {n}점",
    submitCreate: "🍶 체크인 남기기",
    submitCreating: "기록 중...",
    submitEdit: "저장",
    submitEditing: "저장 중...",
    cancel: "취소",
    block: {
      title: "체크인을 남겨보세요",
      subtitleAnonymous:
        "별점과 함께 한 음식·한 줄 메모로 이 술을 기록해보세요.",
      subtitleLoggedIn: "같은 술이라도 마실 때마다 새로 기록할 수 있어요.",
      loginCta: "🍶 로그인하고 체크인하기",
    },
    list: {
      h2Pre: "체크인 (",
      h2Post: ")",
      empty: "아직 체크인이 없어요. 첫 번째가 되어보세요!",
      anonymous: "익명",
      youLabel: "당신",
      starsAria: "{n}점",
      editButton: "수정",
      editAria: "이 체크인 수정",
      deleteButton: "삭제",
      deleteAria: "이 체크인 삭제",
      deletePending: "삭제 중...",
      relativeNow: "방금",
      relativeMinutesSuffix: "분 전",
      relativeHoursSuffix: "시간 전",
      relativeDaysSuffix: "일 전",
      relativeMonthsSuffix: "달 전",
      relativeYearsSuffix: "년 전",
    },
  },

  notFound: {
    metaTitle: "페이지를 찾을 수 없어요",
    metaDescription: "찾으시는 페이지가 없거나 이동했어요.",
    code: "404",
    h1: "페이지를 찾을 수 없어요",
    body: "찾으시는 페이지가 없거나 이동했어요. 아래 링크에서 다시 시작해보세요.",
    homeTitle: "홈",
    homeSubtitle: "처음으로",
    productsTitle: "제품",
    productsSubtitle: "791개의 술",
    breweriesTitle: "양조장",
    breweriesSubtitle: "431곳의 양조장",
    journalTitle: "Journal",
    journalSubtitle: "최근 글",
  },

  blog: {
    metaTitle: "Journal",
    metaDescription:
      "한국술을 더 깊게 즐기기 위한 읽을거리. 양조장 방문기, 페어링 가이드, 전통주의 역사.",
    uppercase: "Journal",
    h1: "마시는 즐거움, 읽는 깊이",
    description:
      "양조장 방문기, 페어링 가이드, 전통주의 역사. 한국술을 더 풍성하게 즐기기 위한 읽을거리.",
    empty: "아직 게시글이 없습니다. 곧 첫 이야기가 올라옵니다.",
    minRead: "{n}분 읽기",
    monthLong: "{year}년 {month}월 {day}일",
    monthShort: "{year}년 {month}월 {day}일",
    backLink: "← Journal",
    notFoundTitle: "글 없음",
    fallbackToKo:
      "이 글은 영어로만 작성되어 있어요. 한국어 버전을 준비 중이에요.",
    fallbackToEn:
      "이 글은 한국어로만 작성되어 있어요. 영어 버전을 준비 중이에요.",
    byAuthor: "by {author}",
    bothAvailable: "영어 버전도 있어요 — 헤더의 EN 토글로 변경할 수 있어요.",
  },

  productDetail: {
    notFound: "제품 없음",
    crumbProducts: "제품",
    statAbv: "도수",
    statVolume: "용량",
    statCategory: "카테고리",
    statRegion: "지역",
    statEmpty: "—",
    tastingNotesH2: "맛 노트",
    tastingNotesEmpty: "큐레이팅된 맛 노트가 곧 제공됩니다.",
    ingredientsH2: "원재료",
    pairingsH2: "어울리는 음식",
    tasteProfileH3: "맛 프로필",
    breweryStoryH2: "{brewery} 이야기",
    breweryStoryMore: "양조장 자세히 보기 →",
    sameBreweryH3: "{brewery} 의 다른 제품",
    similarH2: "비슷한 {category}",
    similarSubtitle: "You might also like",
    similarMore: "더 보기 →",
    sourceLabel: "원본 출처:",
    sourceLinkText: "더술닷컴",
  },

  breweryDetail: {
    notFound: "양조장 없음",
    metaDescription: "{region} {name} 양조장 — 제품·스토리·위치 정보",
    crumbProducts: "제품",
    breweryUppercase: "양조장",
    foundedYearLabel: "설립 {year}년",
    visitingBadge: "찾아가는 양조장",
    addressH2: "주소",
    linksH2: "링크",
    storyH2: "이야기",
    storyEmptyTitle: "이야기",
    storyEmptyBody:
      "{brewery} 의 이야기·사진·세부 정보는 아직 채워지는 중이에요. 양조장 측에서 직접 등재하시면 빠르게 반영됩니다.",
    storyEmptyLink: "양조장 등록 안내 →",
    lineupSubtitle: "{brewery} 의 제품",
    lineupH2: "라인업",
    lineupNoCheckIns: "아직 체크인 없음",
    lineupCheckInsCount: "{count}회",
    cta: {
      pill: "1기 양조장 · 5~10곳 모집 중",
      h3Mine: "이 양조장 운영자이신가요?",
      body:
        "Sooly 는 1기 양조장 5~10곳을 모집해 가격·기능을 함께 정합니다. 공식 ✓ 뱃지·이야기·사진·체크인 답변은 앞으로도 무료, 비즈니스 도구만 1기 양조장과 함께 설계 후 정식 출시됩니다. 1기 합류 시 6개월 무료 + 평생 가격 락인.",
      forBreweries: "양조장 운영자분께",
      planLink: "플랜 비교",
      applyLink: "신청하기",
      mailtoSubject: "[Sooly] 양조장 등록 문의 — {brewery}",
    },
  },

  profile: {
    public: {
      notFound: "프로필 없음",
      metaDescription: "{name} 의 한국술 체크인 기록.",
      editProfile: "프로필 편집",
      statCheckIns: "체크인",
      statAverage: "평균 별점",
      statLast30: "최근 30일",
      statJoined: "활동 시작",
      statEmpty: "—",
      statsH2: "통계",
      drunkH2: "마신 술",
      emptyTitle: "아직 체크인이 없어요",
      emptyMessageMine: "마음에 드는 술 페이지에서 ★ 별점을 남겨보세요.",
      emptyMessageOther: "이 사용자는 아직 체크인을 남기지 않았습니다.",
      browseCta: "술 둘러보기",
      categoryBreakdownH3: "카테고리별 분포",
      categoryBreakdownEmpty: "아직 카테고리 데이터가 없어요.",
      breweryTopH3: "좋아하는 양조장 TOP 3",
      breweryTopEmpty: "체크인을 더 남겨보세요.",
      breweryCheckInCount: "체크인 {count}회",
      ratingHistogramH3: "별점 분포",
      joinedFormat: "{year}년 {month}월",
    },
  },

  settings: {
    metaTitle: "설정",
    metaDescription: "프로필·언어 등 계정 설정을 관리합니다.",
    h1: "설정",
    signedInAs: "{name} (@{username}) 로 로그인되어 있어요.",
    rowProfile: "프로필",
    rowProfileSub: "표시 이름·사용자명·한 줄 소개",
    rowMyProfile: "내 프로필 보기",
    rowMyProfileSub: "공개 프로필·체크인 기록",
    rowLanguage: "언어",
    rowLanguageHint: "헤더 우측의 KO · EN 토글로 변경할 수 있어요.",
    rowComingSoon: "알림 설정·계정 삭제 등은 곧 추가됩니다.",
    profile: {
      metaTitle: "프로필 설정",
      metaDescription: "표시 이름·사용자명·한 줄 소개를 수정합니다.",
      backLink: "← 설정으로",
      h1: "프로필 설정",
      subtitle: "다른 사용자에게 보여지는 정보를 수정할 수 있어요.",
      displayNameLabel: "표시 이름",
      displayNameHint:
        "체크인·프로필 카드에 표시되는 이름이에요. 한국어·영어 모두 OK.",
      usernameLabel: "사용자명",
      usernameHintPre: "프로필 URL 에 사용돼요 (예: sooly.co.kr/u/",
      usernameHintPost:
        "). 영문 소문자·숫자·언더스코어(_) 만, 2~20자.",
      bioLabel: "한 줄 소개",
      bioPlaceholder: "좋아하는 술, 좋아하는 술자리…",
      save: "저장",
      saving: "저장 중...",
      cancel: "취소",
    },
  },

  login: {
    metaTitle: "로그인",
    metaDescription: "이메일 매직 링크로 Sooly 에 로그인.",
    h1: "로그인",
    subtitle: "이메일을 입력하면 로그인 링크를 보내드려요. 비밀번호 없이 한 번에.",
    errorCallback:
      "로그인 링크가 만료되었거나 유효하지 않아요. 다시 시도해주세요.",
    errorOauth: "소셜 로그인 시작에 실패했어요. 잠시 후 다시 시도해주세요.",
    termsPrefix: "로그인하면 Sooly 의 ",
    termsLink: "이용약관",
    termsMid: " 과 ",
    privacyLink: "개인정보 처리방침",
    termsSuffix: " 에 동의하는 것으로 간주합니다.",
    sentTitle: "메일을 확인해주세요",
    sentBodyPost: " 로 로그인 링크를 보냈어요. 이메일의 버튼을 누르면 로그인됩니다.",
    sentSpamNote:
      "메일이 안 보이면 스팸함을 확인해주세요. 5분 안에 안 오면 다시 시도하세요.",
    googleCta: "Google 로 계속하기",
    kakaoCta: "카카오로 계속하기",
    orEmail: "또는 이메일",
    emailLabel: "이메일",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "로그인 링크 보내기",
    sending: "전송 중...",
  },

  productsList: {
    metaTitle: "제품",
    metaDescription:
      "한국 전통주·막걸리·소주·과실주 791개 제품 카탈로그.",
    h1: "제품 카탈로그",
    totalSummaryPre: "총 ",
    totalSummarySuffix: "개 제품",
    searchSummaryPre: "검색 결과 ",
    searchSummarySuffix: "건",
    pageInfo: "{page}/{total} 페이지",
    error: "DB 조회 실패: {message}",
    empty: "조건에 맞는 제품이 없습니다.",
    noBreweryName: "양조장 미상",
  },

  breweriesList: {
    metaTitle: "양조장",
    metaDescription: "한국 전통주 양조장 431곳을 지역별로 둘러보세요.",
    h1: "양조장",
    totalSummaryPre: "전국 ",
    totalSummarySuffix: "곳",
    searchSummaryPre: "검색 결과 ",
    searchSummarySuffix: "곳",
    pageInfo: "{page}/{total} 페이지",
    error: "DB 조회 실패: {message}",
    empty: "조건에 맞는 양조장이 없습니다.",
    productsCountSuffix: "개 제품",
    visitingBadge: "찾아가는 양조장",
  },

  category: {
    uppercase: "Category",
    productsCrumb: "제품",
    drinkingTipsH2: "마시는 법",
    topBreweriesH2: "{category} 를 만드는 대표 양조장",
    productsH2: "{category} 제품",
    productCountSuffix: "개 제품",
    filterView: "필터로 보기 →",
    viewAllPrefix: "",
    viewAllSuffix: " 전체 {count}개 보기 →",
    notFound: "카테고리 없음",
    noBreweryName: "양조장 미상",
  },

  categoryInfo: {
    탁주: {
      tagline: "쌀과 누룩이 빚어내는 우리네 가장 친숙한 술",
      description:
        "탁주는 막걸리로도 불리며, 쌀을 주원료로 누룩과 물을 섞어 발효시킨 뒤 걸러내지 않은 술입니다. 뿌연 빛깔과 부드러운 목넘김, 은은한 단맛과 시큼함이 어우러진 맛이 특징. 도수는 보통 5~12% 사이로 가볍게 즐기기 좋습니다.",
      tip1: "처음 마실 땐 차갑게 (5~7℃) 시작해보세요",
      tip2: "부침개·보쌈·전·파전 등 기름진 음식과 완벽한 궁합",
      tip3: "마시기 전 가볍게 흔들어 침전물을 섞어주세요",
    },
    약주: {
      tagline: "쌀의 맑은 정수를 뽑아낸 은근한 깊이의 술",
      description:
        "약주는 탁주에서 가라앉은 맑은 윗부분만 떠낸 맑은 술입니다. 맛이 깔끔하면서 쌀의 단맛과 누룩의 향이 어우러져 우아한 풍미를 냅니다. 도수는 13~18% 사이가 일반적.",
      tip1: "상온~약간 차가운 온도(10~14℃)에서 향이 가장 잘 피어납니다",
      tip2: "회, 나물, 두부 같은 담백한 음식과 어울림",
      tip3: "잔은 얕고 넓은 것으로 — 향을 충분히 느낄 수 있게",
    },
    청주: {
      tagline: "섬세함의 정점, 우리 술의 귀공자",
      description:
        "청주는 약주와 비슷하나 더욱 정제된 맑은 술입니다. 일본의 사케와 기원이 같으며, 차갑게 마시면 과실향, 따뜻하게 마시면 쌀의 단맛이 두드러집니다. 도수 14~18%.",
      tip1: "냉장 또는 40℃ 내외로 따뜻하게(데움주)",
      tip2: "생선회·초밥·담백한 일식과 페어링",
      tip3: "개봉 후 1주일 내에 마시는 게 좋음",
    },
    증류주: {
      tagline: "강렬하고 순수한 한국의 정수",
      description:
        "전통 소주를 포함한 증류주는 발효주를 증류해 얻은 맑은 술입니다. 높은 도수(25~45%)에 원재료의 향이 농축돼 있으며, 향이 오래 남는 것이 특징. 안동소주, 이강주 등 지역별 명주가 유명.",
      tip1: "스트레이트로 향을 먼저 음미한 뒤 얼음을 넣어 변화를 즐기기",
      tip2: "튀김·전 같은 기름진 음식과 잘 맞음",
      tip3: "소량씩 천천히 — 도수가 높아 빠르게 취함",
    },
    과실주: {
      tagline: "계절의 과일을 담은 발효의 예술",
      description:
        "복분자·머루·사과·매실 등 과실을 발효해 빚은 술. 과일 본연의 단맛·산미·향이 살아있어 입문자도 편하게 접근할 수 있습니다. 도수는 보통 8~15%.",
      tip1: "차갑게 마시거나 탄산수와 섞어 가볍게",
      tip2: "디저트·치즈·과일과 페어링",
      tip3: "달콤한 맛이 강하니 소량씩",
    },
    리큐르: {
      tagline: "증류주 위에 향과 풍미를 더한 한국식 조화",
      description:
        "증류주에 과실·약초·꿀 등을 침출하거나 조합해 만든 술. 도수는 15~40% 범위로 다양하며, 향긋하고 달콤한 스타일이 많아 칵테일 베이스로도 훌륭합니다.",
      tip1: "스트레이트, 온더락, 토닉워터 조합 등 다양하게",
      tip2: "디저트 와인처럼 식후주로 잘 어울림",
      tip3: "감미로움을 살리려면 차갑게",
    },
  },

  home: {
    hero: {
      uppercase: "Korean alcohol, curated",
      h1Pre: "한국술을 ",
      h1Highlight: "발견",
      h1Mid: "하고,\n기록하고, 공유하세요.",
      description:
        "전통주·막걸리·소주·과실주 {productCount}종과 전국 양조장 {breweryCount}곳. 이름만 알던 술의 맛·지역·양조장 이야기를 한 자리에서.",
      browseProducts: "제품 둘러보기",
      findBreweries: "양조장 찾아보기",
      todayPick: "오늘의 술",
      productPageLink: "제품 페이지 →",
      noBreweryName: "양조장 미상",
    },
    stats: {
      productsLabel: "제품",
      productsSuffix: "종",
      breweriesLabel: "양조장",
      breweriesSuffix: "곳",
      regionsLabel: "지역",
      regionsSuffix: "시도",
      categoriesLabel: "카테고리",
      categoriesSuffix: "종",
    },
    categoriesSection: {
      subtitle: "Explore by style",
      h2: "카테고리 둘러보기",
      countSuffix: "개",
    },
    picksSection: {
      subtitle: "Today's Picks",
      h2: "오늘의 발견",
    },
    featuredSection: {
      subtitle: "Featured Brewery",
      h2: "이번 주 양조장",
      foundedYearLabel: "설립 {year}년",
      viewStory: "양조장 이야기 보기 →",
      emptyStory: "이 양조장의 이야기는 곧 업데이트됩니다.",
    },
    journalSection: {
      subtitle: "Journal",
      h2: "마시는 즐거움, 읽는 깊이",
      description:
        "양조장 방문기, 페어링 가이드, 전통주의 역사. 한국술을 더 풍성하게 즐기기 위한 읽을거리.",
      readingMinutesSuffix: "분",
      readMore: "읽으러 가기 →",
      empty: "곧 첫 글이 올라옵니다.",
    },
  },

  forBreweries: {
    metaTitle: "양조장을 위한 Sooly",
    metaDescription:
      "Sooly 는 한국술 정보 허브입니다. 1기 양조장 5~10곳을 모집해 함께 가격·기능을 정합니다. 공식 양조장 등록과 페이지 직접 관리는 앞으로도 무료, 비즈니스 도구만 정식 출시 시 유료입니다.",

    hero: {
      pill: "1기 양조장 5~10곳 모집 중",
      h1Line1: "양조장의 이야기를",
      h1Line2Pre: "",
      h1Line2Highlight: "직접",
      h1Line2Post: " 들려주세요.",
      description:
        "Sooly 는 양조장 {breweryCount}곳 이상과 제품 {productCount}종을 담은 한국술 정보 허브입니다. 1기 양조장과 함께 가격·기능을 정직하게 정하고, 공식 양조장 페이지 운영은 앞으로도 무료로 운영합니다.",
      apply: "1기 양조장 신청",
      compare: "플랜 비교",
      note:
        "💡 1기 양조장은 정식 출시 후 6개월 무료 + 평생 가격 락인 + 의사결정 직접 참여. 선착순 5~10곳 모집 후 마감합니다.",
    },

    features: {
      subtitle: "공식 양조장 · 앞으로도 무료",
      h2: "양조장이 직접 페이지를 관리합니다",
      description:
        "공식 양조장으로 등록되면 페이지를 직접 관리할 수 있는 다섯 가지 기능을 쓰실 수 있어요. 결제·약정 없고, 정식 출시 이후에도 영구 무료로 운영합니다. 메일 한 통이면 시작합니다.",
      benefit1Title: "공식 ✓ 뱃지",
      benefit1Desc:
        "양조장 페이지에 '공식 ✓' 뱃지. 진짜 운영자가 관리하는 공간임을 사용자에게 명시.",
      benefit2Title: "양조장 이야기 등재",
      benefit2Desc:
        "역사·철학·대표 인터뷰. 사용자가 제품을 선택할 때 결정타가 되는 컨텍스트.",
      benefit3Title: "공식 사진 업로드",
      benefit3Desc:
        "양조장 전경·설비·대표 사진. 현재 플레이스홀더 자리를 진짜 사진으로.",
      benefit4Title: "제품 정보 수정",
      benefit4Desc:
        "크롤링 시점 이후 변경된 도수·용량·원재료·페어링 직접 업데이트.",
      benefit5Title: "체크인에 양조장 답변",
      benefit5Desc:
        "사용자가 남긴 체크인·평가에 양조장 입장에서 답글. 팬과 직접 대화하는 채널.",
    },

    steps: {
      h3: "신청 절차 — 3 단계",
      step1Strong: "메일 작성",
      step1BodyPre: "아래 ",
      step1Link: "등록 문의",
      step1BodyPost:
        " 버튼을 누르면 메일 양식이 자동으로 채워져요. 빈칸만 채워서 보내세요.",
      step2Strong: "본인 확인",
      step2Body:
        " — Sooly 가 보내주신 자료로 양조장 운영자 본인임을 확인합니다 (보통 1영업일).",
      step3Strong: "반영",
      step3Body:
        " — 본인 확인 완료 후 양조장 페이지에 공식 ✓ 뱃지 + 보내주신 정보·사진이 24시간 내 게재됩니다.",
    },

    plans: {
      subtitle: "플랜 비교",
      h2: "세 가지 단계 — 어디까지 무료, 어디부터 유료",
      description:
        "Sooly 는 모든 양조장이 기본 등재되고, 운영자 본인 확인 후 공식 양조장이 되면 페이지를 직접 관리할 수 있고 (앞으로도 무료), 비즈니스 도구는 정식 출시 시 유료로 전환됩니다.",
      note:
        "* 플랜 이름과 가격은 1기 양조장 5~10곳과 협의 후 정식 출시 시 확정됩니다. 위 표는 현재 계획안이며, 1기 양조장 의견에 따라 변경될 수 있습니다.",
      freeName: "기본",
      freePrice: "무료",
      freePriceNote: "자동 등재 — 신청 불필요",
      freeTagline:
        "Sooly 카탈로그에 양조장·제품 자동 노출. 운영자 신청 없이도 누구나 발견 가능.",
      freeFeature1: "카탈로그·검색 자동 등재",
      freeFeature2: "사용자 체크인·별점 노출",
      freeFeature3: "Schema.org 구조화 데이터",
      freeFeature4: "한/영 페이지 자동 생성",
      officialBadge: "앞으로도 무료",
      officialName: "공식",
      officialPrice: "0원",
      officialPriceNote: "정식 출시 후에도 영구 무료",
      officialTagline:
        "양조장 운영자가 페이지를 직접 관리. 사용자에게 '진짜 양조장이 운영하는 페이지' 신호.",
      officialFeature1: "공식 ✓ 뱃지",
      officialFeature2: "양조장 이야기·소개글 등재",
      officialFeature3: "공식 사진 업로드",
      officialFeature4: "제품 정보 수정",
      officialFeature5: "체크인에 양조장 답변",
      businessBadge: "개발 중",
      businessName: "비즈니스",
      businessPrice: "가격 미정",
      businessPriceNote: "1기 양조장과 함께 정함 (정식 출시 시 유료)",
      businessTagline:
        "양조장 마케팅·데이터 도구. 사용자 행동 분석 + 능동적 홍보 채널.",
      businessFeature1: "조회수·체크인 통계 (양조장·제품별)",
      businessFeature2: "신제품 우선 노출 (홈·카테고리)",
      businessFeature3: "양조장 공지·뉴스피드 (팔로워 알림)",
      businessFeature4: "검색 키워드 리포트 (SEO 인사이트)",
    },

    cohort: {
      subtitle: "1기 양조장 모집 · 선착순 5~10곳",
      h2: "함께 시작할 양조장과 가격·기능을 정합니다",
      description:
        "Sooly 는 양조장에게 정말 필요한 도구만 만들고 가격도 정직하게 매기고 싶어요. 그래서 첫 5~10 양조장과 직접 대화해서 무엇을 만들지·얼마면 합리적인지 함께 정합니다. 1기 양조장에 합류하시면 네 가지를 약속드립니다.",
      promise1Title: "의사결정 직접 참여",
      promise1Desc:
        "비즈니스 도구의 기능 우선순위, 가격 구조, 약관까지 양조장 의견을 그대로 반영합니다.",
      promise2Title: "정식 출시 후 6개월 무료",
      promise2Desc:
        "유료 전환 시점에도 1기 양조장은 첫 6개월 동안 모든 도구를 무료로 사용하세요.",
      promise3Title: "평생 가격 락인",
      promise3Desc:
        "6개월 이후 가격이 인상되어도 1기 양조장은 처음 정한 가격이 평생 유지됩니다.",
      promise4Title: "1기 양조장 표기",
      promise4Desc:
        "양조장 페이지와 Sooly 공식 채널에 '1기 양조장' 표기. 함께 시작한 기여가 남습니다.",
      eligibilityH3: "신청 자격",
      eligibility1: "한국 내 양조 면허를 보유한 양조장",
      eligibility2Pre: "양조장 운영자 본인 (대표·실장·마케팅 담당) — 인증 자료는 ",
      eligibility2Link: "하단",
      eligibility2Post: " 참조",
      eligibility3:
        "사이트가 양조장 페이지를 보강할 수 있도록 기본 정보 (이야기·사진 1~2장) 제공 의사",
      cap: "5~10곳이 채워지면 모집을 마감하고 정식 출시 준비에 들어갑니다.",
    },

    why: {
      h2: "왜 지금 Sooly 인가",
      point1Title: "한국술에는 아직 Untappd·Vivino 같은 허브가 없습니다",
      point1Body:
        "맥주엔 Untappd(유저 900만), 와인엔 Vivino(유저 5천만). 한국 전통주는? 이커머스 몇 곳은 있어도 '발견·기록·공유'가 통합된 플랫폼은 공석입니다.",
      point2Title: "해외 한인 1,000만 + K-culture 팬을 타겟",
      point2Body:
        "Sooly 는 한/영 이중언어 설계. 영문 정보가 절대 부족한 한국술 시장에서 검색 유입을 선점합니다.",
      point3Title: "양조장은 IT·마케팅 리소스 부족",
      point3Body:
        "대부분의 양조장이 공식 홈페이지가 없거나 관리되지 않습니다. Sooly 가 그 인프라를 대신 제공.",
    },

    faq: {
      h2: "자주 묻는 질문",
      q1: "공식 양조장 등록은 정말 영구 무료인가요?",
      a1: "네. 결제·카드 등록·약정 없음. 공식 ✓ 뱃지·양조장 이야기 등재·사진 업로드·제품 정보 수정·체크인 답변은 양조장 운영자라면 누구나 영구 무료로 쓰실 수 있습니다. 정식 출시 후에도 이 정책은 유지됩니다.",
      q2: "유료 플랜 (비즈니스) 가격은 얼마인가요?",
      a2: "아직 정해지지 않았어요. 1기 양조장 5~10곳과 직접 만나서 정직한 가격을 함께 정할 계획입니다. 1기 양조장에 합류하시면 그 의사결정에 직접 참여하고, 정식 출시 시 첫 6개월 무료 + 평생 가격 락인 + 1기 양조장 표기를 받으실 수 있습니다.",
      q3: "지금 무료인 기능이 나중에 유료로 옮겨질 가능성도 있나요?",
      a3: "없습니다. 공식 양조장의 다섯 가지 기능 (공식 ✓ 뱃지·이야기 등재·사진·제품 수정·체크인 답변) 은 Sooly 의 커뮤니티 자산이라 영구 무료입니다. 유료화는 비즈니스 도구에만 적용됩니다.",
      q4: "운영자 본인 확인은 어떻게 하나요?",
      a4: "사업자등록증 사본 / 양조장 공식 도메인 이메일 / 양조장 공식 인스타·홈페이지 운영 증명 중 하나면 됩니다. Sooly 가 직접 확인 후 1영업일 내 답신드려요.",
      q5: "제품 정보 수정·사진 업로드는 양조장이 직접 하나요?",
      a5: "지금은 메일로 보내주시면 Sooly 가 24시간 내 반영합니다. 양조장 운영자가 직접 수정할 수 있는 관리 인터페이스는 1기 양조장과 함께 정식 출시 시점에 도입 예정입니다.",
      q6: "저희 양조장이 Sooly 에 이미 등록돼 있나요?",
      a6: "전국 1,300곳 양조장 중 약 400곳, 제품 791종이 이미 카탈로그에 있습니다. 메일로 양조장명 알려주시면 등록 여부 + 페이지 URL 을 답신드려요. 미등록 양조장도 신규 등록은 무료입니다.",
      q7: "1기 양조장 모집은 언제 마감되나요?",
      a7: "5~10곳이 채워지면 마감하고 정식 출시 준비에 들어갑니다. 정확한 마감일은 정해두지 않았고, 신청 순서대로 본인 확인 후 합류해주세요. 마감 후에는 일반 공식 양조장 신청은 계속 받지만 1기 혜택 (6개월 무료·평생 락인·1기 표기) 은 적용되지 않습니다.",
      q8: "중간에 그만두고 싶으면 어떻게 하나요?",
      a8: "언제든. 메일 한 통이면 공식 등록 해제·정보 비공개 모두 가능하고, 데이터는 즉시 삭제 또는 비공개 처리됩니다. 1기 양조장도 마찬가지입니다.",
    },

    contact: {
      h2: "1기 양조장 신청하기",
      description:
        "아래 버튼을 누르면 메일 양식이 자동으로 채워져요. 빈칸만 채워서 보내주시면 1영업일 내 답신드립니다. 1기 양조장 이외 일반 인증 신청도 같은 메일로 받습니다 — 본문에 알려주세요.",
      cta: "✉️ 1기 양조장 신청하기 (메일 양식 자동)",
      fallbackPrefix: "메일 클라이언트가 안 열리면 직접 보내주세요 →",
      infoHeader: "메일에 함께 보내주실 정보",
      info1: "1. 양조장명 (한글) + 영문 표기",
      info2: "2. 신청자 이름 + 직책 (예: 홍길동 / 대표)",
      info3: "3. 연락처 — 휴대폰 또는 이메일",
      info4:
        "4. 인증 자료 — 사업자등록증 사본 / 공식 도메인 이메일 / 공식 인스타·홈페이지 운영 증명 중 하나",
      info5: "5. 하고 싶은 것 (제품 수정 / 사진 / 양조장 스토리 등)",
      mailtoSubject: "[Sooly] 1기 양조장 등록 문의",
      mailtoBody:
        "1. 양조장명 (한글):\n2. 양조장명 (영문, 있으면):\n3. 신청자 이름 + 직책 (예: 홍길동 / 대표):\n4. 연락처 (휴대폰 또는 이메일):\n5. 인증 자료 (택1):\n   ㄱ. 사업자등록증 사본 첨부\n   ㄴ. 양조장 공식 도메인 이메일 (예: kim@brewery.co.kr)\n   ㄷ. 양조장 공식 인스타·홈페이지 운영자임을 증명할 자료\n6. 하고 싶은 것 (제품 정보 수정 / 사진 업로드 / 양조장 스토리 추가 등):\n\n\n(추가로 궁금한 점이 있으시면 자유롭게 적어주세요.)",
    },
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
