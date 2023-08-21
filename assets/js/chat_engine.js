class ChatEngine{
    constructor(chatBoxId,userEmail){
        this.chatBoxId=$(`#${chatBoxId}`);
        this.userEmail=userEmail;
        this.socket=io.connect('http://localhost:5000');
        if(this.userEmail){
            this.connectionHandler();
        }
    }
    connectionHandler(){
        let self=this;
        this.socket.on('connect',function(){
            console.log('conection established using sockets...!');
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'codeial'
            });
            self.socket.on('user_joined',function(data){
                console.log('user joined',data);
            });
            $('#message-send-button').click(function(){
                let msg=$('#message-input').val();
                if(msg!=''){
                    $('#message-input').val('');
                    self.socket.emit('send_message',{
                        message:msg,
                        user_email:self.userEmail,
                        chatroom:'codeial'
                    })
                }
            });
            self.socket.on('receive_message',function(data){
                console.log(data);
                let newMessage=$('<li>');
                let messageType='friend-message';
                if(data.user_email==self.userEmail){
                    messageType='your-message';
                }
                newMessage.append($('<span>',{
                    html:data.message
                }));
                newMessage.append($('<sub>',{
                    html:data.user_email
                }));
                newMessage.addClass(messageType);
                $('#message-list').append(newMessage);
            })
        });
    }
}
