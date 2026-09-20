
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const encargosRoutes = require("./routes/encargos.routes");

const app = express();

const origenesPermitidos = [
    "http://localhost:5500",
    "http://127.0.0.1:5500"
];

if (process.env.FRONTEND_URL) {
    origenesPermitidos.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: origenesPermitidos
}));

app.use(express.json());

app.get("/salud", function (req, res) {
    res.json({ ok: true, servicio: "gremio-api" });
});

app.use("/auth", authRoutes);
app.use("/encargos", encargosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("Gremio API escuchando en el puerto " + PORT);
});
