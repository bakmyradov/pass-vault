import { useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  useUpdatePasswordMutation,
  useGetPasswordQuery,
} from "../slices/passwordsSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  service: yup.string().required("Service is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const UpdatePasswordModal = ({ onClose, passwordId }) => {
  const { data: selectedPassword, isFetching } = useGetPasswordQuery(
    passwordId,
    {
      skip: !passwordId,
    }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      service: "",
      username: "",
      password: "",
    },
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (selectedPassword) {
      reset({
        service: selectedPassword.service,
        username: selectedPassword.username,
        password: selectedPassword.password,
      });
    }
  }, [selectedPassword, reset]);

  const [updatePassword] = useUpdatePasswordMutation();

  const onSubmit = async (data) => {
    try {
      await updatePassword({
        passwordId,
        service: data.service,
        username: data.username,
        plaintextPassword: data.password,
      });
      toast.success("Password updated successfully");
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.error(error);
      onClose();
    }
  };

  if (isFetching) {
    return null;
  }

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

export default UpdatePasswordModal;
