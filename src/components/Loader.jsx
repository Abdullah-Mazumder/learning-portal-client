import loader from "../image/loader.gif";

const Loader = () => {
  return (
    <div className="flex w-full justify-center">
      <img className="w-6 h-6" src={loader} alt="loader" />
    </div>
  );
};

export default Loader;
