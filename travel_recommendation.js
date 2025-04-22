async function fetchTravelData() {
    try {
      const response = await fetch('./travel_recommendation_api.json');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching travel data:", error);
    }
  }
  
  function createCard(item) {
    return `
      <div class="recommendation-card">
        <img src="${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
    `;
  }
  
  function renderRecommendations(items) {
    const container = document.getElementById('recommendations');
    container.innerHTML = items.map(createCard).join('');
  }
  
  function setupSearch(data) {
    document.getElementById("btnSearch").addEventListener("click", () => {
      const input = document.getElementById("destinationInput").value.trim().toLowerCase();
      const keyword = input.endsWith("es") ? input.slice(0, -2) :
                      input.endsWith("s") ? input.slice(0, -1) : input;
  
      let results = [];
  
      if (keyword === "beach") {
        results = data.beaches?.slice(0, 2);
      } else if (keyword === "temple") {
        results = data.temples?.slice(0, 2);
      } else {
        const country = data.countries?.find(c =>
          c.name.toLowerCase().includes(keyword)
        );
        results = country?.cities?.slice(0, 2) || [];
      }
  
      renderRecommendations(results.length > 0 ? results : [{
        name: "No results found",
        imageUrl: "https://via.placeholder.com/300x200?text=No+Image",
        description: "Try a different keyword like 'beach', 'temple', or a country name."
      }]);
    });
  }
  
  async function init() {
    const travelData = await fetchTravelData();
    setupSearch(travelData);
  }
  
  init();
  