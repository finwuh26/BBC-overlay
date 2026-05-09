import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.json());

  // In-memory data store for the election results
  let electionData = {
    theme: "election", // "election" or "news"
    headline: "EXIT POLL: LABOUR LANDSLIDE",
    subheadline: "Sir Keir Starmer's party is forecast to win a majority of 170 seats",
    breaking: false,
    mode: "exit_poll", // "exit_poll" or "results"
    tickerMode: "results", // "text" or "results"
    
    // Style settings
    primaryColor: "#280058", // BBC Election Purple
    darkColor: "#1E0043", // Darker purple for clock/scoreboard
    logoTitle: "ELECTION",
    logoTextClass: "text-white",
    bbcBoxesClass: "bg-white text-black",
    crystalUrl: "",

    parties: [
      { id: "lab", name: "LAB", seats: 410, color: "#E4003B", visible: true },
      { id: "con", name: "CON", seats: 131, color: "#0087DC", visible: true },
      { id: "ld", name: "LD", seats: 61, color: "#FAA61A", visible: true },
      { id: "ref", name: "REF", seats: 13, color: "#12B6CF", visible: true },
      { id: "pc", name: "PC", seats: 4, color: "#008142", visible: true },
      { id: "grn", name: "GRN", seats: 0, color: "#02A95B", visible: false },
      { id: "snp", name: "SNP", seats: 0, color: "#FDF38E", visible: false },
      { id: "bin", name: "BIN", seats: 8, color: "#A0A0A0", visible: false },
    ],
    majorityTarget: 326,
    tickerItems: [
      "National results and analysis at bbc.co.uk/news or the BBC News app",
    ],
    recentResults: [
       { constituency: "Eastleigh", result: "LD GAIN", partyColor: "#FAA61A", partyId: "ld" },
       { constituency: "Leeds West", result: "LAB HOLD", partyColor: "#E4003B", partyId: "lab" },
       { constituency: "Barnsley North", result: "LAB HOLD", partyColor: "#E4003B", partyId: "lab" }
    ]
  };

  // API Routes
  app.get("/api/data", (req, res) => {
    res.json(electionData);
  });

  app.post("/api/data", (req, res) => {
    electionData = { ...electionData, ...req.body };
    io.emit("data_update", electionData);
    res.json({ success: true, data: electionData });
  });

  // Socket.io for real-time updates
  io.on("connection", (socket) => {
    console.log("Client connected");
    socket.emit("data_update", electionData);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
