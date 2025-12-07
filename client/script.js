const baseUrl = "https://expert-zebra-r7rw99599j7hppx5-8000.app.github.dev";

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
            resp.tasks.forEach(task => domUser.cTaskCard(task))
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

    htmlDeleteTask: async function removeTask(id){
        try{
            const resp = await tasks.remove(id);
            document.getElementById("tarefa-" + id).remove(); 
        }catch(erro){
            alert(erro.message);
        };
          
    },

    htmlEditTask: async function taskEdicao(id, event){
        event.preventDefault();

        const titulo = document.getElementById("novoTitulo").value;
        const descricao = document.getElementById("novaDescricao").value;
        const prazoEntrega = document.getElementById("novaData").value;

        try{
            const resp = await tasks.update(titulo, descricao, prazoEntrega, id)
        }catch(erro){
            alert(erro.message)
        };
    },
};

const domUser = {
   cTaskCard: function criarTask(task){
        const fragment = document.createDocumentFragment();

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

        const botaoEditar = this.cBotao("Editar", "botaoEditar", this.cFormEdit.bind(this, task.id))
        card.appendChild(botaoEditar);

        const botaoDeletar = this.cBotao("Deletar", "botaoDeletar", manipuladorUser.htmlDeleteTask.bind(null, task.id))
        card.appendChild(botaoDeletar);

        fragment.appendChild(card);

        document.getElementById("tarefasContainer").appendChild(fragment);
   },

   cFormEdit: function formularioEdit(id){
        const fragment = document.createDocumentFragment();

        const formEditarTask = document.getElementById("tarefa-" + id);

        if (formEditarTask.querySelector("form")) return;

        const tituloAtual = formEditarTask.querySelector("h3").innerText;
        const descricaoAtual = formEditarTask.querySelector("p").innerText;

        const form = document.createElement("form");

        const inputTitulo = this.cInput("text","novoTitulo","novoTitulo", "Novo Titulo", tituloAtual);
        const inputDescricao = this.cInput("text", "novaDescricao", "novaDescricao", "Nova descrição", descricaoAtual);
        const inputData = this.cInput("date", "novaData", "novaData", "", formEditarTask);

        const botaoSalvar = this.cBotao("Salvar", "botaoSalvar", (event) => manipuladorUser.htmlEditTask(id, event));

        form.append(inputTitulo, inputDescricao, inputData, botaoSalvar);
        formEditarTask.appendChild(form);
        fragment.appendChild(formEditarTask)
        
        document.getElementById("tarefasContainer").appendChild(fragment);
   },

   cBotao: function criarBotao(texto, classe, acao){
        const botao = document.createElement("button");
        botao.textContent = texto;
        botao.classList.add(classe);
        botao.type = "button";
        botao.onclick = acao;
        return botao
   },

   cInput: function criarInput(type, name, id, placeholder = "",value = ""){
        const input = document.createElement("input");

        input.type = type;
        input.name = name;
        input.id = id;
        input.placeholder = placeholder;
        if (value) input.value = value;
        return input;
   },

   tasksForm: function mostrarFormulario(){
        const formulario = document.getElementById("formularioTasks")

        if (formulario.style.display === "none"){
            formulario.style.display = "block"
        }else{
            formulario.style.display = "none"        
        }
   },
};