import github from "../model/github.js";

const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

const getToken = async() => {
    const token = await github.getToken(code);
    localStorage.setItem("token", token);
    setTimeout(() => {
        window.location = "http://localhost:5500/src/views/";
    }, 500);
}
getToken(code);
