import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
// import Codex from "./pages/codex/page";
import Npcs from "./pages/npcs/Npcs";
import Dashboard from "./pages/dashboard/Dashboard";
import Campaigns from "./pages/campaigns/Campaigns";
import PublicLayout from "./layouts/PublicLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import Quests from "./pages/quests/Quests";
import { CampaignProvider } from "./context/campaign/CampaignProvider";
import Auth from "./pages/auth/Auth";
import ProtectedRoute from "./routes/ProtectedRoute";
import NpcsDetails from "./pages/npcs/NpcDetails";
import QuestDetails from "./pages/quests/QuestDetails";
import Settings from "./pages/settings/Settings";
import Players from "./pages/players/Players";
import Invite from "./pages/invite/Invite";
import Locations from "./pages/locations/Locations";
import LocationDetails from "./pages/locations/LocationDetails";
import Characters from "./pages/characters/Characters";
import Items from "./pages/items/Items";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
// import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth view={"login"}/>} />
          <Route path="/invite/:token" element={<Invite/>} />
          <Route path="/register" element={<Auth view={"register"} />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route 
            element={
              <CampaignProvider>
                <AuthLayout />
              </CampaignProvider>
            }
          >
            <Route path="/campaigns" element={<Campaigns />}/>
            {/* <Route path="/codex/*" element={<Codex />} /> */}
            <Route path="/characters" element={<Characters/>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/items" element={<Items/>} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:locationId" element={<LocationDetails />} />
            <Route path="/npcs" element={<Npcs />} />
            <Route path="/npcs/:npcId" element={<NpcsDetails />} />
            <Route path="/players" element={<Players />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/quests/:questId" element={<QuestDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
