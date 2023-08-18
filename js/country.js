"use strict";

const mainBody = document.querySelector(".main_body");
const darkModeBtn = document.querySelector(".left-header");
const backBtn = document.getElementById("back-btn");
const loader = document.querySelector(".loader");
const errorHandler = document.querySelector(".error-handler");
console.log(loader);

const API_URL = "https://restcountries.com/v3.1/";

let data = JSON.parse(localStorage.getItem("name")) || [];
// console.log(data);

const screenMode = localStorage.getItem("darkMode") === "true";

window.onload = () => {
  screenMode
    ? document.body.classList.add("dark-mode")
    : document.body.classList.remove("dark-mode");
  mainBody.innerHTML = "";
  loader.classList.remove("hide");
};

// Helpers
const getJson = async function () {
  try {
    const res = await fetch(`${API_URL}all`);
    if (!res.ok) throw new Error(`Oops`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err.message);
  }
};

const errMsg = function (err) {
  const html = `
      <div class="error">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <h2>Something went wrong.</h2>
        <details>
          ${err.toString()}
        </details>
      </div>
  `;
  errorHandler.insertAdjacentHTML("beforeend", html);
};

function extractCommonName(params) {
  const nativeName = params.nativeName;
  for (const languageCode in nativeName) {
    if (nativeName[languageCode].common) {
      return nativeName[languageCode].common;
    }
  }
  return null;
}

// const generateMarkUp = async function (data) {
async function generateMarkUp(data) {
  mainBody.innerHTML = "";
  loader.classList.remove("hide");

  const allData = await getJson();
  // console.log(allData);
  // console.log(data);

  let boundaries = [];

  data?.map((country, idx) => {
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

    const currencyKeys = currencies && Object.keys(currencies);
    const languagesVal = languages && Object.values(languages);
    console.log(currencyKeys, languagesVal);

    console.log(borders);
    borders
      ?.map((bord) => {
        return allData.find((each) => {
          if (each.cca3 === bord) boundaries.push(each.name.common);
        });
      })
      .join("");
    // console.log(boundaries);
    // console.log(boundaries?.name);

    // // This
    // const getNativeKey = Object.keys(name.nativeName);
    // const nativeName =
    //   name.nativeName[getNativeKey[getNativeKey.length - 1]]?.common;
    // console.log(getNativeKey, nativeName);
    // console.log(borders);

    // Or this
    const commonNativeName = extractCommonName(name);
    console.log(commonNativeName);

    const markup = ` 
        <div class="main-country">
            <img src=${flags.svg} alt="${name.common}">
            <div class="text-country">
                <div class="name">
                    <h3>${name.common || name.official}</h3>
                </div>
                <div class="text-area">
                    <div class="text-first">
                        <div class="native_name"><p>Native Name: ${commonNativeName}</p></div>
                        <div class="population"><p>Population: ${population.toLocaleString()}</p></div>
                        <div class="region"><p>Region: ${region}</p></div>
                        <div class="sub-region"><p>Sub Region: ${subregion}</p></div>
                        <div class="capital"><p>Capital: ${capital}</p></div>
                    </div>
                    <div class="text-second">
                        <p class=''>
                          Top Level Domain:
                          <span class=''>${tld}</span>
                        </p>
                        <p class=''>
                          Currencies:
                          <span class=''>
                            ${currencies && currencies[currencyKeys].name}
                          </span>
                          <span class=''>
                            ${currencies && currencies[currencyKeys].symbol}
                          </span>
                        </p>
                        <p class=''>
                          Languages:
                          <span class=''>
                            ${languagesVal
                              .map((lang) => lang)
                              .sort((a, b) => (a > b ? 1 : -1))
                              .join(", ")}
                          </span>
                        </p>
                    </div>
                </div>
                
                <div class="borders">
                    <h4 class="border-text">Borders Countries:</h4>
                    <div class='country-space'>
                      ${boundaries
                        .map(
                          (item) =>
                            `<a href='country.html?country=${item}'><button class='border'>${item}</button></a>`
                        )
                        .join("")}
                    </div>
                </div>
            </div>
        </div>
     `;

    mainBody.insertAdjacentHTML("beforeend", markup);
    loader.classList.add("hide");
  });
}

// function displayCountry(data) {
//   try {
//     mainBody.innerHTML = "";
//     loader.classList.remove("hide");
//     generateMarkUp(data);
//   } catch (err) {
//     loader.classList.add("hide");
//     errMsg(err);
//   }
// }
// window.addEventListener('hashchange', displayCountry)
// displayCountry();

backBtn.addEventListener("click", function () {
  // Go back to the previous page in the browser's history
  // window.history.back();
  window.location.href = "index.html";
});

darkModeBtn.addEventListener("click", function () {
  document.querySelectorAll(".color").forEach((el) => {
    el.classList.toggle("hide");
    // document.body.classList.toggle("dark-mode");
  });
  document.body.classList.toggle("dark-mode");
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
  // document.body.setAttribute('id', 'dark-mode')
});

console.log(window.location);

async function handleUrlChange() {
  // const code = window.location.search;
  // const country = code.slice(code.indexOf("=") + 1);
  const urlParams = new URLSearchParams(window.location.search);
  const country = urlParams.get("country");
  // console.log(country);

  mainBody.innerHTML = "";
  loader.classList.remove("hide");

  if (!country) return;

  const response = await updateCountryInfo(country);
  console.log(response);

  generateMarkUp(response);
}

async function updateCountryInfo(countryName) {
  try {
    mainBody.innerHTML = "";
    loader.classList.remove("hide");
    // const headers = new Headers();
    // headers.append("Cache-Control", "no-cache"); // Add this line to prevent caching

    // https://restcountries.com/v3.1/name/{name}
    const res = await fetch(`${API_URL}name/${countryName}`);
    console.log(res);
    const countryData = await res.json();
    console.log(countryData);

    if (!res.ok) throw new Error(`Omo!!!🔥 (${res.status})`);
    return countryData;
  } catch (err) {
    console.error(`${err.message}`)
  }
}

// ['popstate', 'load'].forEach(ev => window.addEventListener(ev, handleUrlChange));
window.addEventListener("popstate", handleUrlChange);
handleUrlChange();
