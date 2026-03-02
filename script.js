const searchInput = document.querySelector('#country-input');
const searchBtn = document.querySelector('#search-btn');

// Trigger on Click
searchBtn.addEventListener('click', () => handleSearch(searchInput.value));

// Trigger on Enter Key
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch(searchInput.value);
    }
});


async function getCountry(countryName) {
    const url = `https://restcountries.com/v3.1/name/${countryName}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Country "${countryName}" not found.`);
    }
    
    const result = await response.json();
    return result[0]; 
}


async function handleSearch(name) {
    spinner.style.display = 'block'; 
    errorBox.textContent = '';       

    try {
        const data = await getCountry(name); // Call the fetcher
        renderCountry(data);                // Show the card
    } catch (err) {
        errorBox.textContent = err.message;  // Show the error
    } finally {
        spinner.style.display = 'none';      // Always hide spinner
    }
}

function renderCountry(country) {
    const container = document.querySelector('.country-card');
    container.innerHTML = `
        <img src="${country.flags.svg}" alt="Flag" class="flag">
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    `;
    
    // Call next requirement: Bordering countries
    if (country.borders) {
        fetchBorders(country.borders);
    }
}

async function fetchBorders(codes) {
    const borderContainer = document.querySelector('.border-grid');
    borderContainer.innerHTML = ''; // Clear previous borders

    // Fetch all borders at once using the comma-separated codes
    const response = await fetch(`https://restcountries.com{codes.join(',')}`);
    const neighbors = await response.json();

    neighbors.forEach(neighbor => {
        const borderItem = `
            <div class="border-item">
                <img src="${neighbor.flags.svg}" width="30">
                <span>${neighbor.name.common}</span>
            </div>`;
        borderContainer.insertAdjacentHTML('beforeend', borderItem);
    });
}
function displayCountry(country) {
    const infoContainer = document.getElementById('country-info');

    // 1. Clear any previous search results or errors
    infoContainer.innerHTML = '';

    // 2. Build the HTML string using Template Literals
    // Note: Use a ternary operator (?) to check if capital exists
    const countryHTML = `
        <div class="country-card">
            <img src="${country.flags.svg}" alt="${country.name.common} flag" style="width: 100%; border-radius: 8px;">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
        </div>
    `;

    // 3. Inject the HTML into the container
    infoContainer.innerHTML = countryHTML;
}

async function handleSearch(name) {
    // Show spinner logic here...
    
    try {
        const data = await getCountry(name); // Your fetch function
        if (data && data.length > 0) {
            displayCountry(data[0]); // Pass the first country object
        }
    } catch (error) {
        // Show error logic here...
    } finally {
        // Hide spinner logic here...
    }
}

