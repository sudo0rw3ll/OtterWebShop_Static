window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addCartItemBtn").addEventListener("click", createCartItem);
        
    document.getElementById("btn_dodaj_novi_carti").addEventListener("click", function(){
        $("#cartItemModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#cartItemModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editCartItemModal").modal('show');
    });
});


function createCartItem(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    $("#cartItemModal").modal('show');
    
        let cartItem = {
            quantity: document.getElementById("input_quantity").value,
            cart_id: document.getElementById("input_cart_id").value,
            cart_product_id: document.getElementById("input_cart_product_id").value
        };

        json_cart_item = JSON.stringify(cartItem);

        fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem/addCartItem", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body:json_cart_item
            })
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            document.getElementById("input_quantity").value = "";
            document.getElementById("input_cart_id").value = "";
            document.getElementById("input_cart_product_id").value = "";
            
            $("#cartItemModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("cartItemsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = `<tr data-cartItemID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].quantity + `</td>
        <td>` + data[i].cart_id + `</td>
        <td>` + data[i].cart_product_id + `</td><td> 
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.cartitemid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem/deleteCartItem/" + id, {method:"DELETE", headers: {'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
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
            $("#editCartItemModal").modal('show');
            let cart_item_id = this.parentNode.parentNode.dataset.cartitemid;
            
            document.getElementById("editCartItemBtn").addEventListener("click", function(e){
                e.preventDefault();
                let edit = {
                    id : cart_item_id,
                    quantity : document.getElementById("edit_input_quantity").value,
                    cart_id : document.getElementById("edit_input_cart_id").value,
                    cart_product_id : document.getElementById("edit_input_cart_product_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem/editCartItem/"+cart_item_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/cartItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_quantity").value = "";
                document.getElementById("edit_input_cart_id").value = "";
                document.getElementById("edit_input_cart_product_id").value = "";
     
                $("#editCartItemModal").modal('hide');
            });
        });
    }
}