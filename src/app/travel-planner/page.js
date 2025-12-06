import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function TravelPlannerPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>Travel Planner</h1>
          <p>Create travel plans and generate packing lists</p>
        </div>
        
        <div className="travel-planner">
          <div className="travel-form">
            <h2>Create New Plan</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Destination</label>
                <input type="text" placeholder="Ex: Paris, France" />
              </div>
              <div className="form-group">
                <label>Departure Date</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Return Date</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>Trip Type</label>
                <select>
                  <option value="">Select</option>
                  <option value="business">Business</option>
                  <option value="vacation">Vacation</option>
                  <option value="adventure">Adventure</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary">Create Plan</button>
          </div>
          
          <div className="travel-plans">
            <h2>Travel Plans</h2>
            <div className="travel-plan-card">
              <div className="travel-plan-header">
                <h3>Paris, France</h3>
                <span className="travel-dates">Jan 15-20, 2024</span>
              </div>
              <div className="travel-plan-days">
                <div className="travel-day">
                  <div className="day-header">
                    <span className="day-name">Day 1</span>
                    <span className="day-date">Jan 15</span>
                  </div>
                  <div className="day-outfits">
                    <div className="day-outfit-item">
                      <span>👕👖👟</span>
                      <span>Casual City Walk</span>
                    </div>
                  </div>
                </div>
                <div className="travel-day">
                  <div className="day-header">
                    <span className="day-name">Day 2</span>
                    <span className="day-date">Jan 16</span>
                  </div>
                  <div className="day-outfits">
                    <div className="day-outfit-item">
                      <span>👔👖👞</span>
                      <span>Formal Dinner</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="travel-plan-actions">
                <button className="btn btn-secondary">Generate Packing List</button>
                <button className="btn btn-primary">Export PDF</button>
              </div>
            </div>
          </div>
          
          <div className="packing-list-section">
            <h2>Packing List</h2>
            <div className="packing-list">
              <div className="packing-category">
                <h3>Tops</h3>
                <ul>
                  <li>✓ White Blouse</li>
                  <li>✓ Black T-shirt</li>
                  <li>✓ White Shirt</li>
                </ul>
              </div>
              <div className="packing-category">
                <h3>Bottoms</h3>
                <ul>
                  <li>✓ Jeans</li>
                  <li>✓ Formal Pants</li>
                </ul>
              </div>
              <div className="packing-category">
                <h3>Shoes</h3>
                <ul>
                  <li>✓ Sneakers</li>
                  <li>✓ Dress Shoes</li>
                </ul>
              </div>
            </div>
            <button className="btn btn-primary">Export List</button>
          </div>
        </div>
      </div>
    </main>
  );
}

