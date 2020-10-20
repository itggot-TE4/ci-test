const url = "https://api.github.com";
const user = "TE4-oskar-pilborg";
const attackerAuth= "?client_id=cb348d1dcf73a4b3554f&client_secret=610dd5f3ef42d839735e047830964bc31649f826";

export default class overloadBot {

    static async repos(user){
        const request = await fetch(`${url}/users/${user}/repos${attackerAuth}`);
        const result = await request.json(); 
        return result;
    }

    static attack(iterations){
        for(let i = 0; i <= iterations; i++){
            overloadBot.repos(user);
            console.log(i);
        }
    }
}