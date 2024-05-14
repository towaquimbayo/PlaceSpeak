import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../redux/actions/UserAction";
import Layout from "../components/Layout";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { config } from "../config";
import "../css/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const endpoint = config.url;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    if (!email || !password) {
      setErrMsg("Please fill out all mandatory fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${endpoint}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setUser(true, data.user_id));
        setLoading(false);
        navigate("/");
      } else {
        const data = await response.json();
        console.error("Login failed:", data);
        setErrMsg(data.message || "An unexpected error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login" isAuthPage>
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
          <h1>Welcome Back!</h1>
          {errMsg && <AlertMessage msg={errMsg} type="error" />}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrMsg("");
                }}
              />
            </div>
            <Button
              type="submit"
              title="Login"
              loading={loading}
              text="Login"
              full
              customStyle={{ marginTop: "2rem" }}
            />
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
