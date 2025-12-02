async function Cadastro() {

    const url = "https://verbose-fishstick-v6jjqpv7ppxgcpjx9-8000.app.github.dev/auth/signup"
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
    const url = "https://verbose-fishstick-v6jjqpv7ppxgcpjx9-8000.app.github.dev/auth/login"
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
}

async function carregarTasks() {
    const url = "https://verbose-fishstick-v6jjqpv7ppxgcpjx9-8000.app.github.dev/tasks";
    
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

    } catch (erro) {
        console.error(erro);
        alert("Erro ao carregar dados");
    }
}
