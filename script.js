function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const movieList = document.getElementById('movieList');
    const movieDetails = document.getElementById('movieDetails');

    async function fetchMovies(searchTerm) {
        const apiKey = 'YOUR_OMDB_API_KEY';
        const url = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.Search || []; // Array of movie objects or empty array
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    }

    function displayMovies(movies) {
        movieList.innerHTML = ''; // Clear previous results
        movies.forEach(movie => {
            const movieTitle = document.createElement('div');
            movieTitle.classList.add('movie-list-item');
            movieTitle.textContent = movie.Title;
            movieList.appendChild(movieTitle);

            // Add click event listener to show movie details
            movieTitle.addEventListener('click', async () => {
                const details = await fetchMovieDetails(movie.imdbID);
                displayMovieDetails(details);
            });
        });
    }

    async function fetchMovieDetails(movieId) {
        const apiKey = 'YOUR_OMDB_API_KEY';
        const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data; // Movie details object
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return null;
        }
    }

    function displayMovieDetails(movie) {
        if (movie) {
            const { Title, Year, Plot, Poster } = movie;
            movieDetails.innerHTML = `
                <h2>${Title} (${Year})</h2>
                <img src="${Poster}" alt="${Title} Poster">
                <p>${Plot}</p>
            `;
        } else {
            movieDetails.innerHTML = 'Movie details not found.';
        }
    }

    const debouncedSearch = debounce(async function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length > 2) { // Minimum characters to trigger search
            const movies = await fetchMovies(searchTerm);
            displayMovies(movies);
        }
    }, 500); // Adjust delay as per your needs (milliseconds)

    searchInput.addEventListener('input', debouncedSearch);
});
