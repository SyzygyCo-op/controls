
let PLUG_URL = "https://plugs.syzygysf.com/?key="+PLUG_KEY;
let DOOR_URL = "https://card.syzygysf.com/?card="+DOOR_CARD+"&key="+DOOR_KEY;

function send_command(url, callback)
{
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status == 200)
        {
            let res = JSON.parse(xhr.response);
            if(res.status == "OK")
            {
                callback(res.value);
            }
        }
        else
        {
            console.log("command failure");
            console.log(url);
            console.log(xhr.response);
            callback("error");
        }
    };
    xhr.onerror = function() {
        console.log("command failure");
        console.log(url);
        console.log(xhr.response);
        callback("error");
    };

    xhr.open("GET", url);
    xhr.send();
}

function toggle_light(device, callback)
{
    let url = PLUG_URL + "&device=" + device + "&value=toggle";
    send_command(url, callback);
}

function get_light(device, callback)
{
    let url = PLUG_URL + "&device=" + device;
    send_command(url, callback);
}

function unlock_door(callback)
{
    let url = DOOR_URL + "&fn=unlock";
    send_command(url, callback);
}

function get_door(callback)
{
    let url = DOOR_URL + "&fn=get";
    send_command(url, callback);
}

function setClass(element, result) {
    if(result == "on")
    {
        element.classList.remove("off");
        element.classList.add("on");
    }
    else
    {
        element.classList.remove("on");
        element.classList.add("off");
    }
}

document.addEventListener('DOMContentLoaded', function(){ 
    let buttons = document.getElementsByTagName("a");

    for(let b of buttons)
    {
        if(b.dataset.type == "plug")
        {
            let setButtonClass = function(result) {
                if(result == "on")
                {
                    b.classList.remove("off");
                    b.classList.add("on");
                }
                else if(result == "off")
                {
                    b.classList.remove("on");
                    b.classList.add("off");
                }
                else
                {
                    b.classList.remove("on");
                    b.classList.remove("off");
                }
            };

            b.onclick = function() {
                toggle_light(b.dataset.name, setButtonClass);
            };

            get_light(b.dataset.name, setButtonClass);
            setInterval(function() {
                get_light(b.dataset.name, setButtonClass);
            }, 5000);
        }
        else if(b.dataset.type == "door")
        {
            let setButtonClass = function(result) {
                if(result == "unlocked")
                {
                    b.classList.remove("off");
                    b.classList.add("on");
                }
                else if(result == "locked")
                {
                    b.classList.remove("on");
                    b.classList.add("off");
                }
                else
                {
                    b.classList.remove("on");
                    b.classList.remove("off");
                }
            };

            b.onclick = function() {
                unlock_door(setButtonClass);
            };

            get_door(setButtonClass);
            setInterval(function() {
                get_door(setButtonClass);
            }, 5000);
        }
    }
});
