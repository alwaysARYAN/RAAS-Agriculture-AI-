const Market = require('../models/Market');
const { fetchGoogleSheetCSV, marketCache } = require('../utils/csvParser');
const axios = require('axios');

// @desc    Get market prices from Google Sheets
// @route   GET /api/market/prices
// @access  Private
exports.getMarketPrices = async (req, res, next) => {
  try {
    const { commodity, state, district, limit = 50 } = req.query;

    // Check cache first
    let prices = marketCache.get('all_prices');

    if (!prices) {
      console.log('📊 Fetching market prices from Google Sheets...');
      
      try {
        // Fetch from Google Sheets
        const sheetData = await fetchGoogleSheetCSV(process.env.MANDI_SHEET_URL);
        
        // Transform sheet data to our format (matching actual sheet headers)
        prices = sheetData.map(row => ({
          commodity: row.cropEng || row.Commodity || row.commodity,
          variety: row.Variety || row.variety || 'General',
          market: row.market || row.Market || row.market_name || row['Market Name'],
          state: row.State || row.state || 'Not specified',
          district: row.District || row.district || 'Not specified',
          min_price: parseFloat(row.minPrice || row['Min Price'] || row.min_price || row.MinPrice || 0),
          max_price: parseFloat(row.maxPrice || row['Max Price'] || row.max_price || row.MaxPrice || 0),
          modal_price: parseFloat(row.avgPrice || row['Modal Price'] || row.modal_price || row.ModalPrice || row.Price || 0),
          price_unit: row['Price Unit'] || row.price_unit || 'per quintal',
          arrival_date: row.dateUpdated || row.Date || row.price_date || new Date().toISOString().split('T')[0],
          price_trend: row.Trend || row.price_trend || 'Stable',
          arrival_quantity: row['Arrival'] || row.arrival_quantity || '-',
          source: 'Google Sheets'
        })).filter(p => p.commodity && p.modal_price > 0);

        // Cache for 5 minutes
        marketCache.set('all_prices', prices);
        console.log(`✅ Loaded ${prices.length} market prices from Google Sheets`);
        
      } catch (sheetError) {
        console.error('Failed to fetch from Google Sheets:', sheetError.message);
        console.log('Using database fallback...');
        
        // Fallback to database
        prices = await Market.find({}).sort({ price_date: -1 }).limit(50).lean();
        
        if (prices.length === 0) {
          // Use sample data as last resort
          prices = getSampleMarketData();
        }
      }
    }

    // Filter based on query parameters
    let filteredPrices = prices;
    
    if (commodity) {
      const commodityRegex = new RegExp(commodity, 'i');
      filteredPrices = filteredPrices.filter(p => commodityRegex.test(p.commodity));
    }
    
    if (state) {
      const stateRegex = new RegExp(state, 'i');
      filteredPrices = filteredPrices.filter(p => stateRegex.test(p.state));
    }
    
    if (district) {
      const districtRegex = new RegExp(district, 'i');
      filteredPrices = filteredPrices.filter(p => districtRegex.test(p.district));
    }

    // Limit results
    filteredPrices = filteredPrices.slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: filteredPrices.length,
      total: prices.length,
      data: filteredPrices,
      last_updated: new Date()
    });

  } catch (error) {
    console.error('Get market prices error:', error);
    next(error);
  }
};

// Sample data function
function getSampleMarketData() {
  return [
    {
      commodity: 'Wheat',
      variety: 'General',
      market_name: 'APMC Market',
      state: 'Maharashtra',
      district: 'Pune',
      min_price: 2000,
      max_price: 2200,
      modal_price: 2100,
      price_unit: 'per quintal',
      price_date: new Date().toISOString().split('T')[0],
      price_trend: 'Stable',
      arrival_quantity: '500 quintals',
      source: 'Sample Data'
    },
    {
      commodity: 'Rice',
      variety: 'Paddy',
      market_name: 'Mandi',
      state: 'Punjab',
      district: 'Ludhiana',
      min_price: 1800,
      max_price: 2000,
      modal_price: 1900,
      price_unit: 'per quintal',
      price_date: new Date().toISOString().split('T')[0],
      price_trend: 'Up',
      arrival_quantity: '800 quintals',
      source: 'Sample Data'
    },
    {
      commodity: 'Tomato',
      variety: 'Hybrid',
      market_name: 'Vegetable Market',
      state: 'Maharashtra',
      district: 'Nashik',
      min_price: 800,
      max_price: 1200,
      modal_price: 1000,
      price_unit: 'per quintal',
      price_date: new Date().toISOString().split('T')[0],
      price_trend: 'Up',
      arrival_quantity: '200 quintals',
      source: 'Sample Data'
    }
  ];
}

// @desc    Get price comparison for a commodity
// @route   GET /api/market/compare/:commodity
// @access  Private
exports.comparePrices = async (req, res, next) => {
  try {
    const { commodity } = req.params;
    const { state } = req.query;

    const query = {
      commodity: new RegExp(commodity, 'i')
    };

    if (state) {
      query.state = new RegExp(state, 'i');
    }

    const prices = await Market.find(query)
      .sort({ 'price_data.modal_price': -1 })
      .limit(10);

    if (prices.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No price data found for ${commodity}`
      });
    }

    // Calculate statistics
    const modalPrices = prices.map(p => p.price_data.modal_price);
    const avgPrice = modalPrices.reduce((a, b) => a + b, 0) / modalPrices.length;
    const highestPrice = Math.max(...modalPrices);
    const lowestPrice = Math.min(...modalPrices);

    // Find best markets
    const bestMarket = prices[0]; // Highest price
    const lowestMarket = prices[prices.length - 1]; // Lowest price

    res.status(200).json({
      success: true,
      data: {
        commodity,
        statistics: {
          average_price: Math.round(avgPrice),
          highest_price: highestPrice,
          lowest_price: lowestPrice,
          price_variance: highestPrice - lowestPrice
        },
        best_market: {
          market_name: bestMarket.market_name,
          district: bestMarket.district,
          state: bestMarket.state,
          price: bestMarket.price_data.modal_price
        },
        all_markets: prices,
        recommendation: highestPrice > avgPrice * 1.2 
          ? `Consider selling at ${bestMarket.market_name}, ${bestMarket.district} for best returns`
          : 'Prices are relatively stable across markets'
      }
    });

  } catch (error) {
    console.error('Compare prices error:', error);
    next(error);
  }
};

// @desc    Add or update market price
// @route   POST /api/market/prices
// @access  Private (Admin or verified users)
exports.addMarketPrice = async (req, res, next) => {
  try {
    const {
      commodity,
      variety,
      market_name,
      state,
      district,
      min_price,
      max_price,
      modal_price,
      price_unit,
      arrival_quantity,
      price_trend
    } = req.body;

    // Validate required fields
    if (!commodity || !market_name || !state || !district || !min_price || !max_price || !modal_price) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required price information'
      });
    }

    const marketPrice = await Market.create({
      commodity,
      variety: variety || 'General',
      market_name,
      mandi_name: market_name,
      state,
      district,
      price_data: {
        min_price,
        max_price,
        modal_price
      },
      price_unit: price_unit || 'per quintal',
      arrival_quantity: arrival_quantity || 0,
      price_date: new Date(),
      price_trend: price_trend || 'Stable',
      source: 'Manual Entry',
      is_verified: req.user.role === 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Market price added successfully',
      data: marketPrice
    });

  } catch (error) {
    console.error('Add market price error:', error);
    next(error);
  }
};

// @desc    Get trending commodities
// @route   GET /api/market/trending
// @access  Private
exports.getTrendingCommodities = async (req, res, next) => {
  try {
    // Get commodities with upward price trends
    const trendingUp = await Market.find({
      price_trend: 'Up',
      price_date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    })
      .sort({ change_percentage: -1 })
      .limit(5);

    // Get commodities with downward price trends
    const trendingDown = await Market.find({
      price_trend: 'Down',
      price_date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
      .sort({ change_percentage: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        rising_prices: trendingUp,
        falling_prices: trendingDown
      }
    });

  } catch (error) {
    console.error('Get trending commodities error:', error);
    next(error);
  }
};

// @desc    Get price history for a commodity
// @route   GET /api/market/history/:commodity
// @access  Private
exports.getPriceHistory = async (req, res, next) => {
  try {
    const { commodity } = req.params;
    const { days = 30, state, district } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const query = {
      commodity: new RegExp(commodity, 'i'),
      price_date: { $gte: startDate }
    };

    if (state) query.state = new RegExp(state, 'i');
    if (district) query.district = new RegExp(district, 'i');

    const history = await Market.find(query)
      .sort({ price_date: 1 })
      .select('commodity market_name state district price_data price_date price_trend');

    if (history.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No price history found for ${commodity}`
      });
    }

    // Calculate trend
    const firstPrice = history[0].price_data.modal_price;
    const lastPrice = history[history.length - 1].price_data.modal_price;
    const priceChange = lastPrice - firstPrice;
    const percentageChange = (priceChange / firstPrice) * 100;

    res.status(200).json({
      success: true,
      data: {
        commodity,
        period: `Last ${days} days`,
        price_change: Math.round(priceChange),
        percentage_change: percentageChange.toFixed(2),
        trend: priceChange > 0 ? 'Increasing' : priceChange < 0 ? 'Decreasing' : 'Stable',
        history
      }
    });

  } catch (error) {
    console.error('Get price history error:', error);
    next(error);
  }
};
