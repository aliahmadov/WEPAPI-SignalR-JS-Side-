// let timeSection = document.querySelector("#time-section");
// let button = document.querySelector("#offerBtn");
// let element = document.querySelector("#offerValue");
// var totalseconds = 10;
// var clearInterval;
// var CURRENTROOM="";


// const connection = new signalR.HubConnectionBuilder()
//     .withUrl("https://localhost:7115/offers")
//     .configureLogging(signalR.LogLevel.Information)
//     .build();
// async function start() {
//     try {
//         await connection.start();

//         $.get("https://localhost:7115/api/Offer", function (data, status) {
//             console.log(data);
//             element.innerHTML = 'Begin PRICE $ ' + data;
//         });

//         console.log("SignalR Connected");
//     }
//     catch (err) {
//         console.log(err);
//         setTimeout(() => {
//             start();
//         }, 5000);
//     }
// }
// var lastOffer = 0;
// connection.on("ReceiveMessage", (message, data) => {
//     let element2 = document.querySelector("#offerValue2");
//     data += 100;
//     element2.innerHTML = message + data;
//     button.disabled = false;
//     totalseconds = 0;
//     clearTimeout(clearInterval);
//     timeSection.style.display = "none";

// })


// connection.on("ReceiveInfo", (message, data) => {
//     let element2 = document.querySelector("#offerValue2");
//     element2.innerHTML = message+"\n with this offer : "+data+"$";
//     button.disabled = true;
//     timeSection.style.display = "none";
// })

// connection.onclose(async () => {
//     await start();
// })


// async function IncreaseOffer() {
//     timeSection.style.display = "block";
//     totalseconds = 10;
//     let result = document.querySelector("#user");
//     $.get("https://localhost:7115/Increase?number=100", function (data, status) {
//         element.innerHTML = data;
//         $.get("https://localhost:7115/api/Offer", function (data, status) {
//             lastOffer = data;
//             let element2 = document.querySelector("#offerValue2");
//             element2.innerHTML = lastOffer;
//         });
//     });

//     await connection.invoke("SendMessage", result.value);
//     button.disabled = true;

//     clearInterval = setInterval(async () => {
//         let time = document.querySelector("#time");
//         --totalseconds;
//         time.innerHTML = totalseconds;
//         if (totalseconds == 0) {
//             button.disabled = false;
//             clearTimeout(clearInterval);
//             let result = document.querySelector("#user");
//             button.disabled = true;
//             await connection.invoke("SendWinnerMessage", "Game Over\n" + result.value + " is winner");
//         }
//     }, 1000);

// }

// start();


/////////////////////////////////////////////////////
////////////////////////////////////////////////////

let timeSection = document.querySelector("#time-section");
let button = document.querySelector("#offerBtn");
let element = document.querySelector("#offerValue");
var totalseconds = 10;
var clearInterval;
var CURRENTROOM="";
var room=document.getElementById("room");
let currentUser="";
let cars=["chevrolet","mercedes"]
let rooms=document.getElementById("rooms");
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7115/offers")
    .configureLogging(signalR.LogLevel.Information)
    .build();


async function firstStart()
{
    let content=``;
    cars.forEach(async element => {
        content+=`<button onclick="JoinRoom('${element}')">${element}</button>`;
    //  connection.on("ReceiveFileName",(element)=>{

    //  });
    });

    rooms.innerHTML+=content;
}



firstStart();
async function start() {

  
    try {
        await connection.start();

        $.get("https://localhost:7115/Room?room="+CURRENTROOM, function (data, status) {
            console.log(data);
            element.innerHTML = 'Begin PRICE $ ' + data;
        });

        console.log("SignalR Connected");
    }
    catch (err) {
        console.log(err);
        setTimeout(() => {
            start();
        }, 5000);
    }
}
var lastOffer = 0;
connection.on("ReceiveMessageRoom", (message, data) => {
    let element2 = document.querySelector("#offerValue2");
    data += 100;
    element2.innerHTML = message + data;
    button.disabled = false;
    totalseconds = 0;
    clearTimeout(clearInterval);
    timeSection.style.display = "none";

})


connection.on("ReceiveInfoRoom", (message, data) => {
    let element2 = document.querySelector("#offerValue2");
    element2.innerHTML = message+"\n with this offer : "+data+"$";
    button.disabled = true;
    timeSection.style.display = "none";
})

connection.on("ReceiveJoinInfo", (user) => {
    let infoUser = document.querySelector("#info");
    infoUser.innerHTML = user+" connected to our Room";
})

connection.on("ReceiveLeaveInfo",(user)=>{

    let infoUser=document.querySelector("#info");
    infoUser.innerHTML=user+" left our room";
});

connection.on("ReceiveChatMessage",(message)=>{

    let msgsection=document.getElementById("msgsection");
    let content=`<div>${message}</div>`;
    msgsection.innerHTML+=content;
});

connection.onclose(async () => {
    await start();
})


async function IncreaseOffer() {
    timeSection.style.display = "block";
    totalseconds = 20;
    let result = document.querySelector("#user");
    $.get(`https://localhost:7115/IncreaseRoom?room=${CURRENTROOM}&number=100`, function (data, status) {
        element.innerHTML = data;
        $.get("https://localhost:7115/Room?room="+CURRENTROOM, function (data, status) {
            lastOffer = data;
            let element2 = document.querySelector("#offerValue2");
            element2.innerHTML = lastOffer;
        }); 
    });

    await connection.invoke("SendMessageRoom",CURRENTROOM,result.value);
    button.disabled = true;

    clearInterval = setInterval(async () => {
        let time = document.querySelector("#time");
        --totalseconds;
        time.innerHTML = totalseconds;
        if (totalseconds == 0) {
            button.disabled = false;
            clearTimeout(clearInterval);
            let result = document.querySelector("#user");
            button.disabled = true;
            await connection.invoke("SendWinnerMessageRoom",CURRENTROOM, "Game Over\n" + result.value + " is winner");
        }
    }, 1000);

}




function HideJoinButtons()
{
    let leave=document.querySelector("#leave");
    let buttons=rooms.getElementsByTagName("button");

    for(let i=0;i<buttons.length;i++)
    {
        buttons[i].style.display="none";
    }
    leave.style.display="block";
}

function UnhideJoinButtons()
{
    let buttons=rooms.getElementsByTagName("button");
    let leave=document.querySelector("#leave");
    for(let i=0;i<buttons.length;i++)
    {
        buttons[i].style.display="block";
    }
    leave.style.display="none";
    console.log(leave);
}

async function JoinRoom(r)
{
   HideJoinButtons();
    room=document.getElementById("room");
    CURRENTROOM=r;
    room.style.display="block";
    await start();
    currentUser=document.getElementById("user").value
    await connection.invoke("JoinRoom",CURRENTROOM,currentUser);
}

async function LeaveRoom()
{
    room=document.getElementById("room");
    await start();
    room.style.display="none";
    UnhideJoinButtons();
    currentUser=document.getElementById("user").value;
    await connection.invoke("LeaveRoom",CURRENTROOM,currentUser);
    clearTimeout(clearInterval)
}


async function SendMessage()
{
    currentUser=document.getElementById("user").value;
    let msg=document.getElementById("msg").value;
    let msgsection=document.getElementById("msgsection");
    await start();
    await connection.invoke("SendChatMessage",CURRENTROOM,msg,currentUser);
    let content=`<div>My message : ${msg}</div>`;

    msgsection.innerHTML+=content;
    $("#msg").val("");
}