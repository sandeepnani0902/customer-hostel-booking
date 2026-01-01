// Utility to generate nearby places based on hostel location
export const generateNearbyPlaces = (hostelLocation) => {
  const locationKeywords = hostelLocation.toLowerCase()
  
  // Location-specific places
  const locationSpecificPlaces = {
    'koramangala': [
      { name: 'Koramangala Metro', icon: 'bi-train-front', distance: 0.6 },
      { name: 'Forum Mall', icon: 'bi-shop', distance: 1.2 },
      { name: 'Manipal Hospital', icon: 'bi-hospital', distance: 0.9 },
      { name: 'Sarjapur Road', icon: 'bi-signpost', distance: 2.8 }
    ],
    'whitefield': [
      { name: 'Whitefield Railway Station', icon: 'bi-train-freight-front', distance: 1.8 },
      { name: 'ITPL', icon: 'bi-building', distance: 2.5 },
      { name: 'Phoenix MarketCity', icon: 'bi-shop', distance: 3.2 },
      { name: 'Manipal Hospital', icon: 'bi-hospital', distance: 1.5 }
    ],
    'hsr layout': [
      { name: 'HSR Layout Metro', icon: 'bi-train-front', distance: 0.8 },
      { name: 'Central Mall', icon: 'bi-shop', distance: 1.1 },
      { name: 'Agara Lake', icon: 'bi-water', distance: 2.0 },
      { name: 'Outer Ring Road', icon: 'bi-signpost', distance: 0.5 }
    ],
    'btm layout': [
      { name: 'Jayadeva Metro', icon: 'bi-train-front', distance: 1.2 },
      { name: 'BTM Layout Bus Stand', icon: 'bi-bus-front', distance: 0.3 },
      { name: 'Fortis Hospital', icon: 'bi-hospital', distance: 1.8 },
      { name: 'Silk Board', icon: 'bi-signpost', distance: 2.5 }
    ],
    'indiranagar': [
      { name: 'Indiranagar Metro', icon: 'bi-train-front', distance: 0.7 },
      { name: '100 Feet Road', icon: 'bi-signpost', distance: 0.4 },
      { name: 'CMH Road', icon: 'bi-signpost', distance: 0.9 },
      { name: 'Garuda Mall', icon: 'bi-shop', distance: 1.5 }
    ],
    'electronic city': [
      { name: 'Electronic City Metro', icon: 'bi-train-front', distance: 1.0 },
      { name: 'Infosys Campus', icon: 'bi-building', distance: 0.8 },
      { name: 'Wipro Campus', icon: 'bi-building', distance: 1.2 },
      { name: 'Hosur Road', icon: 'bi-signpost', distance: 0.6 }
    ],
  }

  // Generate random distances for base places (0.1 to 2.5 km)
  const generateRandomDistance = () => (Math.random() * 2.4 + 0.1).toFixed(1)

  // Get location-specific places
  let nearbyPlaces = []
  
  for (const [location, places] of Object.entries(locationSpecificPlaces)) {
    if (locationKeywords.includes(location)) {
      nearbyPlaces = places
      break
    }
  }

  // If no specific places found, generate generic ones
  if (nearbyPlaces.length === 0) {
    nearbyPlaces = [
      { name: 'Metro Station', icon: 'bi-train-front', distance: generateRandomDistance() },
      { name: 'Bus Stop', icon: 'bi-bus-front', distance: generateRandomDistance() },
      { name: 'ATM', icon: 'bi-credit-card', distance: generateRandomDistance() },
      { name: 'Hospital', icon: 'bi-hospital', distance: generateRandomDistance() }
    ]
  }

  // Add common places
  const commonPlaces = [
    { name: 'Police Station', icon: 'bi-shield-check', distance: generateRandomDistance() },
    { name: 'Bank', icon: 'bi-bank', distance: generateRandomDistance() }
  ]

  return [...nearbyPlaces, ...commonPlaces].slice(0, 6)
}

// Get color class based on place type
export const getPlaceColor = (icon) => {
  const colorMap = {
    'bi-train-front': 'text-primary',
    'bi-train-freight-front': 'text-primary', 
    'bi-bus-front': 'text-secondary',
    'bi-hospital': 'text-danger',
    'bi-shop': 'text-success',
    'bi-credit-card': 'text-warning',
    'bi-bank': 'text-warning',
    'bi-building': 'text-primary',
    'bi-mortarboard': 'text-info',
    'bi-airplane': 'text-primary',
    'bi-shield-check': 'text-success'
  }
  return colorMap[icon] || 'text-muted'
}