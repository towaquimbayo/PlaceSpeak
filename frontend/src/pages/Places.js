import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardHeader from "../components/DashboardHeader";
import { Checkbox, Dropdown, Field } from "../components/Field";
import Layout from "../components/Layout";
import SideNav from "../components/SideNav";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";
import { config } from "../config";
import { setUserLocation } from "../redux/actions/UserAction";
import PlacesDeleteModal from "../components/PlacesDeleteModal";

export default function Places() {
  const dispatch = useDispatch();
  const user_id = useSelector((state) => state.user.user_id);

  const [loading, setLoading] = useState(false);
  const [loadingAlt, setLoadingAlt] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [places, setPlaces] = useState([]);
  const [primaryPlaceId, setPrimaryPlaceId] = useState(null);
  const [primaryCheckedId, setPrimaryCheckedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
          setPrimaryPlaceId(data.primary);
          setPrimaryCheckedId(data.primary);
          setForm(
            data.places.find((place) => place.address_id === data.primary)
          );
        } else {
          setPrimaryPlaceId(0);
          setPrimaryCheckedId(0);
        }
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

    if (places.length === 1 && primaryCheckedId === -1) {
      setErrorMsg("You must have at least one primary place.");
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
        body: JSON.stringify({
          ...form,
          primaryAddress: primaryCheckedId === form.address_id,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${isUpdating ? "updating" : "creating"} place: ${response.statusText}`
        );
      }

      const updatedPlace = await response.json();
      console.log("Updated place:", updatedPlace);

      // Update user location in Redux if the primary place is updated or first new place is created
      if (places.length === 0 || primaryCheckedId === form.address_id) {
        dispatch(setUserLocation(form.city, form.province));
      }

      setSuccessMsg(
        isUpdating
          ? "Place updated successfully, reloading..."
          : "Place created successfully, reloading..."
      );
      setTimeout(() => window.location.reload(), 3000);
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

  async function updatePrimaryAddress(newPrimaryId) {
    try {
      const endpoint = config.url;
      const response = await fetch(`${endpoint}/api/users/address/${user_id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          address_id: newPrimaryId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating primary address: ${response.statusText}`)
      }

      const result = await response.json();
      console.log("Primary address updated:", result)
      setPrimaryPlaceId(newPrimaryId)
    }
    catch(error) {
      console.error("Update primary address error:", error);
      setErrorMsg("An unexpected error occured while updating the primary address. Please try again later.")
      setPrimaryCheckedId(primaryPlaceId); // revert to the previous primary address
    }
  }

  async function handleDelete() {
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingAlt(true);

    try {
      const endpoint = config.url;
      const response = await fetch(
        `${endpoint}/api/users/address/${user_id}`,
        {
          headers: { "Content-Type": "application/json" },
          method: "DELETE",
          body: JSON.stringify({
            address_id: form.address_id
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting place: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Delete place response:", data);

      setPlaces(places.filter((place) => place.address_id !== form.address_id));
      setSuccessMsg("Place deleted successfully, reloading...");
      setTimeout(() => window.location.reload(), 3000);
    } catch (error) {
      console.error("Delete place error:", error);
      setErrorMsg("An unexpected error occurred. Please try again later.");
    } finally {
      setLoadingAlt(false);
      setDeleteModalOpen(false);
    }
  }

  function placeForm() {
    return (
      <form onSubmit={handleSubmit}>
        {isCreateNew ? (
          <div className="formRow">
            <Field
              label="Name"
              name="name"
              placeholder="Home"
              value={form.name}
              onChange={handleOnChange}
            />
          </div>
        ) : (
          <>
            <div className="formRow">
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
                  setPrimaryCheckedId(primaryPlaceId);
                }}
              />
            </div>
            <div className="formRow">
              <Checkbox
                label="Set as Primary Place"
                name="primaryPlace"
                isChecked={primaryCheckedId === form.address_id}
                onChange={() => {
                  const newPrimaryId = form.address_id
                  console.log(newPrimaryId);
                  setPrimaryCheckedId(newPrimaryId);
                  updatePrimaryAddress(newPrimaryId);
                }}
              />
            </div>
          </>
        )}
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
            disabled={!isAutofilled && !form.street}
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
            disabled={!isAutofilled && !form.street}
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
                  places.find((place) => place.address_id === primaryPlaceId) ||
                  initialForm
                );
                setPrimaryCheckedId(primaryPlaceId);
                setErrorMsg("");
                setSuccessMsg("");
              }}
              outline
            />
          </div>
        ) : (
          <div className="formBtnGroup">
            <Button
              title="Save Changes"
              text="Save Changes"
              type="submit"
              loading={loading}
            />
            <Button
              title="Delete Place"
              text="Delete Place"
              onClick={() => setDeleteModalOpen(true)}
              outline
            />
          </div>
        )}
      </form>
    );
  }

  return (
    <Layout title="Places">
      <DashboardHeader />
      <PlacesDeleteModal
        placeName={form.name}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDelete}
        loading={loadingAlt}
      />
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
