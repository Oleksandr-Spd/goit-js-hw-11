import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from './api';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
let perPage = 40;
let isLoading = false;

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

async function processImages() {
  try {
    const images = await getImages(searchQuery, page, perPage);

    if (images.length > 0) {
      displayImages(images);
      toggleLoadMoreBtn(true);
      displayTotalHits(images.length);
      page++;
    } else {
      toggleLoadMoreBtn(false);
      if (page === 1) {
        Notiflix.Notify.info('Sorry, no images found for your search query.');
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

async function onSubmit(e) {
  e.preventDefault();
  searchQuery = e.target.searchQuery.value.trim();
  page = 1;
  gallery.innerHTML = '';
  toggleLoadMoreBtn(false);

  if (searchQuery.length === 0) {
    return;
  }

  try {
    await processImages();
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

async function onLoadMore() {
  if (!isLoading) {
    isLoading = true;

    try {
      await processImages();
      isLoading = false;
    } catch (error) {
      Notiflix.Notify.failure(error.message);
      isLoading = false;
    }
  }
}

function displayImages(images) {
  const html = images.map(image => createHtml(image)).join('');
  gallery.innerHTML += html;
  lightbox.refresh();
}

function toggleLoadMoreBtn(show) {
  loadMoreBtn.style.display = show ? 'block' : 'none';
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
