export function saveFile(blob: Blob, filename: string) {
  const blobURL = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = blobURL;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(blobURL);
}
