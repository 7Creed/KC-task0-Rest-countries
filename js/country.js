"use strict";

const mainBody = document.querySelector(".main_body");
const backBtn = document.getElementById("back-btn");

const API_URL = "https://restcountries.com/v3.1/";

let data = JSON.parse(localStorage.getItem("name")) || [];
console.log(data);
console.log("nameObj");

// Helpers
const getJson = async function (url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (error) {}
};

// const arrAll =await getJson(`${API_URL}all`)
// console.log(arrAll);

function extractCommonName(params) {
  const nativeName = params.nativeName;
  for (const languageCode in nativeName) {
    if (nativeName[languageCode].common) {
      return nativeName[languageCode].common;
    }
  }
  return null;
}
// const commonName = extractCommonName(name)
// console.log(commonName);

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

    const currencyKeys = currencies && Object.keys(currencies);
    const languagesVal = languages && Object.values(languages);
    console.log(currencyKeys, languagesVal);

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
            <div class="text">
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
                
                <div>
                    <h4 className="">Borders Countries:</h4>
                    <div>
                        ${borders?.map((bord) => {
                        console.log(bord);
                        })}
                    </div>
                </div>
            </div>
        </div>
     `;

    //  arrAll.find(prop => console.log(prop.cca3))
    mainBody.insertAdjacentHTML("beforeend", markup);
  });
};
generateMarkUp(data);

backBtn.addEventListener("click", function() {
  // Go back to the previous page in the browser's history
  window.history.back();
  // window.location.href = 'index.html'
});

// console.log(typeof(typeof x));