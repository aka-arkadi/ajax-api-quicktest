console.log('Hallo - app.js is ready');
const response_text = document.getElementById('response_text');
const login_email = document.getElementById('login_email');
const login_password = document.getElementById('login_password');
const url_input = document.getElementById('url');
const response_time = document.getElementById('response_time');
const login_status = document.getElementById('login_status');
const json_textarea = document.getElementById('json_textarea');
var b_token = '';
var url_login = "http://localhost:8000/api/auth/login";

function load_response(a) {
    var jsonResponse;
    if (a.responseText != '') {
        try {
            jsonResponse = JSON.parse(a.responseText);
            jsonResponse = 'status code: '+a.status+'<br>'+JSON.stringify(jsonResponse, null, 4);
        } catch (e) {            
            jsonResponse = 'status: '+ (a.status).toString()+'<br>'+'status_text: '+ a.statusText +'<br>exception: json.parse, response text, load response function';
            console.log('exception, json.parse in load_response function');
        }
    } else {
        jsonResponse = 'status: '+ (a.status).toString()+'<br>'+'status_text: '+ a.statusText;
    }
    response_text.innerHTML = jsonResponse;    
}

function set_auth(xhttp) { 
    if (b_token != '') xhttp.setRequestHeader('Authorization', 'Bearer ' + b_token);    
}

function get_request() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () { load_response(this); }
    xhttp.open("GET", url_input.value, false);
    // xhttp.open(.., .., x) -> true: asynchronous task, false: synchronous task
    set_auth(xhttp);
    var start = Date.now();
    xhttp.send();
    response_time.innerHTML= (Date.now()-start).toString() + 'ms';
}

function delete_request() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () { load_response(this);}
    xhttp.open("DELETE", url_input.value, false);
    set_auth(xhttp);
    var start = Date.now();
    xhttp.send();
    response_time.innerHTML = (Date.now()-start).toString() + 'ms';
}

function put_request() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() { load_response(this); }
    xhttp.open("PUT", url_input.value, false);
    set_auth(xhttp);
    xhttp.setRequestHeader('Content-type','application/json; charset="utf-8"');
    var start = Date.now();
    xhttp.send(json_textarea.value);
    response_time.innerHTML = (Date.now()-start).toString() + 'ms';
}

function post_request() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () { load_response(this); }
    xhttp.open("POST", url_input.value, false);
    set_auth(xhttp);
    xhttp.setRequestHeader('Content-type','application/json; charset="utf-8"');
    var start = Date.now();
    xhttp.send(json_textarea.value);
    response_time.innerHTML= (Date.now()-start).toString() + 'ms';
}

function not_used() {
    /* method for post via form-data, no need to set content-typ in request-header for form-data 
    try {
        var json_data = JSON.parse(json_textarea.value);
    } catch (e) {
        response_text.innerHTML = 'exception in post function, json.parse, check json field';
        return;
    }
    fdata = new FormData();
    for (key of Object.keys(json_data)) {
        fdata.append(key, json_data[key]);
    }
    xhttp.send(fdata);*/
    console.log('hm');
}

function login_logout() {
    if (b_token == '') {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            var jsonResponse;
            try {
                jsonResponse = JSON.parse(this.responseText);
                b_token = jsonResponse['access_token'];
                console.log('b_token: ' + b_token.substr(1,20)+'...');
                console.log('logged in');
                login_status.innerHTML = '<div style="color:#292;"><strong> logged in </strong></div>';
            } catch (e) { console.log('loggin failed, exception json.parse in login_logout function'); }
        }
        xhttp.open("POST", url_login, true);
        fdata = new FormData();
        fdata.append('email', login_email.value);
        fdata.append('password', login_password.value);
        xhttp.send(fdata);
    } else {
        b_token = '';
        console.log('logged out');
        login_status.innerHTML = '<div style="color:#777;">not logged in</div>';
    }
}
