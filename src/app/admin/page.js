import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>Admin Panel</h1>
          <p>User management and application settings</p>
        </div>
        
        <div className="admin-panel">
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>User 1</td>
                    <td>user1@example.com</td>
                    <td>Jan 15, 2024</td>
                    <td>
                      <button className="btn btn-secondary">Edit</button>
                      <button className="btn btn-secondary">Delete</button>
                    </td>
                  </tr>
                  <tr>
                    <td>User 2</td>
                    <td>user2@example.com</td>
                    <td>Jan 20, 2024</td>
                    <td>
                      <button className="btn btn-secondary">Edit</button>
                      <button className="btn btn-secondary">Delete</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="admin-section">
            <h2>Application Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">1,234</p>
              </div>
              <div className="stat-card">
                <h3>Total Items</h3>
                <p className="stat-number">5,678</p>
              </div>
              <div className="stat-card">
                <h3>Total Outfits</h3>
                <p className="stat-number">2,345</p>
              </div>
              <div className="stat-card">
                <h3>Saved Outfits</h3>
                <p className="stat-number">8,901</p>
              </div>
            </div>
          </div>
          
          <div className="admin-section">
            <h2>Application Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Application Name</label>
                <input type="text" defaultValue="Smart Virtual Closet" />
              </div>
              <div className="form-group">
                <label>Version</label>
                <input type="text" defaultValue="1.0.0" />
              </div>
              <button className="btn btn-primary">Save Settings</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

