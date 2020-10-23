export default class github {
    static async auth(){
        console.log("called from mock")
    }

    static async userInfo(token){
        console.log("mock")
        return token;
    }
  }
