import React from "react";

const MovieCard = ({
  movie: { title, poster_path, original_language, release_date, vote_average },
}) => {
  return (
    <>
      <div className="flex flex-col lg:max-w-[280px] md:max-w-[230px] sm:max-w-[190px] max-w-[150px] w-full rounded-md  gap-2 md:p-4 p-2 bg-[#070f2c] ">
        {/* <img src={poster_path} alt="" /> */}

        <img
          className="rounded"
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "images/no_poster.png"
          }
          alt={title}
        />
        <p className=" text-sm text-start ">{title}</p>
        <div className="flex gap-1 items-center text-gray-500 text-sm">
          <img className="w-4 h-4" src="/images/star.png" alt="" />
          <p className="text-[#fff4db]">
            {vote_average ? vote_average.toFixed(1) : "N/A"}
          </p>
          <span>•</span>
          <p>{original_language}</p>
          <span>•</span>
          <p>{release_date ? release_date.split("-")[0] : "N/A"}</p>
        </div>
      </div>
    </>
  );
};

export default MovieCard;
