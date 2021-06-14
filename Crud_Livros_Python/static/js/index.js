
var idatual = 0;
var modalCadastro;
var modalAlerta;
var modalExcluir;


window.onload = function(e){
    listar();
}

function listar() {
    // Limpar tabela
    var tab = document.getElementById("tabela");
    for (var i = tab.rows.length - 1; i>0; i --){
        tab.deleteRow(i);
    }

    fetch("http://127.0.0.1:5000/livros/0", {method: "GET"})
    .then(response => response.json())
    .then(data => {
        for(const item of data) {
            var tab = document.getElementById("tabela");
            var row = tab.insertRow(-1);
            row.insertCell(-1).innerHTML = item.idlivro;
            row.insertCell(-1).innerHTML = item.titulo;
            row.insertCell(-1).innerHTML = item.autor;
            row.insertCell(-1).innerHTML = item.editora;
            row.insertCell(-1).innerHTML = item.ano;
            row.insertCell(-1).innerHTML = item.numPaginas;
            row.insertCell(-1).innerHTML = "<button type='button' class='btn btn-primary' "
            + "onclick='alterar("+item.idlivro+")'> "
            + "<i class='bi bi-pencil'></i> </button>"
            + "<button type='button' class='btn btn-danger' "
            + "onclick='excluir("+item.idlivro+")'> "
            + "<i class='bi bi-trash'></i> </button>";
        }

    })
    .catch(error => console.log("Erro", error));
}

function novo() {
    idatual = 0;
    document.getElementById("txtTitulo").value = "";
    document.getElementById("txtAutor").value = "";
    document.getElementById("txtEditora").value = "";
    document.getElementById("txtAno").value = "";
    document.getElementById("numPaginas").value = "";

    modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
    modalCadastro.show();
}

function alterar(id) {
    idatual = id;

    fetch("http://127.0.0.1:5000/livros/" + idatual, {method: "GET"})
    .then(response => response.json())
    .then(data => {

        document.getElementById("txtTitulo").value = data[0].titulo;
        document.getElementById("txtAutor").value = data[0].autor;
        document.getElementById("txtEditora").value = data[0].editora;
        document.getElementById("txtAno").value = data[0].ano;
        document.getElementById("numPaginas").value = data[0].numPaginas;

        modalCadastro = new bootstrap.Modal(document.getElementById("modalCadastro"));
        modalCadastro.show();
    })
    .catch(error => console.log("Erro", error));
    
}

function excluir(id) {
    idatual = id;
    document.getElementById("modalAlertaBody").style.backgroundColor = "#FFFFFF";
    document.getElementById("modalAlertaBody").innerHTML = "<h5>Confirma a exclusão do registro? </h5>"
    + '<button type="button" class="btn btn-primary" onclick="excluirSim()">Sim</button>'
    + '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Não</button>';
    modalExcluir = new bootstrap.Modal(document.getElementById("modalAlerta"));
    modalExcluir.show();
}

function excluirSim() {
    fetch("http://127.0.0.1:5000/livros/" + idatual, {method: "DELETE"})
    .then(response => {
        const status = response.status
        modalExcluir.hide();
        listar();
        if (status==200) {
            mostrarAlerta("Registro excluído com sucesso!", true);
        } else {
            mostrarAlerta("Falha ao excluir registro", false);
        }
    })
    .catch(error => console.log("Erro", error));
}

function salvar() {
    var l = {	
        idlivro: idatual,
        titulo: document.getElementById("txtTitulo").value,
        autor: document.getElementById("txtAutor").value,
        editora: document.getElementById("txtEditora").value,
        ano: document.getElementById("txtAno").value,
        numPaginas: document.getElementById("numPaginas").value
    };

    var json = JSON.stringify(l);

    var url;
    var metodo;

    if (idatual == 0){
        url = "http://127.0.0.1:5000/livros/0";
        metodo = "POST";
    } else {
        url = "http://127.0.0.1:5000/livros/" + idatual;
        metodo = "PUT";
    }
    
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

     fetch(url, {method: metodo, body: json, redirect: 'follow', headers: myHeaders}) 
     .then(result => {
        if (result.status == 200) {
            mostrarAlerta("Cadastro Efetuado com Sucesso", true);
            modalCadastro.hide();
            listar();
        } else {
            mostrarAlerta("Falha ao inserir dados", false);
        }
    })


}

function mostrarAlerta(msg, success) {
    if (success) {
        document.getElementById("modalAlertaBody").style.backgroundColor = "#E0F2F1";
    } else {
        document.getElementById("modalAlertaBody").style.backgroundColor = "#FFEBEE"
    }
    document.getElementById("modalAlertaBody").innerHTML = msg;
    modalAlerta = new bootstrap.Modal(document.getElementById("modalAlerta"));
    modalAlerta.show();
    window.setTimeout(function(){
        modalAlerta.hide();
    }, 3000);
}