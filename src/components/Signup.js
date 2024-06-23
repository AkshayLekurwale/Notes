import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = (props) => {
  const [credentials, setCredentials] = useState({ name: "", email: "", pass: "", cpass: "" });
  const [errors, setErrors] = useState([]);
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, pass, cpass } = credentials;

    // Check if passwords match
    if (pass !== cpass) {
        props.showAlert("Passwords do not match", "danger");
        return;
    }

    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password: pass })
    });

    const json = await response.json();
    if (json.success) {
      // Save the auth token and redirect
      localStorage.setItem('token', json.token);
      navigate("/");
      props.showAlert("Account created successfully", "success");
    } else {
      setErrors(json.errors || [{ msg: json.error }]);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-2">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} placeholder="Enter name" />
        </div>
        <div className="form-group my-2">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp" placeholder="Enter email" />
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="form-group my-2">
          <label htmlFor="pass">Password</label>
          <input type="password" className="form-control" id="pass" name="pass" onChange={onChange} placeholder="Password" />
        </div>
        <div className="form-group my-2">
          <label htmlFor="cpass">Confirm Password</label>
          <input type="password" className="form-control" id="cpass" name="cpass" onChange={onChange} placeholder="Confirm Password" />
        </div>
        <button type="submit" className="btn btn-primary my-2">Submit</button>
      </form>
      {errors.length > 0 && (
        <div className="alert alert-danger my-2">
          {errors.map((error, index) => (
            <p key={index}>{error.msg}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Signup;
