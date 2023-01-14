window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addProductCategoryBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novu_product_cat").addEventListener("click", function(){
        $("#productCatModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#productCatModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editProductCatModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#productCatModal").modal('show');
    
        let productcat = {
            cat_name: document.getElementById("input_cat_name").value
        };

        product_cat_json = JSON.stringify(productcat);

        fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory/addProductCategory", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: product_cat_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory/", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_cat_name").value = "";
    
            $("#productCatModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("productCatsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-productCatID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].cat_name +
            `</td><td>` + `<button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.productcatid;
        obrisi_buttons[i].addEventListener("click", function(){
            fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory/deleteProductCategory/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(){
            $("#editProductCatModal").modal('show');

            let product_cat_id = this.parentNode.parentNode.dataset.productcatid;
            
            document.getElementById("editProductCatBtn").addEventListener("click", function(){
                let edit = {
                    id: product_cat_id,
                    cat_name: document.getElementById("edit_input_cat_name").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory/editProductCategory/"+product_cat_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/productCategory", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_cat_name").value = "";
            
                $("#editProductCatModal").modal('hide');
            });
        });
    }
}