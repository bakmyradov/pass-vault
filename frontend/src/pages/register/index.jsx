import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../../components/form-container";
import Input from "../../components/input";
import Button from "../../components/button";
import { useRegisterMutation } from "../../slices/userApiSlice";
import { setCredentials } from "../../slices/authSlice";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

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
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Register</h1>
      <form onSubmit={submitHandler} className="w-96 shadow-2xl px-8 py-8">
        <Input
          value={data.email}
          name="email"
          label="Email"
          type="email"
          onChange={handleInputChange}
        />
        <Input
          value={data.name}
          name="name"
          label="Name"
          type="text"
          onChange={handleInputChange}
        />
        <Input
          value={data.password}
          name="password"
          label="Password"
          type="password"
          onChange={handleInputChange}
        />
        <Input
          value={data.confirmPassword}
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          onChange={handleInputChange}
        />
        <Button disabled={isLoading}>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default RegisterPage;
