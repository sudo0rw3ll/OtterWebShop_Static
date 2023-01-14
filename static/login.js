window.addEventListener("load", () => {
    document.getElementById("btn_login").addEventListener('click', e => {
        e.preventDefault();

        console.log("login_clicked");

        const data = {
            username: document.getElementById('login_username').value,
            password: document.getElementById('login_password').value
        };

        fetch("http://127.0.0.1:9000/login", {
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(el => {
            if(el.msg){
                alert(el.msg);
            }else{
                document.cookie = `token=${el.token};SameSite=Lax`;
                window.location.href = 'admin_dashboard.html';
            }
        });
    });
});