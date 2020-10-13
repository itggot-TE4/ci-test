function generateDeck() {

    let suits = ['&hearts;', '&clubs;', '&diams;', '&spades;'];
    let deck = localStorage.getItem('deck') || [];

    if (deck.length == 0) {
        for(let i=0; i < suits.length; i++) {
            // Yttre loop ( suits )
            for(let j = 2; j<= 14; j++) {
                // Inner loop value 
                let value;
                if(j < 11)   { value = j.toString() }
                if(j === 11) { value = 'J' }
                if(j === 12) { value = 'D' }
                if(j === 13) { value = 'K' }
                if(j === 14) { value = 'A' }
    
                let color = (suits[i] === '&hearts;' || suits[i] === '&diams;' ) ? 'red' : 'black';
    
                let card = {
                    suite: suits[i],
                    rank: j,
                    value: value,
                    color: color
                }
    
                deck.push(card)
            }
        }
    
        localStorage.setItem('deck', deck)
    }

    return deck

}

function updateGUI(deck) {

    for(let card of deck){
        
        let cardEl = document.createElement('article');
        cardEl.classList.add(card.color);

        let headerEl = document.createElement('header');
        headerEl.innerHTML = `<p>${card.suite}</p><p>${card.value}</p>`;
        cardEl.appendChild(headerEl)

        let suiteEl = document.createElement('h1');
        suiteEl.innerHTML = card.suite;
        cardEl.appendChild(suiteEl)

        let footerEl = document.createElement('footer');
        footerEl.innerHTML = `<p>${card.suite}</p><p>${card.value}</p>`;
        cardEl.appendChild(footerEl)

        cardEl.addEventListener('click', (e) => {
            e.target.classList.add('selected');
        })

        document.querySelector('main').appendChild(cardEl);

    }
}

let deck = generateDeck();
updateGUI(deck)