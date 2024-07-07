import type { JsonLdArticleAuthor, JsonLdProvider } from "./types";

function genAuthorInfo(author: string | JsonLdArticleAuthor) {
  if (typeof author === "string") {
    return { "@type": "Person", name: author };
  }

  return { "@type": author?.type ?? "Person", name: author.name, url: author?.url };
}

export function setAuthorJsonLd(
  author: string | string[] | JsonLdArticleAuthor | JsonLdArticleAuthor[],
) {
  if (Array.isArray(author)) {
    return author.map((author: string | JsonLdArticleAuthor) => genAuthorInfo(author));
  }
  return genAuthorInfo(author);
}

export function setPublisherJsonLd(name?: string, logo?: string) {
  if (!name && !logo) {
    return undefined;
  }
  return {
    "@type": "Organization",
    name: name,
    logo: { "@type": "ImageObject", url: logo },
  };
}

export function setProvider(provider: JsonLdProvider) {
  if (provider) {
    return {
      "@type": provider.type || "Organization",
      name: provider.name,
      sameAs: provider.url,
    };
  }

  return undefined;
}
