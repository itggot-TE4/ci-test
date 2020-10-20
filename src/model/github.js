//import auth from "../config/github.js";
const url = "https://api.github.com";

export default class github {
    static async auth(){
        const url = "https://github.com/login/oauth/authorize?client_id=bae0be1309c40444a180";
        console.log(url);
        window.location = url;
    }

    static async getToken(code){
        console.log(code);
        const request = await fetch(`http://localhost:4000/getToken?code=${code}`);
        const result = await request.text();
        const resultUrl = new URLSearchParams(result);
        const accessToken = resultUrl.get('access_token');
        return accessToken;
    }

    static async userInfo(token){
        const request = await fetch(`https://api.github.com/user`, { // CR 101
            headers: {
                "Authorization": `token ${token}`
            }
        });
        const result = await request.json();
        return result;
    }

    static async get(path){
        const request = await fetch(`${path}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await request.json();
        return result;
    }

    static async repos(user){
        const request = await fetch(`${url}/users/${user}/repos`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await request.json();
        return result;
    }

    static async repo(id){
        const request = await fetch(`${url}/repositories/${id}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await request.json();
        return result;
    }

    static async user(user){
        const request = await fetch(`${url}/users/${user}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await request.json();
        return result;
    }

    static async forks(user, repo){
        const request = await fetch(`${url}/repos/${user}/${repo}/forks`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await request.json();
        return result;
    }

    static async contents(user, repo, path){
        const request = await fetch(`${url}/repos/${user}/${repo}/contents/${path}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        const result = await request.json();
        return result;
    }
}
