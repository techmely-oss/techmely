export * from "./types";
export * from "./article.ld";
export * from "./blogPost.ld";
export * from "./breadcrumb.ld";
export * from "./course.ld";
export * from "./set.ld";

export function toJsonLd(type: string, jsonLd: any) {
  const { id = undefined } = jsonLd;
  const updated = {
    ...(id ? { "@id": jsonLd.id } : {}),
    ...jsonLd,
  };

  // biome-ignore lint/performance/noDelete: <explanation>
  delete updated.id;

  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    ...updated,
  });
}
