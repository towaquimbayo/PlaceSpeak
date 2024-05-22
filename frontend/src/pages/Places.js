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
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
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
    longitude: 0,
    latitude: 0,
  };
  const [form, setForm] = useState(initialForm);
  const [searchAddress, setSearchAddress] = useState("");
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
        } else setPrimaryPlace(0);
      } catch (error) {
        console.error("Fetch places error:", error);
        setErrorMsg("An unexpected error occurred. Please try again later.");
      } finally {
        setFetching(false);
      }
    };
    if (user_id) fetchPlaces();
  }, [user_id]);

  function validateForm() {
    let valid = true;

    // if (Object.values(form).some((value) => value === "" || value === null)) {
    //   setErrorMsg("Please fill out all mandatory fields.");
    //   return false;
    // }

    // Check mandatory fields, excluding 'suite'
    const mandatoryFields = [
      "name",
      "country",
      "postalCode",
      "province",
      "city",
      "street",
      "propertyType",
      "ownershipType",
    ];
    if (
      mandatoryFields.some(
        (field) => form[field] === "" || form[field] === null
      )
    ) {
      setErrorMsg("Please fill out all mandatory fields.");
      return false;
    }

    if (form.name.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        name: "Please enter a name under 50 characters.",
      }));
      valid = false;
    }

    if (form.street.length > 100) {
      setFieldErrors((prev) => ({
        ...prev,
        street: "Please enter a street under 100 characters.",
      }));
      valid = false;
    }

    if (form.suite && form.suite.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        suite: "Please enter an apt/suite under 50 characters.",
      }));
      valid = false;
    }

    if (form.city.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        city: "Please enter a city under 50 characters.",
      }));
      valid = false;
    }

    if (form.province.length > 50) {
      setFieldErrors((prev) => ({
        ...prev,
        province: "Please enter a province under 50 characters.",
      }));
      valid = false;
    }

    if (form.country.length > 100) {
      setFieldErrors((prev) => ({
        ...prev,
        country: "Please enter a country under 100 characters.",
      }));
      valid = false;
    }

    if (form.postalCode.length > 10) {
      setFieldErrors((prev) => ({
        ...prev,
        postalCode: "Please enter a postal code under 10 characters.",
      }));
      valid = false;
    }

    if (form.propertyType.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        propertyType: "Please select a property type.",
      }));
      valid = false;
    }

    if (form.ownershipType.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        ownershipType: "Please select an ownership type.",
      }));
      valid = false;
    }

    // Check if there are any errors in the fieldErrors object
    if (!valid) {
      setErrorMsg("Please ensure all fields are filled out correctly.");
      return false;
    }

    return true;
  }

  // If form.address_id is 0, it's creating a new place
  // Otherwise, it's updating an existing place
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setFieldErrors({});
    setLoading(true);
    const isUpdating = form.address_id !== 0;

    // Trim all form values
    for (const key in form) {
      if (typeof form[key] === "string") {
        form[key] = form[key].trim();
      }
    }

    // Form Validations
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const endpoint = config.url;
      const response = await fetch(`${endpoint}/api/users/address/${user_id}`, {
        method: isUpdating ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, primaryPlace }),
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
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));

    if (e.target.name.includes("addressSearch")) {
      setSearchAddress(e.target.value);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }

  // When the address field is autofilled, retrieve the full address details
  function handleOnRetrieve(data) {
    console.log("Retrieved Autofilled Address:", data);
    const fieldData = data.features[0].properties;
    const coordinates = data.features[0].geometry.coordinates;
    setIsAutofilled(true);
    setSearchAddress("");
    setForm({
      ...form,
      street: fieldData.address_line1,
      city: fieldData.address_level2,
      province: fieldData.address_level1,
      country: fieldData.country,
      postalCode: fieldData.postcode,
      longitude: coordinates[0],
      latitude: coordinates[1],
    });
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
            label="Search Address"
            name="addressSearch"
            placeholder="Start typing your address..."
            value={searchAddress}
            onChange={handleOnChange}
            onRetrieve={handleOnRetrieve}
            addressAutofill
          />
        </div>
        <div className="formRow">
          <Field
            label="Street"
            name="street"
            placeholder="123 Main St"
            value={form.street}
            onChange={handleOnChange}
            autoComplete="address-line1"
            disabled
            error={fieldErrors?.street}
          />
          <Field
            label="Apt / Suite"
            name="suite"
            value={form.suite || ""}
            onChange={handleOnChange}
            optional
            autoComplete="address-line2"
            disabled={!isAutofilled}
            error={fieldErrors?.suite}
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
            disabled
            error={fieldErrors?.province}
          />
          <Field
            label="City"
            name="city"
            placeholder="Los Angeles"
            value={form.city}
            onChange={handleOnChange}
            autoComplete="address-level2"
            disabled
            error={fieldErrors?.city}
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
            disabled
            error={fieldErrors?.country}
          />
          <Field
            label="Postal Code"
            name="postalCode"
            value={form.postalCode}
            onChange={handleOnChange}
            autoComplete="postal-code"
            disabled={!isAutofilled}
            error={fieldErrors?.postalCode}
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
            error={fieldErrors?.propertyType}
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
            error={fieldErrors?.ownershipType}
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
                  setIsAutofilled(false);
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
