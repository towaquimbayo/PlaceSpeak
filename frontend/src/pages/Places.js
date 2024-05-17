import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardHeader from "../components/DashboardHeader";
import { Dropdown, Field } from "../components/Field";
import Layout from "../components/Layout";
import SideNav from "../components/SidenNav";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { config } from "../config";

export default function Places() {
  const user_id = useSelector((state) => state.user.user_id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isNewPlace, setIsNewPlace] = useState(false);
  const [places, setPlaces] = useState([]);
  const [primaryPlace, setPrimaryPlace] = useState(null);
  const initialForm = {
    id: 0,
    name: "",
    country: "",
    postalCode: "",
    province: "",
    city: "",
    street: "",
    suite: "",
    propertyType: "",
    ownershipType: "",
  };
  const [form, setForm] = useState(initialForm);
  const placeNameOptions = places.map((place) => ({
    value: place.id,
    label: place.name,
  }));
  const propertyTypeOptions = [
    { value: "home", label: "Home" },
    { value: "work", label: "Work" },
    { value: "recreational", label: "Recreational" },
    { value: "investment", label: "Investment" },
    { value: "management", label: "Management" },
  ];
  const ownershipTypeOptions = [
    { value: "rent", label: "Rent" },
    { value: "own", label: "Own" },
    { value: "manage", label: "Manage" },
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        // const endpoint = config.url;
        // const response = await fetch(`${endpoint}/api/places`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ user_id: `${user_id}` }),
        // });
        // if (!response.ok) {
        //   throw new Error(`Error fetching user places: ${response.statusText}`);
        // }

        // const data = await response.json();
        // @TODO replace hardcoded places
        const data = {
          primary: 1, // primary place id
          places: [
            {
              id: 1,
              name: "Home",
              country: "United States",
              postalCode: "12345",
              province: "California",
              city: "Los Angeles",
              street: "123 Main St",
              suite: "Apt 101",
              propertyType: "home",
              ownershipType: "own",
            },
            {
              id: 2,
              name: "Work",
              country: "United States",
              postalCode: "54321",
              province: "New York",
              city: "Los Angeles",
              street: "456 Elm St",
              suite: "Suite 200",
              propertyType: "work",
              ownershipType: "rent",
            },
          ],
        };
        console.log("Places:", data.places);
        if (data.places.length > 0) {
          setPlaces(data.places);
          setPrimaryPlace(data.primary);
          setForm(data.places.find((place) => place.id === data.primary));
        }
      } catch (error) {
        console.error("Fetch places error:", error);
        setErrorMsg("An unexpected error occurred. Please try again later.");
      } finally {
        setFetching(false);
      }
    };
    fetchPlaces();
  }, [user_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // @TODO: Use same endpoint for creating and updating places
    // use form.id to determine if it's a new place or an existing one
    // if form.id is 0, it's a new place, otherwise it's an existing one

    try {
      setLoading(true);
      setForm({ ...form, user_id: user_id }); // add user_id to form data
      const endpoint = config.url;
      const response = await fetch(`${endpoint}/api/places/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error(`Error fetching user places: ${response.statusText}`);
      }

      setSuccessMsg("New place created successfully.");
      setIsNewPlace(false);
      setForm(places.find((place) => place.id === primaryPlace));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error("Update place error:", error);
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

  function placeForm() {
    return (
      <form className="accountForm" onSubmit={handleSubmit}>
        <div className="formRow">
          {isNewPlace ? (
            <Field
              label="Name"
              name="name"
              placeholder="Home"
              value={form.name}
              onChange={handleOnChange}
            />
          ) : (
            <Dropdown
              label="Name"
              name="name"
              value={placeNameOptions.find(
                (option) => option.value === form.id
              )}
              options={placeNameOptions}
              onChange={(option) => {
                setForm(places.find((place) => place.id === option.value));
              }}
            />
          )}
        </div>
        <div className="formRow">
          <Field
            label="Country"
            name="country"
            placeholder="United States"
            value={form.country}
            onChange={handleOnChange}
          />
          <Field
            label="Postal Code"
            name="postalCode"
            placeholder="12345"
            value={form.postalCode}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Field
            label="Province / State"
            name="province"
            placeholder="California"
            value={form.province}
            onChange={handleOnChange}
          />
          <Field
            label="City"
            name="city"
            placeholder="Los Angeles"
            value={form.city}
            onChange={handleOnChange}
          />
        </div>
        <div className="formRow">
          <Field
            label="Street Address"
            name="street"
            placeholder="123 Main St"
            value={form.street}
            onChange={handleOnChange}
          />
          <Field
            label="Apt / Suite"
            name="suite"
            value={form.suite}
            onChange={handleOnChange}
            optional
          />
        </div>
        <div className="formRow">
          <Dropdown
            label="Property Type"
            name="propertyType"
            value={propertyTypeOptions.find(
              (option) => option.value === form.propertyType
            )}
            options={propertyTypeOptions}
            onChange={(option) => {
              setForm({ ...form, propertyType: option.value });
            }}
          />
          <Dropdown
            label="Ownership Type"
            name="ownershipType"
            value={ownershipTypeOptions.find(
              (option) => option.value === form.ownershipType
            )}
            options={ownershipTypeOptions}
            onChange={(option) => {
              setForm({ ...form, ownershipType: option.value });
            }}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          {isNewPlace ? (
            <div className="formBtnGroup">
              <Button
                title="Create a New Place"
                text="Create Place"
                type="submit"
                loading={loading}
              />
              <Button
                title="Cancel"
                text="Cancel"
                onClick={() => {
                  setIsNewPlace(false);
                  setForm(places.find((place) => place.id === primaryPlace));
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                outline
              />
            </div>
          ) : (
            <Button
              title="Save Changes"
              text="Save Changes"
              type="submit"
              loading={loading}
            />
          )}
        </div>
      </form>
    );
  }

  return (
    <Layout title="Places">
      <DashboardHeader />
      <div className="dashboardContainer">
        <SideNav />
        <div className="dashboardContent">
          {isNewPlace ? (
            <h2>Create a New Place</h2>
          ) : (
            <>
              <div className="flexHeader">
                <h2>My Places</h2>
                <Button
                  title="Create a New Place"
                  text="Add Place"
                  onClick={() => {
                    setForm(initialForm);
                    setIsNewPlace(true);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                />
              </div>
              <p className="description">
                Where you live determines which consultations you are eligible
                to participate in. If you live in one place but work in another,
                or if you have homes in more than one location, you can add
                extra places to participate in consultations in those areas as
                well.
              </p>
            </>
          )}
          {errorMsg && <AlertMessage type="error" msg={errorMsg} />}
          {successMsg && <AlertMessage type="success" msg={successMsg} />}
          {fetching ? (
            <p id="loadingText">Loading...</p>
          ) : (places && places.length > 0) || isNewPlace ? (
            placeForm()
          ) : (
            <p>
              Hmm, it looks like you haven't added any places yet. Create a new
              place to get started!
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
