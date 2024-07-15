export interface JsonLdProps {
  type?: string;
  scriptId?: string;
  [key: string]: any;
}

export type JsonLdProvider = {
  type?: "Organization" | "Person";
  name: string;
  url?: string;
};

export type JsonLdArticleAuthor = {
  name: string;
  type?: string;
  url?: string;
};
