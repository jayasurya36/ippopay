import React, { useEffect, useState } from "react";
import "./login.css";
import topImg from "../images/topImg.svg";
import { postData } from "../api/server";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Login() {
  let [credentials, setCredentials] = useState({
    userName: "",
    password: "",
  });

  const onSubmitHandler = (e) => {
    e.preventDefault();
    postData(credentials)
      .then(res => console.log(res))
      .catch((err) => console.log(err));
  };

  //function to check

  function strongPasswordChecker(password) {
    let steps = 0;
    let missingTypes = 3;
    let repeatingSeq = 0;
    let repeatingChars = [];

    for (let i = 0; i < password.length; ) {
      const char = password[i];

      // Check for repeating characters
      let j = i;
      while (i < password.length && password[i] === char) {
        i++;
      }
      const repeatCount = i - j;
      repeatingSeq += Math.floor(repeatCount / 3);
      if (repeatCount >= 3) {
        repeatingChars.push(repeatCount);
      }

      // Check for missing types (lowercase, uppercase, digit)
      if (char >= "a" && char <= "z") {
        missingTypes &= ~1;
      } else if (char >= "A" && char <= "Z") {
        missingTypes &= ~2;
      } else if (char >= "0" && char <= "9") {
        missingTypes &= ~4;
      }
    }

    // Case 1: Password is already strong
    if (
      password.length >= 6 &&
      password.length <= 20 &&
      missingTypes === 0 &&
      repeatingSeq === 0
    ) {
      return 0;
    }

    // Case 2: Password is too short
    if (password.length < 6) {
      return Math.max(6 - password.length, missingTypes);
    }

    // Case 3: Password is too long
    let deleteCount = password.length - 20;
    steps += deleteCount;

    // Reduce repeatingSeq by replacing characters
    for (const repeat of repeatingChars) {
      if (deleteCount > 0) {
        const replacements = Math.min(deleteCount, Math.floor(repeat / 3));
        repeatingSeq -= replacements;
        deleteCount -= replacements;
      }
    }

    // Case 4: Password is of the right length but needs additional characters
    steps += Math.max(missingTypes, repeatingSeq);

    return steps;
  }

  let [steps, setSteps] = useState(0);
  useEffect(() => {
    setSteps(() => strongPasswordChecker(credentials.password));
  }, [credentials.password]);

  return (
    <div className="loginContainer" onSubmit={onSubmitHandler}>
      <form action="#" method="POST">
        <img src={topImg} alt="logo" />
        <h1>Login</h1>
        <input
          type="text"
          name="username"
          placeholder="Enter Username"
          autoComplete="off"
          value={credentials.userName}
          onChange={(e) => {
            setCredentials((credentials) => ({
              ...credentials,
              userName: e.target.value,
            }));
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          minLength={6}
          maxLength={20}
          autoComplete="off"
          value={credentials.password}
          onChange={(e) => {
            setCredentials((credentials) => ({
              ...credentials,
              password: e.target.value,
            }));
          }}
        />
        {credentials.password ? <div className="steps">{steps > 0 ? steps : 0}</div> : ""}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
