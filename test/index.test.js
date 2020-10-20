const hello = require("../src/js/index")

test("Returns Hello World!", () => {
    expect(hello()).toBe(1);
})