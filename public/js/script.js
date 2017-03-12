$(function () {
    let socket = io.connect(),
        $messageArea = $('#messageArea'),
        $messageForm = $('#messageForm'),
        $message = $('#message'),
        $chat = $('#chat'),
        $userFormArea = $('#userFormArea'),
        $userForm = $('#userForm'),
        $users = $('#users'),
        $username = $('#username');

    //User
    $userForm.submit((e)=>{
        e.preventDefault();
        socket.emit('new user', $username.val(), (data)=>{
            if(data){
                $userFormArea.hide();
                $messageArea.show();
            }
        });
        $username.val('');
    });

    socket.on('get users', (data)=>{
        let html = '';
        for(let i=0; i<data.length; i++){
            html += '<li class="list-group-item">' + data[i] + '</li>';
        }
        $users.html(html);
    });

    // Message
    $messageForm.submit((e)=>{
        e.preventDefault();
        socket.emit('send message', $message.val());
        $message.val('');
    });

    socket.on('new message',(data)=>{
        $chat.append('<div class="well"><strong>' + data.user + '</strong>: ' + data.msg + '</div>');
    });

});