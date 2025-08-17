import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebouncedSearch(search), 800, [search]);

  const fetchMovies = async (query = "") => {
    if (query.trim() === "") {
      // Initial load – get popular movies
      query = "";
    }
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === false) {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Fetching movie error:${error}`);
      setErrorMessage("Error Fetching Movies. Please try again later! ");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearch.trim());
  }, [debouncedSearch]);

  const updateSearchCount = async (searchTerm, movie) => {
    try {
      // const response = await fetch("http://localhost:5000/api/search", {
      const response = await fetch(
        "https://moviez-backend-sak6.onrender.com/api/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            searchTerm,
            movie_id: movie.id,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ Failed to update search count:", data.error);
      } else {
        console.log("✅ Search trend updated:", data);
      }

      return data;
    } catch (error) {
      console.error("❌ Error updating search count:", error);
    }
  };

  const getTrendingMovies = async () => {
    try {
      const res = await fetch(
        "https://moviez-backend-sak6.onrender.com/api/trending-movies"
      );
      // const res = await fetch("http://localhost:5000/api/trending-movies");
      if (!res.ok) {
        throw new Error(`HTTP error! Status:${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log("Error Fetching trending movies", err);
      return [];
    }
  };
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
      setTrendingMovies([]);
    }
  };
  useEffect(() => {
    loadTrendingMovies();
  }, []);
  return (
    <main className="w-full max-h-screen h-full ">
      <div className="bg-[url(/images/bg.png)] bg-cover bg-center flex flex-col  mx-auto  h-full gap-2  px-4">
        <img
          className="bg-cover bg-center w-full  lg:max-w-[600px] max-w-full mx-auto drop-shadow-md px-6"
          src="/images/hero-img.png"
          alt=""
        />
        <h1 className="text-white text-4xl mx-auto text-center w-full max-w-[405px]  lg:max-w-[500px]">
          Find{" "}
          <span className="bg-gradient-to-r from-[#D6C7FF] to-[#AB8BFF]  bg-clip-text text-transparent">
            Movies
          </span>{" "}
          You’ll Love Without the Hassle
        </h1>
        <Search search={search} setSearch={setSearch} />
        {/* <h1 className="text-white">{search}</h1> */}

        {Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
          <div className="trending xl:max-w-[1320px] lg:max-w-4xl md:max-w-3xl sm:max-w-[120vw] max-w-[96vw] mx-auto px-8 mt-6">
            <h2 className="text-white mb-4 pl-4">Top 10 Trending Movies</h2>
            <div className=" w-full overflow-x-auto hide-scrollbar-x px-5 overflow-y-hidden ">
              <ul className=" flex gap-10 px-10 py-4  min-w-full">
                {trendingMovies.map((movie, index) => (
                  <li
                    className="flex flex-row  min-w-[220px] lg:min-w-[240px]  relative  hover:scale-110 duration-300"
                    key={movie._id}
                  >
                    <p className="bebas flex  items-end h-fit min-h-[200px] w-[100px] absolute -bottom-9 -left-13 z-0">
                      {index + 1}
                    </p>
                    <img
                      className="max-h-[220px] max-w-[170px] lg:max-h-[260px]  w-full h-full rounded-xl z-10"
                      src={movie.poster_url}
                      alt={movie.searchTerm}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <section className="flex flex-col justify-center mx-auto py-12  items-center">
        <h2 className="text-white mb-4">ALL MOVIES</h2>
        {/* <h1 className="text-white">{{ fetchTrendingMovies. }}</h1> */}
        {isloading ? (
          <Spinner />
        ) : errorMessage ? (
          <p className="text-red-500">{errorMessage}`</p>
        ) : (
          <ul className="flex flex-wrap lg:max-w-[1320px] justify-center md:max-w-4xl sm:max-w-3xl max-w-xl w-full gap-4">
            {movieList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
export default App;
