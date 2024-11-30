import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "@/components/FormContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLoginMutation } from "@/slices/userApiSlice";
import { setCredentials } from "@/slices/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginPage = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  const submitHandler = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <FormContainer>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="w-96 flex flex-col gap-y-6"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                {...register("email")}
                name="email"
                type="email"
                placeholder="Enter email"
              />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                {...register("password")}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
              />
              <p className="text-sm text-red-500">{errors.password?.message}</p>
            </div>
            <Button disabled={isLoading} className={"mt-2"}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </FormContainer>
  );
};

export default LoginPage;
