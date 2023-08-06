"use strict";

const mainBody = document.querySelector(".main_body");
const darkModeBtn = document.querySelector(".left-header");
const backBtn = document.getElementById("back-btn");
const loader = document.querySelector(".loader");
const errorHandler = document.querySelector(".error-handler");
console.log(errorHandler);

const API_URL = "https://restcountries.com/v3.1/";

let data = JSON.parse(localStorage.getItem("name")) || [];
console.log(data);

const screenMode = localStorage.getItem("darkMode") === "true";
console.log(screenMode);

window.onload = () => {
  screenMode
    ? document.body.classList.add("dark-mode")
    : document.body.classList.remove("dark-mode");
};

// Helpers
// const getJson = async function () {
//   try {
//     const res = await fetch(`${API_URL}all`);
//     if (!res.ok) throw new Error(`Oops`);
//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// let boundaries = [];
// const getBorderCountries = async function () {
//   const res = await fetch(`${API_URL}all`);
//   console.log(res);
//   const allData = await res.json();
//   console.log(allData);
//   console.log(data[0]);
//   // console.log(allData.borders);
//   // console.log(borders);
//   console.log(data[0]?.borders);
//   data[0]?.borders
//     ?.map((bord) => {
//       return (boundaries += allData.find((each) => each.cca3 === bord));
//     })
//     .join("");
//   console.log(boundaries);
//   console.log(boundaries[0]?.name.common);
//   // return `<a href='' class='border'>${}</a>`;
// };
// getBorderCountries();

// const allData = awiat getJson(`${API_URL}all`);
// console.log(allData);

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

const generateMarkUp = async function (data) {
  mainBody.innerHTML = "";
  loader.classList.remove("hide");

  const res = await fetch(`${API_URL}all`);
  console.log(res);
  const allData = await res.json();
  console.log(allData);
  console.log(data);
  // console.log(allData.borders);
  // console.log(borders);

  let boundaries = [];

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

    const currencyKeys = currencies && Object.keys(currencies);
    const languagesVal = languages && Object.values(languages);
    console.log(currencyKeys, languagesVal);

    console.log(borders);
    borders
      ?.map((bord) => {
        console.log(allData);
        return allData.find((each) => {
          if (each.cca3 === bord) boundaries.push(each.name.common);
        });
      })
      .join("");
    console.log(boundaries);
    console.log(boundaries?.name);

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
                      ${boundaries.map(
                        (item) => `<button class='border'>${item}</button>`
                      ).join('')}
                    </div>
                </div>
            </div>
        </div>
     `;

    mainBody.insertAdjacentHTML("beforeend", markup);
    loader.classList.add("hide");
  });
};

// const boundaries = function (data) {
//   let btn =``;
//   data.borders?
// }

function displayCountry() {
  try {
    generateMarkUp(data);
  } catch (err) {
    loader.classList.add("hide");
    errMsg(err);
  }
}
displayCountry();

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

// console.log(typeof(typeof x));
