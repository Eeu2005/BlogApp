import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
const btn = document.querySelector("#preview")
const conteudo = document.querySelector("textarea")
const div = document.createElement("div")
div.className = "mt-4"
const label = conteudo.labels[0]
let mark = false
btn.addEventListener("click",(e)=>{
    if(!mark){
        div.innerHTML = marked.parse(conteudo.value)
        conteudo.style.display ="none"
        div.style.display= "block"
        label.appendChild(div)
        mark =true
    }else{
        mark =false
        conteudo.style.display = "block";
        div.style.display = "none"
    }
})