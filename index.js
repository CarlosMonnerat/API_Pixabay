'use strict'

const searchImages = async (text) => {
    const key = '40146163-68a905c3c59f3c5b5d6ac25d7';
    const url = `https://pixabay.com/api/?key=${key}&q=${text}`;
    const response = await fetch(url);
    return response.json();
};

const createTagLink = (tag) => `
    <a href="#" onClick = "loadGallery('${tag}')">
        ${tag}
    </a>    
`;

const createCard = ({webformatURL, pageURL, tags, likes, comments}) => {
    const card = document.createElement('div');
    card.classList.add('card-container');
    card.innerHTML = `
    <a href="${pageURL}" class="card-image">
        <img src=${webformatURL} >
    </a>
    <div class="card-info">
        <div class="card-tags">
            ${tags.split(',').map(createTagLink).join('')}
        </div>
        <div class="card-action">
            <div class="card-like">
                <i class="fa-regular fa-thumbs-up"></i>
                <span>${likes}</span>
            </div>
            <div class="card-comments">
                <i class="fa-regular fa-comment"></i>
                <span>${comments}</span>
            </div>
            <div class="card-save">
                <i class="fa-regular fa-bookmark"></i>
            </div>
        </div>
    </div>
    `;
    return card;
};

//Como 'searchImages' é uma func asincrona, ela tbm retorna uma promise. Por isso 'loadGallery' tbm precisa trabalhar de forma sincrona
const loadGallery = async (textSearch, page = 1) => {
    const container = document.querySelector('.container-gallery');
    const {hits, totalHits} = await searchImages (`${textSearch}&page=${page}`);  //Desestruturação
    const cards = hits.map(createCard);
    //'replaceChildren' tem q receber objs, mas 'cards' é um array. Então usa-se '...'(spread) para espalhar o array 
    container.replaceChildren(...cards);

    document.querySelector('#search-input').value = textSearch;
    document.querySelector('#page').value = page;
    const totalPages = Math.ceil(totalHits / 20);
    document.querySelector('#page-total').textContent = `/ ${totalPages}` //Como 'page-total' é um 'span', não possui 'value', apenas 'content'
};

const handleKeypress = ({key, target}) => {     //caracteristica do js chamada 'destructuring'. => (event.key, event.target)
    if(key === 'Enter'){
         loadGallery(target.value);
    }   
};

const handlePage = ({key, target}) => {
    const text = document.getElementById('search-input').value;
    if(key === 'Enter'){
        loadGallery(text, target.value);
   }   
};

const handleNext = () => {
    let page = Number(document.querySelector('#page').value);
    const totalPages = Number(document.querySelector('#page-total').textContent.replace('/', ''));
    const text = document.getElementById('search-input').value;
    if(page < totalPages){
        page++;
        loadGallery(text, page);
    }
};

const handlePrevious = () => {
    let page = Number(document.querySelector('#page').value);
    const text = document.getElementById('search-input').value;
    if(page > 1){
        page--;
        loadGallery(text, page);
    }
};

document.querySelector('#page').addEventListener('keypress', handlePage);
document.getElementById('search-input').addEventListener('keypress', handleKeypress);
document.querySelector("#page-next").addEventListener('click', handleNext);
document.querySelector("#page-previous").addEventListener('click', handlePrevious);