/*
    Código está organizado em 5 módulos: api, auth, tasks, manipuladorUser e domUser.

    -api: Módulo que usa a função utilitária apiRequest para enviar todas as funções para o servidor.

    -auth: Funções de login e cadastro do sistema.

    -tasks: Funções responsaveis pelo CRUD (create, read, update e delete).

    -manipuladorUser: Funções para coletar informações do html e enviar para auth ou tasks.

    -domUser: Funções para manipular o Html dinamicamente.
*/

//url do servidor
const baseUrl = "https://humble-zebra-v6jjqpv7pgv53pv7-8000.app.github.dev";
/* 
    função utilitaria para envio do servidor. de argumento obrigatorio somente endpoint (parte final da url).
    caso não envie nenhum outro parametro, usa o que está depois de = como padrão.
*/
async function apiRequest(endpoint, method = "GET", body = null, usaToken = true){
    // url que irá enviar as requisições
    const url = baseUrl + endpoint 
    //informa ao servidor os dados que estão sendo enviados
    const headers = {
        "Content-Type": "application/json"
    };
    // se usaToken for verdadeiro pegará o token de segurança guardado e adicionará ao headers.
    if (usaToken) {
        const token = localStorage.getItem("Token");
        if (token) headers["authorization"] = "Bearer " + token;
    };
    // um objeto que junta tudo para enviar ao servidor.
    const options = {
        method,
        headers,
    };
    // se possuir um body para enviar, irá adicionar ao objeto options.
    if (body) {
        options.body = JSON.stringify(body);
    };
    // envia usando fetch a url final e o objeto options ao servidor e recebe a resposta do servidor
    const resp = await fetch(url, options);
    // se a requisição der algum erro retorna um erro e mostra uma mensagem ou o status do erro
    if (!resp.ok) {
        throw new Error(resp?.message || `Erro na requisição (${resp.status})`);
    };
    // cria uma variavel data que irá receber o JSON do servidor caso exista
    let data;

    try{
        data = await resp.json();
    }catch{
        data = null
    };
    // retorna o JSON, se não existir retorna null.
    return data;
};
// todas as funções que conectam com a api do servidor.
const api = {
    signup: (data) => apiRequest("/auth/signup", "POST", data, false),
    login: (data) => apiRequest("/auth/login", "POST", data, false),
    getTask: () => apiRequest("/tasks"),
    createTask: (data) => apiRequest("/tasks", "POST", data),
    editTask: (id, data) => apiRequest("/tasks/" + id, "PUT", data),
    deleteTask: (id) => apiRequest("/tasks/" + id, "DELETE"),
};
// funções que conectam com a parte auth da api
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
// funções que conectam com a parte tasks da api
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
// funções que recebe os dados do html
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
// funções auxiliares para criação das coisas no html.
const domUser = {
   cTaskCard: function criarTask(task){
        const fragment = document.createDocumentFragment();

        const card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("text-center");
        card.classList.add("col-3");
        card.id = "tarefa-"+ task.id;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body")
        card.appendChild(cardBody)

        const titulo = document.createElement("h3");
        titulo.textContent = task.title;
        titulo.classList.add("card-title")
        cardBody.appendChild(titulo);

        const deadline = document.createElement("p")
        deadline.textContent = "Prazo final: " + task.deadline;
        deadline.classList.add("card-subtitle")
        cardBody.appendChild(deadline);

        const description = document.createElement("p");
        description.textContent = task.description;
        description.classList.add("card-text")
        cardBody.appendChild(description);

        const botaoEditar = this.cBotao("Editar", "botaoEditar", this.cFormEdit.bind(this, task.id))
        cardBody.appendChild(botaoEditar);

        const botaoDeletar = this.cBotao("Deletar", "botaoDeletar", manipuladorUser.htmlDeleteTask.bind(null, task.id))
        cardBody.appendChild(botaoDeletar);

        fragment.appendChild(card);

        document.getElementById("grupoContainer").appendChild(fragment);
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