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
    verifiedPlan: "For breweries",
    features: "Features",
    registerInquiry: "Register a brewery",
    aboutSooly: "About Sooly",
    contact: "Contact",
    copyright: "© 2026 Sooly · Korean alcohol hub",
    dataSource: "Some data via thesool.com (aT)",
  },

  common: {
    save: "Save",
    saving: "Saving…",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    loading: "Loading…",
    error: "Something went wrong",
    retry: "Try again",
    optional: "optional",
    required: "required",
    viewAll: "View all →",
    seeMore: "See more →",
    apply: "Apply",
    reset: "Reset",
    close: "Close",
    submit: "Submit",
    submitting: "Submitting…",
    or: "or",
    yes: "Yes",
    no: "No",
  },

  categories: {
    탁주: "Takju",
    약주: "Yakju",
    청주: "Cheongju",
    증류주: "Soju",
    과실주: "Fruit Wine",
    리큐르: "Liqueur",
  },
  categoryHints: {
    탁주: "Unfiltered rice wine",
    약주: "Refined and elegant",
    청주: "Clear rice wine",
    증류주: "Bold and aromatic",
    과실주: "Fruit-forward",
    리큐르: "Infused spirits",
  },

  taste: {
    단맛: "Sweet",
    산미: "Acidic",
    쓴맛: "Bitter",
    감칠맛: "Umami",
    향: "Aromatic",
    목넘김: "Smooth",
  },
  tasteRadar: {
    emptyHint: "Taste profile appears once enough check-ins accumulate",
  },
  ratingDisplay: {
    noCheckIns: "No check-ins yet",
    countSuffix: "{count} check-ins",
  },
  photoPlaceholder: {
    primary: "Photo coming soon",
    secondary: "사진 준비중이에요",
  },
  brewerySlot: {
    productTitle: "Straight from the brewery",
    breweryTitle: "Official from {brewery}",
    breweryDefault: "the brewery",
    productDesc:
      "Once the brewery joins, their stories, new releases, and events post directly into this slot.",
    breweryDesc:
      "Announcements, new releases, and events the brewery posts directly will collect here.",
    cta: "Are you from this brewery? Apply to onboard →",
    soon: "· Coming soon",
  },

  search: {
    placeholder: "Search products or breweries",
    aria: "Search",
    noResults: "No results",
    resultsForLabel: "Results for",
  },

  pagination: {
    prev: "Prev",
    next: "Next",
    pageOf: "{page} of {total}",
  },

  filters: {
    category: "Category",
    region: "Region",
    clearAll: "Clear all",
    clear: "Clear",
  },

  checkIn: {
    ratingLabel: "Rating",
    ratingRequired: "*",
    ratingButtonAria: "{n} stars",
    ratingSelected: "{n} stars",
    ratingHint: "Tap 1–5 stars",
    pairingLabel: "Paired with",
    pairingPlaceholder: "savory pancakes, bossam, sashimi…",
    noteLabel: "One-line note",
    notePlaceholder: "How did it taste? Who were you with?",
    drankAtLabel: "Date",
    tasteLabel: "Taste profile",
    tasteHint:
      "Rate this drink 1–5 across each axis. Combined with others' ratings, it forms the hexagon chart.",
    tasteClearAll: "Clear all",
    tasteAxisAria: "{label} {n}",
    submitCreate: "🍶 Check in",
    submitCreating: "Saving…",
    submitEdit: "Save",
    submitEditing: "Saving…",
    cancel: "Cancel",
    block: {
      title: "Leave a check-in",
      subtitleAnonymous:
        "Log this bottle with a rating, the food you paired it with, and a one-line note.",
      subtitleLoggedIn:
        "You can check in the same bottle each time you drink it — every pour gets its own log.",
      loginCta: "🍶 Sign in to check in",
    },
    list: {
      h2Pre: "Check-ins (",
      h2Post: ")",
      empty: "No check-ins yet. Be the first.",
      anonymous: "Anonymous",
      youLabel: "You",
      starsAria: "{n} stars",
      editButton: "Edit",
      editAria: "Edit this check-in",
      deleteButton: "Delete",
      deleteAria: "Delete this check-in",
      deletePending: "Deleting…",
      relativeNow: "just now",
      relativeMinutesSuffix: "m ago",
      relativeHoursSuffix: "h ago",
      relativeDaysSuffix: "d ago",
      relativeMonthsSuffix: "mo ago",
      relativeYearsSuffix: "y ago",
    },
  },

  notFound: {
    metaTitle: "Page not found",
    metaDescription: "The page you're looking for doesn't exist.",
    code: "404",
    h1: "Page not found",
    body:
      "The page you're looking for doesn't exist or has moved. Try one of these instead.",
    homeTitle: "Home",
    homeSubtitle: "Back to start",
    productsTitle: "Products",
    productsSubtitle: "791 sools",
    breweriesTitle: "Breweries",
    breweriesSubtitle: "431 makers",
    journalTitle: "Journal",
    journalSubtitle: "Latest posts",
  },

  blog: {
    metaTitle: "Journal",
    metaDescription:
      "Reading material for deeper enjoyment of Korean alcohol — brewery visits, pairing guides, history of traditional spirits.",
    uppercase: "Journal",
    h1: "The pleasure of drinking, the depth of reading",
    description:
      "Brewery visits, pairing guides, the history of Korean alcohol — reading to enjoy Korean spirits more fully.",
    empty: "No posts yet. The first story is on the way.",
    minRead: "{n} min read",
    monthLong: "{monthLong} {day}, {year}",
    monthShort: "{monthShort} {day}, {year}",
    backLink: "← Journal",
    notFoundTitle: "Post not found",
    fallbackToKo:
      "This post is only available in Korean. An English version is on the way.",
    fallbackToEn:
      "This post is only available in English. A Korean version is on the way.",
    byAuthor: "by {author}",
    bothAvailable:
      "Also available in Korean — switch using the KO toggle in the header.",
  },

  productDetail: {
    notFound: "Product not found",
    crumbProducts: "Products",
    statAbv: "ABV",
    statVolume: "Volume",
    statCategory: "Category",
    statRegion: "Region",
    statEmpty: "—",
    tastingNotesH2: "Tasting notes",
    tastingNotesEmpty: "Curated tasting notes coming soon.",
    ingredientsH2: "Ingredients",
    pairingsH2: "Pairs with",
    tasteProfileH3: "Taste profile",
    breweryStoryH2: "About {brewery}",
    breweryStoryMore: "Learn more about the brewery →",
    sameBreweryH3: "More from {brewery}",
    similarH2: "Similar {category}",
    similarSubtitle: "You might also like",
    similarMore: "See more →",
    sourceLabel: "Source:",
    sourceLinkText: "thesool.com",
  },

  breweryDetail: {
    notFound: "Brewery not found",
    metaDescription:
      "{region} · {name} — products, story, and visiting info.",
    crumbProducts: "Products",
    breweryUppercase: "Brewery",
    foundedYearLabel: "Founded {year}",
    visitingBadge: "Visiting brewery",
    addressH2: "Address",
    linksH2: "Links",
    storyH2: "Story",
    storyEmptyTitle: "Story",
    storyEmptyBody:
      "The story, photos, and details for {brewery} are still being gathered. If you're from this brewery, you can help fill this page in.",
    storyEmptyLink: "Brewery onboarding →",
    lineupSubtitle: "From {brewery}",
    lineupH2: "Lineup",
    lineupNoCheckIns: "No check-ins yet",
    lineupCheckInsCount: "{count} check-ins",
    cta: {
      pill: "Founding cohort · 5–10 breweries",
      h3Mine: "Are you from this brewery?",
      body:
        "Sooly is recruiting a founding cohort of 5–10 breweries to set pricing and roadmap together. Verified ✓ badge, story, photos, and check-in replies are free forever; the business tier is co-designed with the cohort. Join the cohort and get 6 months free at launch + lifetime price lock-in.",
      forBreweries: "For breweries",
      planLink: "Plan comparison",
      applyLink: "Apply",
      mailtoSubject: "[Sooly] Brewery onboarding — {brewery}",
    },
  },

  profile: {
    public: {
      notFound: "Profile not found",
      metaDescription: "Korean alcohol check-ins by {name}.",
      editProfile: "Edit profile",
      statCheckIns: "Check-ins",
      statAverage: "Avg rating",
      statLast30: "Last 30 days",
      statJoined: "Joined",
      statEmpty: "—",
      statsH2: "Stats",
      drunkH2: "Drinks logged",
      emptyTitle: "No check-ins yet",
      emptyMessageMine:
        "Open a product page you love and leave a ★ rating.",
      emptyMessageOther: "This user hasn't checked in anything yet.",
      browseCta: "Browse drinks",
      categoryBreakdownH3: "By category",
      categoryBreakdownEmpty: "No category data yet.",
      breweryTopH3: "Top 3 breweries",
      breweryTopEmpty: "Leave a few more check-ins.",
      breweryCheckInCount: "{count} check-ins",
      ratingHistogramH3: "Rating distribution",
      joinedFormat: "{month}/{year}",
    },
  },

  settings: {
    metaTitle: "Settings",
    metaDescription: "Manage your profile, language, and account preferences.",
    h1: "Settings",
    signedInAs: "Signed in as {name} (@{username}).",
    rowProfile: "Profile",
    rowProfileSub: "Display name, username, bio",
    rowMyProfile: "View my profile",
    rowMyProfileSub: "Public page with your check-ins",
    rowLanguage: "Language",
    rowLanguageHint: "Switch with the KO · EN toggle in the header.",
    rowComingSoon:
      "Notifications, account deletion, and more — coming soon.",
    profile: {
      metaTitle: "Profile settings",
      metaDescription:
        "Update your display name, username, and one-line bio.",
      backLink: "← Settings",
      h1: "Profile settings",
      subtitle: "Edit how others see you on Sooly.",
      displayNameLabel: "Display name",
      displayNameHint:
        "Shown on your check-ins and profile card. Korean or English is fine.",
      usernameLabel: "Username",
      usernameHintPre: "Used in your profile URL (e.g. sooly.co.kr/u/",
      usernameHintPost:
        "). Lowercase letters, digits, underscores only. 2–20 chars.",
      bioLabel: "One-line bio",
      bioPlaceholder: "Drinks you love, places you drink them…",
      save: "Save",
      saving: "Saving…",
      cancel: "Cancel",
    },
  },

  login: {
    metaTitle: "Sign in",
    metaDescription: "Sign in to Sooly with an emailed magic link.",
    h1: "Sign in",
    subtitle: "Enter your email and we'll send a sign-in link. No password required.",
    errorCallback: "That sign-in link has expired or is invalid. Please try again.",
    errorOauth: "Could not start social sign-in. Please try again shortly.",
    termsPrefix: "By signing in you agree to Sooly's ",
    termsLink: "Terms",
    termsMid: " and ",
    privacyLink: "Privacy Policy",
    termsSuffix: ".",
    sentTitle: "Check your inbox",
    sentBodyPost:
      ". Tap the button in the email to sign in.",
    sentSpamNote:
      "Not in your inbox? Check spam. If nothing arrives in 5 minutes, try again.",
    googleCta: "Continue with Google",
    kakaoCta: "Continue with Kakao",
    orEmail: "or with email",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    sendMagicLink: "Send sign-in link",
    sending: "Sending…",
  },

  productsList: {
    metaTitle: "Products",
    metaDescription:
      "Catalog of 791 Korean traditional alcohols — makgeolli, soju, fruit wines.",
    h1: "Product catalog",
    totalSummaryPre: "",
    totalSummarySuffix: " products in total",
    searchSummaryPre: "",
    searchSummarySuffix: " results",
    pageInfo: "page {page} of {total}",
    error: "DB query failed: {message}",
    empty: "No products match these filters.",
    noBreweryName: "Unknown brewery",
  },

  breweriesList: {
    metaTitle: "Breweries",
    metaDescription:
      "Browse 431 Korean traditional alcohol breweries by region.",
    h1: "Breweries",
    totalSummaryPre: "",
    totalSummarySuffix: " breweries across Korea",
    searchSummaryPre: "",
    searchSummarySuffix: " results",
    pageInfo: "page {page} of {total}",
    error: "DB query failed: {message}",
    empty: "No breweries match these filters.",
    productsCountSuffix: " products",
    visitingBadge: "Visiting brewery",
  },

  category: {
    uppercase: "Category",
    productsCrumb: "Products",
    drinkingTipsH2: "How to drink",
    topBreweriesH2: "Notable {category} breweries",
    productsH2: "{category} bottles",
    productCountSuffix: " products",
    filterView: "Filter view →",
    viewAllPrefix: "View all ",
    viewAllSuffix: " ({count}) →",
    notFound: "Category not found",
    noBreweryName: "Unknown brewery",
  },

  categoryInfo: {
    탁주: {
      tagline: "Korea's most familiar drink — rice, nuruk, and time",
      description:
        "Takju, also known as makgeolli, is an unfiltered rice wine fermented with nuruk (a traditional Korean fermentation starter). Cloudy in color, soft on the throat, with a gentle balance of sweetness and tang. Typically 5–12% ABV, easy to drink and forgiving for beginners.",
      tip1: "Start cold (5–7°C / 41–45°F) on your first sip",
      tip2: "Pairs perfectly with savory pancakes, bossam, and other oily dishes",
      tip3: "Shake gently before pouring to mix the sediment",
    },
    약주: {
      tagline: "The clear essence of rice — quietly deep",
      description:
        "Yakju is the clear top layer skimmed from takju after the sediment has settled. Cleaner on the palate, with rice sweetness and nuruk aroma weaving into an elegant flavor. Typically 13–18% ABV.",
      tip1: "Aroma opens up best at room temperature or slightly cool (10–14°C / 50–57°F)",
      tip2: "Pairs with sashimi, namul, tofu — clean, gentle dishes",
      tip3: "Use a shallow, wide cup so the aroma has space to breathe",
    },
    청주: {
      tagline: "Refinement at its peak — the gentleman of Korean drinks",
      description:
        "Cheongju is a more refined clear rice wine, similar to yakju but more polished. Shares ancestry with Japanese sake. Chilled, fruit aromas come forward; warmed, rice sweetness rises. Typically 14–18% ABV.",
      tip1: "Refrigerated, or warmed to about 40°C (104°F) — Korean-style hot sake",
      tip2: "Pairs with sashimi, sushi, and other clean Japanese dishes",
      tip3: "Best within a week of opening",
    },
    증류주: {
      tagline: "Bold, pure — distilled Korean spirit",
      description:
        "Distilled spirits including traditional soju, made by distilling fermented rice wine into a clear, high-proof spirit. Concentrated aromas of the source ingredients linger long on the palate. Typically 25–45% ABV. Andong soju, Igangju, and other regional specialties are famous.",
      tip1: "Sip neat first to catch the aroma, then add ice for a different angle",
      tip2: "Pairs with fried foods and savory dishes",
      tip3: "Sip slowly in small amounts — high ABV hits fast",
    },
    과실주: {
      tagline: "Fermented art — fruit by season",
      description:
        "Fermented from fruits like bokbunja (Korean black raspberry), wild grape, apple, or maesil (green plum). The natural sweetness, acidity, and aroma of the fruit stay vivid, making it approachable for beginners. Typically 8–15% ABV.",
      tip1: "Serve chilled, or top with sparkling water for a lighter pour",
      tip2: "Pairs with desserts, cheese, and fruit",
      tip3: "Sweetness is forward — small pours work best",
    },
    리큐르: {
      tagline: "Distilled spirit, dressed in aroma — Korean harmony",
      description:
        "Liqueurs are distilled spirits infused or blended with fruits, herbs, or honey. ABV ranges 15–40%, often aromatic and sweet — making them excellent cocktail bases.",
      tip1: "Versatile — neat, on the rocks, or with tonic",
      tip2: "Works as a dessert wine or after-dinner sip",
      tip3: "Chill it to keep the sweetness focused",
    },
  },

  home: {
    hero: {
      uppercase: "Korean alcohol, curated",
      h1Pre: "",
      h1Highlight: "Discover",
      h1Mid: " Korean spirits.\nLog them. Share them.",
      description:
        "{productCount} traditional spirits, makgeolli, soju, and fruit wines from {breweryCount} breweries across Korea. Taste, region, and the story behind each bottle — all in one place.",
      browseProducts: "Browse products",
      findBreweries: "Find a brewery",
      todayPick: "Today's pick",
      productPageLink: "Product page →",
      noBreweryName: "Unknown brewery",
    },
    stats: {
      productsLabel: "Products",
      productsSuffix: "",
      breweriesLabel: "Breweries",
      breweriesSuffix: "",
      regionsLabel: "Regions",
      regionsSuffix: "",
      categoriesLabel: "Categories",
      categoriesSuffix: "",
    },
    categoriesSection: {
      subtitle: "Explore by style",
      h2: "Browse by category",
      countSuffix: "",
    },
    picksSection: {
      subtitle: "Today's Picks",
      h2: "Today's finds",
    },
    featuredSection: {
      subtitle: "Featured Brewery",
      h2: "This week's brewery",
      foundedYearLabel: "Founded {year}",
      viewStory: "View brewery story →",
      emptyStory: "We'll update this brewery's story soon.",
    },
    journalSection: {
      subtitle: "Journal",
      h2: "The pleasure of drinking, the depth of reading",
      description:
        "Brewery visits, pairing guides, the history of traditional alcohols — reading material to enrich your time with Korean spirits.",
      readingMinutesSuffix: " min",
      readMore: "Read post →",
      empty: "First post coming soon.",
    },
  },

  forBreweries: {
    metaTitle: "Sooly for Breweries",
    metaDescription:
      "Sooly is the global hub for Korean alcohol. We're recruiting our founding cohort of 5–10 breweries to set pricing and roadmap together. Verifying your brewery and managing your page stay free forever; only the business analytics tier becomes paid at launch.",

    hero: {
      pill: "Founding cohort · 5–10 breweries",
      h1Line1: "Tell your brewery's",
      h1Line2Pre: "story ",
      h1Line2Highlight: "directly",
      h1Line2Post: ".",
      description:
        "Sooly is the information hub for Korean alcohol — already covering {breweryCount}+ breweries and {productCount} products. We're setting pricing and features together with a founding cohort, and verifying your brewery + managing your page stay free forever.",
      apply: "Apply to founding cohort",
      compare: "Compare plans",
      note:
        "💡 Founding cohort breweries get 6 months free at launch + lifetime price lock-in + a seat at the decision table. Closing once 5–10 spots fill.",
    },

    features: {
      subtitle: "Verified brewery · free forever",
      h2: "Run your brewery page yourself",
      description:
        "Once a brewery is verified, the owner can use these five tools directly. No payment, no contract, and these stay free even after the paid tier ships. One email is all it takes to start.",
      benefit1Title: "Verified ✓ badge",
      benefit1Desc:
        "A 'Verified ✓' badge on your brewery page so visitors see this is a space the actual owner runs.",
      benefit2Title: "Brewery story",
      benefit2Desc:
        "History, philosophy, owner interview. The context that tips users toward picking your bottle.",
      benefit3Title: "Official photos",
      benefit3Desc:
        "Brewery exterior, equipment, hero shots — replace placeholder slots with real photography.",
      benefit4Title: "Edit product info",
      benefit4Desc:
        "Update ABV, volume, ingredients, pairings that have changed since the original catalog crawl.",
      benefit5Title: "Reply to check-ins",
      benefit5Desc:
        "Respond to user check-ins and ratings as the brewery. A direct line to your fans.",
    },

    steps: {
      h3: "How to apply — 3 steps",
      step1Strong: "Email us",
      step1BodyPre: "Tap the ",
      step1Link: "Apply",
      step1BodyPost:
        " button below — your draft email is pre-filled. Just fill in the blanks and send.",
      step2Strong: "Verification",
      step2Body:
        " — we confirm you're the brewery owner from the materials you send (typically within one business day).",
      step3Strong: "Live",
      step3Body:
        " — once verified, the Verified ✓ badge plus your story and photos go live on your brewery page within 24 hours.",
    },

    plans: {
      subtitle: "Compare plans",
      h2: "Three tiers — what's free, what's paid",
      description:
        "Every brewery is auto-listed (Basic). After owner verification, Verified breweries can manage their page directly (free forever). The Business tier — analytics and promotion — is paid at launch.",
      note:
        "* Plan names and pricing will be finalized with the founding cohort of 5–10 breweries before launch. The table above is the current draft and may change based on cohort feedback.",
      freeName: "Basic",
      freePrice: "Free",
      freePriceNote: "Auto-listed — no application needed",
      freeTagline:
        "Auto-listed in the Sooly catalog. Discoverable to anyone, even without owner verification.",
      freeFeature1: "Auto-listing in catalog & search",
      freeFeature2: "User check-ins & star ratings",
      freeFeature3: "Schema.org structured data",
      freeFeature4: "Auto-generated KO/EN page",
      officialBadge: "Free forever",
      officialName: "Verified",
      officialPrice: "$0",
      officialPriceNote: "Stays free forever, even after launch",
      officialTagline:
        "Brewery owners manage the page directly. Signals to users that 'a real brewery operates this page.'",
      officialFeature1: "Verified ✓ badge",
      officialFeature2: "Brewery story & introduction",
      officialFeature3: "Official photo upload",
      officialFeature4: "Edit product info",
      officialFeature5: "Reply to check-ins",
      businessBadge: "In development",
      businessName: "Business",
      businessPrice: "Pricing TBD",
      businessPriceNote: "Set with the founding cohort (paid at launch)",
      businessTagline:
        "Brewery marketing and data tools. User behavior analytics + active promotion channels.",
      businessFeature1: "View / check-in analytics (per brewery & product)",
      businessFeature2: "Priority placement for new releases (home / category)",
      businessFeature3: "Brewery announcements & feed (follower notifications)",
      businessFeature4: "Search keyword report (SEO insights)",
    },

    cohort: {
      subtitle: "Founding cohort · first-come 5–10 breweries",
      h2: "Set pricing and features with us, from the start",
      description:
        "Sooly wants to ship only the tools breweries actually need, and price them honestly. So we're sitting down with the first 5–10 breweries to decide what to build and what's a fair price together. If you join the founding cohort, here's what we promise.",
      promise1Title: "Decision input",
      promise1Desc:
        "Feature priorities, pricing structure, and terms — your input shapes the Business tier directly.",
      promise2Title: "6 months free at launch",
      promise2Desc:
        "Even when paid pricing kicks in, founding cohort breweries get the first 6 months free.",
      promise3Title: "Lifetime price lock-in",
      promise3Desc:
        "If pricing rises after the first 6 months, your founding cohort price stays put for life.",
      promise4Title: "Founding-cohort credit",
      promise4Desc:
        "A 'founding cohort' badge on your brewery page and Sooly's official channels. Your contribution is permanent.",
      eligibilityH3: "Eligibility",
      eligibility1: "Brewery licensed in Korea",
      eligibility2Pre:
        "Brewery owner or operator (CEO / lead / marketing) — verification materials below in ",
      eligibility2Link: "Contact",
      eligibility2Post: "",
      eligibility3:
        "Willingness to provide basic info (story + 1–2 photos) so we can flesh out your page",
      cap: "We close the cohort once 5–10 spots fill, then move into launch prep.",
    },

    why: {
      h2: "Why Sooly, why now",
      point1Title: "Korean alcohol still has no Untappd / Vivino",
      point1Body:
        "Beer has Untappd (9M users), wine has Vivino (50M). Korean traditional alcohol? A few storefronts exist, but a unified 'discover · log · share' platform is wide open.",
      point2Title: "10M Korean diaspora + global K-culture audience",
      point2Body:
        "Sooly is bilingual KO/EN by design. We claim search traffic in a Korean alcohol space where English info is genuinely scarce.",
      point3Title: "Breweries lack IT and marketing capacity",
      point3Body:
        "Most breweries don't have an active website or marketing channel. Sooly is that infrastructure on your behalf.",
    },

    faq: {
      h2: "Frequently asked",
      q1: "Is the Verified tier really free forever?",
      a1: "Yes. No payment, no card on file, no contract. The Verified ✓ badge, brewery story, photo upload, product editing, and check-in replies are free forever for any brewery owner. This policy holds even after the paid tier ships.",
      q2: "How much will the Business tier cost?",
      a2: "Not decided yet. We're sitting down with 5–10 founding cohort breweries to set honest pricing together. Founding cohort members participate directly in that decision and get 6 months free at launch + lifetime price lock-in + founding-cohort credit.",
      q3: "Could the currently-free features ever become paid?",
      a3: "No. The five Verified features (Verified ✓ badge, story, photos, product edits, check-in replies) are Sooly's community assets and stay free forever. Paid pricing only applies to the Business tier.",
      q4: "How do you verify owners?",
      a4: "Any one of: business registration copy / brewery's official-domain email / proof you operate the brewery's official Instagram or website. We confirm directly and reply within one business day.",
      q5: "Do breweries edit product info and upload photos themselves?",
      a5: "For now, send it via email and we'll publish within 24 hours. A direct edit interface for owners is planned at launch, co-designed with the founding cohort.",
      q6: "Is our brewery already on Sooly?",
      a6: "Out of ~1,300 Korean breweries, about 400 (and 791 products) are already in the catalog. Email us your brewery name and we'll send back the registration status and page URL. New listings are free too.",
      q7: "When does founding cohort recruitment close?",
      a7: "Once 5–10 spots fill, we close it and start launch prep. There's no fixed deadline — we verify and admit applicants in order. After close, standard verification stays open but founding-cohort perks (6 months free, lifetime lock-in, founding credit) no longer apply.",
      q8: "What if we want to leave?",
      a8: "Anytime. One email and we revoke verification or hide info, with data deleted or made private immediately. Same goes for founding cohort breweries.",
    },

    contact: {
      h2: "Apply to the founding cohort",
      description:
        "Tap the button — your draft email is pre-filled. Send it, and we reply within one business day. Standard (non-cohort) verification requests use the same address — just mention it in the body.",
      cta: "✉️ Apply (email pre-filled)",
      fallbackPrefix: "If your email client doesn't open, reach us directly →",
      infoHeader: "Info to include",
      info1: "1. Brewery name (Korean) + English",
      info2: "2. Applicant name + role (e.g. Hong Gildong / CEO)",
      info3: "3. Contact — phone or email",
      info4:
        "4. Verification — business registration copy / official-domain email / proof of running the brewery's Instagram or website",
      info5:
        "5. What you'd like to do (product edits / photos / brewery story / etc.)",
      mailtoSubject: "[Sooly] Founding cohort application",
      mailtoBody:
        "1. Brewery name (Korean):\n2. Brewery name (English, if any):\n3. Applicant name + role (e.g. Hong Gildong / CEO):\n4. Contact (phone or email):\n5. Verification (pick one):\n   a. Business registration copy attached\n   b. Brewery's official-domain email (e.g. kim@brewery.co.kr)\n   c. Proof you run the brewery's official Instagram or website\n6. What you'd like to do (product edits / photo upload / brewery story / etc.):\n\n\n(Anything else you'd like to ask, feel free to write below.)",
    },
  },
};
