import React from 'react';
import { BrowserRouter,Routes, Route, Navigate } from 'react-router-dom';
import StartupLayout from '../layouts/StartupLayout';
import StartupDashboard from '../pages/startup/StartupDashboard';
import StartupProfile from '../pages/startup/StartupProfile';
import CreateInternship from '../pages/startup/CreateInternship';
import ManageInternships from '../pages/startup/ManageInternships';
import ViewApplications from '../pages/startup/ViewApplications';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '../pages/Auth/LandingPage';

import StudentLayout from '../layouts/StudentLayout';
import StudentDashboard from '../pages/student/StudentDashboard'
import StudentProfile from '../pages/student/StudentProfile';
import StudentInternships from '../pages/student/StudentInternships'
import InternshipDetails from '../pages/student/InternshipDetails'

import StartupLogin from '../pages/Auth/StartupLogin';
import StudentLogin from '../pages/Auth/StudentLogin';
import AdminLogin from '../pages/Auth/AdminLogin';
import StudentRegister from '../pages/Auth/StudentRegister'
import StudentApplications from '../pages/student/StudentApplications';
import StudentCertificates from '../pages/student/StudentCertificates'

import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Startups from '../pages/admin/Startups';
import Internships from '../pages/admin/Internships';
import Students from '../pages/admin/Students';
import Applications from '../pages/admin/Applications';
import Analytics from '../pages/admin/Analytics';
import Reports from '../pages/admin/Reports';
import Settings from '../pages/admin/Settings';




const AppRoutes = () => {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/login/student" element={<StudentLogin />} />
            <Route path="/login/startup" element={<StartupLogin />} />
            <Route path="/register/student" element={<StudentRegister />} />
            <Route path="/login" element={<LandingPage />} />

            <Route element={<ProtectedRoute allowedRoles={['STARTUP']} />}>
              <Route element={<StartupLayout />}>
                <Route path="/startup/dashboard" element={<StartupDashboard />} />
                <Route path="/startup/profile" element={<StartupProfile />} />
                <Route path="/startup/internships" element={<ManageInternships />} />
                <Route path="/startup/internships/create" element={<CreateInternship />} />
                <Route path="/startup/internships/:id/applications" element={<ViewApplications />} />
              </Route>
            </Route>


            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
                <Route element={<StudentLayout />}>
                  <Route path="/student/dashboard" element={<StudentDashboard/>} />
                  <Route path="/student/internships" element={<StudentInternships />} />
                  <Route path="/student/internships/:id" element={<InternshipDetails />} />
                  
                  <Route path="/student/applications" element={<StudentApplications />} />
                  <Route path="/student/certificates" element={<StudentCertificates />} />
                  <Route path="/student/profile" element={<StudentProfile />} /> 
                </Route>
            </Route>


            <Route element={<ProtectedRoute allowedRoles={['CIIC']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/startups" element={<Startups />} />
                <Route path="/admin/internships" element={<Internships />} />
                <Route path="/admin/students" element={<Students />} />
                <Route path="/admin/applications" element={<Applications />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/settings" element={<Settings />} />
              </Route>
            </Route>

            
        </Routes>
        </BrowserRouter>

    );
};

export default AppRoutes;
