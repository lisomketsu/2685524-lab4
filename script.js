// ===============================
// GET REQUIRED ELEMENTS (BY ID)
// ===============================
const searchInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderContainer = document.getElementById('bordering-countries');
const errorBox = document.getElementById('error-message');


// ===============================
// EVENT LISTENERS
// ===============================
searchBtn.addEventListener('click', () => {
    handleSearch(searchInput.value.trim());
});

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch(searchInput.value.trim());
    }
});


// ===============================
// MAIN SEARCH FUNCTION
// ===============================
async function handleSearch(name) {

    if (!name) {
        showError("Please enter a country name.");
        return;
    }

    try {
        showLoading();
        clearUI();

        const country = await getCountry(name);
        renderCountry(country);

        if (country.borders && country.borders.length > 0) {
            await fetchBorders(country.borders);
        } else {
            borderContainer.innerHTML = "<p>No bordering countries.</p>";
            borderContainer.classList.remove('hidden');
        }

    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}


// ===============================
// FETCH MAIN COUNTRY
// ===============================
async function getCountry(countryName) {
    const url = `https://restcountries.com/v3.1/name/${countryName}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Country "${countryName}" not found.`);
    }

    const result = await response.json();
    return result[0]; // Return single country object
}


// ===============================
// RENDER COUNTRY INFO
// ===============================
function renderCountry(country) {

    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <img src="${country.flags.svg}" 
             alt="${country.name.common} flag" 
             style="width:100px;">
        <p><strong>Capital:</strong> 
            ${country.capital ? country.capital[0] : 'N/A'}
        </p>
        <p><strong>Population:</strong> 
            ${country.population.toLocaleString()}
        </p>
        <p><strong>Region:</strong> 
            ${country.region}
        </p>
    `;

    countryInfo.classList.remove('hidden');
}


// ===============================
// FETCH BORDER COUNTRIES
// ===============================
async function fetchBorders(codes) {

    borderContainer.innerHTML = '';

    // ✅ CORRECT API ENDPOINT
    const response = await fetch(
        `https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}`
    );

    const neighbors = await response.json();

    neighbors.forEach(neighbor => {
        const borderHTML = `
            <div>
                <img src="${neighbor.flags.svg}" 
                     alt="${neighbor.name.common} flag" 
                     width="50">
                <p>${neighbor.name.common}</p>
            </div>
        `;
        borderContainer.insertAdjacentHTML('beforeend', borderHTML);
    });

    borderContainer.classList.remove('hidden');
}


// ===============================
// UI HELPERS
// ===============================
function showLoading() {
    spinner.classList.remove('hidden');
}

function hideLoading() {
    spinner.classList.add('hidden');
}

function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

function clearUI() {
    errorBox.classList.add('hidden');
    countryInfo.classList.add('hidden');
    borderContainer.classList.add('hidden');
    borderContainer.innerHTML = '';
}