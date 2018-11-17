export function generateHash(){
  return Math.random().toString(36).substring(7);
}

export function stringToHtml(str, getAll) {
  let parser = new DOMParser(),
  dom = parser.parseFromString(str.replace(/>\s+</g,'><'), "text/html");
  return getAll ? dom.body : dom.body.firstChild;
}
