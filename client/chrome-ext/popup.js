
// window.alert(typeof jQuery);



document.addEventListener('DOMContentLoaded', function(){

  var log = function (stuff) {
    var li = document.createElement('li');
    var p = document.createElement('p');
    var dl = document.createElement('button');
    dl.innerText = "Download Snippet";
    dl.addEventListener('click', dlCallback);
    p.innerText = stuff;
    li.appendChild(dl);
    li.appendChild(p);
    content.appendChild(li);
  };

  var populateDiv = function (source, div) {
    source.forEach(function (obj) {
      var title = Object.keys(obj)[0];
      log(title);
    });
  };
  var dlCallback = function (event) {
    event.preventDefault();
    var title = event.target.parentNode.childNodes[1].innerText;    // Vanilla DOM traversal! =)
    chrome.storage.local.get('snippetStore', function (store) {
      for (var i = 0; i < store.snippetStore.length; ++i) {         // loop through array until key equals the title we're looking for
        if (store.snippetStore[i].hasOwnProperty(title)) {
          var encodedObj = btoa(JSON.stringify(store.snippetStore[i]));
          var url = 'data:application/json;base64,' + encodedObj;
              chrome.downloads.download({
                  url: url,
                  filename: title+'.txt',
                  saveAs: true
              });
          return;
        }
      }
    });
  };
  // initialize new snippet store array if it doesn't already exist in local storage
  chrome.storage.local.get('snippetStore', function (snippetStore) {
    if (!Array.isArray(snippetStore.snippetStore)) {
      chrome.storage.local.set({ 'snippetStore': [] }, function () {
        console.log('created new snippet store');
      })
    }
    else {
      populateDiv(snippetStore.snippetStore, content);
    }
  });


  // cache DOM calls
  var content = document.getElementById('content');
  var add = document.getElementById('add');
  var title = document.getElementById('title');
  var scope = document.getElementById('scope');
  var prefix = document.getElementById('prefix');
  var snippet = document.getElementById('snippet');


  add.addEventListener('click', function(event) {
    event.preventDefault();
    var container = {};
    var snippet = {};

    snippet.title = title.value;
    snippet.scope = scope.value;
    snippet.prefix = prefix.value;
    snippet.text = snippet.value;

    container[snippet.title] = JSON.stringify(snippet);

    chrome.storage.local.get('snippetStore', function (snippetStore) {         // grab snippetStore array
      snippetStore.snippetStore.push(container);                              // push the new object :: {title: objJSONString}
      chrome.storage.local.set({'snippetStore': snippetStore.snippetStore});   // set snippetStore as new updated array
      
      content.innerHTML = '';                                                 // clear list before repopulating
      populateDiv(snippetStore.snippetStore, content);
    });
  });
});

  // window.alert("ready");



// $.ajax({
//   type: 'POST',
//   url: 'http://localhost:3000/api/snippet',
//   // crossDomain: true,
//   // header: {}
//   data: {
//       "username" : "tpduong",
//       "text" : "text bhalkd asd",
//       "tabPrefix" : "tabPrefix",
//       "title" : "title",
//       "scope" : "scope",
//       "tags" : [],
//       "forkedFrom" : "forkedFrom"
//      },
//   // dataType: 'json',
//   success: function(response) {
//       console.log(response);
//   },
//   error: function (response) {
//       alert('POST failed.');
//   }
// });
