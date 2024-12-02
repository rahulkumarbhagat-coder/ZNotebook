import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import notesContext from "../context/notes/noteContext";

const Login = () => {
  //alerts context api
  const context = useContext(notesContext);
  const { showAlert } = context;

  //defining useNavigation
  let navigate = useNavigate();

  //defining credentials
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  //defining onChange
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  //defining onClick
  const handleClick = async (e) => {
    e.preventDefault();

    const request1 = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    const json = await request1.json();
    console.log(json);
    if (json.success) {
      
      localStorage.setItem("token", json.authtoken);
      showAlert("Logged in successfully", "success");

      //Redirect
      navigate("/");
      
      
    } else {
      showAlert("Invalid Credentials", "danger");
    }
  };

  return (
    <div>
      <form onSubmit={handleClick}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            value={credentials.email}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            value={credentials.password}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          onSubmit={handleClick}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Login;
