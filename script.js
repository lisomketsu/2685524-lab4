
const searchInput = document.querySelector('#country-input');
const searchBtn = document.querySelector('#search-btn');
const spinner = document.querySelector('.spinner'); 
const errorBox = document.querySelector('.error');   
const countryInfo = document.getElementById('country-info');
const borderGrid = document.querySelector('.border-grid');


searchBtn.addEventListener('click', () => handleSearch(searchInput.value));

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch(searchInput.value);
    }
});


async function handleSearch(name) {
    if (!name) return;

    
    spinner.style.display = 'block';
    errorBox.textContent = '';
    countryInfo.innerHTML = '';
    borderGrid.innerHTML = '';

    try {
        const country = await getCountry(name);
        displayCountry(country);
        
        
        if (country.borders && country.borders.length > 0) {
            await fetchBorders(country.borders);
        } else {
            borderGrid.innerHTML = '<p>No bordering countries.</p>';
        }
    } catch (err) {
        errorBox.textContent = err.message; 
    } finally {
        spinner.style.display = 'none'; 
    }
}


async function getCountry(countryName) {
    
    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Country "${countryName}" not found.`);
    }
    
    const result = await response.json();
    return result[0]; 
}

function displayCountry(country) {
   
    countryInfo.innerHTML = `
        <div class="country-card">
            <img src="${country.flags.svg}" alt="${country.name.common} flag" style="width: 100%; border-radius: 8px;">
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
        </div>
    `;
}


async function fetchBorders(codes) {
    try {
       
        const url = ` https://restcountries.com/v3.1/alpha/{code}';
`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error("Could not load borders.");
        
        const neighbors = await response.json();

        neighbors.forEach(neighbor => {
            const borderItem = `
                <div class="border-item" style="padding: 10px; text-align: center;">
                    <img src="${neighbor.flags.svg}" alt="${neighbor.name.common}" width="50" style="display: block; margin: 0 auto;">
                    <span>${neighbor.name.common}</span>
                </div>`;
            borderGrid.insertAdjacentHTML('beforeend', borderItem);
        });
    } catch (err) {
        console.error("Border fetch error:", err);
        borderGrid.innerHTML = '<p>Error loading borders.</p>';
    }
}
