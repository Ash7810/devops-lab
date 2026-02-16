
import React from 'react';
// FIX: The User type is not available in the assumed Supabase JS version. Replaced with `any`.
// import { User } from '@supabase/supabase-js';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPageProps {
    user: any | null;
}

const AdminPage: React.FC<AdminPageProps> = ({ user }) => {
    const isAdmin = user && user.email === 'admin@shreechoice.com';

    if (!isAdmin) {
        return <AdminLogin />;
    }

    return <AdminDashboard user={user} />;
};

export default AdminPage;
