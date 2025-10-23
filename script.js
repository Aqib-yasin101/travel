// Travel Recommendations JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Check if elements exist (they might not be on all pages)
    if (searchInput && searchBtn && resetBtn) {
        // Event listeners
        searchBtn.addEventListener('click', performSearch);
        resetBtn.addEventListener('click', resetSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Function to perform search
    async function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            alert('Please enter a search term');
            return;
        }
        
        try {
            console.log('Searching for:', searchTerm);
            
            // Show loading message
            showLoadingMessage('Searching...');
            
            // Fetch data from JSON file
            const response = await fetch('travel_recommendation_api.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Fetched data:', data);
            
            // Filter recommendations based on search term with keyword variations
            const filteredRecommendations = data.recommendations.filter(rec => {
                return matchesKeyword(rec, searchTerm);
            });
            
            console.log('Filtered results:', filteredRecommendations);
            
            // Hide loading message
            hideLoadingMessage();
            
            // Display results
            displayResults(filteredRecommendations);
            
        } catch (error) {
            console.error('Error fetching data:', error);
            hideLoadingMessage();
            showLoadingMessage('Error loading data');
            setTimeout(() => {
                hideLoadingMessage();
            }, 2000);
            alert('Error loading travel recommendations. Please try again.');
        }
    }
    
    // Function to match keywords with variations
    function matchesKeyword(rec, searchTerm) {
        // Convert all text to lowercase for comparison
        const name = rec.name.toLowerCase();
        const country = rec.country.toLowerCase();
        const category = rec.category.toLowerCase();
        const description = rec.description.toLowerCase();
        
        // Define keyword variations
        const keywordVariations = {
            // Beach variations
            'beach': ['beach', 'beaches', 'coastal', 'seaside', 'shore', 'seashore', 'ocean', 'sea'],
            'beaches': ['beach', 'beaches', 'coastal', 'seaside', 'shore', 'seashore', 'ocean', 'sea'],
            'coastal': ['beach', 'beaches', 'coastal', 'seaside', 'shore', 'seashore', 'ocean', 'sea'],
            'seaside': ['beach', 'beaches', 'coastal', 'seaside', 'shore', 'seashore', 'ocean', 'sea'],
            
            // Temple variations
            'temple': ['temple', 'temples', 'shrine', 'shrines', 'religious', 'sacred', 'spiritual', 'monastery'],
            'temples': ['temple', 'temples', 'shrine', 'shrines', 'religious', 'sacred', 'spiritual', 'monastery'],
            'shrine': ['temple', 'temples', 'shrine', 'shrines', 'religious', 'sacred', 'spiritual', 'monastery'],
            'religious': ['temple', 'temples', 'shrine', 'shrines', 'religious', 'sacred', 'spiritual', 'monastery'],
            
            // Mountain variations
            'mountain': ['mountain', 'mountains', 'peak', 'peaks', 'alpine', 'hiking', 'trekking', 'summit'],
            'mountains': ['mountain', 'mountains', 'peak', 'peaks', 'alpine', 'hiking', 'trekking', 'summit'],
            'hiking': ['mountain', 'mountains', 'peak', 'peaks', 'alpine', 'hiking', 'trekking', 'summit'],
            'alpine': ['mountain', 'mountains', 'peak', 'peaks', 'alpine', 'hiking', 'trekking', 'summit'],
            
            // Adventure variations
            'adventure': ['adventure', 'adventurous', 'exciting', 'thrilling', 'extreme', 'outdoor', 'sports'],
            'adventurous': ['adventure', 'adventurous', 'exciting', 'thrilling', 'extreme', 'outdoor', 'sports'],
            'exciting': ['adventure', 'adventurous', 'exciting', 'thrilling', 'extreme', 'outdoor', 'sports'],
            
            // Romantic variations
            'romantic': ['romantic', 'romance', 'couple', 'honeymoon', 'intimate', 'love', 'couples'],
            'romance': ['romantic', 'romance', 'couple', 'honeymoon', 'intimate', 'love', 'couples'],
            'honeymoon': ['romantic', 'romance', 'couple', 'honeymoon', 'intimate', 'love', 'couples'],
            'couple': ['romantic', 'romance', 'couple', 'honeymoon', 'intimate', 'love', 'couples'],
            
            // Cultural variations
            'cultural': ['cultural', 'culture', 'traditional', 'heritage', 'historical', 'ancient', 'history'],
            'culture': ['cultural', 'culture', 'traditional', 'heritage', 'historical', 'ancient', 'history'],
            'traditional': ['cultural', 'culture', 'traditional', 'heritage', 'historical', 'ancient', 'history'],
            'heritage': ['cultural', 'culture', 'traditional', 'heritage', 'historical', 'ancient', 'history'],
            
            // Relaxation variations
            'relaxation': ['relaxation', 'relaxing', 'peaceful', 'calm', 'serene', 'tranquil', 'spa', 'wellness'],
            'relaxing': ['relaxation', 'relaxing', 'peaceful', 'calm', 'serene', 'tranquil', 'spa', 'wellness'],
            'peaceful': ['relaxation', 'relaxing', 'peaceful', 'calm', 'serene', 'tranquil', 'spa', 'wellness'],
            'spa': ['relaxation', 'relaxing', 'peaceful', 'calm', 'serene', 'tranquil', 'spa', 'wellness']
        };
        
        // Get variations for the search term
        const variations = keywordVariations[searchTerm] || [searchTerm];
        
        // Check if any variation matches in any field
        for (let variation of variations) {
            if (name.includes(variation) || 
                country.includes(variation) || 
                category.includes(variation) || 
                description.includes(variation)) {
                return true;
            }
        }
        
        // Also check for partial matches and common synonyms
        const commonSynonyms = {
            'beach': ['coastal', 'seaside', 'shore', 'ocean'],
            'temple': ['shrine', 'religious', 'sacred'],
            'mountain': ['peak', 'alpine', 'hiking'],
            'adventure': ['exciting', 'thrilling', 'outdoor'],
            'romantic': ['couple', 'honeymoon', 'intimate'],
            'cultural': ['traditional', 'heritage', 'historical'],
            'relaxation': ['peaceful', 'calm', 'spa']
        };
        
        // Check for synonyms
        for (let [key, synonyms] of Object.entries(commonSynonyms)) {
            if (searchTerm.includes(key)) {
                for (let synonym of synonyms) {
                    if (name.includes(synonym) || 
                        country.includes(synonym) || 
                        category.includes(synonym) || 
                        description.includes(synonym)) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    // Function to get time zone for a country
    function getTimeZone(country) {
        const timeZones = {
            'Greece': 'Europe/Athens',
            'Japan': 'Asia/Tokyo',
            'Canada': 'America/Toronto',
            'Indonesia': 'Asia/Jakarta',
            'Peru': 'America/Lima',
            'Switzerland': 'Europe/Zurich',
            'Maldives': 'Indian/Maldives',
            'Cambodia': 'Asia/Phnom_Penh',
            'United States': 'America/New_York',
            'Myanmar': 'Asia/Yangon'
        };
        return timeZones[country] || 'UTC';
    }
    
    // Function to get current time in a specific timezone
    function getCurrentTime(country) {
        const timeZone = getTimeZone(country);
        const options = { 
            timeZone: timeZone, 
            hour12: true, 
            hour: 'numeric', 
            minute: 'numeric', 
            second: 'numeric',
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        };
        
        try {
            const currentTime = new Date().toLocaleTimeString('en-US', options);
            const currentDate = new Date().toLocaleDateString('en-US', { 
                timeZone: timeZone,
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            return { time: currentTime, date: currentDate, timeZone: timeZone };
        } catch (error) {
            console.error(`Error getting time for ${country}:`, error);
            return { time: 'N/A', date: 'N/A', timeZone: timeZone };
        }
    }
    
    // Function to display search results
    function displayResults(recommendations) {
        // Remove existing results if any
        const existingResults = document.getElementById('searchResults');
        if (existingResults) {
            existingResults.remove();
        }
        
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'searchResults';
        resultsContainer.style.cssText = `
            margin: 2rem auto;
            max-width: 1200px;
            padding: 0 2rem;
        `;
        
        if (recommendations.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 10px;">
                    <h3>No recommendations found</h3>
                    <p>Try searching with different keywords or browse our featured destinations.</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <h2 style="text-align: center; margin-bottom: 2rem; color: #333;">
                    Found ${recommendations.length} recommendation(s)
                </h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
                    ${recommendations.map(rec => {
                        const timeInfo = getCurrentTime(rec.country);
                        return `
                        <div style="background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
                            <img src="${rec.imageUrl}" alt="${rec.name}" style="width: 100%; height: 250px; object-fit: cover;">
                            <div style="padding: 1.5rem;">
                                <h3 style="color: #333; margin-bottom: 0.5rem; font-size: 1.5rem;">${rec.name}</h3>
                                <p style="color: #007bff; font-weight: bold; margin-bottom: 0.5rem;">${rec.country}</p>
                                <p style="color: #666; margin-bottom: 1rem; line-height: 1.5;">${rec.description}</p>
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                    <span style="background: #e9ecef; padding: 0.25rem 0.75rem; border-radius: 15px; font-size: 0.9rem; color: #495057;">${rec.category}</span>
                                    <span style="color: #28a745; font-weight: bold;">${rec.priceRange}</span>
                                </div>
                                <p style="color: #666; font-size: 0.9rem; margin-bottom: 0.5rem;"><strong>Best Time:</strong> ${rec.bestTime}</p>
                                <div style="background: #f8f9fa; padding: 0.75rem; border-radius: 5px; margin-top: 1rem; border-left: 4px solid #007bff;">
                                    <p style="color: #333; font-size: 0.9rem; margin: 0; font-weight: bold;">🕐 Current Time in ${rec.country}</p>
                                    <p style="color: #007bff; font-size: 0.85rem; margin: 0.25rem 0 0 0;">${timeInfo.time} (${timeInfo.date})</p>
                                    <p style="color: #666; font-size: 0.8rem; margin: 0.25rem 0 0 0;">Timezone: ${timeInfo.timeZone}</p>
                                </div>
                            </div>
                        </div>
                    `;
                    }).join('')}
                </div>
            `;
        }
        
        // Add results to page
        const main = document.querySelector('main');
        if (main) {
            main.appendChild(resultsContainer);
        } else {
            // If no main element, add to body
            document.body.appendChild(resultsContainer);
        }
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Start time updates every second
        startTimeUpdates();
    }
    
    // Function to start time updates
    function startTimeUpdates() {
        // Clear any existing interval
        if (window.timeUpdateInterval) {
            clearInterval(window.timeUpdateInterval);
        }
        
        // Update time every second
        window.timeUpdateInterval = setInterval(() => {
            updateTimeDisplays();
        }, 1000);
    }
    
    // Function to update time displays
    function updateTimeDisplays() {
        const timeDisplays = document.querySelectorAll('[data-time-zone]');
        timeDisplays.forEach(display => {
            const timeZone = display.getAttribute('data-time-zone');
            const country = display.getAttribute('data-country');
            const timeInfo = getCurrentTime(country);
            
            const timeElement = display.querySelector('.current-time');
            const dateElement = display.querySelector('.current-date');
            
            if (timeElement) timeElement.textContent = timeInfo.time;
            if (dateElement) dateElement.textContent = timeInfo.date;
        });
    }
    
    // Function to reset/clear search
    function resetSearch() {
        // Clear the search input
        searchInput.value = '';
        
        // Clear time update interval
        if (window.timeUpdateInterval) {
            clearInterval(window.timeUpdateInterval);
        }
        
        // Remove existing results
        const existingResults = document.getElementById('searchResults');
        if (existingResults) {
            existingResults.remove();
        }
        
        // Show loading message briefly
        showLoadingMessage('Results cleared');
        
        // Hide loading message after 1 second
        setTimeout(() => {
            hideLoadingMessage();
        }, 1000);
        
        console.log('Search reset - all results cleared');
        
        // Optional: Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Function to show loading/status message
    function showLoadingMessage(message) {
        // Remove existing loading message if any
        hideLoadingMessage();
        
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'statusMessage';
        loadingDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 1000;
            font-weight: bold;
            animation: slideIn 0.3s ease;
        `;
        loadingDiv.textContent = message;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(loadingDiv);
    }
    
    // Function to hide loading/status message
    function hideLoadingMessage() {
        const loadingDiv = document.getElementById('statusMessage');
        if (loadingDiv) {
            loadingDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (loadingDiv.parentNode) {
                    loadingDiv.remove();
                }
            }, 300);
        }
    }
    
    // Function to load and display all recommendations on page load
    async function loadAllRecommendations() {
        try {
            console.log('Loading all recommendations...');
            
            const response = await fetch('travel_recommendation_api.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('All recommendations loaded:', data);
            
            // Display all recommendations
            displayResults(data.recommendations);
            
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }
    
    // Load all recommendations when page loads (for home page)
    if (window.location.pathname.includes('travel_recommendation.html') || 
        window.location.pathname.includes('index.html') || 
        window.location.pathname === '/') {
        loadAllRecommendations();
    }
});

// Additional utility functions
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 1000;
    `;
    loadingDiv.textContent = 'Loading...';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}