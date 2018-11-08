import Data from "./Data";
import { removeWithChild, hasParentTag, stringToHtml, getRange, cloneAll } from "./DomUtils";
import { removeAccents } from "./StringUtils";
import Mark from "mark.js";
var currentTimeout = false;
var nodeShowMore = stringToHtml('<a class="law--showmore"> Mostrar mais </a>');
var nodeHasContent = stringToHtml('<a class="law--hascontent"> ... </a>');

function render(node, nodes) {
  node.innerHTML = "";
  for (var i = 0, max = nodes.length; i < max; i++) {
    node.appendChild(nodes[i]);
  }
}

function addShowMore(foundNodes) {
  var showMoreNode = nodeShowMore.cloneNode(true);
  var index = foundNodes.length + 1;
  showMoreNode.setAttribute('index', index);
  foundNodes.push(showMoreNode);
  showMoreNode.addEventListener('click', function(e) {
    var target = e.target;
    console.log('->>', target.getAttribute('index'));
  });
}

function searchTextInHtml(html, text) {
  var foundNodes = [];
  var allNodes = stringToHtml(html, true).getElementsByTagName("*");
  allNodes = removeWithChild(allNodes);
  allNodes = cloneAll(allNodes);
  // console.log('allNodes', allNodes);
  for (var i = 0, max = allNodes.length; i < max; i++) {
    var node = allNodes[i];
    foundNodes.push(node);
    if (hasParentTag(node, 'strike')) {
      console.warn('FIXME TODO');
      continue;
    }
    var compareText = removeAccents(node.innerText);
    if (compareText.indexOf(text) > -1) {
      console.log('compareText', compareText, text);
      // foundNodes = foundNodes.concat(getRange(allNodes, i, text, 2));
      
      var RANGE = 2;
      var minContent = i-RANGE-1;
      var minRange = i-RANGE;
      var maxRange = i+RANGE;
      var maxContent = i+RANGE+1;
      for (var j = minContent; j <= maxContent; j++) {
        var nodeInRange = allNodes[j];
        nodeInRange.classList.add('law--show');
        if (j == minRange) {
          foundNodes.push(nodeHasContent.cloneNode(true));
          continue;
        } else if (j == maxRange) {
          foundNodes.push(nodeHasContent.cloneNode(true));
          continue;
        } else if (j == minContent) {
          addShowMore(foundNodes);
          continue;
        } else if (j == maxContent) {
          addShowMore(foundNodes);
          continue;
        }
        nodeInRange.classList.add('law--show');
      }
    }
  }
  var instance = new Mark(foundNodes);
  instance.mark(text);
  return foundNodes;
}

function initSearch(text) {
  if (text.length < 3) {
    return;
  }
  var lawRender = document.getElementsByClassName("law--render")[0];
  var finalNodes = [];
  for (var i = 0, max = Data.length; i < max; i++) {
    var dataItem = Data[i];
    var html = dataItem.html;
    var searchedNodes = searchTextInHtml(html, text);
    var lawList = stringToHtml(`<div class="law--list"></div>`);
    render(lawList, searchedNodes);
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
