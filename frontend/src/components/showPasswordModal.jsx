import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import {
  useUpdatePasswordMutation,
  useDeletePasswordMutation,
} from "@/slices/passwordsSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  service: yup.string().required("Service is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const ShowPasswordModal = ({
  isFetchingPassword,
  selectedPassword,
  selectedPasswordId,
  refetch,
}) => {
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

  const [updatePassword] = useUpdatePasswordMutation();
  const [deletePassword] = useDeletePasswordMutation();

  useEffect(() => {
    if (selectedPassword) {
      reset({
        service: selectedPassword.service,
        username: selectedPassword.username,
        password: selectedPassword.password,
      });
    }
  }, [selectedPassword, reset]);

  const [isUpdate, setIsUpdate] = useState(false);

  const onSubmit = async (data) => {
    try {
      await updatePassword({
        passwordId: selectedPasswordId,
        service: data.service,
        username: data.username,
        plaintextPassword: data.password,
      }).unwrap();

      toast.success("Password updated successfully", {
        position: "bottom-right",
      });
      setIsUpdate(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full pb-20">
      {isFetchingPassword ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
          <div className="mt-8 w-full flex flex-col h-full">
            <div className="flex flex-col gap-y-4">
              {isUpdate && (
                <div className="w-full relative">
                  <Label htmlFor="service">Service</Label>
                  <Input {...register("service")} type="text" name="service" />
                  <p className="text-sm text-red-500">
                    {errors.service?.message}
                  </p>
                </div>
              )}
              <div className="w-full relative">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <Input
                    {...register("username")}
                    type="text"
                    name="username"
                    readOnly={!isUpdate}
                  />
                  {!isUpdate && (
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedPassword.username,
                        );
                        toast.success("Username copied to clipboard", {
                          position: "bottom-right",
                        });
                      }}
                      size="icon"
                      className={
                        "absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-7 h-7"
                      }
                      type="button"
                    >
                      <CopyIcon />
                    </Button>
                  )}
                  <p className="text-sm text-red-500">
                    {errors.username?.message}
                  </p>
                </div>
              </div>
              <div className="w-full relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    {...register("password")}
                    type="text"
                    name="password"
                    readOnly={!isUpdate}
                  />
                  {!isUpdate && (
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedPassword.password,
                        );
                        toast.success("Password copied to clipboard", {
                          position: "bottom-right",
                        });
                      }}
                      size="icon"
                      className={
                        "absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-7 h-7"
                      }
                      type="button"
                    >
                      <CopyIcon />
                    </Button>
                  )}
                  <p className="text-sm text-red-500">
                    {errors.password?.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex mt-auto gap-x-6">
              {!isUpdate ? (
                <>
                  <Button
                    className={"w-full"}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsUpdate(true);
                    }}
                    type="button"
                  >
                    Update
                  </Button>
                  <Button
                    className={"w-full bg-red-500"}
                    onClick={async (e) => {
                      e.preventDefault();
                      await deletePassword(selectedPasswordId);
                    }}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button className={"w-full"} type="submit">
                    Save
                  </Button>
                  <Button
                    className={"w-full bg-gray-500"}
                    onClick={() => setIsUpdate(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default ShowPasswordModal;
