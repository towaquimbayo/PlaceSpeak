import { useState, useEffect } from "react";
import Button from "../components/Button";
import DashboardHeader from "../components/DashboardHeader";
import { Field, Password, Textarea } from "../components/Field";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";
import AlertMessage from "../components/AlertMessage";

const api_link = "http://127.0.0.1:8000";
const hardcoded_email = "abhishekchouhannk@gmail.com"

export default function Profile() {
  const [form, setForm] = useState({
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
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserDetails = async() => {
      setLoading(true);
      try {
        const response = await fetch(`${api_link}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email : `${hardcoded_email}`}),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const data = await response.json();

        console.log(data);

        setForm(data);
      }
      catch (error) {
      setErrorMsg(error.message);
      } finally {
      setLoading(false);
      }
    };
    
    fetchUserDetails();
  }, []);


  function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // TODO: Validate form data
    // TODO: Show loading spinner
    // TODO: Send form data to the server
    // fetch("/api/profile", { method: "POST", body: JSON.stringify(form) });

    console.log("Sending Form to Server!", form);
    setTimeout(() => setLoading(false), 1000);
  }

  function handleOnChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
          {errorMsg && <AlertMessage type="error" message={errorMsg} />}

          <form className="accountForm" onSubmit={handleSubmit}>
            <div className="formRow">
              <Field
                label="First Name"
                name="firstName"
                placeholder="John"
                value={form.firstName}
                onChange={handleOnChange}
              />
              <Field label="Last Name" name="lastName" placeholder="Doe" value={form.lastName}
                onChange={handleOnChange}/>
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
        </div>
      </div>
    </Layout>
  );
}
