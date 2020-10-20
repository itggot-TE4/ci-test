import attackBot from "../model/bot.js";
const bigRedButton = document.querySelector("#attack");

bigRedButton.addEventListener("click", async() =>{
    attackBot.attack(50);
});