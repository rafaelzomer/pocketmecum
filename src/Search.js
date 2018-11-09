import Data from "./Data";
import { removeWithChild, hasParentTag, stringToHtml, getRange, cloneAll } from "./DomUtils";
import { removeAccents } from "./StringUtils";
import Mark from "mark.js";
var currentTimeout = false;
var nodeShowMore = stringToHtml('<a class="law--showmore"> Mostrar mais </a>');
var nodeHasContent = stringToHtml('<a has-content="true" class="law--hascontent"> ... </a>');
var ALL_NODES = {};

function render(node, nodes) {
  node.innerHTML = "";
  for (var i = 0, max = nodes.length; i < max; i++) {
    node.appendChild(nodes[i]);
  }
}

function checkInsert({target, nodes, parent, index, tipo, direction}) {
  var nextIndex = index+1;
  if (direction == 'top') {
    nextIndex = index-1;
  }
  var nodeToInsert = nodes[nextIndex];
  if (!nodeToInsert) {
    parent.removeChild(target);
    console.log('OPA');
    return;
  }
  nodeToInsert.setAttribute('style', 'background: red');
  if (direction === 'top') {
    parent.insertBefore(nodeToInsert, target);
  } else {
    parent.insertBefore(nodeToInsert, target.nextSibling);
  }
  var nextElement = parent.querySelectorAll('[index="'+nextIndex+'"]')[0];
  console.log('nextElement', nextElement);
  if (!nextElement) {
    var showMoreNode = createShowMore(nextIndex, tipo, direction);
    if (direction == 'top') {
      parent.insertBefore(showMoreNode, nodeToInsert);
    } else {
      parent.insertBefore(showMoreNode, nodeToInsert.nextSibling);
      // parent.insertBefore(showMoreNode, nodeToInsert);
    }
  } else {
    parent.removeChild(target.nextSibling.nextSibling);
    parent.removeChild(target.nextSibling);
  }
  parent.removeChild(target);
}

function createShowMore(index, tipo, direction) {
  var showMoreNode = nodeShowMore.cloneNode(true);
  showMoreNode.setAttribute('index', index);
  showMoreNode.setAttribute('tipo', tipo);
  showMoreNode.setAttribute('direction', direction);
  showMoreNode.addEventListener('click', function(e) {
    var target = e.target;
    var index = parseInt(target.getAttribute('index'));
    var tipo = target.getAttribute('tipo');
    var direction = target.getAttribute('direction');
    var parent = target.closest('.law--list');
    var nodes = ALL_NODES[tipo];

    if (direction == 'top') {
      checkInsert({target, nodes, parent, index, tipo, direction});
    }
    if (direction == 'bottom') {
      checkInsert({target, nodes, parent, index, tipo, direction});
    }
  });
  return showMoreNode;
}

function addHasContent(foundNodes) {
  var lastNode = foundNodes[foundNodes.length-1];
  if (!lastNode.getAttribute('has-content')) {
    foundNodes.push(nodeHasContent.cloneNode(true));
  }
}

function searchTextInHtml(html, text, tipo) {
  var foundNodes = [];
  var allNodes = stringToHtml(html, true).getElementsByTagName("*");
  allNodes = removeWithChild(allNodes);
  allNodes = cloneAll(allNodes);
  for (var i = 0, max = allNodes.length; i < max; i++) {
    var node = allNodes[i];
    if (hasParentTag(node, 'strike')) {
      // console.warn('FIXME TODO');
      continue;
    }
    var compareText = removeAccents(node.innerText);
    if (compareText.indexOf(text) > -1) {
      var RANGE = 2;
      var minContent = i-RANGE-1;
      var minRange = i-RANGE;
      var maxRange = i+RANGE;
      var maxContent = i+RANGE+1;
      for (var j = minContent; j <= maxContent; j++) {
        var nodeInRange = allNodes[j];
        nodeInRange.classList.add('law--show');
        if (j == minRange) {
          addHasContent(foundNodes);
          continue;
        } else if (j == maxRange) {
          addHasContent(foundNodes);
          continue;
        } else if (j == minContent) {
          console.warn('COLOCA minContent');
          foundNodes.push(createShowMore(j, tipo, 'bottom'));
          continue;
        } else if (j == maxContent) {
          console.warn('COLOCA maxContent');
          foundNodes.push(createShowMore(j, tipo, 'top'));
          continue;
        } else if (j == i) {
          foundNodes.push(node);
        }
      }
    }
  }
  var instance = new Mark(foundNodes);
  instance.mark(text);
  return {foundNodes, allNodes};
}

function initSearch(text) {
  if (text.length < 3) {
    return;
  }
  var lawRender = document.getElementsByClassName("law--render")[0];
  var finalNodes = [];
  for(var tipo in Data) {
    var dataItem = Data[tipo];
    var html = dataItem.html;
    var {foundNodes, allNodes} = searchTextInHtml(html, text, tipo);
    var lawList = stringToHtml(`<div class="law--list"></div>`);
    render(lawList, foundNodes);
    ALL_NODES[tipo] = allNodes;
    var nodeItem = stringToHtml(`
      <div class="law--item">
        <div class="law--title">${dataItem.title}</div>
      </div>
    `);
    nodeItem.appendChild(lawList);
    finalNodes.push(nodeItem);
  }
  render(lawRender, finalNodes);
}

export function search(text) {
  if (currentTimeout) {
    clearTimeout(currentTimeout);
  }
  currentTimeout = setTimeout(function() {
    initSearch(text);
  }, 500);
}
