/* eslint-disable react/prop-types */
const Image = ({ url }) => {
  return (
    <>
      {url instanceof File || url instanceof Blob ? (
        <img
          src={URL.createObjectURL(url)}
          className="w-full h-full object-contain"
          onLoad={(e) => {
            if (e.target.src.startsWith("blob:")) {
              URL.revokeObjectURL(e.target.src);
            }
          }}
          alt="image"
        />
      ) : (
        <img src={url} alt="image" className="w-full h-full object-cover" />
      )}
    </>
  );
};

export default Image;
