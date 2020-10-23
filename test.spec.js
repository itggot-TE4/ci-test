import { fireEvent, getByText, getByDisplayValue } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM, VirtualConsole, CookieJar } from 'jsdom'
import { TestHelper } from './test-helpers.js'
import fs from 'fs'
import path from 'path'

//const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let h
let dom
let container

xdescribe('index.html', () => {
  beforeEach((done) => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    let url = 'http://serving:8000';

    let options = {
        resources: 'usable',
        runScripts: 'dangerously'
    }


    JSDOM.fromURL(url, options).then((dom) => {
        setTimeout(() => {
            container = dom.window.document.body
            h = new TestHelper(container)
            done();
        }, 500);
    })
  })

  it('has a main', () => {
    expect(container.querySelector('main')).not.toBeNull()
  })

  it('no hearts 1', () => {
    expect(h.cardIsPresent("♥1")).toBeFalsy();
  })
  
  it('has spades, clubs, hearts and diams 2', () => {
    expect(h.cardIsPresent("♣2")).toBeTruthy();
    expect(h.cardIsPresent("♠2")).toBeTruthy();
    expect(h.cardIsPresent("♥2")).toBeTruthy();
    expect(h.cardIsPresent("♦2")).toBeTruthy();
  })

  it('has a card', () => {
    expect(container.querySelector('article')).not.toBeNull();
  })

  test('snapshot of main', () => {
    expect(container.querySelector('main').innerHTML).toMatchSnapshot();
  })

});
