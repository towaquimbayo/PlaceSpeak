import ReactModal from "react-modal";
import Button from "./Button";

export default function PlacesDeleteModal({
  placeName,
  isOpen,
  onClose,
  onDelete,
  loading,
}) {
  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel={`Delete Place: ${placeName}`}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        },
        content: {
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          border: "none",
          borderRadius: "0.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "700px",
          width: "90%",
          padding: "6rem 2rem",
          height: "fit-content",
        },
      }}
      bodyOpenClassName="ReactModal__Body--open"
    >
      <h2 style={{ marginBottom: "1rem", fontWeight: 400 }}>
        Are you sure you want to delete{" "}
        <span style={{ color: "red", fontWeight: 700 }}>{placeName}</span>?
      </h2>
      <div className="formBtnGroup">
        <Button
          title="Confirm Deleting Place"
          text="Confirm Delete"
          onClick={onDelete}
          loading={loading}
        />
        <Button title="Cancel" text="Cancel" onClick={onClose} outline />
      </div>
    </ReactModal>
  );
}
