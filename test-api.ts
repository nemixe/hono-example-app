import { initializeDatabase } from "./src/utils/initDb"

async function testAPI() {
  const baseUrl = "http://localhost:8000"
  
  console.log("🔧 Initializing database with sample data...")
  await initializeDatabase()

  console.log("🧪 Testing API endpoints...")

  // Test root endpoint
  console.log("\n1. Testing root endpoint...")
  try {
    const response = await fetch(`${baseUrl}/`)
    const data = await response.json()
    console.log("✅ Root endpoint:", data.message)
  } catch (error) {
    console.log("❌ Root endpoint failed:", error)
  }

  // Test user registration
  console.log("\n2. Testing user registration...")
  let authToken = ""
  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "testuser",
        email: "test@example.com",
        password: "password123"
      })
    })
    const data = await response.json()
    if (data.success) {
      authToken = data.data.token
      console.log("✅ User registration successful")
    } else {
      console.log("⚠️ User registration response:", data.message)
    }
  } catch (error) {
    console.log("❌ User registration failed:", error)
  }

  // Test equipment list (no auth required)
  console.log("\n3. Testing equipment list...")
  try {
    const response = await fetch(`${baseUrl}/api/alat`)
    const data = await response.json()
    console.log("✅ Equipment list:", data.success ? "Success" : data.message)
  } catch (error) {
    console.log("❌ Equipment list failed:", error)
  }

  // Test creating equipment (auth required)
  console.log("\n4. Testing equipment creation...")
  if (authToken) {
    try {
      const response = await fetch(`${baseUrl}/api/alat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          alat_kategori_id: 1,
          alat_nama: "iPhone 15 Pro",
          alat_deskripsi: "Latest iPhone model",
          alat_harga_sewa_perhari: 50000,
          alat_stok: 5
        })
      })
      const data = await response.json()
      console.log("✅ Equipment creation:", data.success ? "Success" : data.message)
    } catch (error) {
      console.log("❌ Equipment creation failed:", error)
    }
  } else {
    console.log("⚠️ Skipping equipment creation (no auth token)")
  }

  // Test validation error
  console.log("\n5. Testing validation error...")
  if (authToken) {
    try {
      const response = await fetch(`${baseUrl}/api/alat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          alat_kategori_id: 999, // Invalid category
          alat_nama: "",
          alat_harga_sewa_perhari: -100
        })
      })
      const data = await response.json()
      console.log("✅ Validation error handling:", response.status === 422 ? "Success" : "Failed")
    } catch (error) {
      console.log("❌ Validation test failed:", error)
    }
  }

  console.log("\n🎉 API testing completed!")
}

testAPI().catch(console.error)