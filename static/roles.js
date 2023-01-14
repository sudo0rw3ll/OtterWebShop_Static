window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:1337/admin/role', {method:"GET", headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addRoleBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novu_role").addEventListener("click", function(){
        $("#rolesModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#rolesModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editRoleModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#rolesModal").modal('show');
    
        let role = {
            role_name: document.getElementById("input_role_name").value
        };

        role_json = JSON.stringify(role);

        fetch("http://localhost:1337/admin/role/addRole", {
            method:"POST",
            headers:{
                'Authorization' : `Bearer ${token}`,
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            },
                body: role_json
            })
            .then(response => response.json())
            .then(data => {
                fetch('http://localhost:1337/admin/role/', {method:"GET", headers: {"Authorization" : `Bearer ${token}`}})
                .then(response => response.json())
                .then(data => updateTable(data));
            });

            
            document.getElementById("input_role_name").value = "";
    
            $("#rolesModal").modal('hide');
}

function updateTable(data){
    var tabela = document.getElementById("rolesTable");
    tabela.innerHTML = "";
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    for(i in data){
        let redHTML = 
        `<tr data-roleID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].role_name +
            `</td><td>` + `<button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.roleid;
        obrisi_buttons[i].addEventListener("click", function(){
            fetch("http://localhost:1337/admin/role/deleteRole/" + id, {method:"DELETE", headers:{"Authorization" : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("http://localhost:1337/admin/role", {method:"GET", headers:{"Authorization" : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(){
            $("#editRoleModal").modal('show');

            let role_id = this.parentNode.parentNode.dataset.roleid;
            
            document.getElementById("editRoleBtn").addEventListener("click", function(){
                let edit = {
                    id: role_id,
                    role_name: document.getElementById("edit_input_role_name").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("http://localhost:1337/admin/role/editRole/"+role_id, {
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
                        fetch("http://localhost:1337/admin/role", {method:"GET", headers:{"Authorization" : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_role_name").value = "";
            
                $("#editRoleModal").modal('hide');
            });
        });
    }
}