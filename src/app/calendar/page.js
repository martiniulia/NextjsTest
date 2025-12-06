import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const { currentUser } = await getAuthenticatedAppForUser();
  
  return (
    <main className="main__home">
      <div className="page-container">
        <div className="page-header">
          <h1>Outfit Calendar</h1>
          <p>Plan your outfits for each day</p>
        </div>
        
        <div className="calendar-container">
          <div className="calendar-header">
            <button className="calendar-nav-btn">←</button>
            <h2>January 2024</h2>
            <button className="calendar-nav-btn">→</button>
          </div>
          
          <div className="calendar-grid">
            <div className="calendar-day-header">Mon</div>
            <div className="calendar-day-header">Tue</div>
            <div className="calendar-day-header">Wed</div>
            <div className="calendar-day-header">Thu</div>
            <div className="calendar-day-header">Fri</div>
            <div className="calendar-day-header">Sat</div>
            <div className="calendar-day-header">Sun</div>
            
            {Array.from({ length: 35 }).map((_, index) => {
              const day = index - 0 + 1;
              const hasOutfit = day === 15 || day === 20 || day === 25;
              
              return (
                <div key={index} className={`calendar-day ${hasOutfit ? 'has-outfit' : ''} ${day < 1 || day > 31 ? 'other-month' : ''}`}>
                  {day > 0 && day <= 31 && (
                    <>
                      <span className="day-number">{day}</span>
                      {hasOutfit && (
                        <div className="outfit-indicator">
                          <div className="outfit-preview-mini">👕👖</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="calendar-outfit-list">
          <h3>Scheduled Outfits</h3>
          <div className="scheduled-outfits">
            <div className="scheduled-outfit-item">
              <div className="scheduled-date">
                <span className="date-day">15</span>
                <span className="date-month">Jan</span>
              </div>
              <div className="scheduled-outfit-info">
                <h4>Casual Weekend</h4>
                <p>White Blouse, Jeans, Sneakers</p>
              </div>
              <button className="icon-btn">✏️</button>
              <button className="icon-btn">🗑️</button>
            </div>
            
            <div className="scheduled-outfit-item">
              <div className="scheduled-date">
                <span className="date-day">20</span>
                <span className="date-month">Jan</span>
              </div>
              <div className="scheduled-outfit-info">
                <h4>Formal Business</h4>
                <p>Suit, Tie, Dress Shoes</p>
              </div>
              <button className="icon-btn">✏️</button>
              <button className="icon-btn">🗑️</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

