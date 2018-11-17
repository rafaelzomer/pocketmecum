import "./offline";
import "./styles/reset.css";
import "./styles/index.css";
import "./styles/law.css";
import "./styles/search.css";
import "./styles/main.css";
import "./styles/header.css";
import logo from '../static/logo.svg';
import {stringToHtml} from './DomUtils';
import defaultHtml from './default.html';
import {search} from './Search';

const page = stringToHtml(defaultHtml, true);
document.body.appendChild(page);

document.addEventListener("DOMContentLoaded", () => {
  var searchInput = document.getElementById("search-input");
  var logoImg = document.getElementById("logo");

  searchInput.onkeyup = function(e) {
    var input = e.target;
    search(input.value);
  };
  logoImg.setAttribute('src', logo);
  search(true);
});
