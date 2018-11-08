var nodeMostrarMais = stringToHtml('<a class="law--showmore"> Mostrar mais </a>');

export function highlightText(node, text) {
  var content = node.innerText;
  var index = content.indexOf(text);
  if (index >= 0) { 
    var newNode = node.cloneNode(true);
    content = content.substring(0,index) + "<span class='highlight'>" + content.substring(index,index+text.length) + "</span>" + content.substring(index + text.length);
    newNode.innerHtml = content;
    return newNode;
  }
  return null;
}

export function removeWithChild(nodes) {
  var newList = [];
  for (var i=0, max=nodes.length; i < max; i++) {
    var node = nodes[i];
    if (i == 101 || i == 100) {
      console.log('node', node, !node.childNodes[0].tagName);
    }
    if (!node.childNodes || !node.childNodes[0] || !node.childNodes[0].tagName) {
      newList.push(node);
    }
  }
  return newList;
}

export function cloneAll(all) {
  var clonedList = [];
  for (let i = 0; i < all.length; i++) {
    clonedList.push(all[i].cloneNode(true));
  }
  return clonedList;
}

export function getRange(all, index, search, range) {
  // var rangeNodes = [];
  var minRange = index-range;
  var maxRange = index+range;
  for (var j=minRange, max=maxRange; j <= max; j++) {
    var n = all[j];
    // .cloneNode(true);
    if (typeof n !== 'undefined') {
      if (j == minRange) {
        var showmore = nodeMostrarMais.cloneNode(true);
        // rangeNodes.push(showmore);
        all.splice(j, 0, showmore);
        continue;
      } else if (j == maxRange) {
        var showmore = nodeMostrarMais.cloneNode(true);
        all.splice(j, 0, showmore);
        // rangeNodes.push(showmore);
        continue;
      }  
      if (n.tagName && n.tagName.toLowerCase() == 'a') {
        n.removeAttribute('href');
      }
      n.classList.add('law--show');
      // rangeNodes.push(n);
    } else if (j == minRange) {
      // rangeNodes.push(stringToHtml('<h1> ZOMER </h1>'));
    } else if (j == maxRange) {
      // rangeNodes.push(stringToHtml('<h1> ZOMER FIM </h1>'));
    }
  }
  return all;
}

export function stringToHtml(str, getAll) {
  let parser = new DOMParser(),
  dom = parser.parseFromString(str.replace(/>\s+</g,'><'), "text/html");
  return getAll ? dom.body : dom.body.firstChild;
}

export function hasParentTag(node, parentTagName) {
  if (!node) {
    return false;
  }
  if (node.tagName && node.tagName.toLowerCase() == parentTagName.toLowerCase()) {
    return true;
  }
  return hasParentTag(node.parentNode, parentTagName);
}
