import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { Field, Password } from "../components/Field";
import { config } from "../config";
import "../css/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const endpoint = config.url;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!firstName || !lastName || !email || !password) {
      setErrMsg("Please fill out all mandatory fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${endpoint}/api/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      if (response.ok) {
        setLoading(false);
        navigate("/login");
      } else {
        const data = await response.json();
        console.error("Registration failed:", data);
        setErrMsg("An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Register" isAuthPage>
      <div className="auth-container">
        <div className="auth-illustration">
          <div className="auth-info">
            <Link to="/" className="logo">
              PlaceSpeak
            </Link>
            <div className="auth-info-head">
              <h1>Real people, real places, real change.</h1>
              <p>
                PlaceSpeak empowers you to shape your community! Connect with your neighbours, share your
                voice, and directly influence decisions that impact your daily life.
              </p>
            </div>
            <div className="review">
              <p>
                <q>
                  <i>
                    I have used PlaceSpeak as part of several public and stakeholder consulatations
                    in BC and the Yukon beginning in 2016; as the only purpose-built Canadian public
                    consulatation framework it has proven its value and effectiveness.
                  </i>
                </q>
              </p>
              <div className="reviewer">
                <div className="avatar">
                  <img
                    src="https://api.dicebear.com/8.x/avataaars/svg?seed=Maggie&skinColor=edb98a,ffdbb4"
                    alt="avatar"
                    width={35}
                  />
                </div>
                <div>
                  <p className="name">Inga Petri</p>
                  <p>Founder at Strategic Moves</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="auth-form">
          <h1>Get Started</h1>
          {errMsg && <AlertMessage msg={errMsg} type="error" />}
          <form className="accountForm" onSubmit={handleSignup}>
            <div className="formRow">
              <Field
                label="First Name"
                name="firstName"
                placeholder="John"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrMsg("");
                }}
              />
              <Field
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <div className="formRow">
              <Field
                label="Email"
                type="email"
                name="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <div className="formRow">
              <Password
                label="Password"
                name="password"
                placeholder="********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <Button
              type="submit"
              title="Sign Up"
              loading={loading}
              text="Sign Up"
              full
              customStyle={{ marginTop: "1rem" }}
            />
            <p>
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
