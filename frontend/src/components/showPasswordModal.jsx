const showPasswordModal = ({ isFetchingPassword, selectedPassword }) => {
  return (
    <div className="w-full">
      {isFetchingPassword ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-4 w-full">
          <p>
            Username:
            <span className="text-gray-700 font-mono font-bold ml-1 break-words">
              {selectedPassword?.username}
            </span>
          </p>
          <p>
            Password:
            <span className="text-gray-700 font-mono font-bold ml-1 break-words">
              {selectedPassword?.password}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default showPasswordModal;
