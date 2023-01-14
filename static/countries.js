window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch("https://otter-web-shop-rest.onrender.com/admin/country", {method:"GET", headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addCountryBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novu_country").addEventListener("click", function(){
        $("#countryModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#countryModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editCountryModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#countryModal").modal('show');
    
        let country = {
            country_name: document.getElementById("input_country_name").value,
            iso2: document.getElementById("input_iso2").value
        };

        country_json = JSON.stringify(country);

        fetch("https://otter-web-shop-rest.onrender.com/admin/country/addCountry", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: country_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/country/", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_country_name").value = "";
            document.getElementById("input_iso2").value = "";
    
            $("#countryModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    
    var tabela = document.getElementById("countriesTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-countryID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].country_name +
            `</td><td>` + data[i].iso2 + `</td><td>` + `<button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.countryid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/country/deleteCountry/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/country", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
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
            $("#editCountryModal").modal('show');

            let country_id = this.parentNode.parentNode.dataset.countryid;
            
            document.getElementById("editCountryBtn").addEventListener("click", function(e){
                e.preventDefault();
                let edit = {
                    id: country_id,
                    country_name: document.getElementById("edit_input_country_name").value,
                    iso2: document.getElementById("edit_input_iso2").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/country/edit/"+country_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/country", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_country_name").value = "";
                document.getElementById("edit_input_iso2").value = "";

                $("#editCountryModal").modal('hide');
            });
        });
    }
}