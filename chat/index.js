$(() => {
    const socket = new WebSocket('ws://localhost:5000/chat');
    // User color
    function randomHSL(){
        let rand = Math.random;
        let round = Math.round;
        return `hsl(${round(360*rand())},${round(35+45*rand())}%,${round(40+10*rand())}%)`
    }

    // Add chat message
    var addNewMessage = (usr, msg, color) => 
        $("#chat-box").prepend([
            $("<article></article>", {"class":"chat-object"})
                .append($("<ul></ul>")
                    .append([
                        $("<li>",{"class":"chat-user","text": usr})
                            .css("color", color),
                        $("<li>",{"class":"chat-message","text": msg}),
                    ])
                )
            ]);

    socket.addEventListener('open', function (event) {
        socket.send('Server established connection.');
        addNewMessage('SYSTEM','Connection established...', 'hsl(0, 100%, 50%)')
    });


    // Get chat color
    let chatColor = randomHSL();

    // Listen for messages
    socket.addEventListener('message', function (event) {
        let newMessage = JSON.parse(event.data);
        addNewMessage(`${newMessage.user}: `, newMessage.msg, newMessage.color)
    });

    // JQuery loaded
    $("#chat-form").submit(event => {
        // Send request and update chat
        let user = $('input[name="chat-name"]').val()
        let msg = $('input[name="chat-new-message"]').val()

        if (user != "" && msg != "") {
            socket.send(JSON.stringify({
                "user": user,
                "msg": msg,
                "color": chatColor
            }))
        }
        event.preventDefault();
    })
})