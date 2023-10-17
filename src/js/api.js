import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: '40101755-cc34c32d0d934ee8791c8a829',
};

export async function getImages(value, page = 1) {
  try {
    const response = await axios.get('', {
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        q: value,
        page,
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}
