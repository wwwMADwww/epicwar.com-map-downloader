// ==UserScript==
// @name        epicwar.com map downloader
// @namespace   epicwar.com
// @description epicwar.com map downloader
// @include     *://www.epicwar.com/maps/
// @include     *://www.epicwar.com/maps/search/?go*
// @version     1
// @grant       none
// ==/UserScript==

function loadScript(scriptUrl, afterLoadFunc){
  fetch(scriptUrl)
      .then(response => response.text())
      .then(text => eval(text))
      .then(() => afterLoadFunc() );
};

function main() {
  
  if (!Enumerable)
  {
    // нужен загруженный LinqJS
    console.error("import linqjs!");
    return;
  }

  // создаем стиль для чекбоксов
  var checkBoxStyleName = 'epicwar-grabber-checkbox';
  var checkBoxStyle = document.createElement('style');
  checkBoxStyle.type = 'text/css';
  checkBoxStyle.innerHTML = "."+checkBoxStyleName+" { float: right }"; // расположение у правого края контейнера
  document.getElementsByTagName('head')[0].appendChild(checkBoxStyle); // запихиваем стиль в <head>

  // проверка на нужную ссылку
  function isDownloadLink(str) {
    if (str)
      return str.search(/\/maps\/download\/.*w3x/) > -1;  // строка, содержащая "/maps/downloads/" и "w3x"      
  };

  function createCheckBox(id, checked) {
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = "MadCheckbox";
    checkbox.checked = checked;
    checkbox.className = checkBoxStyleName;
    checkbox.id = id;
    return checkbox;
  };

  function createButton(id, caption, onClick) {
    var b = document.createElement('button');
    b.id = id;
    b.innerText = caption;
    b.onclick = onClick;
    return b;
  };

  function createButtonTopBar() {
    var forms = document.getElementsByTagName("form"); // поиска тега <form>
    var searchFormDiv = Enumerable.from(forms).where(f => {console.log(f); return f.attributes['action'].value == '/maps/search/'}).firstOrDefault().parentNode; 
    var buttonBar = document.createElement('div');
    searchFormDiv.parentNode.insertBefore(buttonBar, searchFormDiv);
    return buttonBar;
  };

  // для удобной работы
  var controlSets = [];

  function onCheckAllClick() {
    Enumerable.from(controlSets).forEach(controlSet => { controlSet.checkBox.checked = true });
  };

  function onUnheckAllClick() {
    Enumerable.from(controlSets).forEach(controlSet => { controlSet.checkBox.checked = false });
  };

  function onDownloadSelectedClick() {
    Enumerable.from(controlSets).where(controlSets => controlSets.checkBox.checked).forEach(controlSet => {
      // надо сделать загрузку файлов
      console.log("download "+controlSet.link.href);
    });
  };


  var buttonBar = createButtonTopBar();
  buttonBar.appendChild(createButton("checkAllButton"        , "Выделить всё"      , onCheckAllClick));
  buttonBar.appendChild(createButton("uncheckAllButton"      , "Снять выделение"   , onUnheckAllClick));
  buttonBar.appendChild(createButton("downloadSelectedButton", "Скачать выделенное", onDownloadSelectedClick));

  // ячейки таблицы имеют класс listentry
  var listEntries = document.getElementsByClassName("listentry");

  var i = 0;

  Enumerable.from(listEntries)
    .where(listEntry => listEntry.childNodes.length > 1) // ищем ячейки с вложенными элементами
    .forEach(listEntry => {
      // имщем среди вложенных элементов ссылку на скачивание карты
      var query = Enumerable.from(listEntry.childNodes).where(node => isDownloadLink(node.href));
      
      // если таких элементов нет - идем на следующую ячейку
      if (!query.any())
        return;
      
      
      var controlSet = {
        listEntry: listEntry,
        link: query.firstOrDefault()
      };
      
      // создаем чекбокс
      controlSet.checkBox = createCheckBox("madCheckbox" + i, 1);
      // помещаем чекбокс в ячейку со ссылкой, потому что помещать в другую ячейку мне лень
      controlSet.listEntry.appendChild(controlSet.checkBox);
      
      controlSets.push(controlSet);
      
      i++;
    });

  
};

//loadScript('https://raw.githubusercontent.com/mihaifm/linq/master/linq.js', main);
loadScript('https://raw.githubusercontent.com/mihaifm/linq/6d75e2310d7ed092977775ff3933ccff7a64643e/linq.js', main);
