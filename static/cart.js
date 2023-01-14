window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch("https://otter-web-shop-rest.onrender.com/admin/cart", {method:"GET", headers:{"Authorization" : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addCartBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novi_cart").addEventListener("click", function(){
        $("#cartModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#cartModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editCartModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#cartModal").modal('show');
        
        let cart = {
            user_cart_id: document.getElementById("input_user_cart_id").value,
        };

        json_cart = JSON.stringify(cart);

        fetch("https://otter-web-shop-rest.onrender.com/admin/cart/createCart", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body:json_cart
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/cart", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            document.getElementById("input_user_cart_id").value = "";
            
            $("#cartModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    
    var tabela = document.getElementById("cartsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = `<tr data-cartID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].user_cart_id + `</td><td> 
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.cartid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/cart/deleteCart/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/cart", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            $("#editCartModal").modal('show');
            let cart_id = this.parentNode.parentNode.dataset.cartid;
            
            document.getElementById("editCartBtn").addEventListener("click", function(e){
                e.preventDefault();
                let edit = {
                    id : cart_id,
                    user_cart_id : document.getElementById("user_cart_id_input").value,
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/cart/editCart/"+cart_id, {
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
                    if(data.error){
                        alert(data.error);
                    }else if(data.msg){
                        alert(data.msg);
                    }else{
                        fetch("https://otter-web-shop-rest.onrender.com/admin/cart", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });

                document.getElementById("user_cart_id_input").value = "";
     
                $("#editCartModal").modal('hide');
            });
        });
    }
}