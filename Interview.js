console.log('hello world')
var user = "exercise"; // app clientID
var password = "P@ssw0rd!!"; // app clientSecret
var caspioTokenUrl = "https://va.idp.liveperson.net/api/account/40912224/signup";
var XMLHttpRequest = require('xhr2');
var jwt
var convesation_id
var request = new XMLHttpRequest();
var msg = {
    kind: "req",
    id: 1,
    type:"cm.ConsumerRequestConversation",
};
const WebSocket = require('ws');
function getToken(url, clientID, clientSecret) {
    var key;           
    request.open("POST", url, true); 
    request.setRequestHeader("Content-type", "application/json");
    request.send("User="+clientID+"&"+"Passsword="+clientSecret); // specify the credentials to receive the token on request
    request.onreadystatechange = function () {
        if (request.readyState == request.DONE) {
            var response = request.responseText;
            var obj = JSON.parse(response); 
            key = obj.access_token; //store the value of the accesstoken
            token_ = key; // store token in your global variable "token_" or you could simply return the value of the access token from the function
            var jwt = obj['jwt'];
            var socket = new WebSocket("wss://va.msg.liveperson.net/ws_api/account/40912224/messaging/consumer?v=3",{
            headers : {
                Authorization: "jwt " + jwt
            }
        });
        socket.onopen = function(e) { socket.send(JSON.stringify(msg));}
       
        
        
        socket.onmessage = function (event) {
            convesation_id = JSON.parse(event.data)["body"]["conversationId"]
            console.log(convesation_id)
            var msg2 = {
                kind: "req",
                id: 2,
                type:"ms.PublishEvent",
                body:{
                    dialogId: convesation_id,
                    event:{
                        type:"ContentEvent",
                        contentType:"text/plain",
                        message:"My first message"}}
            };
          
            }
            socket.send(JSON.stringify(msg2));
            }
          
        
        
        }
        
}
// Get the token
getToken(caspioTokenUrl,user, password);
