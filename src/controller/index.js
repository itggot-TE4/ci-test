import github from "../model/github.js";

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // mock some globals
    let userInfo = {};
} else {
    const form = document.querySelector("#input");
    const repoTemplate = document.querySelector("#repo");
    const forkTemplate = document.querySelector("#fork");
    const commentTemplate = document.querySelector("#comment");
    const grid = document.querySelector("#grid");
    const repoContainer = document.querySelector("#repos")
    const greeting = document.querySelector("#welcome");
    let userInfo = {};

    document.querySelector("#showComments").addEventListener("click", async() => {
        greeting.innerHTML = "";
        grid.innerHTML = "";
        repoContainer.innerHTML = "";
        const username = userInfo.login;
        const repos = await github.repos(username);
        
        repos.forEach(async(repo) => {
            const request = await fetch(`http://localhost:4000/comments?fork=${repo.id}`)
            const comment = await request.json();
            if(comment.length > 0){
                appendComment(comment[0], repo);
            }
        });
    });
}

const appendComment = async(comment, repos) => {
    const manifestSource = await github.contents(repos.owner.login, repos.name, ".manifest.json");
    const manifest = JSON.parse(atob(manifestSource.content));
    const filePath = manifest.filePath;
    let repo = document.importNode(commentTemplate.content.cloneNode(true).querySelector("div"), true);
    let state = "";
    const title = repos.full_name;
    switch(parseInt(comment.state)){
        case 1:
            state = `<i class="fas fa-check"></i> Klar`
            break;
        case 2:
            state = `<i class="fas fa-redo"></i> Åtgärd krävs`
            break;
        default:
            state = `<i class="fas fa-eye-slash"></i> Ej bedömd`
            break;
    }

    const contents = await github.contents(repos.owner.login, repos.name, filePath);
    const code = atob(contents.content);
    
    const prettyPrint = prettyPrintOne(code);
    repo.querySelector("pre").innerHTML = prettyPrint;
    repo.querySelector("h4").innerHTML = title;
    repo.querySelector("p.state").innerHTML = state;
    repo.querySelector("p.comment").innerHTML = comment.comment;
    
    grid.insertAdjacentElement("beforeend", repo);
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // mock some globals
} else {
    document.querySelector("#showUserRepos").addEventListener("click", async() => {
        const username = userInfo.login;
        const repos = await github.repos(username);
        showRepos(username, repos);
    });


    form.addEventListener("submit", async(e) => {
        e.preventDefault();
        const query = e.target.querySelector("input").value;
        const repos = await github.repos(query);
        showRepos(query, repos);
    });
}

const showRepos = async (query, repos) => {
    greeting.innerHTML = "";
    grid.innerHTML = "";
    repoContainer.innerHTML = "";
    repos.forEach(async (el) => {
        let repo = document.importNode(repoTemplate.content.cloneNode(true).querySelector("div"), true);
        const result = await github.contents(query, el.name, ".manifest.json");
        if(result.message !== "Not Found"){
            result.show = true;
        }else{
            result.show = false;
        }
        repo.dataset.id = el.id;
        repo.querySelector("a").setAttribute("href", `${el.html_url}`);
        repo.querySelector("#name").innerHTML = `${el.name}`;
        repo.querySelector("#forks").innerHTML = `${el.forks_count}`;
       
        if(result.show === false){
           repo.style.opacity = "0.5";
           repo.disabled = true;
        }
        repoContainer.insertAdjacentElement("beforeend", repo);
    });
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    // mock some globals
} else {
    document.addEventListener("click", async(e) => {
        if(e.target && e.target.id === "showForks"){
            const repoId = e.target.parentElement.parentElement.dataset.id;
            const repo = await github.repo(repoId);
            const manifest = await github.contents(repo.owner.login, repo.name, ".manifest.json");
            const forks = await github.get(repo.forks_url);
            showForks(forks, manifest);
        } else if(e.target && e.target.className.includes("save")) {
            e.preventDefault();
            const form = e.target.parentElement;
            const comment = form.querySelector('input[type="text"]').value;
            const forkId = form.parentElement.parentElement.dataset.id;
            const state = form.querySelector(`input[name="${forkId}"]:checked`).value;
            const data = {
                comment, state, forkId
            }
            fetch("http://localhost:4000/comments", {
                method: "POST",
                headers: {
                    "token": localStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        }
    });
}

const showForks = (forks, manifestSource) => {
    const manifest = JSON.parse(atob(manifestSource.content));
    const filePath = manifest.filePath;
    
    grid.style.cssText = "display:flex;align-items:center;justify-content:center;flex-direction:column;"
    grid.innerHTML = "";
    repoContainer.innerHTML = "";

    forks.forEach(async(el) => {
        let fork = document.importNode(forkTemplate.content.cloneNode(true).querySelector("div"), true);
        const request = await fetch(`http://localhost:4000/comments?fork=${el.id}`)
        const emptyData = {id: null, github_uid: null, githubForkId: null, comment: null, state: null};
        let commentData = await request.json();

        if(commentData.length < 1){
            commentData.push(emptyData);
        }

        const contents = await github.contents(el.owner.login, el.name, filePath);

        if(contents.message !== "Not Found"){
            const code = atob(contents.content);

            const unitTests = testCode(code, manifest);

            unitTests.forEach(test => {
                fork.querySelector(".unit-tests").insertAdjacentHTML("beforeend", `${test.passed ? '<i class="far fa-check-circle passed"></i>' : '<i class="far fa-times-circle failed"></i>'} Test: ${test.description}<br>`);
            });
    
            const checkboxes = fork.querySelectorAll("#judge label input");
            const comment = fork.querySelector("#judge input");
            const button = fork.querySelector("#judge button");
            fork.dataset.id = el.id;
            checkboxes.forEach((ele) => {
                ele.setAttribute("name", el.id)
            });
            
            comment.value = commentData[0].comment;
            for(let i = 0; i<checkboxes.length; i++){
                if(commentData[0].state === checkboxes[i].value){
                    checkboxes[i].checked = true; 
                }
            }

            if(commentData[0].state === "1"){
                comment.setAttribute("disabled", "true"); 
                for(let i = 0; i<checkboxes.length; i++){
                    checkboxes[i].disabled = true;  
                }
                button.disabled = true;
                button.style.backgroundColor = "grey";
            }
            
            fork.style.width = "500px"
            fork.querySelector(".fork-title").innerHTML = `${el.owner.login}/${el.name}`;
            const prettyPrint = prettyPrintOne(code);
            fork.querySelector(".fork-code").innerHTML = prettyPrint;
            fork.querySelector("a").setAttribute("href", el.html_url);
            grid.insertAdjacentElement("beforeend", fork);
        }
    });
}

const testCode = (code, manifest) => {
    const unitTests = [];
    const tests = manifest.tests;

    //Splits string into array of rows, filters out empty lines, slices first and last index, and finally joins it to a string again
    const codeFormatted = code.split("\n").filter(value => value !== "").slice(1, -1).join("");

    tests.forEach(test => {
        const args = manifest.functionParameters;
        const fun = new Function(args, codeFormatted);
        const result = fun(...test.arguments);
        const passed = test.expected === result;
        unitTests.push({
            "description": test.description,
            "passed": passed
        });
    });
    return unitTests;
}

const auth = async() => {
    if(!localStorage.getItem("token")){
        github.auth();
    }
    userInfo = await github.userInfo(localStorage.getItem("token"));
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = auth;
} else {
    auth();
}
