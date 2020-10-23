/*jest.mock('../../model/github',  () => ({
    github: {
        default: {
            auth: jest.fn(() => console.log("someone called me")),
            userInfo: jest.fn(async (token) => console.log(token)),
        }
    }
}))*/

jest.mock('../../model/github');

/*jest.mock('../../model/github',  () => {
    return jest.fn().mockImplementation(() => {
        return {
            default: {
                auth: jest.fn(() => console.log("someone called me")),
                userInfo: jest.fn(async (token) => console.log(token)),
            }
        };
    });
});*/

const index = require('../index')

/*
jest.mock('../../model/github', () => ({
    default: class {
        static auth() {
            return jest.fn(() => console.log("someone called me"));
        }

        static async userInfo() {
            return jest.fn(async (token) => console.log(token))
        }
    }      
})      
)
*/

describe('index.js', () => {
    test('has auth', async () => {
        await index();
    })
})
