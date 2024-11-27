import express from 'express';
import Connection from './database/db.js';
import route from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import prodroute from './routes/product-route.js';
import sellRoutes from "./routes/sellroute.js";
import expenseRoutes from './routes/exp-route.js'
const app = express();
const PORT = process.env.PORT || 8000;

// Apply CORS middleware before defining routes
app.use(
  cors({
    origin: ['https://expertcaraccessories.netlify.app'], // Allow only your frontend domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Include cookies/authorization headers if needed
  })
); // Allow requests from all origins

app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended:true}));


// Define your routes
app.use('/', route);
app.use("/api/products", prodroute);
app.use("/api/sales", sellRoutes);
app.use('/api/expenses', expenseRoutes); // Use the sale routes here

app.get("/", (req, res) => {
    //server has sent the response
    res.send("Hello form Node API Server");
  });
  
// Connect to the database
Connection();

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running successfully on PORT ${PORT}`);
}); 