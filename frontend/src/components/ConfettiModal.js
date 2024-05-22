import ReactModal from "react-modal"
import ConfettiExplosion from "react-confetti-explosion"

export const ConfettiModal = ({ isOpen, message }) => {
  return (
    <ReactModal
        isOpen={isOpen}
        contentLabel="Badge Unlocked"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },

          content: {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            maxWidth: "700px",
            width: "90%",
          },
        }}
        closeTimeoutMS={3000}
      >
        <h2>{message}</h2>
        {isOpen && <ConfettiExplosion
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          duration={3000}
      />}
      </ReactModal>
  )
}