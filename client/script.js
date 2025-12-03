const baseUrl = "https://verbose-fishstick-v6jjqpv7ppxgcpjx9-8000.app.github.dev";

async function Cadastro() {

    const url = baseUrl + "/auth/signup"
    const nome = document.getElementById("nomeInput").value;
    const email = document.getElementById("emailImput").value;
    const senha = document.getElementById("senhaImput").value;

    const payLoad = {
        name: nome,
        email: email,
        password: senha,
    };
    console.log(payLoad)

    try {
        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payLoad),
            headers: {'Content-Type': 'application/json',},
        }); 

        if (!resp.ok){
            throw new Error("Erro ao enviar formulario");
        }

        const respJson = await resp.json();
        
        console.log(respJson);
        localStorage.setItem("Token", respJson.access_token);
        alert("Cadastrado com sucesso")
        window.location.href = 'tarefas.html';

    } catch(erro) {
        console.error(erro);
        alert("Deu ruim ao enviar formulario")
    }
};

async function login(){
    const url = baseUrl + "/auth/login"
    const email = document.getElementById("emailImput").value;
    const senha = document.getElementById("senhaImput").value;

    const payLoad = {
        email: email,
        password: senha,
    }
    console.log(payLoad);
    try{
        const resp = await fetch(url,{
            method: 'POST',
            body: JSON.stringify(payLoad),
            headers: {'Content-Type': 'application/json',},
        });

        if (!resp.ok){
            throw new Error("Erro ao enviar formulario");
        }

        const respJson = await resp.json();
        
        console.log(respJson);
        alert("Sucesso ao enviar")
        localStorage.setItem("Token", respJson.access_token);
        window.location.href = 'tarefas.html';

    } catch(erro){
        console.error(erro)
        alert("Deu ruim ao enviar formulario")
    }
};


function criarTaskCard(task){

    const card = document.createElement("div");
    card.classList.add("tarefa-card");
    card.id = "tarefa-"+ task.id;

    const titulo = document.createElement("h3");
    titulo.textContent = task.title;
    card.appendChild(titulo);

    const description = document.createElement("p");
    description.textContent = task.description;
    card.appendChild(description);

    const deadline = document.createElement("p")
    deadline.textContent = "Prazo final: " + task.deadline;
    card.appendChild(deadline);

    const botaoEditar = document.createElement("button");
    botaoEditar.textContent = "Editar";
    botaoEditar.classList.add("botaoEditar");
    botaoEditar.setAttribute('onclick', "editarTask");
    card.appendChild(botaoEditar);

    const botaoDeletar = document.createElement("button");
    botaoDeletar.textContent = "Deletar";
    botaoDeletar.classList.add("botaoDeletar");
    botaoDeletar.setAttribute('onclick', "deleteTask");
    card.appendChild(botaoDeletar);

    const container = document.getElementById("tarefasContainer()");
    container.appendChild(card);

};

function editarTask(){
    console.log("editou")
};

function deleteTask(){
    console.log("deletou")
};

async function carregarTasks() {
    const url = baseUrl + "/tasks";
    
    try {
        const resp = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("Token")
            },
        });
        console.log(resp);

        if (!resp.ok) {
            throw new Error("Erro ao fazer requisição GET");
        };

        const data = await resp.json();
        console.log(data);
        data.tasks.forEach(task => criarTaskCard(task))

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar dados");
    }
};

function mostrarFormulario(){
    const formulario = document.getElementById("formularioTasks")

    if (formulario.style.display === "none"){
        formulario.style.display = "block"
    }else{
        formulario.style.display = "none"        
    }
};

async function criarTask(){
    const url = baseUrl + "/tasks"

    const titulo = document.getElementById("tituloTarefa").value;
    const descrição = document.getElementById("descricaoTarefa").value;
    const prazoEntrega = document.getElementById("dataTarefa").value;

    const payload = {
        title: titulo,
        description: descrição,
        deadline: prazoEntrega,
    };

    try {
        const resp = await fetch(url, {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer " + localStorage.getItem("Token")
            },
        });
        console.log(resp);

        if (!resp.ok) {
            throw new Error("Erro ao enviar formulario");
        };

    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar formulario");
    };
};