import ResponsiveAppBar from "../Components/ResponsiveAppBar";
import background from "../assets/download.svg";
import trackSalesBackground from "../assets/tracksales.jpeg";
import inventoryBackground from "../assets/inventory.jpeg";
import profitsBackground from "../assets/profits.png";
import { Box } from "@mui/material";
function Homepage() {
  //const navigate = useNavigate();

  const cardData = [
    {
      title: "Manage Inventory",
      description: "Update and organize your stock",
      path: "/inventory",
      background: inventoryBackground,
    },
    {
      title: "Track Sales Performance",
      description: "Monitor sales trends and insights",
      path: "/sales-performance",
      background: trackSalesBackground,
    },
    {
      title: "View Profits",
      description: "Analyze daily, weekly, and monthly profits",
      path: "/profits",
      background: profitsBackground,
    },
  ];

  return (
    <>
      <Box
  sx={{
    position: "fixed", // Fix it to the top
    top: 0, // Align to the top of the viewport
    left: 0, // Align to the left
    width: "100%", // Full width
    zIndex: 1100, // Ensure it stays on top of other content
  }}
>
  <ResponsiveAppBar />
</Box>
      <div
        className="homepage-background"
        // style={{
        //   marginTop: "8.9vh",
        //   height: "90vh",
        //   width: "100vw",
        //   backgroundImage: url(${background}), linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        //   position: "relative",
        //   display: "flex",
        //   flexDirection: "column",
        //   alignItems: "center",
        // }}
      >
        <div
          className="message-container"
          //   style={{
          //     position: "absolute",
          //     top: "20%",
          //     color: "white",
          //     textAlign: "center",
          //     width: "80%",
          //   }}
        >
          <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
            Welcome to Our Car Accessories Management System
          </h1>
          <p style={{ fontSize: "1.5rem", marginTop: "20px" }}>
            Easily manage your inventory, track your sales performance, and
            download receipts for all transactions. Stay on top of your daily,
            weekly, and monthly profits while keeping your business organized.
          </p>
        </div>
        <div className="card-container">
          {cardData.map((card, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#CBDCEB",
                borderRadius: "15px",
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
                padding: "20px",
                textAlign: "center",
                width: "300px",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              // onClick={() => navigate(card.path)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-10px)";
                e.currentTarget.style.boxShadow =
                  "0px 10px 20px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0px 6px 10px rgba(0, 0, 0, 0.2)";
              }}
            >
              <div
                style={{
                  height: "100px",
                  width: "100px",
                  background: "linear-gradient(135deg, #6D83F2, #88C4F4)",
                  borderRadius: "50%",
                  margin: "0 auto",
                  marginBottom: "0px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  <img src={card.background} alt="Not Found" />
                </span>
              </div>
              <h2
                style={{ fontSize: "1.6rem", fontWeight: "600", color: "#333" }}
              >
                {card.title}
              </h2>
              <p style={{ fontSize: "1rem", color: "#555", marginTop: "10px" }}>
                {card.description}
              </p>
              <div
                style={{
                  position: "absolute",
                  bottom: "0",
                  left: "0",
                  height: "4px",
                  width: "100%",
                  background: "linear-gradient(135deg, #6D83F2, #88C4F4)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <style>
        {`

            .card-container {
                display: flex;
                flex-wrap: wrap; /* Allows cards to wrap on smaller screens */
                justify-content: center; /* Centers the cards horizontally */
                align-items: center; /* Aligns the cards to the top */
                gap: 20px; /* Adds space between cards */
                margin-top: 50vh; /* Positions the card-container below the text */
                padding: 10px; /* Adds some padding around the container */
            }

            .card-container > div {
              flex: 1 1 300px; /* Ensures cards are responsive and maintain their width */
              max-width: 300px; /* Prevents cards from stretching too wide */
              margin: 10px; /* Adds space around individual cards */
            }
            .homepage-background {
                height: 100vh;

                background-image: url(${background}), linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7));
                background-size: cover;
                background-position: center;
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top:6vh;
            }

            .message-container {
                position: absolute;
                top: 20%;
                color: white;
                text-align: center;
                width: 80%;
            }
          @media (max-width: 768px) {
            .homepage-background {
              margin-top: 0;
              height: 100%;
            }
            .message-container {
              top: 10%;
            }
              .card-container {
                margin-top: 85vh; /* Change marginTop for mobile devices */
              }
          }
       `}
      </style>
    </>
  );
}

export default Homepage;
