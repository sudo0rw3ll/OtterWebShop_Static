window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch("https://otter-web-shop-rest.onrender.com/admin/order", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addOrderBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novi_order").addEventListener("click", function(){
        $("#orderModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#orderModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editOrderModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#orderModal").modal('show');
    
        let order = {
            total : document.getElementById("input_total").value,
            shipping : document.getElementById("input_shipping").value,
            grand_total: document.getElementById("input_grand_total").value,
            status: document.getElementById("input_status").value,
            user_order_id: document.getElementById("input_user_order_id").value
        };

        order_json = JSON.stringify(order);

        fetch("https://otter-web-shop-rest.onrender.com/admin/order/addOrder", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: order_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/order", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            document.getElementById("input_shipping").value = "";
            document.getElementById("input_total").value = "";
            document.getElementById("input_grand_total").value = "";
            document.getElementById("input_status").value = "";
            document.getElementById("input_user_order_id").value = "";
            
            $("#orderModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    var tabela = document.getElementById("ordersTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = `<tr data-orderID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].total + 
        `<td>` + data[i].shipping + `</td><td>` + data[i].grand_total + `</td><td>` + data[i].status
            + `</td><td>` + data[i].user_order_id + `</td><td>` + ` 
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.orderid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/order/deleteOrder/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/order", {method:"GET", headers: {'Authorization' : `Bearer ${token}`}})
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
            $("#editOrderModal").modal('show');
            let order_id = this.parentNode.parentNode.dataset.orderid;
            
            document.getElementById("editOrderBtn").addEventListener("click", function(){
                let edit = {
                    id : order_id,
                    total : document.getElementById("edit_input_total").value,
                    shipping : document.getElementById("edit_input_shipping").value,
                    grand_total: document.getElementById("edit_input_grand_total").value,
                    user_order_id: document.getElementById("edit_input_user_order_id").value,
                    status: document.getElementById("edit_input_status").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/order/editOrder/"+order_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/order", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });

                document.getElementById("edit_input_total").value = "";
                document.getElementById("edit_input_shipping").value = "";
                document.getElementById("edit_input_grand_total").value = "";
                document.getElementById("edit_input_user_order_id").value = "";
                document.getElementById("edit_input_status").value = "";
                
     
                $("#editOrderModal").modal('hide');
            });
        });
    }
}