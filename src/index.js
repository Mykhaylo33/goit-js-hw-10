import './css/styles.css';
import Notiflix from 'notiflix';
const debounce = require('lodash.debounce');
import apiService from './js/fetchCountries';
import { firstWay, secondWay, clearEl } from './js/markup';

const api = new apiService();
const DEBOUNCE_DELAY = 300;

const rfs = {
  inputEl: document.querySelector('#search-box'),
  singleCountryEl: document.querySelector('.country-info'),
  multiCountryEl: document.querySelector('.country-list'),
};

rfs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  event.preventDefault();

  const inputValue = event.target.value.trim();

  if (inputValue === '') {
    clearEl(rfs.singleCountryEl);
    clearEl(rfs.multiCountryEl);
    return;
  }

  api
    .fetchCountries(inputValue)
    .then(countries => {
      if (countries.length === 1) {
        rfs.singleCountryEl.innerHTML = firstWay(countries[0]);
        clearEl(rfs.multiCountryEl);
      } else if (countries.length > 1 && countries.length <= 10) {
        rfs.multiCountryEl.innerHTML = secondWay(countries);
        clearEl(rfs.singleCountryEl);
      } else if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        clearEl(rfs.singleCountryEl);
        clearEl(rfs.multiCountryEl);
      }

      return countries;
    })
    .then(data => {
      if (data.message) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearEl(rfs.singleCountryEl);
        clearEl(rfs.multiCountryEl);
      }
    })
    .catch(error => {
      console.log(error.message);
    })
    .finally(() => {});
}