import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./Index";
import SearchPage from "./SearchPage";
import DocumentsPage from "./DocumentsPage";
import AnalyticsPage from "./AnalyticsPage";
import AlertsPage from "./AlertsPage";
import AccessControlPage from "./AccessControlPage";
import SettingsPage from "./SettingsPage";
import HelpPage from "./HelpPage";
import WellnessPage from "./WellnessPage";
import UploadPage from "./UploadPage";
import SignIn from "./SignIn";
import AdminUserManagement from "./AdminUserManagement";
import NotFound from "./NotFound";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
      <Route path="/wellness" element={<ProtectedRoute><WellnessPage /></ProtectedRoute>} />
      <Route path="/access" element={<ProtectedRoute><AccessControlPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><AdminUserManagement /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;