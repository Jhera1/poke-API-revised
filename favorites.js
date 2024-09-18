document.addEventListener('DOMContentLoaded', () => {
  displayFavorites();
  
  document.getElementById('sort-a-z').addEventListener('click', () => sortFavorites('asc'));
  document.getElementById('sort-z-a').addEventListener('click', () => sortFavorites('desc'));
});

let favorites = [];

function displayFavorites() {
  favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  const carousel = document.querySelector('.card-carousel');
  const totalBaseExpDiv = document.querySelector('.total-base-exp');
  carousel.innerHTML = '';

  if (favorites.length === 0) {
    carousel.innerHTML = '<p>No favorite Pokémon yet.</p>';
    totalBaseExpDiv.textContent = 'T.B.E.: 0';
    return;
  }

  renderCards();
  updateTotalBaseExperience();
}

const renderCards = () => {
  const carousel = document.querySelector('.card-carousel');
  carousel.innerHTML = '';

  if (favorites.length === 0) {
    carousel.innerHTML = '<p>No favorite Pokémon yet.</p>';
    document.querySelector('.total-base-exp').textContent = 'T.B.E.: 0';
    return;
  }

  const activeCard = document.querySelector('.card.active');
  const activePokemonName = activeCard ? activeCard.querySelector('div').textContent : null;

  favorites.forEach((pokemon, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    if ((activePokemonName && pokemon.name === activePokemonName) || 
        (!activePokemonName && index === 0)) {
      card.classList.add('active');
    }

    card.innerHTML = `
      <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
      <div>${pokemon.name}</div>
      <div class="poke-data">Base Experience: ${pokemon.base_experience}</div>
      <button class="fav-btn">Remove from Favorites</button>
    `;

    card.querySelector('.fav-btn').addEventListener('click', () => {
      removeFromFavorites(pokemon);
      favorites = favorites.filter(fav => fav.name !== pokemon.name);
      renderCards();
      updateTotalBaseExperience();
    });

    carousel.appendChild(card);
  });

  initializeFavoritesCarousel();
};

function removeFromFavorites(pokemon) {
  favorites = favorites.filter(fav => fav.name !== pokemon.name);
  localStorage.setItem('favorites', JSON.stringify(favorites));

  if (favorites.length === 0) {
    window.location.href = './index.html';
  }
}

function updateTotalBaseExperience() {
  const cards = document.querySelectorAll('.card');
  let totalBaseExp = 0;

  cards.forEach(card => {
    const baseExpElement = card.querySelector('.poke-data');
    const baseExpText = baseExpElement.textContent.match(/\d+/);
    totalBaseExp += parseInt(baseExpText[0], 10);
  });

  const totalBaseExpDiv = document.querySelector('.total-base-exp');
  totalBaseExpDiv.textContent = `T.B.E.: ${totalBaseExp}`;
}

const initializeFavoritesCarousel = () => {
  const slides = document.querySelectorAll('.card');
  const buttons = document.querySelectorAll('.slide-control-container button');

  let current = 0;
  let next = current < slides.length - 1 ? current + 1 : 0;
  let prev = current > 0 ? current - 1 : slides.length - 1;

  const update = () => {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next', 'hidden');
      if (index === current) {
        slide.classList.add('active');
      } else if (index === next) {
        slide.classList.add('next');
      } else if (index === prev) {
        slide.classList.add('prev');
      } else {
        slide.classList.add('hidden');
      }
    });
  };

  const updateIndex = (number) => {
    current = number;
    next = current < slides.length - 1 ? current + 1 : 0;
    prev = current > 0 ? current - 1 : slides.length - 1;
    update();
  };

  const goToNext = () => current < slides.length - 1 ? updateIndex(current + 1) : updateIndex(0);
  const goToPrev = () => current > 0 ? updateIndex(current - 1) : updateIndex(slides.length - 1);

  buttons[0].addEventListener('click', goToPrev);
  buttons[1].addEventListener('click', goToNext);

  update();
};

function sortFavorites(order) {
  favorites.sort((a, b) => {
    if (order === 'asc') {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  renderCards();
  initializeFavoritesCarousel();
  updateTotalBaseExperience();
}
