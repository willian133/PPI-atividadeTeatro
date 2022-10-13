// obter os elementos da página
const frm = document.querySelector("form")
const dvPalco = document.querySelector("#divPalco")

// constante para definir o número de poltronas
const POLTRONAS = 240;

// vetor com as poltronas reservadas pelo cliente
const reservadas = [];

window.addEventListener("load", () => {
    //se houver dados salvos no localstorage, faz um split(";") e atribui esses dados ao array, caso contrário, inicializamos o array
    // operador ternário
    const ocupadas = localStorage.getItem("teatroOcupadas") ? localStorage.getItem("teatroOcupadas").split(";"): [];
    //montar o número total de poltronas (definidas pela constante)
    for(let i=1; i<=POLTRONAS; i++){
        //cria a tag figura
        const figure = document.createElement("figure");
        //cria a tag img
        const imgStatus = document.createElement("img");

        //se a posição estiver ocupada, exibe a imagem ocupada, senão, a imagem disponível
        imgStatus.src = ocupadas.includes(i.toString()) ? "img/ocupada.jpg" : "img/disponivel.jpg"
        //classe com a dimensão da imagem
        imgStatus.className = "poltrona";
        
        //cria figcaption
        const figureCap = document.createElement("figcaption");

        //quantidade de zeros antes do número da poltrona
        const zeros = i<10 ? "00" : i<100 ? "0" : ""; 

        //cria o texto 

        const num = document.createTextNode(`[${zeros}${i}]`);
    
        //define os pais de cada tag criada
        figureCap.appendChild(num);
        figure.appendChild(imgStatus);
        figure.appendChild(figureCap);

        // se i módulo de 24 == 12 (é o corredor: define margem direita 60 px)
        if(i % 24 == 12) figure.style.marginRight = "60px";

        // indica que a figura é filha de divpalco;
        dvPalco.appendChild(figure);

        //se i módulo 24 == 0: o código após o && será executado(inserindo quebra linha)
        (i%24 == 0) && dvPalco.appendChild(document.createElement("br"));

    }
})


frm.addEventListener("submit", (e) => {
    e.preventDefault();

    //obtem o conteúdo do input
    const poltrona = Number(frm.inPoltrona.value);

    //valida o preenchimento de entrada
    if(poltrona > POLTRONAS){
        alert("Informe um número de poltrona válido!");
        frm.inPoltrona.focus();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas") ? localStorage.getItem("teatroOcupadas").split(";"): [];
    //validar se a poltrona ja estiver ocupada
    if(ocupadas.includes(poltrona+"")){
        alert(`Poltrona ${poltrona} já está ocupada...`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }
    if(reservadas.includes(poltrona)){
        alert(`Poltrona ${poltrona} já está reservada...`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    //capturar a imagem da poltrona, filha de divPalco.
    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona-1];

    //modifica o atributo da img
    // console.log(poltrona);
    imgPoltrona.src = "img/reservada.jpg";

    // adiciona a poltrona ao vetor
    reservadas.push(poltrona);

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
    return;
})

frm.btConfirmar.addEventListener("click", (e)=>{
    //verificar se não há poltronas reservadas
    if(reservadas.length == 0){
        alert("Não há poltronas reservadas!!");
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }

    const ocupadas = localStorage.getItem("teatroOcupadas") ? localStorage.getItem("teatroOcupadas").split(";"): [];

    //for decrescente, pois as reservas vão sendo removidas a casda alteração da imagem
    for(let i=reservadas.length-1; i>=0; i--){
        ocupadas.push(reservadas[i]);

        //captura a imagem da poltrona, filha e divPalco. É pois começa em 0

        const imgPoltrona = dvPalco.querySelectorAll("img")[reservadas[i]-1];
        imgPoltrona.src = "img/ocupada.jpg";//modifica a imagem

        reservadas.pop(); //remove do vetor a reserva já alterada
    }

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
});

frm.btDeleteOcupada.addEventListener("click", (e) => {
    //obtem o conteúdo do input
    const poltrona = Number(frm.inPoltrona.value);
    if(poltrona > POLTRONAS || poltrona<=0){
        alert("Informe um número de poltrona válido!");
        return;
    }

    //obtem as poltronas ocupadas
    const ocupadas = localStorage.getItem("teatroOcupadas")? localStorage.getItem("teatroOcupadas").split(";"): [];

    //verifica se a poltrona está realmente ocupada
    if(!ocupadas.includes(poltrona+"")){
        alert(`A poltrona ${poltrona} não está ocupada...`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }


    console.log(ocupadas)
    ocupadas.splice(ocupadas.indexOf(poltrona.toString()), 1);
    console.log(ocupadas)

    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona-1];
    imgPoltrona.src = "img/disponivel.jpg";//modifica a imagem

    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();

    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));

    return;
});