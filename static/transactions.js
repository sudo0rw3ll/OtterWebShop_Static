window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch('http://localhost:1337/admin/transaction', {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addTransactionBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_transaction").addEventListener("click", function(){
        $("#transactionModal").modal('show');
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

    $("#transactionModal").modal('show');
    
        let transaction = {
            expire_date: document.getElementById("input_expire_date").value,
            cvv: document.getElementById("input_cvv").value,
            card_number: document.getElementById("input_card_number").value,
            owner_name: document.getElementById("input_owner_name").value,
            status: document.getElementById("input_status").value,
            order_payment_id: document.getElementById("input_order_payment_id").value,
            transaction_user_id: document.getElementById("input_trans_user_id").value,
        };

        transaction_json = JSON.stringify(transaction);

        fetch("http://localhost:1337/admin/transaction/addTransaction", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: transaction_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch('http://localhost:1337/admin/transaction', {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_expire_date").value = "";
            document.getElementById("input_cvv").value = "";
            document.getElementById("input_owner_name").value = "";
            document.getElementById("input_status").value = "";
            document.getElementById("input_order_payment_id").value = "";
            document.getElementById("input_trans_user_id").value = "";
            document.getElementById("input_card_number").value = "";

            $("#transactionModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("transactionsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-transactionID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].expire_date + 
        `</td><td>` + data[i].cvv + `</td><td>` + data[i].card_number + `</td><td>` + data[i].owner_name
            + `</td><td>` + data[i].status + `</td><td>` + data[i].order_payment_id 
            + `</td><td>` + data[i].transaction_user_id + `</td><td>` + ` 
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.transactionid;
        obrisi_buttons[i].addEventListener("click", function(){
            fetch("http://localhost:1337/admin/transaction/deleteTransaction/" + id, {method:"DELETE", headers: {'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:1337/admin/transaction", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                .then(response => response.json())
                .then(data => updateTable(data));
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(e){
            e.preventDefault();

            $("#editTransactionModal").modal('show');

            let transaction_id = this.parentNode.parentNode.dataset.transactionid;
            
            document.getElementById("editTransactionBtn").addEventListener("click", function(){
                let edit = {
                    id: transaction_id,
                    expire_date: document.getElementById("edit_input_expire_date").value,
                    cvv: document.getElementById("edit_input_cvv").value,
                    card_number: document.getElementById("edit_input_card_number").value,
                    owner_name: document.getElementById("edit_input_owner_name").value,
                    status: document.getElementById("edit_input_status").value,
                    order_payment_id: document.getElementById("edit_input_order_payment_id").value,
                    transaction_user_id: document.getElementById("edit_input_trans_user_id").value,
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("http://localhost:1337/admin/transaction/editTransaction/"+transaction_id, {
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
                        fetch("http://localhost:1337/admin/transaction", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_expire_date").value = "";
                document.getElementById("edit_input_cvv").value = "";
                document.getElementById("edit_input_owner_name").value = "";
                document.getElementById("edit_input_status").value = "";
                document.getElementById("edit_input_order_payment_id").value = "";
                document.getElementById("edit_input_trans_user_id").value = "";
                document.getElementById("edit_input_card_number").value = "";
                
                $("#editTransactionModal").modal('hide');
            });
        });
    }
}