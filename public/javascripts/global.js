/**
 * Created by Karthik on 28/08/2014.
 */
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var context;
var x = (window.innerWidth-50)/2;
var y = (window.innerHeight-50)/2;
var dx = 5;
var dy = 5;

var player1BatX = 108;
var player1BatY = 300;
var player2BatX = (document.body.offsetWidth - 107);
var player2BatY = 500;
var player = 2;
var gameCode;
var socket = io.connect('http://localhost:2001');

var player1Score = 0;
var player2Score = 0;


var myCanvas = document.getElementById("myCanvas");
var player1BatObject = document.getElementById("player1Bat");
var player2BatObject = document.getElementById("player2Bat");


function init()
{
    player1Bat();
    player2Bat();
    setInterval(draw,10);
}

$(document).ready(function(){
    $("#player").change(function(){
        player = $("#player").val();
    });
    $("#myCanvas").mousemove(function(e){
        if(parseInt(e.pageY) > 170 && parseInt(e.pageY) < (document.body.offsetHeight - 108)) {
            if(player == 1)
            {
                player1BatObject.style.top = e.pageY + "px";
                player1BatY = e.pageY;
            }
            if(player == 2)
            {
                player2BatObject.style.top = e.pageY + "px";
                player2BatY = e.pageY;
            }
            var data = {
                "gameCode": gameCode,
                "player": player,
                "mouseY": e.pageY
            }
            socket.emit('mouseMove', data);
        }
    });
});

function player1Bat()
{
    player1BatObject.style.top = player1BatY+"px";
    player1BatObject.style.left = player1BatX+"px";
}
function player2Bat()
{
    player2BatObject.style.top = player2BatY + "px";
    player2BatObject.style.left = player2BatX + "px";
}



function draw()
{
    context = myCanvas.getContext('2d');
    context.beginPath();
    context.canvas.width  = window.innerWidth-50;
    context.canvas.height = window.innerHeight-50;
    context.fillStyle = "#111000";
    context.fillRect(100,100,(document.body.offsetWidth - 200),(document.body.offsetHeight - 200));
    context.fill();
    context.moveTo((document.body.offsetWidth/2), 100);
    context.lineTo((document.body.offsetWidth/2), (document.body.offsetHeight -100));
    context.closePath();
    context.strokeStyle = '#ffffff';
    context.stroke();
    context.closePath();
    context.fillStyle = "#00ff00";
    context.arc(x, y, 13, 0, Math.PI*2, true);
    context.fill();
    context.closePath();

    if(player = 1) {
        if (x < 120) {
            if(y >= player1BatY - 115 && y <= (player1BatY + 80 - 115))
            {
                dx = -dx;
            }
            else
            {
                //player1 missed
                player2Score++;
            }
        }
    }
    if(player = 2){
        if (x > (document.body.offsetWidth - 120)  ) {
            if(y >= player2BatY - 115 && y <= (player2BatY + 80 - 115))
            {
                dx = -dx;
            }
            else
            {
                player1Score++;
            }
        }
    }

    if(y < 115 || y > document.body.offsetHeight - 115)
    {
        dy = -dy;
    }
    x += dx;
    y += dy;
    context.restore();
}

socket.on('mouseMove', function (data) {
    if(data.player == 1 && data.gameCode == gameCode)
    {
        player1BatObject.style.top = data.mouseY + "px";
    }
    if(data.player == 2 && data.gameCode == gameCode)
    {
        player2BatObject.style.top = data.mouseY + "px";
    }
});
