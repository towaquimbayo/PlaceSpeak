import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../components/Button";
import DashboardHeader from "../components/DashboardHeader";
import { Field, Password, Textarea } from "../components/Field";
import Layout from "../components/Layout";
import SideNav from "../components/SideNav";
import AlertMessage from "../components/AlertMessage";
import { config } from "../config";
import { updateUserName } from "../redux/actions/UserAction";

export default function Profile() {
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.user.user_id);

  const [form, setForm] = useState({
    user_id: user_id,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    about: "",
    linkedIn: "",
    twitter: "",
    facebook: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const endpoint = config.url;
        const response = await fetch(`${endpoint}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: `${user_id}` }),
        });
        if (!response.ok) {
          throw new Error(
            `Error fetching user details: ${response.statusText}`
          );
        }

        const data = await response.json();
        console.log("Data:", data);
        setForm({
          user_id: user_id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          password: data.password,
          about: data.about,
          linkedIn: data.linkedIn,
          twitter: data.twitter,
          facebook: data.facebook,
        });
      } catch (error) {
        console.error("Error:", error);
        setErrorMsg("An unexpected error occurred. Please try again later.");
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [user_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const endpoint = config.url;
      const response = await fetch(`${endpoint}/api/update_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error(`Error updating user details: ${response.statusText}`);
      }

      dispatch(updateUserName(form.firstName, form.lastName));
      setSuccessMsg("Your profile has been updated successfully.");
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  function handleOnChange(e) {
    setSuccessMsg("");
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function accountForm() {
    return (
      <form onSubmit={handleSubmit}>
        <div className="formRow">
          <Field
            label="First Name"
            name="firstName"
            placeholder="John"
            value={form.firstName}
            onChange={handleOnChange}
          />
          <Field
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Field
            label="Email"
            type="email"
            name="email"
            placeholder="johndoe@gmail.com"
            value={form.email}
            onChange={handleOnChange}
          />
          <Field
            label="Phone"
            type="tel"
            name="phone"
            placeholder="(XXX) XXX - XXXX"
            value={form.phone}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Password
            label="Password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Textarea
            label="About Me"
            name="about"
            placeholder="Tell us about yourself..."
            value={form.about}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Field
            label="LinkedIn"
            name="linkedIn"
            placeholder="https://linkedin.com/in/johndoe"
            value={form.linkedIn}
            onChange={handleOnChange}
          />
          <Field
            label="X / Twitter"
            name="twitter"
            placeholder="https://twitter.com/johndoe"
            value={form.twitter}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Field
            label="Facebook"
            name="facebook"
            placeholder="https://facebook.com/johndoe"
            value={form.facebook}
            onChange={handleOnChange}
            halfWidth
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Button
            title="Save Changes"
            text="Save Changes"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    );
  }

  return (
    <Layout title="Profile">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          <h2>My Account</h2>
          <p className="description">
            Please review your profile details to ensure accuracy. Don't forget
            to verify your email, address, and phone number for a verified
            badge!
          </p>
          {errorMsg && <AlertMessage type="error" msg={errorMsg} />}
          {successMsg && <AlertMessage type="success" msg={successMsg} />}
          {fetching ? <p id="loadingText">Loading...</p> : accountForm()}
        </div>
      </div>
    </Layout>
  );
}
