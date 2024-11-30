import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "@/components/FormContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterMutation } from "@/slices/userApiSlice";
import { setCredentials } from "@/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// schema for registeration form validation passwords should match
const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password should be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
});

const RegisterPage = () => {
  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  });

  const submitHandler = async (data) => {
    try {
      const res = await register(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };
  return (
    <FormContainer>
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-96 flex flex-col gap-y-6"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                {...registerForm("email")}
                name="email"
                type="email"
                placeholder="Enter email"
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                {...registerForm("name")}
                name="name"
                type="text"
                placeholder="Enter name"
              />
              <p className="text-sm text-red-500">{errors.name?.message}</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                {...registerForm("password")}
                name="password"
                type="password"
                placeholder="Enter password"
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                {...registerForm("confirmPassword")}
                name="confirmPassword"
                type="password"
                placeholder="Confirm password"
              />
              <p className="text-sm text-red-500">
                {errors.confirmPassword?.message}
              </p>
            </div>
            <Button disabled={isLoading}>
              {isLoading ? "Loading..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </FormContainer>
  );
};

export default RegisterPage;
