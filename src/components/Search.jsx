const Search = ({ search, setSearch }) => {
  return (
    <>
      <div className=" bg-[#0F0D23] flex flex-row max-w-[500px] w-full mx-auto p-[1em] gap-2 rounded ">
        <img src="/images/search.svg" alt="" />
        <input
          onChange={(e) => setSearch(e.target.value)}
          className="text-[#A8B5DB] outline-none w-[inherit]"
          placeholder="Search here"
          value={search}
        />
      </div>
    </>
  );
};

export default Search;
