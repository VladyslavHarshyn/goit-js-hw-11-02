import axios from 'axios';

export class PixabayApi {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '27886183-b8a69c4f9a7f08eca44a6c4b4';

  constructor() {
    this.page = 1;
    this.q = null;
    this.per_page = 33;
  }

  searchPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        key: this.#API_KEY,
        page: this.page,
        per_page: this.per_page,
        q: this.q,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
  }

  addPages() {
    this.page += 1;
  }
}
