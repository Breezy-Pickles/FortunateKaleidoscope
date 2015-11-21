document.addEventListener('DOMContentLoaded', function(){

  // =================== CACHE DOM CALLS ===================\\

  var content = document.getElementById('content');
  var addBtn = document.getElementById('add');
  var title = document.getElementById('title');
  var scope = document.getElementById('scope');
  var prefix = document.getElementById('prefix');
  var snippetText = document.getElementById('snippet');

  // =================== DEFINE UTILITY FUNCTIONS ===================\\
  var utils = {};
  
  utils.log = function (stuff) {
    var li = document.createElement('li');
    var p = document.createElement('p');
    var dl = document.createElement('button');
    dl.innerText = "Download Snippet";
    dl.addEventListener('click', utils.dlCallback);
    p.innerText = stuff;
    li.appendChild(dl);
    li.appendChild(p);
    content.appendChild(li);
  };

  utils.populateDiv = function (source, div) {
    source.forEach(function (obj) {
      var title = Object.keys(obj)[0];
      utils.log(title);
    });
  };

  utils.formatSnippet = function(snippetObj) {
    var snippetTitle = Object.keys(snippetObj)[0];
    snippetObj = JSON.parse(snippetObj[snippetTitle]);
    console.log(snippetTitle);
    console.dir(snippetObj);
    var str = "<snippet><content><![CDATA[" + (snippetObj.text || '') +
    "]]></content><tabTrigger>" + (snippetObj.prefix || '') + 
    "</tabTrigger><scope>" + (snippetObj.scope || '') + "</scope></snippet>";
    return str;
  };

  utils.dlCallback = function (event) {
    event.preventDefault();
    var title = event.target.parentNode.childNodes[1].innerText;    // Vanilla DOM traversal! =)
    chrome.storage.local.get('snippetStore', function (store) {
      for (var i = 0; i < store.snippetStore.length; ++i) {         // loop through array until key equals the title we're looking for
        if (store.snippetStore[i].hasOwnProperty(title)) {
          var encodedObj = btoa(utils.formatSnippet(store.snippetStore[i]));  // btoa method comes with window object, encodes to base64
          var url = 'data:application/json;base64,' + encodedObj;
              chrome.downloads.download({
                  url: url,
                  filename: title+'.sublime-snippet',
                  saveAs: true,
                  conflictAction: "prompt"
              });
          return;
        }
      }
    });
  };

  // =================== LOAD SNIPPETS OR INITIALIZE NEW ARRAY ===================\\

  chrome.storage.local.get('snippetStore', function (snippetStore) {
    if (!Array.isArray(snippetStore.snippetStore)) {
      chrome.storage.local.set({ 'snippetStore': [] }, function () {
        console.log('created new snippet store');
      })
    }
    else {
      utils.populateDiv(snippetStore.snippetStore, content);
    }
  });

  // =================== SET UP EVENT LISTENER ===================\\
  
  addBtn.addEventListener('click', function(event) {
    event.preventDefault();
    var container = {};
    var snippet = {};

    snippet.title = title.value;
    snippet.scope = scope.value;
    snippet.prefix = prefix.value;
    snippet.text = snippetText.value;

    container[snippet.title] = JSON.stringify(snippet);

    chrome.storage.local.get('snippetStore', function (snippetStore) {         // grab snippetStore array
      var nameExists = snippetStore.snippetStore.some(function(snippetObj) {   // check if title is already registered with a snippet
        return Object.keys(snippetObj)[0] === snippet.title;
      });
      if (nameExists) {
        console.log('Sorry, that title is already taken');
        title.value = '';
        title.placeholder = snippet.title +' is already taken . . .'
      }
      else {        
      snippetStore.snippetStore.push(container);                              // push the new object :: {title: objJSONString}
      chrome.storage.local.set({'snippetStore': snippetStore.snippetStore});   // set snippetStore as new updated array
      content.innerHTML = '';                                                 // clear list before repopulating
      utils.populateDiv(snippetStore.snippetStore, content);

      title.value = snippetText.value = prefix.value = '';                    // reset form fields
      title.focus();
      }
    });
  });
});
