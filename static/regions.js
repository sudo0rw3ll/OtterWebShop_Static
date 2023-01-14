window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    
    fetch('http://localhost:1337/admin/region', {method:"GET", headers:{"Authorization": `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addRegionBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novu_region").addEventListener("click", function(){
        $("#regionModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#regionModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editRegionModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    $("#regionModal").modal('show');
    
        let region = {
            region_name: document.getElementById("input_region_name").value,
            country_id: document.getElementById("input_country_id").value
        };

        region_json = JSON.stringify(region);

        fetch("http://localhost:1337/admin/region/addRegion", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: region_json
            })
            .then(response => response.json())
            .then(data => {
                fetch('http://localhost:1337/admin/region/', {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                .then(response => response.json())
                .then(data => updateTable(data));
            });

            
            document.getElementById("input_region_name").value = "";
            document.getElementById("input_country_id").value = "";
    
            $("#regionModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    var tabela = document.getElementById("regionsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-regionID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].region_name +
            `</td><td>` + data[i].country_id + `<td></td>` + `<td><button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.regionid;
        obrisi_buttons[i].addEventListener("click", function(){
            fetch("http://localhost:1337/admin/region/deleteRegion/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                fetch("http://localhost:1337/admin/region", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                .then(response => response.json())
                .then(data => updateTable(data));
            });
        });
    }

    var izmeni_buttons = document.querySelectorAll(".btn_izmeni");

    for(i=0;i<izmeni_buttons.length;i++){
        izmeni_buttons[i].addEventListener("click", function(){
            $("#editRegionModal").modal('show');

            let region_id = this.parentNode.parentNode.dataset.regionid;
            
            document.getElementById("editRegionBtn").addEventListener("click", function(){
                let edit = {
                    id: region_id,
                    region_name: document.getElementById("edit_input_region_name").value,
                    country_id: document.getElementById("edit_input_country_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("http://localhost:1337/admin/region/editRegion/"+region_id, {
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
                        fetch("http://localhost:1337/admin/region", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_region_name").value = "";
                document.getElementById("edit_input_country_id").value = "";

                $("#editRegionModal").modal('hide');
            });
        });
    }
}