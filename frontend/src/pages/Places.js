import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardHeader from "../components/DashboardHeader";
import { Dropdown, Field } from "../components/Field";
import Layout from "../components/Layout";
import SideNav from "../components/SideNav";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { config } from "../config";

export default function Places() {
  const user_id = useSelector((state) => state.user.user_id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [places, setPlaces] = useState([]);
  const [primaryPlace, setPrimaryPlace] = useState(null);
  const initialForm = {
    address_id: 0,
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
    value: place.address_id,
    label: place.name,
  }));
  const propertyTypeOptions = [
    { value: "HOME", label: "Home" },
    { value: "WORK", label: "Work" },
    { value: "RECREATIONAL", label: "Recreational" },
    { value: "INVESTMENT", label: "Investment" },
    { value: "MANAGEMENT", label: "Management" },
  ];
  const ownershipTypeOptions = [
    { value: "RENT", label: "Rent" },
    { value: "OWN", label: "Own" },
    { value: "MANAGE", label: "Manage" },
  ];

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const endpoint = config.url;
        const response = await fetch(
          `${endpoint}/api/users/address/${user_id}`
        );
        if (!response.ok) {
          throw new Error(`Error fetching user places: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Data:", data);
        console.log("Places:", data.places);

        if (data.places.length > 0) {
          setPlaces(data.places);
          setPrimaryPlace(data.primary);
          setForm(
            data.places.find((place) => place.address_id === data.primary)
          );
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

  // If form.address_id is 0, it's creating a new place
  // Otherwise, it's updating an existing place
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);
    const isUpdating = form.address_id !== 0;

    try {
      const endpoint = config.url;
      const response = await fetch(`${endpoint}/api/users/address/${user_id}`, {
        method: isUpdating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${isUpdating ? "updating" : "creating"} place: ${
            response.statusText
          }`
        );
      }

      const updatedPlace = await response.json();
      console.log("Updated place:", updatedPlace);

      if (isUpdating) {
        // Update the existing place in the places array
        setPlaces(
          places.map((place) =>
            place.address_id === form.address_id ? updatedPlace : place
          )
        );
        setSuccessMsg("Place updated successfully.");
      } else {
        // Add the new place to the places array
        setPlaces([...places, updatedPlace]);
        setSuccessMsg("New place created successfully.");
      }
      setIsCreateNew(false);
      setForm(places.find((place) => place.address_id === primaryPlace));
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      console.error(`${isUpdating ? "Update" : "Create"} place error:`, error);
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
      <form onSubmit={handleSubmit}>
        <div className="formRow">
          {isCreateNew ? (
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
                (option) => option.value === form.address_id
              )}
              options={placeNameOptions}
              onChange={(option) => {
                setForm(
                  places.find((place) => place.address_id === option.value)
                );
              }}
            />
          )}
        </div>
        <div className="formRow">
          <Field
            label="Street Address"
            name="street"
            placeholder="123 Main St"
            value={form.street}
            onChange={handleOnChange}
            autoComplete="address-line1"
            addressAutofill
          />
          <Field
            label="Apt / Suite"
            name="suite"
            value={form.suite}
            onChange={handleOnChange}
            optional
            autoComplete="address-line2"
          />
        </div>
        <div className="formRow">
          <Field
            label="Province / State"
            name="province"
            placeholder="California"
            value={form.province}
            onChange={handleOnChange}
            autoComplete="address-level1"
          />
          <Field
            label="City"
            name="city"
            placeholder="Los Angeles"
            value={form.city}
            onChange={handleOnChange}
            autoComplete="address-level2"
          />
        </div>
        <div className="formRow">
          <Field
            label="Country"
            name="country"
            placeholder="United States"
            value={form.country}
            onChange={handleOnChange}
            autoComplete="country-name"
          />
          <Field
            label="Postal Code"
            name="postalCode"
            value={form.postalCode}
            onChange={handleOnChange}
            autoComplete="postal-code"
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
          {isCreateNew ? (
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
                  setIsCreateNew(false);
                  setForm(
                    places.find((place) => place.address_id === primaryPlace)
                  );
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
          {isCreateNew ? (
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
                    setIsCreateNew(true);
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
          ) : (places && places.length > 0) || isCreateNew ? (
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
