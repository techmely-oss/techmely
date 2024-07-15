import { toJsonLd } from ".";

export interface ItemListElementsJsonLd {
  item: string;
  name: string;
  position: number;
}
export function setItemListElementsJson(items: ItemListElementsJsonLd[]) {
  if (items && items.length > 0) {
    return items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      item: {
        "@id": item.item,
        name: item.name,
      },
    }));
  }

  return undefined;
}

export function getBreadcrumbJsonLd(items: ItemListElementsJsonLd[]) {
  return toJsonLd("BreadcrumbList", {
    itemListElement: setItemListElementsJson(items),
  });
}
