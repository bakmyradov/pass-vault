import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../../components/form-container";
import Input from "../../components/input";
import Button from "../../components/button";
import { useLoginMutation } from "../../slices/userApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
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
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Login</h1>
      <form onSubmit={submitHandler} className="w-96 shadow-2xl px-8 py-8">
        <Input
          value={data.email}
          name="email"
          label="Email"
          type="email"
          onChange={handleInputChange}
        />
        <Input
          value={data.password}
          name="password"
          label="Password"
          type="password"
          onChange={handleInputChange}
        />
        <Button disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default LoginPage;
