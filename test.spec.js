import { fireEvent, getByText, getByDisplayValue } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM, VirtualConsole, CookieJar } from 'jsdom'
import fs from 'fs'
import path from 'path'

//const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

let dom
let container

describe('index.html', () => {
  beforeEach((done) => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    let options = {
        resources: "usable",
        runScripts: 'dangerously'
    }

    JSDOM.fromFile('./index.html', options).then((dom) => {
        setTimeout(() => {
            container = dom.window.document.body
            done();
        }, 500);
    })
  })

  it('has a main', () => {
    expect(container.querySelector('main')).not.toBeNull()
  })

  it('no hearts 1', () => {
    expect(Array.from(container.querySelectorAll('header')).some((node) => node.textContent === "♥1")).toBeFalsy();
  })

  it('has hearts 2 <3', () => {
    expect(Array.from(container.querySelectorAll('header')).some((node) => node.textContent === "♥2")).toBeTruthy();
  })

  it('has spades 2 <3', () => {
    expect(Array.from(container.querySelectorAll('header')).some((node) => node.textContent === "♠2")).toBeTruthy();
  })

  it('has clubs 2 <3', () => {
    expect(Array.from(container.querySelectorAll('header')).some((node) => node.textContent === "♣2")).toBeTruthy();
  })

  it('has diams 2 <3', () => {
    expect(Array.from(container.querySelectorAll('header')).some((node) => node.textContent === "♦2")).toBeTruthy();
  })

});