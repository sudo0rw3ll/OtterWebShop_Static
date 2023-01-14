window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addOrderItemBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novi_orderi").addEventListener("click", function(){
        $("#orderItemModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#orderItemModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editOrderItemModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#orderItemModal").modal('show');
    
        let orderItem = {
            quantity : document.getElementById("input_quantity").value,
            order_product_id : document.getElementById("input_order_product_id").value,
            order_id: document.getElementById("input_order_id").value
        };

        order_item = JSON.stringify(orderItem);

        fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem/addOrderItem", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: order_item
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            document.getElementById("input_quantity").value = "";
            document.getElementById("input_order_product_id").value = "";
            document.getElementById("input_order_id").value = "";
            
            $("#orderItemModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("orderItemsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = `<tr data-orderItemID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].quantity + 
        `<td>` + data[i].order_product_id + `</td><td>` + data[i].order_id + `</td><td> 
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.orderitemid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem/deleteOrderItem/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
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

            $("#editOrderItemModal").modal('show');
            let order_item_id = this.parentNode.parentNode.dataset.orderitemid;
            
            document.getElementById("editOrderItemBtn").addEventListener("click", function(e){
                e.preventDefault();

                let edit = {
                    id : order_item_id,
                    quantity : document.getElementById("edit_input_quantity").value,
                    order_product_id : document.getElementById("edit_input_order_product_id").value,
                    order_id: document.getElementById("edit_input_order_id").value
                };

                console.log(edit);
                console.log(order_item_id);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem/editOrderItem/" + order_item_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/orderItem", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_quantity").value = "";
                document.getElementById("edit_input_order_product_id").value = "";
                document.getElementById("edit_input_order_id").value = "";
     
                $("#editOrderItemModal").modal('hide');
            });
        });
    }
}