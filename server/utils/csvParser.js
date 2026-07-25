const axios = require('axios');

/**
 * Fetch and parse CSV data from Google Sheets
 * @param {string} url - Published Google Sheets CSV URL
 * @returns {Promise<Array>} Parsed CSV data as array of objects
 */
async function fetchGoogleSheetCSV(url) {
  try {
    console.log(`🔍 Attempting to fetch CSV from: ${url.substring(0, 80)}...`);
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Agriculture-AI-Bot/1.0'
      },
      timeout: 10000
    });

    console.log(`✅ Successfully fetched CSV data (${response.data.length} bytes)`);
    const csvData = response.data;
    const parsed = parseCSV(csvData);
    console.log(`📊 Parsed ${parsed.length} rows from CSV`);
    
    return parsed;
  } catch (error) {
    console.error('❌ Error fetching Google Sheet:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data?.substring(0, 200));
    }
    throw new Error(`Failed to fetch data from Google Sheets: ${error.message}`);
  }
}

/**
 * Parse CSV string to array of objects
 * @param {string} csvString - CSV data as string
 * @returns {Array} Array of objects with headers as keys
 */
function parseCSV(csvString) {
  const lines = csvString.trim().split('\n');
  
  if (lines.length === 0) {
    console.warn('⚠️ CSV string is empty');
    return [];
  }

  // Get headers from first line
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  console.log(`📋 CSV Headers: ${headers.join(', ')}`);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }

  console.log(`✅ Successfully parsed ${data.length} data rows`);
  return data;
}

/**
 * Parse a single CSV line (handles quoted values with commas)
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Cache system for Google Sheets data
 */
class SheetCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

// Create cache instances
const marketCache = new SheetCache(5 * 60 * 1000); // 5 minutes
const schemesCache = new SheetCache(10 * 60 * 1000); // 10 minutes

module.exports = {
  fetchGoogleSheetCSV,
  parseCSV,
  marketCache,
  schemesCache
};
