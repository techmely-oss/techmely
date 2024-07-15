/**
 * Download according to the background interface file stream
 * @param {BlobPart} data
 * @param {string} filename
 * @param {string} mime
 * @param {BlobPart} bom
 */
export function downloadByData(data: BlobPart, filename: string, mime?: string, bom?: BlobPart) {
  const blobData = typeof bom !== "undefined" ? [bom, data] : [data];
  const blob = new Blob(blobData, { type: mime || "application/octet-stream" });

  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement("a");

  tempLink.style.display = "none";
  tempLink.href = blobURL;
  tempLink.setAttribute("download", filename);
  tempLink.dataset.testid = "link-download-blob-file";

  if (typeof tempLink.download === "undefined") {
    tempLink.setAttribute("target", "_blank");
  }

  document.body.appendChild(tempLink);
  tempLink.click();
  // After download File --> Remove this temporary element to the body
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobURL);
}
