import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function AIRecommendationsPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>AI Recommendations</h1>
          <p>Automated outfit suggestions based on your preferences, weather, and events</p>
        </div>
        
        <div className="ai-recommendations">
          <div className="recommendation-filters">
            <div className="filter-group">
              <label>Based on:</label>
              <div className="filter-options">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  User preferences
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  Current weather
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" />
                  Calendar events
                </label>
              </div>
            </div>
            <button className="btn btn-primary">Generate Recommendations</button>
          </div>
          
          <div className="weather-info">
            <h3>Weather Information</h3>
            <div className="weather-display">
              <span className="weather-icon">☀️</span>
              <div className="weather-details">
                <p><strong>Bucharest</strong></p>
                <p>25°C - Sunny</p>
                <p>Perfect for light outfits</p>
              </div>
            </div>
          </div>
          
          <div className="recommendations-list">
            <div className="recommendation-card">
              <div className="recommendation-header">
                <h3>Recommended Outfit #1</h3>
                <span className="confidence-badge">95% match</span>
              </div>
              <div className="recommendation-preview">
                <div className="recommended-items">
                  <div className="recommended-item">👕 White Blouse</div>
                  <div className="recommended-item">👖 Jeans</div>
                  <div className="recommended-item">👟 Sneakers</div>
                </div>
              </div>
              <div className="recommendation-reason">
                <p><strong>Why:</strong> Perfect for current weather and your preferred casual style</p>
              </div>
              <button className="btn btn-primary">Save Outfit</button>
            </div>
            
            <div className="recommendation-card">
              <div className="recommendation-header">
                <h3>Recommended Outfit #2</h3>
                <span className="confidence-badge">88% match</span>
              </div>
              <div className="recommendation-preview">
                <div className="recommended-items">
                  <div className="recommended-item">👗 Dress</div>
                  <div className="recommended-item">👠 Sandals</div>
                  <div className="recommended-item">👜 Bag</div>
                </div>
              </div>
              <div className="recommendation-reason">
                <p><strong>Why:</strong> Ideal for a warm day and elegant style</p>
              </div>
              <button className="btn btn-primary">Save Outfit</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

