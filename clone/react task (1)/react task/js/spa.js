

$(window).on('load', function(e) {
    socket.on('user/auth', (data) => {
        console.log('auth:', data)
        if (data.success) {
            navHome();
        } else {
            navLogin();
        }
    });
    socket.emit('user/auth', {
        token: getToken(),
    });
});

function getToken() {
    return window.localStorage.getItem('beatific-token');
}
function setToken(token) {
    window.localStorage.setItem('beatific-token', token);
}

function navLogin() {
    $.get('./views/login.html', function(pageContent) {
        $('body').html(pageContent);
    }).fail(failedGet)
}

function navHome() {
    $.get('./views/home.html', function(pageContent) {
        $('body').html(pageContent);
    }).fail(failedGet)
}

function failedGet() {
    const refresh = '<a class="refreshpage" href=".">refresh page</a>'
    $('body div').html('Whoops, something went wrong, try again. Make sure you are online.<br>' + refresh);
}