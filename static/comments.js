window.addEventListener("load", ()=>{
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    fetch("https://otter-web-shop-rest.onrender.com/admin/comment", {method:"GET", headers: {"Authorization" : `Bearer ${token}`}})
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateTable(data);
        });
        
    document.getElementById("addCommentBtn").addEventListener("click", createCart);
        
    document.getElementById("btn_dodaj_novi_comment").addEventListener("click", function(){
        $("#commentModal").modal('show');
    });

    document.getElementById("actionCreate").addEventListener("click", function(){            
        $("#commentModal").modal('show');
    });

    document.getElementById("actionEdit").addEventListener("click", function(){            
        $("#editCommentModal").modal('show');
    });
});


function createCart(){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];

    $("#commentModal").modal('show');
    
        let comment = {
            comment_body: document.getElementById("input_comment_body").value,
            rank: document.getElementById("input_rank").value,
            user_id : document.getElementById("input_user_id").value,
            product_id : document.getElementById("input_product_id").value
        };

        comment_json = JSON.stringify(comment);

        fetch("https://otter-web-shop-rest.onrender.com/admin/comment/addComment", {
            method:"POST",
            headers:{
                'Accept' : 'application/json',
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
                body: comment_json
            })
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/comment/", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                    .then(response => response.json())
                    .then(data => updateTable(data));
                }
            });

            
            document.getElementById("input_comment_body").value = "";
            document.getElementById("input_rank").value = "";
            document.getElementById("input_user_id").value = "";
            document.getElementById("input_product_id").value = "";

            $("#commentModal").modal('hide');
}

function updateTable(data){
    const cookies = document.cookie.split("=");
    const token = cookies[cookies.length - 1];
    
    var tabela = document.getElementById("commentsTable");
    tabela.innerHTML = "";

    for(i in data){
        let redHTML = 
        `<tr data-commentID="` + data[i].id + `"><td>`+data[i].id + `</td><td>` + data[i].comment_body +
            `</td><td>` + data[i].rank + `</td><td>` + data[i].user_id + `</td><td>` + data[i].product_id + `</td>`
            + `<td><button class="btn btn-danger btn-sm btn_obrisi">Obrisi</button>
            <button class="btn btn-warning btn-sm btn_izmeni">Izmeni</button>
            </td>`;

        tabela.innerHTML += redHTML;
    }

    var obrisi_buttons = document.querySelectorAll(".btn_obrisi");

    for(i=0;i<obrisi_buttons.length;i++){
        let id = obrisi_buttons[i].parentNode.parentNode.dataset.commentid;
        obrisi_buttons[i].addEventListener("click", function(e){
            e.preventDefault();
            fetch("https://otter-web-shop-rest.onrender.com/admin/comment/deleteComment/" + id, {method:"DELETE", headers:{'Authorization' : `Bearer ${token}`}})
            .then(response => response.json())
            .then(data => {
                if(data.error){
                    alert(data.error);
                }else if(data.msg){
                    alert(data.msg);
                }else{
                    fetch("https://otter-web-shop-rest.onrender.com/admin/comment", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
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
            $("#editCommentModal").modal('show');

            let comment_id = this.parentNode.parentNode.dataset.commentid;
            
            document.getElementById("editCommentBtn").addEventListener("click", function(e){
                e.preventDefault();
                let edit = {
                    id: comment_id,
                    comment_body: document.getElementById("edit_input_comment_body").value,
                    rank: document.getElementById("edit_input_rank").value,
                    user_id : document.getElementById("edit_input_user_id").value,
                    product_id : document.getElementById("edit_input_product_id").value
                };

                console.log(edit);

                http_body = JSON.stringify(edit);

                fetch("https://otter-web-shop-rest.onrender.com/admin/comment/editComment/"+comment_id, {
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
                        fetch("https://otter-web-shop-rest.onrender.com/admin/comment", {method:"GET", headers:{'Authorization' : `Bearer ${token}`}})
                        .then(response => response.json())
                        .then(tableData => updateTable(tableData));
                    }
                });
                
                document.getElementById("edit_input_comment_body").value = "";
                document.getElementById("edit_input_rank").value = "";
                document.getElementById("edit_input_user_id").value = "";
                document.getElementById("edit_input_product_id").value = "";

                $("#editCommentModal").modal('hide');
            });
        });
    }
}