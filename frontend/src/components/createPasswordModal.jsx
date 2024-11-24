import { useState } from "react";
import Input from "./input";
import Button from "./button";
import { useAddPasswordMutation } from "../slices/passwordsSlice";
import { toast } from "react-toastify";

const CreatePasswordModal = ({ onClose }) => {
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [plaintextPassword, setPassword] = useState("");

  const [addPassword] = useAddPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPassword({
        service,
        username,
        plaintextPassword,
      });

      setService("");
      setUsername("");
      setPassword("");
      toast.success("Password created successfully");
      onClose();
    } catch (error) {
        toast.error(error?.data?.message || error.message);
      console.error(error);
      onClose();
    }
  };
  return (
    <div className="modal bg-black/50 absolute top-0 left-0 w-screen h-screen z-[999] flex justify-center items-center">
      <div className="modal-content w-96 bg-gray-200 px-5 py-8">
        <div className="modal-header flex justify-between">
          <h1 className="text-2xl">Create Password</h1>
          <button onClick={onClose}>X</button>
        </div>
        <div className="mt-6">
          <form onSubmit={handleSubmit}>
            <Input
              label="Service"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Password"
              value={plaintextPassword}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit">Create</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePasswordModal;
