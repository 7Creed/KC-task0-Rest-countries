"use strict";

// Configs
// const main = document.getElementsByTagName("main");
// console.log(main);
const mainBody = document.querySelector(".main_body");
const API_URL = "https://restcountries.com/v3.1/";
const TIMEOUT_SEC = 10;
let arrayOfCodes = [];
// console.log(arrayOfCodes)

// localStorage.clear()

// Helpers
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s}seconds`));
    }, s * 1000);
  });
};

// Error Handler

const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`kkk${data.message} (${res.status})`)
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const generateMarkUp = function (data) {
  data.forEach((country, idx) => {
    const {
      name,
      flags,
      capital,
      region,
      population,
      cca3,
      borders,
      subregion,
      tld,
      currencies,
      languages,
    } = country;
    // console.log(name);
    // console.log(country);

    // data-country='${JSON.stringify(country)}'
    const markup = `
                       
                      <div class="main" data-country='${cca3}'>
                          <img src=${flags.svg} alt="${name.common}">
                          <div class="text">
                              <div class="name">${
                                name.common || name.official
                              }</div>
                              <div class="population">Population: ${population.toLocaleString()}</div>
                              <div class="region">Region: ${region}</div>
                              <div class="capital">Capital: ${capital}</div>
                          </div>
                      </div>
                        
                    `;

    mainBody.insertAdjacentHTML("beforeend", markup);
  });
};
mainBody.addEventListener("click", getDataSet);

async function getDataSet(e) {
  try {
    const countryElement = e.target.closest(".main");
    const code = countryElement.dataset.country;
    const data = await getJson(`${API_URL}/alpha/${code}`);
    console.log(data);

    // Store the updated arrayOfCodes in localStorage
    localStorage.setItem("name", JSON.stringify(data));
    window.location.href = "country.html";

    arrayOfCodes = [...arrayOfCodes, code];
    // console.log(newArr);
    console.log(arrayOfCodes);
    if (!data.ok) throw new Error(`${data.message} (${res.status})`)
  } catch (err) {
    console.log(err.message);
  }
}
console.log(arrayOfCodes);
// console.log(getDataSet());

const displayBody = async function () {
  try {
    // 1.
    const data = await getJson(`${API_URL}all`);
    // console.log(data);

    // 2.
    generateMarkUp(data);

    // 1. Refactor. create a function on it's own
    //   const res = await fetch("https://restcountries.com/v3.1/all");
    //   const data = await res.json();
    //   console.log(data);

    // 2. Refactor. Create the markup function
    //   data.map((country, idx) => {
    //     const {
    //       name,
    //       flags,
    //       capital,
    //       region,
    //       population,
    //       cca3,
    //       borders,
    //       subregion,
    //       tld,
    //       currencies,
    //       languages,
    //     } = country;
    //     const markup = `
    //                     <div class="main_body">
    //                         <div class="flag">${country.flags.svg}</div>
    //                         <img src=${country.flags.svg} alt="">
    //                         <div class="text">
    //                             <div class="name">name</div>
    //                             <div class="population">population</div>
    //                             <div class="region">region</div>
    //                             <div class="capital">capital</div>
    //                         </div>
    //                     </div>

    //                 `;

    //     return mainBody.insertAdjacentHTML("beforeend", markup);
    //   });

    // 3.
    if (!data.ok) throw new Error(`${data.message} (${res.status})`)
  } catch (err) {
    console.log(err.message);
  }
};
displayBody();

const renderRegion =  async function(region) {
  mainBody.innerHTML = ''
  const data = await getJson(`${API_URL}region/${region}`)
  generateMarkUp(data);
}

document.querySelector('.select').addEventListener('click', function(e) {
  console.log(e.target.value);
  const region = e.target.value
  if (!region) return
  renderRegion(region)
})

const array = [1, 2, 2, 3, 4, 4, 5, 5, 6, 7, 7, 8];

const uniqueElements = array.filter((value, index, self) => {
  return self.indexOf(value) === index;
  
});
console.log(uniqueElements);
