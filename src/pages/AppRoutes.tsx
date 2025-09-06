import { Routes, Route } from "react-router-dom";
import Index from "./Index";
import SearchPage from "./SearchPage";
import DocumentsPage from "./DocumentsPage";
import AnalyticsPage from "./AnalyticsPage";
import AlertsPage from "./AlertsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/alerts" element={<AlertsPage />} />
      <Route path="*" element={<Index />} />
    </Routes>
  );
};

export default AppRoutes;