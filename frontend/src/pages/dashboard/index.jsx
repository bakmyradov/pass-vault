import { useState } from "react";
import {
  useUserPasswordsQuery,
  useGetPasswordQuery,
  useDeletePasswordMutation,
} from "../../slices/passwordsSlice";
import Input from "../../components/input";
import Button from "../../components/button";
import CreatePasswordModal from "../../components/createPasswordModal";
import ShowPasswordModal from "../../components/showPasswordModal";
import UpdatePasswordModal from "../../components/updatePasswordModal";

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatePassId, setUpdatePassId] = useState(null);
  const [selectedPasswordId, setSelectedPasswordId] = useState(null);

  const { data: passwords = [], isLoading, refetch } = useUserPasswordsQuery();

  const [deletePassword] = useDeletePasswordMutation();

  const { data: selectedPassword, isFetching: isFetchingPassword } =
    useGetPasswordQuery(selectedPasswordId, {
      skip: !selectedPasswordId,
    });

  if (isLoading) {
    return null;
  }
  return (
    <>
      <div className="min-h-screen px-20 flex py-10">
        <div className="w-full h-screen bg-black/10 px-8">
          <div className="top flex justify-between items-center mb-4 pt-4">
            <h1 className="text-2xl">Passwords</h1>
            <Button onClick={() => setIsModalOpen(true)}>Create</Button>
          </div>
          <Input hideLabel placeholder="Search passwords" />
          <div className="items">
            <div className="flex items-center justify-between mt-4 flex-col gap-y-4">
              {passwords.map((password) => (
                <div
                  key={password._id}
                  className="item px-4 py-2 bg-black/10 w-full flex justify-between"
                >
                  <div className="left">
                    <h1 className="text-lg font-bold">{password.service}</h1>
                    <p className="text-gray-500">
                      Credentials:
                      <span className="text-gray-700 ml-1">
                        {password.username}
                      </span>
                    </p>
                  </div>
                  <div className="right flex gap-x-4">
                    <button
                      className="text-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUpdatePassId(password._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deletePassword(password._id);
                        refetch();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-green-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPasswordId(password._id);
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {updatePassId && (
        <UpdatePasswordModal
          passwordId={updatePassId}
          onClose={() => {
            setUpdatePassId(null);
            refetch();
          }}
        />
      )}
      {selectedPasswordId && (
        <ShowPasswordModal
          isFetchingPassword={isFetchingPassword}
          selectedPassword={selectedPassword}
          onClose={() => setSelectedPasswordId(null)}
        />
      )}
      {isModalOpen && (
        <CreatePasswordModal
          onClose={() => {
            setIsModalOpen(false);
            refetch();
          }}
        />
      )}
    </>
  );
};

export default DashboardPage;
