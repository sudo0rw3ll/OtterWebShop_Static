window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch("http://localhost:1337/admin/product", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addProductBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novi_product").addEventListener("click", function(){
        $("#productModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#productModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editProductModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    $("#productModal").modal('show');
    
        let product = {
            title: document.getElementById("input_title").value,
            description: document.getElementById("input_description").value,
            image: document.getElementById("input_image").value,
            price: document.getElementById("input_price").value,
            is_available: document.getElementById("input_available").value,
            quantity: document.getElementById("input_quantity").value,
            ProductCategoryId: document.getElementById("input_product_cat_id").value
        };

        product_json = JSON.stringify(product);

        fetch("http://localhost:1337/admin/product/addProduct", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: product_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("http://localhost:1337/admin/product", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => {
                        updateTable(data)
                    });
                }
            });

            
            document.getElementById("input_title").value = "";
            document.getElementById("input_description").value = "";
            document.getElementById("input_image").value = "";
            document.getElementById("input_price").value = "";
            document.getElementById("input_available").value = "";
            document.getElementById("input_quantity").value = "";
            document.getElementById("input_product_cat_id").value = "";

            $("#productModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("productsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-productID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].title + 
        `</td><td>` + data[i].description + `</td><td>` + data[i].image + `</td><td>` + data[i].price
            + `</td><td>` + data[i].is_available + `</td><td>` + data[i].quantity 
            + `</td><td>` + data[i].ProductCategoryId + `</td><td>` + ` 
            <button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.productid;
        obrisi_buttons[i].addEventListener("click", function(){
            fetch("http://localhost:1337/admin/product/deleteProduct/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:1337/admin/product", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                .then(response => response.json())
                .then(data => {
                    if(data.msg){
                        alert(data.msg);
                    }else{
                        updateTable(data);
                    }
                });
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(){
            $("#editProductModal").modal('show');

            let product_id = this.parentNode.parentNode.dataset.productid;
            
            document.getElementById("editProductBtn").addEventListener("click", function(){
                let edit = {
                    id: product_id,
                    title: document.getElementById("edit_input_title").value,
                    description: document.getElementById("edit_input_description").value,
                    image: document.getElementById("edit_input_image").value,
                    price: document.getElementById("edit_input_price").value,
                    quantity: document.getElementById("edit_input_quantity").value,
                    is_available: document.getElementById("edit_input_available").value,
                    ProductCategoryId: document.getElementById("edit_input_product_cat_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("http://localhost:1337/admin/product/editProduct/"+product_id, {
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
                    fetch("http://localhost:1337/admin/product", {method:"GET", headers: {'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(tableData => updateTable(tableData));
                });
                
                document.getElementById("edit_input_title").value = "";
                document.getElementById("edit_input_description").value = "";
                document.getElementById("edit_input_image").value = "";
                document.getElementById("edit_input_price").value = "";
                document.getElementById("edit_input_available").value = "";
                document.getElementById("edit_input_product_cat_id").value = "";
                document.getElementById("edit_input_quantity").value = "";
                
                $("#editProductModal").modal('hide');
            });
        });
    }
}