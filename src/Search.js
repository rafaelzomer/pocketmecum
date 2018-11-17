import Data from "./Data";
import { generateHash, stringToHtml } from "./DomUtils";
import Mark from "mark.js";
var allMarkeds = {};
var currentTimeout = false;

function render(node, nodes) {
  node.innerHTML = "";
  for (var i = 0, max = nodes.length; i < max; i++) {
    node.appendChild(nodes[i]);
  }
}

function searchForText(html, text) {
  var foundNodes = stringToHtml(html, true);
  var instance = new Mark(foundNodes);
  instance.mark(text);
  return { instance, foundNodes: getVisibleElements(foundNodes) };
}

function changeOcurrence(id, direction, ignoreChange) {
  var markeds = allMarkeds[id];
  var qtd = markeds.length;
  if (qtd < 1) {
    return;
  }
  var currentElm = document.getElementById(id + "-current");
  var listElm = document.getElementById(id + "-list");
  var currentIndex = parseInt(currentElm.innerText)-1;
  var indexAnterior = currentIndex;
  if (!ignoreChange) {
    if (direction == "next") {
      currentIndex++;
    } else {
      currentIndex--;
    }
  }
  if (currentIndex > qtd-1) {
    currentIndex = 0;
  }
  if (currentIndex < 0) {
    currentIndex = qtd-1;
  }
  currentElm.innerText = currentIndex+1;
  var antElm = markeds[indexAnterior];
  var proxElm = markeds[currentIndex];
  antElm.classList.remove("law--tagged");
  proxElm.classList.add("law--tagged");
  listElm.scrollTop = proxElm.offsetTop-125;
}

function getVisibleElements(elements) {
  var element = elements.getElementsByTagName("table"), index;
  for (index = element.length - 1; index >= 0; index--) {
      element[index].parentNode.removeChild(element[index]);
  }
  return elements;
}

function initSearch(text) {
  if (text.length < 3 && text !== true) {
    return;
  }
  if (text == true) {
    text = '';
  }
  var lawRender = document.getElementsByClassName("law--render")[0];
  var finalNodes = [];
  for (var tipo in Data) {
    var dataItem = Data[tipo];
    var html = dataItem.html;
    var { foundNodes } = searchForText(html, text, tipo);
    var id = generateHash();
    var lawList = stringToHtml(`<div id="${id}-list" class="law--list"></div>`);
    var nodeItem = stringToHtml(`
      <div class="law--item">
        <div class="law--title">${dataItem.title}</div>
      </div>
    `);
    lawList.appendChild(foundNodes);
    nodeItem.appendChild(lawList);
    var buttonBack = stringToHtml(`<button><</button>`);
    buttonBack.index = id;
    buttonBack.addEventListener("click", function(e) {
      changeOcurrence(e.target.index, "back");
    });
    var buttonForward = stringToHtml(`<button>></button>`);
    buttonForward.index = id;
    buttonForward.addEventListener("click", function(e) {
      changeOcurrence(e.target.index, "next");
    });
    allMarkeds[id] = foundNodes.getElementsByTagName("mark");
    var qtd = allMarkeds[id].length;
    var actions = stringToHtml(`
      <div class="law--actions">
        <span><b id="${id}-current">${qtd > 0 ? 1 : 0}</b> de ${qtd}</span>
      </div>
    `);
    actions.appendChild(buttonBack);
    actions.appendChild(buttonForward);
    nodeItem.appendChild(actions);
    setTimeout(changeOcurrence.bind(null, id, "next", true), 500);
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
