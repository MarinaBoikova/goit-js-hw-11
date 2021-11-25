import './css/styles.css';
import Notiflix from 'notiflix';

const baseUrl = 'https://pixabay.com/api/?key=24496142-39f11c79c6568bfa1b54a8aaa&q=';
let page = 1;
const imagesPerPage = 40;

const inputFormRef = document.querySelector('[name="searchQuery"]');
const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtnRef = document.querySelector('.load-more');

formRef.addEventListener('submit', onImagesSearch);

const fetchImages = () => {
  return fetch(
    `${baseUrl}${inputImagesName}&image_typ=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.status);
  });
};

function clearCards() {
  galleryRef.innerHTML = '';
}
let inputImagesName = '';

function onImagesSearch(e) {
  e.preventDefault();
  inputImagesName = inputFormRef.value.trim();
  page = 1;
  clearCards();
  if (!inputImagesName) {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }
  getImages();
}

function renderImages(images) {
  const markUp = images.hits
    .map(item => {
      const { webformatURL, tags, likes, views, comments, downloads } = item;
      return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="200" height="200"/>
        <div class="info">
          <p class="info-item">
            <b>Likes: ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views: ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments: ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads: ${downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join('');
  galleryRef.insertAdjacentHTML('beforeend', markUp);
}

const onLoadMore = () => {
  page += 1;
  getImages();
};

const getImages = () => {
  fetchImages()
    .then(images => {
      console.log(images);
      if (images.total === 0) {
        loadMoreBtnRef.classList.add('is-hidden');
        return Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
        );
      }
      loadMoreBtnRef.classList.remove('is-hidden');
      const lastPage = Math.ceil(images.totalHits / imagesPerPage);
      if (page >= lastPage) {
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
        loadMoreBtnRef.classList.add('is-hidden');
      }
      return renderImages(images);
    })
    .catch(error => console.error(error));
  console.log(page);
};

loadMoreBtnRef.addEventListener('click', onLoadMore);
