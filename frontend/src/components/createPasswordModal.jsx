import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useAddPasswordMutation } from "../slices/passwordsSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  service: yup.string().required("Service is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const CreatePasswordModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const [addPassword] = useAddPasswordMutation();

  const onSubmit = async (data) => {
    try {
      await addPassword({
        service: data.service,
        username: data.username,
        plaintextPassword: data.password,
      });
      toast.success("Password created successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.error(error);
      onClose();
    }
  };
  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="service">Service</Label>
          <Input
            {...register("service")}
            placeholder="e.g. Google, Facebook, etc."
            name="service"
          />
          <p className="text-red-500 text-sm">{errors.service?.message}</p>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="username">Username</Label>
          <Input
            {...register("username")}
            name="username"
            placeholder="Enter username"
          />
          <p className="text-red-500 text-sm">{errors.username?.message}</p>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            {...register("password")}
            name="password"
            type="text"
            placeholder="Enter password"
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>
        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default CreatePasswordModal;
