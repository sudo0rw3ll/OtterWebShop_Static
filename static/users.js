window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('https://otter-web-shop-rest.onrender.com/admin/user', {method:"GET", headers: {'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addUserBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novi_user").addEventListener("click", function(){
        $("#userModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#userModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editUserModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    $("#userModal").modal('show');
    
        let user = {
            name : document.getElementById("input_name").value,
            surname : document.getElementById("input_surname").value,
            email : document.getElementById("input_email").value,
            username : document.getElementById("input_username").value,
            password : document.getElementById("input_password").value,
            mobile_phone : document.getElementById("input_mobile_phone").value,
            role_id : document.getElementById("input_role_id").value,
            location_id : document.getElementById("input_location_id").value
        };

        user_json = JSON.stringify(user);

        console.log(user_json);

        fetch("https://otter-web-shop-rest.onrender.com/admin/user/addUser", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: user_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch('https://otter-web-shop-rest.onrender.com/admin/user', {method:"GET", headers: {"Authorization" : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_name").value = "";
            document.getElementById("input_surname").value = "";
            document.getElementById("input_email").value = "";
            document.getElementById("input_username").value = "";
            document.getElementById("input_password").value = "";
            document.getElementById("input_mobile_phone").value = "";
            document.getElementById("input_role_id").value = "";
            document.getElementById("input_location_id").value = "";

            $("#userModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("usersTable");
    tabela.innerHTML = "";

    for(i in data){
        console.log(data[i].user_cart_id);
        let redHTML = 
        `<tr data-userID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].name + 
        `</td><td>` + data[i].surname + `</td><td>` + data[i].email + `</td><td>` + data[i].username
            + `</td><td>` + data[i].password + `</td><td>` + data[i].mobile_phone 
            + `</td><td>` + data[i].role_id + `</td><td>` + data[i].location_id + `</td><td>  
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.userid;
        obrisi_buttons[i].addEventListener("click", function(){
            fetch("https://otter-web-shop-rest.onrender.com/admin/user/deleteUser/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/user", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(){
            $("#editUserModal").modal('show');

            let user_id = this.parentNode.parentNode.dataset.userid;
            
            document.getElementById("editUserBtn").addEventListener("click", function(){
                let edit = {
                    id: user_id,
                    name : document.getElementById("edit_input_name").value,
                    surname : document.getElementById("edit_input_surname").value,
                    email : document.getElementById("edit_input_email").value,
                    username : document.getElementById("edit_input_username").value,
                    password : document.getElementById("edit_input_password").value,
                    mobile_phone : document.getElementById("edit_input_mobile_phone").value,
                    role_id : document.getElementById("edit_input_role_id").value,
                    location_id : document.getElementById("edit_input_location_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/user/editUser/"+user_id, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    body: http_body
                })
                .then(response => response.json())
                .then(data => {
                    if(data.msg){
                        alert(data.msg);
                    }else if(data.error){
                        alert(data.error);
                    }else{
                        fetch("https://otter-web-shop-rest.onrender.com/admin/user", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_name").value = "";
                document.getElementById("edit_input_surname").value = "";
                document.getElementById("edit_input_email").value = "";
                document.getElementById("edit_input_username").value = "";
                document.getElementById("edit_input_password").value = "";
                document.getElementById("edit_input_mobile_phone").value = "";
                document.getElementById("edit_input_role_id").value = "";
                document.getElementById("edit_input_location_id").value = "";
                
                $("#editUserModal").modal('hide');
            });
        });
    }
}