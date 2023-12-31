"use strict";

// Configs
const mainBody = document.querySelector(".main_body");
const darkModeBtn = document.querySelector(".left-header");
const selectElement = document.querySelector(".custom-select");
const dropdownBtn = document.querySelector("#dropdown-btn");
const dropdownOpt = document.querySelector("#dropdown-opt");
const countryRegion = document.querySelector("#country-region");
const inputElement = document.getElementById("myInput");
const loader = document.querySelector(".loader");
const errorHandler = document.querySelector(".error-handler");
const API_URL = "https://restcountries.com/v3.1/";
const TIMEOUT_SEC = 30;
let arrayOfCodes = [];
// console.log(arrayOfCodes)

// Helper Functions
// 1. Timeout
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s}seconds`));
    }, s * 1000);
  });
};

// 2. Error Handler  --Not sure how it became error handele
const getJson = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    // if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    if (!res.ok) throw new Error(`Omo!!!🔥 (${res.status})`);

    return data;
  } catch (err) {
    // console.error(`${err}`);
    throw err;
  }
};

// 3. Sorting function
const sorted = function (val) {
  val.sort((a, b) => a.name.common.localeCompare(b.name.common));
  // val.sort((a, b) => (a.name.common > b.name.common ? 1 : -1));
};

// 4. Loader
// function renderLoader () {
//   const markup = ` <div class="loader"></div> `;
//   // mainBody.innerHTML = " ";
//   // mainBody.innerHTML = markup;
//   mainBody.insertAdjacentHTML("beforeend", markup)
// };

// 5. Error Handler
const errMsg = function (err) {
  const html = `
      <div class="error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h4>Something went wrong.</h2>
        <details>
          ${err.message}
        </details>
      </div>
  `;
  errorHandler.insertAdjacentHTML("beforeend", html);
};

// Main Functions
const screenMode = localStorage.getItem("darkMode") === "true";

window.onload = () => {
  screenMode
    ? document.body.classList.add("dark-mode")
    : document.body.classList.remove("dark-mode");
};

darkModeBtn.addEventListener("click", function () {
  console.log(document.querySelectorAll(".color"));
  document.querySelectorAll(".color").forEach((el) => {
    el.classList.toggle("hide");
    // document.body.classList.toggle("dark-mode");
  });
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
  console.log(document.body.classList.contains("dark-mode"));
  // document.body.setAttribute('id', 'dark-mode')
});

mainBody.addEventListener("click", getDataSet);

const generateMarkUp = function (data) {
  const newData = data.forEach((country, idx) => {
    // prettier-ignore
    const {name, flags, capital, region, population, cca3, borders, subregion, tld, currencies, languages,} = country;
    // console.log(country);

    // data-country='${JSON.stringify(country)}'
    // <a href="country.html?country=${name.common}">COUNTRY 1</a>
    const markup = `
                      <div class="main" data-country='${cca3}'>
                          <img src=${flags.svg} alt="${name.common}">
                          <div class="text">
                              <div class="name">
                                <h3>
                                ${name.common || name.official}
                                </h3>
                              </div>
                              <div class="population">Population: ${population.toLocaleString()}</div>
                              <div class="region">Region: ${region}</div>
                              <div class="capital">Capital: ${capital}</div>
                          </div>
                      </div>
                        
                    `;

    mainBody.insertAdjacentHTML("beforeend", markup);
    // mainBody.innerHTML += markup;
  });
};

async function getDataSet(e) {
  try {
    const countryElement = e.target.closest(".main");
    const code = countryElement.dataset.country;
    // console.log(code);
    const data = await getJson(`${API_URL}/alpha/${code}`);
    console.log(data);

    // Store the updated arrayOfCodes in localStorage
    localStorage.setItem("name", JSON.stringify(data));
    // window.location.href = `country.html`;
    window.location.href = `country.html?country=${data[0].name.common}`;
    // window.open(`search.html?search=${data.name.common}`, '_self')

    // Not really useful
    arrayOfCodes = [...arrayOfCodes, code];
    console.log(arrayOfCodes);
  } catch (err) {
    console.error(`${err.message} ⚡⚡⚡`);
    // throw err;
    // errorHandler.classList.remove("hide");
    errMsg(err);
  }
}

const displayBody = async function () {
  try {
    errorHandler.classList.add("hide");
    loader.classList.remove("hide");
    // 1.
    const data = await getJson(`${API_URL}all`);

    // 2.
    sorted(data);
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

    loader.classList.add("hide");
  } catch (err) {
    loader.classList.add("hide");
    errorHandler.classList.remove("hide");
    console.error(`error!! ${err.message}`);
    errMsg(err);
  }
};
displayBody();

const renderRegion = async function (region) {
  mainBody.innerHTML = "";
  const data = await getJson(`${API_URL}region/${region}`);
  sorted(data);
  generateMarkUp(data);
};

selectElement.addEventListener("click", function (e) {
  if (e.target.closest("#dropdown-btn")) dropdownOpt.classList.toggle("hide");
});
countryRegion.addEventListener("click", function (e) {
  loader.classList.remove("hide");
  if (!e.target) return;
  const region = e.target.textContent;
  document.querySelector(".search-term").textContent = region;
  if (region === "All") displayBody();
  loader.classList.add("hide");
  renderRegion(region);
  dropdownOpt.classList.add("hide");
});

inputElement.addEventListener("input", async function (e) {
  mainBody.innerHTML = "";
  loader.classList.remove("hide");
  const inputValue = e.target.value;
  const data = await getJson(`${API_URL}all`);

  if (!inputValue) displayBody();
  console.log(inputValue);
  const inputSearch = data.filter((item) =>
    item.name.common
      .toLowerCase()
      .includes(inputValue !== "" && inputValue.toLowerCase())
  );
  generateMarkUp(inputSearch);
});

// let searchTerm = new URLSearchParams(window.location.country).get("search");
// console.log(searchTerm);
