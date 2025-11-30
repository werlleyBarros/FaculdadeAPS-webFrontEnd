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
        alert("Sucesso ao enviar")

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

    } catch(erro){
        console.error(erro)
        alert("Deu ruim ao enviar formulario")
    }
}