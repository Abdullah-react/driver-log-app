import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-3 col-lg-2">
                        <Sidebar />
                    </div>
                    <main className="col-md-9 col-lg-10 px-4">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;