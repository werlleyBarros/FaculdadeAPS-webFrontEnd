const baseUrl = "https://expert-yodel-pjpwgqq9jq7wh6rj9-8000.app.github.dev";

async function apiRequest(endpoint, method = "GET", body = null, usaToken = true){
    const url = baseUrl + endpoint

    const headers = {
        "Content-Type": "application/json"
    };

    if (usaToken) {
        const token = localStorage.getItem("Token");
        if (token) headers["authorization"] = "Bearer " + token;
    }else{

    }

    const options = {
        method,
        headers,
    }
    console.log(options);
    if (body) {
        options.body = JSON.stringify(body);
    };
    
    const resp = await fetch(url, options);
    console.log(resp)
    if (!resp.ok) {
        throw new Error(resp?.message || `Erro na requisição (${resp.status})`);
    };

    let data;

    try{
        data = await resp.json();
    }catch{
        data = null
    };
    console.log(data)
    return data;
};

const api = {
    signup: (data) => apiRequest("/auth/signup", "POST", data, false),
    login: (data) => apiRequest("/auth/login", "POST", data, false),
    getTask: () => apiRequest("/tasks"),
    createTask: (data) => apiRequest("/tasks", "POST", data),
    editTask: (id, data) => apiRequest("/tasks/" + id, "PUT", data),
    deleteTask: (id) => apiRequest("/tasks/" + id, "DELETE"),
};

const auth = {
    signup: async function cadastrar(nome, email, senha){
        
        const payLoad = { name: nome, email: email, password: senha,};
        const resp = await api.signup(payLoad);
        localStorage.setItem("Token", resp.access_token);
        console.log(localStorage.getItem("Token"))
        return resp;
    },

    login: async function logar(email, senha){

        const payLoad = {email: email, password: senha};
        const resp = await api.login(payLoad);
        console.log("Resposta do login/signup:", resp);
        console.log("Token retornado:", resp?.access_token);
        localStorage.setItem("Token", resp.access_token)

        return resp;
    }
};

const tasks = {
    getAll: async function carregarTasks(){
        const resp = await api.getTask();
        return resp;
    },
    create: async function criarTask(titulo, descricao, prazoEntrega){
        const payLoad = {title: titulo, description: descricao, deadline: prazoEntrega};
        const resp = await api.createTask(payLoad);
        console.log(resp);
        return resp;
    },
    update: async function editarTasks(titulo, descricao, prazoEntrega, id){
        const payLoad = {title: titulo, description: descricao, deadline: prazoEntrega};
        const resp = await api.editTask(id, payLoad);
        return resp;
    },
    remove: async function deletarTask(id){
        const resp = await api.deleteTask(id)
        return resp;
    },
};

const manipuladorUser = {
    htmlLogin: async function manipuladorLogin(){
        const email = document.getElementById("emailInput").value;
        const senha = document.getElementById("senhaInput").value;

        try{
            const resp = await auth.login(email, senha);
            alert("Sucesso ao enviar")
            if (localStorage.getItem("Token")) {
                window.location.href = "tarefas.html";
            };
        }catch(erro){
            alert(erro.message);
        }
    },

    htmlCadastro: async function manipuladorCadastro(){
        const nome = document.getElementById("nomeInput").value;
        const email = document.getElementById("emailInput").value;
        const senha = document.getElementById("senhaInput").value;

        try{
            const resp = await auth.signup(nome, email, senha);
            alert("Cadastrado com sucesso")
            if (localStorage.getItem("Token")) {
                window.location.href = "tarefas.html";
            };
        }catch(erro){
            alert(erro.message);
        }
    },

    htmlShowAllTasks: async function  carregarTasks(){
        try {
            const resp = await api.getTask()
            resp.tasks.forEach(task => criarTaskCard(task))
        }catch(erro){
            alert(erro.message);
        };
    },

    htmlCreateTask: async function criarTask(event){
        event.preventDefault();

        const titulo = document.getElementById("tituloTarefa").value;
        const descricao = document.getElementById("descricaoTarefa").value;
        const prazoEntrega = document.getElementById("dataTarefa").value;
        try{
            const resp = await tasks.create(titulo, descricao, prazoEntrega);
        }catch(erro){
            alert(erro.message);
        };
    },
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

function mostrarFormulario(){
    const formulario = document.getElementById("formularioTasks")

    if (formulario.style.display === "none"){
        formulario.style.display = "block"
    }else{
        formulario.style.display = "none"        
    }
};