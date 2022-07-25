import { PixabayApi } from './pixabay';
import Notiflix from 'notiflix';
import superplaceholder from 'superplaceholder';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const btnEl = document.querySelector('.load-more');
const searchFormInput = document.querySelector('.search-form-input');

const pixabayApi = new PixabayApi();

const inSearchForm = async event => {
  event.preventDefault();

  galleryEl.innerHTML = '';

  pixabayApi.q = event.currentTarget[0].value.trim();
  pixabayApi.page = 1;

  try {
    const { data } = await pixabayApi.searchPhotos();

    if (!data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (data.totalHits <= pixabayApi.per_page) {
      addArrows(data.hits);
      btnEl.style.display = 'none';
    } else {
      addArrows(data.hits);

      btnEl.classList.add('is-hidden');

      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
  } catch (error) {
    console.log(error);
  }
};

superplaceholder({
  el: searchFormInput,
  sentences: [
    'Wanna see pictures?',
    'Then type something',
    'Eg. Pupmpkins',
    'or Hive',
    'Anything you want',
    'I LOVE YOU, M8!',
  ],
  options: {
    // delay between letters (in milliseconds)
    letterDelay: 80, // milliseconds
    // delay between sentences (in milliseconds)
    sentenceDelay: 700,
    // should start on input focus. Set false to autostart
    startOnFocus: false,
    // loop through passed sentences
    loop: true,
    // Initially shuffle the passed sentences
    shuffle: false,
    // Show cursor or not. Shows by default
    showCursor: true,
    // String to show as cursor
    cursor: '💩',
  },
});

function addArrows(data) {
  const createArrows = data
    .map(
      el =>
        `<div class="photo-card">
        <img class="image-card" src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${el.likes}
          </p>
          <p class="info-item">
            <b>Views</b>${el.views}
          </p>
          <p class="info-item">
            <b>Comments</b>${el.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>${el.downloads}
          </p>
        </div>
      </div>`
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', createArrows);
}

const addNewPages = async () => {
  try {
    const { data } = await pixabayApi.searchPhotos();
    let totalPages = Math.ceil(data.totalHits / data.hits.length);
    if (totalPages === pixabayApi.page + 1) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      btnEl.style.display = 'none';
      addArrows(data.hits);
    } else {
      addArrows(data.hits);
      pixabayApi.addPages();
    }
  } catch (error) {
    console.log('error :', error);
  }
};

formEl.addEventListener('submit', inSearchForm);
btnEl.addEventListener('click', addNewPages);
