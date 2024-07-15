import { toJsonLd } from ".";
import { setAuthorJsonLd, setPublisherJsonLd } from "./set.ld";
import type { JsonLdArticleAuthor } from "./types";

export type JsonLdBlogPostingProps = {
  canonical: string;
  title: string;
  description: string;
  thumbnail: string;
  datePublished: string;
  dateModified: string;
  author: string | string[] | JsonLdArticleAuthor | JsonLdArticleAuthor[];
  publisher: {
    name?: string;
    logo?: string;
  };
  image?: string;
};

export function getBlogAuthorJsonLd(props: JsonLdBlogPostingProps) {
  const data = {
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.canonical,
    },
    headline: props.title,
    description: props.description,
    author: setAuthorJsonLd(props.author),
    publisher: setPublisherJsonLd(props.publisher.name, props.publisher.logo),
    datePublished: props.datePublished,
    image: props.image,
  };

  if (props.thumbnail) {
    data.image = props.thumbnail;
  }

  return toJsonLd("BlogPosting", data);
}
