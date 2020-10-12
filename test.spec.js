import { fireEvent, getByText, getByDisplayValue } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM, VirtualConsole, CookieJar } from 'jsdom'
import { TestHelper } from './test-helpers.js'
import fs from 'fs'
import path from 'path'

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let h
let dom
let container

describe('index.html', () => {
  beforeEach((done) => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    let dom = new JSDOM(html, { runScripts: "outside-only" });
    let localStorageHack = `
    window.localStorage = {
        getItem: function (key) {
            return this[key];
        },
        setItem: function (key, value) {
            this[key] = value;
        }
    };
    `;
    dom.window.eval(`document.head.appendChild(function(){
        let elm = document.createElement('script');
        elm.innerHTML = \`${localStorageHack}\`;
        return elm;
    }());`);

    let options = {
        resources: "usable",
        runScripts: 'dangerously',
        cookieJar: new CookieJar(),
        url: new URL("file:" + path.resolve('./index.html')) 
    }

    dom = new JSDOM(dom.serialize(), options);

    setTimeout(() => {
        container = dom.window.document.body
        h = new TestHelper(container)
        done();
    }, 500);
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

  test('snapshot of main', () => {
    expect(container.querySelector('main').innerHTML).toMatchSnapshot();
  })

});