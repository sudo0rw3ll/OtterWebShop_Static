window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    
    fetch("https://otter-web-shop-rest.onrender.com/admin/city", {method:"GET", headers:{"Authorization" : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addCityBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novu_city").addEventListener("click", function(){
        $("#cityModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#cityModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editCityModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    $("#cityModal").modal('show');
    
        let city = {
            city_name: document.getElementById("input_city_name").value,
            region_id: document.getElementById("input_region_id").value,
            country_id: document.getElementById("input_country_id").value
        };

        city_json = JSON.stringify(city);

        fetch("https://otter-web-shop-rest.onrender.com/admin/city/addCity", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: city_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/city/", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_city_name").value = "";
            document.getElementById("input_country_id").value = "";
            document.getElementById("input_region_id").value = "";
    
            $("#cityModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    var tabela = document.getElementById("citiesTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-cityID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].city_name +
            `</td><td>` + data[i].country_id + `<td></td><td>` + data[i].region_id + `</td><td>`+ 
            `<button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
                <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.cityid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/city/deleteCity/" + id, {method:"DELETE", headers:{"Authorization" : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/city", {method:"GET", headers:{"Authorization" : `Bearer ${token}`}})
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
            $("#editCityModal").modal('show');

            let city_id = this.parentNode.parentNode.dataset.cityid;
            
            document.getElementById("editCityBtn").addEventListener("click", function(e){
                e.preventDefault();
                let edit = {
                    id: city_id,
                    city_name: document.getElementById("edit_input_city_name").value,
                    region_id: document.getElementById("edit_input_region_id").value,
                    country_id: document.getElementById("edit_input_country_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/city/editCity/"+city_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/city", {method:"GET", headers:{'Authorization' : `Bear ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_city_name").value = "";
                document.getElementById("edit_input_country_id").value = "";
                document.getElementById("edit_input_region_id").value = "";

                $("#editCityModal").modal('hide');
            });
        });
    }
}