require('dotenv').config();
const { fetchGoogleSheetCSV } = require('./utils/csvParser');

async function testSheets() {
  console.log('\n🧪 Testing Google Sheets Integration\n');
  console.log('=' .repeat(60));
  
  // Test Market Prices Sheet
  console.log('\n1️⃣  Testing Market Prices Sheet');
  console.log('URL:', process.env.MANDI_SHEET_URL);
  console.log('-'.repeat(60));
  
  try {
    const marketData = await fetchGoogleSheetCSV(process.env.MANDI_SHEET_URL);
    console.log(`✅ Market Data: ${marketData.length} rows`);
    if (marketData.length > 0) {
      console.log('Sample row:', JSON.stringify(marketData[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Market Sheet Error:', error.message);
  }
  
  // Test Schemes Sheet
  console.log('\n2️⃣  Testing Government Schemes Sheet');
  console.log('URL:', process.env.SCHEMES_SHEET_URL);
  console.log('-'.repeat(60));
  
  try {
    const schemesData = await fetchGoogleSheetCSV(process.env.SCHEMES_SHEET_URL);
    console.log(`✅ Schemes Data: ${schemesData.length} rows`);
    if (schemesData.length > 0) {
      console.log('Sample row:', JSON.stringify(schemesData[0], null, 2));
    }
  } catch (error) {
    console.error('❌ Schemes Sheet Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test Complete\n');
}

testSheets();
