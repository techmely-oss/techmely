import { toJsonLd } from ".";
import { setAuthorJsonLd, setPublisherJsonLd } from "./set.ld";
import type { JsonLdProps } from "./types";

interface NewsArticleJsonLd extends JsonLdProps {
  scriptId?: string;
  url: string;
  title: string;
  images: ReadonlyArray<string>;
  section: string;
  keywords?: string;
  dateCreated?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string | string[];
  description: string;
  body: string;
  publisherName: string;
  publisherLogo: string;
}

export function getNewsArticleJsonLd({
  scriptId,
  type = "NewsArticle",
  keyOverride,
  url,
  title,
  images,
  section,
  dateCreated,
  datePublished,
  dateModified,
  authorName,
  publisherName,
  publisherLogo,
  body,
  ...rest
}: NewsArticleJsonLd) {
  const data = {
    ...rest,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    image: images,
    articleSection: section,
    dateCreated: dateCreated || datePublished,
    datePublished,
    dateModified: dateModified || datePublished,
    author: setAuthorJsonLd(authorName),
    publisher: setPublisherJsonLd(publisherName, publisherLogo),
    articleBody: body,
  };
  return toJsonLd("NewsArticle", { ...data });
}
