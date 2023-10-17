import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './api';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';

loadMoreBtn.style.display = 'none';

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

const lightbox = new SimpleLightbox('.gallery a', {
  caption: true,
  captionsData: 'alt',
  captionDelay: 250,
});

function createHtml(image) {
  return `
    <div class="photo-card">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes:</b> ${image.likes}
        </p>
        <p class="info-item">
          <b>Views:</b> ${image.views}
        </p>
        <p class="info-item">
          <b>Comments:</b> ${image.comments}
        </p>
        <p class="info-item">
          <b>Downloads:</b> ${image.downloads}
        </p>
      </div>
    </div>
  `;
}

async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value;
  page = 1;
  gallery.innerHTML = '';
  toggleLoadMoreBtn(false);

  const images = await getImages(searchQuery, page);

  if (images.length > 0) {
    displayImages(images);
    displayTotalHits(images.length);
    toggleLoadMoreBtn(true);
  } else {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

async function onLoadMore() {
  const images = await getImages(searchQuery, (page = 1));

  if (images.length > 0) {
    displayImages(images);
    toggleLoadMoreBtn(images.length);
    scrollPageSmoothly();
  } else {
    toggleLoadMoreBtn(images.length);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function displayImages(images) {
  const html = images.map(image => createHtml(image)).join('');
  gallery.innerHTML += html;
  lightbox.refresh();
}

function toggleLoadMoreBtn(show) {
  if (show) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

function scrollPageSmoothly() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function displayTotalHits(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}
