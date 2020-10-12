export class TestHelper {

    constructor(container) {
        this.container = container;
    }

    cardIsPresent(card) {
        return Array.from(this.container.querySelectorAll('header')).some((node) => node.textContent === card)
    };
}