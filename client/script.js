const baseUrl = "https://expert-goldfish-v6qrg77w64x5hp7vj-8000.app.github.dev";

async function Cadastro() {

    const url = baseUrl + "/auth/signup"
    const nome = document.getElementById("nomeInput").value;
    const email = document.getElementById("emailInput").value;
    const senha = document.getElementById("senhaInput").value;

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
    const email = document.getElementById("emailInput").value;
    const senha = document.getElementById("senhaInput").value;

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
    botaoEditar.setAttribute('onclick', 'editarTask('+ task.id +')');
    card.appendChild(botaoEditar);

    const botaoDeletar = document.createElement("button");
    botaoDeletar.textContent = "Deletar";
    botaoDeletar.classList.add("botaoDeletar");
    botaoDeletar.setAttribute('onclick', 'deleteTask('+ task.id +')');
    card.appendChild(botaoDeletar);

    const container = document.getElementById("tarefasContainer");
    container.appendChild(card);

};

function editarTask(taskId){
    const formEditarTask = document.getElementById("tarefa-" + taskId)

    if (formEditarTask.querySelector("form")) return;

    const tituloAtual = formEditarTask.querySelector("h3").innerText;
    const descricaoAtual = formEditarTask.querySelector("p").innerText;

    const form = document.createElement("form");

    const inputTitulo = document.createElement("input");
    inputTitulo.type = "text";
    inputTitulo.name = "novoTitulo";
    inputTitulo.id = "novoTitulo";
    inputTitulo.value = null;
    inputTitulo.placeholder = "Novo Titulo"
    form.appendChild(inputTitulo);

    const inputDescricao = document.createElement("input");
    inputDescricao.type = "text";
    inputDescricao.name = "novaDescricao";
    inputDescricao.id = "novaDescricao";
    inputDescricao.value = null;
    inputDescricao.placeholder = "Nova descrição"
    form.appendChild(inputDescricao);

    const inputData = document.createElement("input");
    inputData.type = "date";
    inputData.name = "novaData";
    inputData.id = "novaData";
    inputData.value = null;
    form.appendChild(inputData);

    const botaoSalvar = document.createElement("button");
    botaoSalvar.type = "submit";
    botaoSalvar.textContent = "Salvar";
    botaoSalvar.setAttribute('onclick', "EnviarTaskEdicao(" + taskId + ")")
    form.appendChild(botaoSalvar);

    formEditarTask.querySelector("h3").style.display = "none";
    formEditarTask.querySelector("p").style.display = "none";
    formEditarTask.appendChild(form);

};

async function EnviarTaskEdicao(taskId){
    event.preventDefault();
    
    const url = baseUrl + "/tasks/" + taskId
    console.log(url)
    const titulo = document.getElementById("novoTitulo").value;
    const descrição = document.getElementById("novaDescricao").value;
    const prazoEntrega = document.getElementById("novaData").value;

    const payload = {
        title: titulo,
        description: descrição,
        deadline: prazoEntrega,
    };

    try {
        const resp = await fetch(url, {
            method: "PUT",
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
        alert("Deu certo");

    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar sua formulario");
    };
};

async function deleteTask(taskId){
    const url = baseUrl + "/tasks/" + taskId
    try{
        const resp = await fetch(url, {
           method: "DELETE",
           headers: {
            'Content-Type': 'application/json',
            "authorization": "Bearer " + localStorage.getItem("Token"),
        },
           
        });

    }catch(erro){
        console.error(erro)
        alert("Deu ruim ao enviar formulario")
    };

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
    event.preventDefault();
    
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
        alert("Erro ao enviar sua formulario");
    };
};