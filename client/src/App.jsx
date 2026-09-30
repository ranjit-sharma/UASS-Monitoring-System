// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';

// Views (MVC Pattern)
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage.jsx';
import { FlightTrackingPage } from './pages/FlightTrackingPage.jsx';

import { ObservationsPage } from './pages/ObservationsPage.jsx';
import { DataCollectionPage } from './pages/DataCollectionPage.jsx';
import { UserManagementPage } from './pages/UserManagementPage.jsx';
import { AuditLogsPage } from './pages/AuditLogsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

import { DataSourceProvider } from './context/DataSourceContext.jsx';
import { AlertSettingsProvider } from './context/AlertSettingsContext.jsx';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <DataSourceProvider>
<AlertSettingsProvider>
            <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/monitoring" element={<LiveMonitoringPage />} />
                <Route path="/tracking" element={<FlightTrackingPage />} />
          

                {/* All authenticated users */}
                <Route
                  path="/observations"
                  element={<ObservationsPage />}
                />

                {/* Admin + Operator only */}
                <Route
                  element={<ProtectedRoute allowedRoles={['admin', 'operator']} />}
                >
                  <Route path="/collections" element={<DataCollectionPage />} />
                </Route>

                {/* Admin only */}
                <Route
                  element={<ProtectedRoute allowedRoles={['admin']} />}
                >
                  <Route path="/users" element={<UserManagementPage />} />
                  <Route path="/audit-logs" element={<AuditLogsPage />} />
                </Route>
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </AlertSettingsProvider>
</DataSourceProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;




