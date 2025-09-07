import { Routes, Route } from "react-router-dom";
import Index from "./Index";
import SearchPage from "./SearchPage";
import DocumentsPage from "./DocumentsPage";
import AnalyticsPage from "./AnalyticsPage";
import AlertsPage from "./AlertsPage";
import AccessControlPage from "./AccessControlPage";
import SettingsPage from "./SettingsPage";
import HelpPage from "./HelpPage";
import NotFound from "./NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="/access" element={<AccessControlPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;