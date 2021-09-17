export const isFileFormatSupported = (event) => {
  var ext = getExtFromFile(event).toLowerCase();
  switch (ext) {
    case "jpg":
    case "png":
    case "gif":
    case "jpeg":
    case "mp4":
    case "bmp":
    case "svg":
    case "webm":
    case "MOV":
    case "tif":
      return true;
    default:
      event.target.value = null;
      return false;
  }
};

export const getExtFromFile = (event) => {
  if (
    !event ||
    !event.target ||
    !event.target.files ||
    event.target.files.length === 0
  ) {
    return;
  }
  const name = event.target.files[0].name;
  const lastDot = name.lastIndexOf(".");
  // const fileName = name.substring(0, lastDot);
  const ext = name.substring(lastDot + 1);

  return ext;
};
