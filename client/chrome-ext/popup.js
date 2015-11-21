
// window.alert(typeof jQuery);



document.addEventListener('DOMContentLoaded', function(){
var log = function (stuff) {
  var text = $('#content').html();
  $('#content').html(text+'\n'+stuff);
};

  $(".add").click(function(event) {
    event.preventDefault();
    var snippet = {};
    snippet.title = $("#title").val();
    snippet.scope = $("#scope").val();
    snippet.prefix = $("#prefix").val();
    snippet.text = $("#snippet").val();
    var snippetJSON = JSON.stringify(snippet);
    log(snippetJSON);
    // chrome.storage.sync.set({'first': snippetJSON}, function () {
    //   log('success');
    // });
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
