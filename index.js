const parentElement = document.querySelector(".main")
const searchInput = document.querySelector(".input")
const movieRating = document.querySelector("#rating-select")
const movieGenre = document.querySelector("#genre-select")
let searchValue = "";
let ratings = 0;
let genre = "";
let filteredArrOfMovies = [];
const URL = "https://movies-app.prakashsakari.repl.co/api/movies";
const getMovies = async (url)=> {
    try{
    const {data} = await axios.get(url);
    return data;
     }catch(err){

     }
}
const movies = await getMovies(URL);
console.log(movies);

// creating card component
const createElement = (element) => document.createElement(element);

// creating card 

const createMovieCard = (movies) =>{
     for( let movie of movies ){
        // creating parent container 
        const cardContainer = createElement('div');
        cardContainer.classList.add("card","shadow");

        // creating image container
        const imageContainer = createElement('div');
        imageContainer.classList.add("card-image-container");

        // creating card image 
        const imageEle = createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src",movie.img_link);
        imageEle.setAttribute("alt",movie.name);
        imageContainer.appendChild(imageEle);

        cardContainer.appendChild(imageContainer);

        // creating movie-detail's container
        const movieContainer = createElement("div");
        movieContainer.classList.add("movie-details");
        // movie title
        const movieTitle = createElement("p");
        movieTitle.classList.add("title");
        movieTitle.innerText = movie.name;
        movieContainer.appendChild(movieTitle);

        // movie genre
        const movieGenre = createElement("p");
        movieGenre.classList.add("genre");
        movieGenre.innerText = `Genre : ${movie.genre}`;
        movieContainer.appendChild(movieGenre);

        // movie rating
        const movieRating = createElement("div");
        movieRating.classList.add("ratings");

        // rating component
        const ratingEle = createElement("div");
        ratingEle.classList.add("star-rating");

        //star icon
        const starIcon = createElement("span");
        starIcon.classList.add("material-symbols-outlined");
        starIcon.innerText = "star";
        ratingEle.appendChild(starIcon);

        // rating value

        const ratingValue = createElement("span");
        ratingValue.innerText = movie.imdb_rating;
        ratingEle.appendChild(ratingValue);

        movieRating.appendChild(ratingEle);
        
        // length
        const length = createElement('p');
        length.innerText = `${movie.duration} mins`;
        
        movieRating.appendChild(length);
        movieContainer.appendChild(movieRating);
        cardContainer.appendChild(movieContainer);
        parentElement.appendChild(cardContainer);
     }
}
function getFilteredData (){
     filteredArrOfMovies = searchValue?.length >0 
     ? movies.filter(movie => movie.name.toLowerCase() === searchValue || 
     searchValue === movie.director_name.toLowerCase() || 
     movie.writter_name.toLowerCase().split(",").includes(searchValue) 
     || movie.cast_name.toLowerCase().split(',').includes(searchValue))
     : movies;
     // implementing rating filter -- you have to check wheter search value is there or not acc. to this rating filter can be applied
    if( ratings > 0 ){
       filteredArrOfMovies = searchValue?.length>0 ? filteredArrOfMovies : movies
       filteredArrOfMovies = filteredArrOfMovies.filter( (movie) =>
            movie.imdb_rating >= ratings
       )
     }
     if( genre ?.length > 0 ){
          filteredArrOfMovies = searchValue?.length>0  || ratings > 7 ? filteredArrOfMovies : movies
          filteredArrOfMovies = filteredArrOfMovies.filter( movie => movie.genre.includes(genre));
     }
     return filteredArrOfMovies;
}
// implementing search input
function HandleInputChange(event){
     searchValue = event.target.value.toLowerCase();
     console.log(searchValue);
     let filterBySearch = getFilteredData();
     parentElement.innerHTML = "";
     createMovieCard(filterBySearch);
}
function debounce(callback,delay){
  let timerId;
  return (...args)=>{
     clearTimeout(timerId);
     timerId = setTimeout( ()=>{callback(...args)},delay)
  }   
}
function handleRatingSelector(event){
   ratings = event.target.value;
   let filterByRating = getFilteredData();
   console.log(filterByRating)
   parentElement.innerHTML = "";
   createMovieCard(ratings ? filterByRating : movies);
}
function handleGenreSelect (event) {
     genre = event.target.value;
     let filterByGenre = getFilteredData();
     parentElement.innerHTML = "";
     createMovieCard(genre ? filterByGenre : movies);
}
const debouncedInput = debounce(HandleInputChange,500)
searchInput.addEventListener("keyup",debouncedInput);
movieRating.addEventListener("change",handleRatingSelector);
// filter by genre
// first creating single array of genre
const genres = movies.reduce( (acc,curr) => {
     let genresArray = [];
     let tempgenrearr = curr.genre.split(",");
     acc = [...acc,...tempgenrearr];
     for( let genre of acc ){
       if(!genresArray.includes(genre)){
          genresArray = [...genresArray,genre];
       }
     }
     return genresArray;
},[])
// now creating genre's drop-down
for( let genre of genres ){
     const option = createElement('option');
     option.classList.add("option");
     option.setAttribute('value',genre);
     option.innerText = genre;
     movieGenre.appendChild(option);
}
movieGenre.addEventListener('change',handleGenreSelect);
createMovieCard(movies)