import { useSelector } from "react-redux";

const DashboardPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Welcome to the Dashboard
      </h1>
      <p className="text-gray-700">Logged in as: {userInfo.name}</p>
    </div>
  );
};

export default DashboardPage;
