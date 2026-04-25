/**
 * JSON-LD (Schema.org) 출력 헬퍼.
 *
 * Server Component 안에서 데이터 객체를 받아 <script type="application/ld+json">
 * 태그로 직렬화. dangerouslySetInnerHTML 을 쓰는 이유는 React 가
 * <script> 자식 텍스트의 일부 문자(< 등)를 escape 해 JSON-LD 가 깨지기 때문.
 *
 * 효과: Google 이 검색 결과에 풍부한(rich) 결과 표시 — 카테고리·제조사·
 * 별점·가격·위치 등이 검색결과에 직접 노출되어 CTR 상승.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 가 < 와 & 를 escape 하지는 않지만, JSON 안의 string 은
      // 그대로 직렬화. </script> 가 데이터에 들어올 일은 거의 없으나,
      // 만약을 위해 해당 패턴을 < 로 치환해 escape.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
