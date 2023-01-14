window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch("http://localhost:1337/admin/location", {method:"GET", headers: {'Authorization' : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addLocationBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novu_location").addEventListener("click", function(){
        $("#locationsModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#locationsModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editLocationModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#locationsModal").modal('show');
    
        let location = {
            address: document.getElementById("input_address_name").value,
            home_flat_number: document.getElementById("input_home_flat_number").value,
            city_id: document.getElementById("input_city_id").value
        };

        location_json = JSON.stringify(location);

        fetch("http://localhost:1337/admin/location/addLocation", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: location_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.msg){
                    alert(data.msg);
                }else if(data.error){
                    alert(data.error);
                }else{
                    fetch("http://localhost:1337/admin/location/", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_address_name").value = "";
            document.getElementById("input_home_flat_number").value = "";
            document.getElementById("input_city_id").value = "";
    
            $("#locationsModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("locationsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-locationID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].address +
            `</td><td>` + data[i].home_flat_number + `<td></td><td>` + data[i].city_id + `</td><td>`+ 
            `<button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
                <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.locationid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("http://localhost:1337/admin/location/deleteLocation/" + id, {method:"DELETE", headers: {'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("http://localhost:1337/admin/location", {method:"GET", headers : {'Authorization' : `Bearer ${token}`}})
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
            $("#editLocationModal").modal('show');

            let location_id = this.parentNode.parentNode.dataset.locationid;
            
            document.getElementById("editAddressBtn").addEventListener("click", function(e){
                e.preventDefault();
                let edit = {
                    id: location_id,
                    address: document.getElementById("edit_input_address_name").value,
                    home_flat_number: document.getElementById("edit_input_home_flat_number").value,
                    city_id: document.getElementById("edit_input_city_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("http://localhost:1337/admin/location/editLocation/"+location_id, {
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
                        fetch("http://localhost:1337/admin/location", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_address_name").value = "";
                document.getElementById("edit_input_home_flat_number").value = "";
                document.getElementById("edit_input_city_id").value = "";

                $("#editLocationModal").modal('hide');
            });
        });
    }
}