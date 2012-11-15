$(function(){
  var socket = io.connect()
    , $posts   = $('ul#posts')
    , $message = $('input#message')
    ;

  // connect
  socket.on('connect', function () {
    str=prompt('What is your nickname?');
    if (str=="" || str==null) {
      str="名無し";
    }
    socket.emit('set nickname', str);
  });
  
  // join
  socket.on('join', function (data) {
    var $li = $('<li>').text(data.id + ' connected ');
    $posts.prepend($li);
  });
  
  // post
  socket.on('post', function(data) {
    var $li = $('<li>').text(data.id + ' say: ' + data.post);
    $posts.prepend($li);
  });
 
  // disconect
  socket.on('disconnect', function(data) {
    var $li = $('<li>').text(data.id + ' disconnected ');
    $posts.prepend($li);
  }); 
  
  // send message
  $('input#update').on('click', function(e) {
      jQuery().message();
  }); 
  
  // push enter
  $('input#message').keypress(function (e) {
    if(e.which == 13){
      jQuery().message();
    }
  });
  
  // close browser window
  window.onbeforeunload = function(){  
    socket.emit('disconnect');
  } 

  // util
  jQuery.extend(jQuery.fn, {
    message: function() {
      var message = $message.val();
      if (message.length === 0) return;
      socket.emit('post', message);
      // clear message text
      $message.val('');
    }
  });
  
}); 
