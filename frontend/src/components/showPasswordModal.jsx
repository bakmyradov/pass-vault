const showPasswordModal = ({
  isFetchingPassword,
  selectedPassword,
  onClose,
}) => {
  return (
    <div className="modal bg-black/50 absolute top-0 left-0 w-screen h-screen z-[999] flex justify-center items-center">
      <div className="modal-content w-96 bg-gray-200 px-5 py-5">
        <div className="modal-header flex justify-between">
          <h1 className="text-2xl">{selectedPassword?.service}</h1>
          <button onClick={onClose}>X</button>
        </div>
        {isFetchingPassword ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-4">
            <p>
              Password:
              <span className="text-gray-700 font-mono font-bold ml-1">
                {selectedPassword?.password}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default showPasswordModal;
