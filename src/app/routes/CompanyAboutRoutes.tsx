import { Route } from "react-router-dom";
import AboutPage from "@/pages/AboutPage";
import EquinoxSphereAboutPage from "@/pages/about/EquinoxSphereAboutPage";
import FoundersPage from "@/pages/founders/FoundersPage";
import VinitSharmaPage from "@/pages/founders/VinitSharmaPage";
import BanothSiddarthPage from "@/pages/founders/BanothSiddarthPage";

export const renderCompanyAboutRoutes = () => (
  <>
    <Route path="/about" element={<AboutPage />} />
    <Route path="/about/equinoxsphere" element={<EquinoxSphereAboutPage />} />
    <Route path="/founders" element={<FoundersPage />} />
    <Route path="/founders/vinit-sharma" element={<VinitSharmaPage />} />
    <Route path="/founders/banoth-siddarth" element={<BanothSiddarthPage />} />
  </>
);
