import Data from "./Data";
import { removeWithChild, hasParentTag, stringToHtml, getRange } from "./DomUtils";
import { removeAccents } from "./StringUtils";
import Mark from "mark.js";
var currentTimeout = false;

function render(node, nodes) {
  node.innerHTML = "";
  for (var i = 0, max = nodes.length; i < max; i++) {
    node.appendChild(nodes[i]);
  }
}

function searchTextInHtml(html, text) {
  var foundNodes = [];
  var allNodes = stringToHtml(html, true).getElementsByTagName("*");
  allNodes = removeWithChild(allNodes);
  console.log('allNodes', allNodes);
  for (var i = 0, max = allNodes.length; i < max; i++) {
    var node = allNodes[i];
    if (hasParentTag(node, 'strike')) {
      console.warn('dasdsad');
      continue;
    }
    var compareText = removeAccents(node.innerText);
    if (compareText.indexOf(text) > -1) {
      console.log('compareText', compareText, text);
      foundNodes = foundNodes.concat(getRange(allNodes, i, text, 2));
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
