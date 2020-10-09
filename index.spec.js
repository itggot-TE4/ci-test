import {sum} from './index.js'

describe('test suite', () => {
    it('tests that 2 + 3 is 5', () => {
	    expect(sum(2, 3)).toEqual(5);
    });
});
