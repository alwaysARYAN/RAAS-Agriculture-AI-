const Scheme = require('../models/Scheme');
const { fetchGoogleSheetCSV, schemesCache } = require('../utils/csvParser');

// @desc    Get all government schemes from Google Sheets
// @route   GET /api/schemes
// @access  Private
exports.getSchemes = async (req, res, next) => {
  try {
    const { scheme_type, government_level, state, search } = req.query;

    // Check cache first
    let schemes = schemesCache.get('all_schemes');

    if (!schemes) {
      console.log('📋 Fetching schemes from Google Sheets...');
      
      try {
        // Fetch from Google Sheets
        const sheetData = await fetchGoogleSheetCSV(process.env.SCHEMES_SHEET_URL);
        
        // Transform sheet data to our format (matching actual sheet headers)
        schemes = sheetData.map(row => ({
          scheme_name: row.schemeName || row['Scheme Name'] || row.scheme_name || row.SchemeName,
          scheme_code: row.schemeCode || row['Scheme Code'] || row.scheme_code || row.SchemeCode || row.schemeName?.substring(0, 10).toUpperCase(),
          description: row.benefitsHindi || row.Description || row.description || row.benefits || 'Government agricultural scheme',
          scheme_type: row.Type || row['Scheme Type'] || row.scheme_type || 'Subsidy',
          government_level: row.Level || row['Government Level'] || row.government_level || 'Central',
          eligible_states: (row.eligibleStates || row['Eligible States'] || row.eligible_states || 'All').split(',').map(s => s.trim()),
          min_land_size: parseFloat(row.minLandSize || row['Min Land Size'] || row.min_land_size || 0),
          benefits: row.benefitsGujarati || row.Benefits || row.benefits || row.benefitsHindi || 'Agricultural benefits provided',
          eligibility: row.eligibility || row.Eligibility || 'As per government norms',
          subsidy_amount: parseFloat(row.subsidyAmount || row['Subsidy Amount'] || row.subsidy_amount || 0),
          subsidy_percentage: parseFloat(row.subsidyPercentage || row['Subsidy %'] || row.subsidy_percentage || 0),
          application_process: row.applicationProcess || row['Application Process'] || row.application_process || 'Apply through nearest government office',
          required_documents: (row.requiredDocuments || row['Required Documents'] || row.required_documents || '').split(',').map(d => d.trim()).filter(d => d),
          official_website: row.website || row.Website || row.official_website || 'https://agricoop.nic.in',
          helpline_number: row.helpline || row.Helpline || row.helpline_number || '1800-180-1551',
          is_active: true,
          source: 'Google Sheets'
        })).filter(s => s.scheme_name);

        // Cache for 10 minutes
        schemesCache.set('all_schemes', schemes);
        console.log(`✅ Loaded ${schemes.length} schemes from Google Sheets`);
        
      } catch (sheetError) {
        console.error('Failed to fetch from Google Sheets:', sheetError.message);
        console.log('Using sample schemes...');
        schemes = getSampleSchemes();
      }
    }

    // Filter based on query parameters
    let filteredSchemes = schemes;
    
    if (scheme_type) {
      filteredSchemes = filteredSchemes.filter(s => 
        s.scheme_type && s.scheme_type.toLowerCase().includes(scheme_type.toLowerCase())
      );
    }
    
    if (government_level) {
      filteredSchemes = filteredSchemes.filter(s => 
        s.government_level && s.government_level.toLowerCase().includes(government_level.toLowerCase())
      );
    }
    
    if (state) {
      filteredSchemes = filteredSchemes.filter(s => 
        !s.eligible_states || 
        s.eligible_states.length === 0 || 
        s.eligible_states.includes('All') ||
        s.eligible_states.some(st => st.toLowerCase().includes(state.toLowerCase()))
      );
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filteredSchemes = filteredSchemes.filter(s => 
        searchRegex.test(s.scheme_name) || 
        searchRegex.test(s.description) ||
        searchRegex.test(s.benefits)
      );
    }

    res.status(200).json({
      success: true,
      count: filteredSchemes.length,
      total: schemes.length,
      data: filteredSchemes,
      last_updated: new Date()
    });

  } catch (error) {
    console.error('Get schemes error:', error);
    next(error);
  }
};

// Sample schemes function
function getSampleSchemes() {
  return [
    {
      scheme_name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
      scheme_code: 'PM-KISAN',
      description: 'Income support providing ₹6,000 per year to all landholding farmers',
      scheme_type: 'Subsidy',
      government_level: 'Central',
      eligible_states: ['All'],
      min_land_size: 0,
      benefits: 'Direct income support of ₹6,000 per year in three installments',
      subsidy_amount: 6000,
      application_process: 'Apply online through PM-KISAN portal or nearest CSC',
      required_documents: ['Aadhaar', 'Land Records', 'Bank Account'],
      official_website: 'https://pmkisan.gov.in',
      helpline_number: '011-24300606',
      is_active: true,
      source: 'Sample Data'
    },
    {
      scheme_name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      scheme_code: 'PMFBY',
      description: 'Crop insurance protecting against natural calamities and pests',
      scheme_type: 'Insurance',
      government_level: 'Central',
      eligible_states: ['All'],
      min_land_size: 0,
      benefits: 'Insurance coverage with subsidized premium (2% Kharif, 1.5% Rabi)',
      subsidy_percentage: 50,
      application_process: 'Apply through banks or online within cutoff dates',
      required_documents: ['Land Records', 'Sowing Certificate', 'Bank Account'],
      official_website: 'https://pmfby.gov.in',
      helpline_number: '011-23382012',
      is_active: true,
      source: 'Sample Data'
    },
    {
      scheme_name: 'Kisan Credit Card (KCC)',
      scheme_code: 'KCC',
      description: 'Credit facility for farmers for cultivation and related needs',
      scheme_type: 'Credit',
      government_level: 'Central',
      eligible_states: ['All'],
      min_land_size: 0,
      benefits: 'Easy credit access with interest subvention of 2-3%',
      subsidy_percentage: 0,
      application_process: 'Apply at any bank branch with required documents',
      required_documents: ['Identity Proof', 'Address Proof', 'Land Records'],
      official_website: 'https://agricoop.nic.in',
      helpline_number: '1800-180-1551',
      is_active: true,
      source: 'Sample Data'
    }
  ];
}

// @desc    Get eligible schemes for logged in farmer
// @route   GET /api/schemes/eligible
// @access  Private
exports.getEligibleSchemes = async (req, res, next) => {
  try {
    const farmer = req.user;

    if (!farmer.state || !farmer.landSize) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your profile with state and land size information'
      });
    }

    // Get all active schemes
    let schemes = await Scheme.find({ is_active: true });

    // Filter eligible schemes
    const eligibleSchemes = schemes.filter(scheme => 
      scheme.isEligible(farmer.state, farmer.landSize)
    );

    // If no schemes in database, create sample schemes
    if (eligibleSchemes.length === 0) {
      console.log('Creating sample government schemes');
      
      const sampleSchemes = [
        {
          scheme_name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
          scheme_code: 'PM-KISAN',
          description: 'Income support scheme providing ₹6,000 per year in three equal installments to all landholding farmer families.',
          scheme_type: 'Subsidy',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0,
            farmer_category: ['All']
          },
          benefits: 'Direct income support of ₹6,000 per year in three installments of ₹2,000 each',
          subsidy_amount: 6000,
          application_process: 'Visit nearest Common Service Centre or apply online through PM-KISAN portal',
          required_documents: ['Aadhaar Card', 'Land Records', 'Bank Account Details'],
          official_website: 'https://pmkisan.gov.in',
          helpline_number: '011-24300606',
          is_active: true
        },
        {
          scheme_name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
          scheme_code: 'PMFBY',
          description: 'Crop insurance scheme protecting farmers against crop loss due to natural calamities, pests, and diseases.',
          scheme_type: 'Insurance',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0,
            farmer_category: ['All']
          },
          benefits: 'Insurance coverage for crop loss with subsidized premium rates. Premium: 2% for Kharif, 1.5% for Rabi',
          subsidy_percentage: 50,
          application_process: 'Apply through banks, CSCs, or online portal within cutoff dates',
          required_documents: ['Land Records', 'Sowing Certificate', 'Bank Account', 'Aadhaar'],
          official_website: 'https://pmfby.gov.in',
          helpline_number: '011-23382012',
          is_active: true
        },
        {
          scheme_name: 'Kisan Credit Card (KCC)',
          scheme_code: 'KCC',
          description: 'Credit facility for farmers to meet their agricultural needs including crop cultivation, maintenance, and marketing.',
          scheme_type: 'Loan',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0,
            farmer_category: ['All']
          },
          benefits: 'Easy access to credit with interest subvention of 2% and prompt repayment incentive of 3%',
          subsidy_percentage: 5,
          application_process: 'Apply through any bank with KCC facility. Documents required for verification.',
          required_documents: ['Land Records', 'Identity Proof', 'Address Proof', 'Passport Photo'],
          official_website: 'https://www.india.gov.in',
          helpline_number: '1800-180-1551',
          is_active: true
        },
        {
          scheme_name: 'Soil Health Card Scheme',
          scheme_code: 'SHC',
          description: 'Free soil testing and health card providing recommendations on nutrient management for improving soil health.',
          scheme_type: 'Other',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0,
            farmer_category: ['All']
          },
          benefits: 'Free soil testing every 2 years with customized fertilizer recommendations',
          application_process: 'Contact local agriculture department or visit soil testing lab',
          required_documents: ['Land Records', 'Identity Proof'],
          official_website: 'https://soilhealth.dac.gov.in',
          helpline_number: '011-23070370',
          is_active: true
        },
        {
          scheme_name: 'National Agriculture Market (e-NAM)',
          scheme_code: 'eNAM',
          description: 'Online trading platform for agricultural commodities enabling farmers to sell produce across India.',
          scheme_type: 'Market Support',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0,
            farmer_category: ['All']
          },
          benefits: 'Access to nationwide market, transparent price discovery, and online payment',
          application_process: 'Register at nearest e-NAM mandi with required documents',
          required_documents: ['Bank Account', 'Mobile Number', 'Farmer Registration'],
          official_website: 'https://www.enam.gov.in',
          helpline_number: '1800-270-0224',
          is_active: true
        },
        {
          scheme_name: 'Paramparagat Krishi Vikas Yojana (PKVY)',
          scheme_code: 'PKVY',
          description: 'Promotion of organic farming through cluster approach and PGS certification.',
          scheme_type: 'Subsidy',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0,
            farmer_category: ['All']
          },
          benefits: 'Financial assistance of ₹50,000 per hectare for 3 years for organic farming adoption',
          subsidy_amount: 50000,
          application_process: 'Apply through State Agriculture Department in cluster groups',
          required_documents: ['Land Records', 'Group Formation Document', 'Bank Details'],
          official_website: 'https://pgsindia-ncof.gov.in',
          helpline_number: '011-23070271',
          is_active: true
        },
        {
          scheme_name: 'Micro Irrigation Fund',
          scheme_code: 'MIF',
          description: 'Financial support for installation of drip and sprinkler irrigation systems.',
          scheme_type: 'Equipment',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 0.5,
            farmer_category: ['All']
          },
          benefits: 'Subsidy up to 90% for small/marginal farmers for micro irrigation installation',
          subsidy_percentage: 90,
          application_process: 'Apply through State Agriculture Department or Horticulture Department',
          required_documents: ['Land Records', 'Bank Account', 'Quotation for Equipment'],
          official_website: 'https://pmksy.gov.in',
          helpline_number: '011-23382012',
          is_active: true
        },
        {
          scheme_name: 'Sub-Mission on Agricultural Mechanization (SMAM)',
          scheme_code: 'SMAM',
          description: 'Financial assistance for purchase of agricultural machinery and equipment.',
          scheme_type: 'Equipment',
          government_level: 'Central',
          eligible_states: [],
          eligibility_criteria: {
            min_land_size: 1,
            farmer_category: ['All']
          },
          benefits: 'Subsidy 40-50% on farm machinery purchase. Higher subsidy for SC/ST/Women farmers',
          subsidy_percentage: 50,
          application_process: 'Apply online through DBT Agriculture portal with required documents',
          required_documents: ['Land Records', 'Caste Certificate (if applicable)', 'Bank Account', 'Aadhaar'],
          official_website: 'https://agrimachinery.nic.in',
          helpline_number: '011-23382012',
          is_active: true
        }
      ];

      // Create schemes in database
      await Scheme.insertMany(sampleSchemes);
      
      // Re-fetch eligible schemes
      schemes = await Scheme.find({ is_active: true });
      const newEligibleSchemes = schemes.filter(scheme => 
        scheme.isEligible(farmer.state, farmer.landSize)
      );

      return res.status(200).json({
        success: true,
        count: newEligibleSchemes.length,
        farmer_profile: {
          state: farmer.state,
          land_size: farmer.landSize
        },
        data: newEligibleSchemes
      });
    }

    res.status(200).json({
      success: true,
      count: eligibleSchemes.length,
      farmer_profile: {
        state: farmer.state,
        land_size: farmer.landSize
      },
      data: eligibleSchemes
    });

  } catch (error) {
    console.error('Get eligible schemes error:', error);
    next(error);
  }
};

// @desc    Get single scheme by ID
// @route   GET /api/schemes/:id
// @access  Private
exports.getSchemeById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);

    if (!scheme) {
      return res.status(404).json({
        success: false,
        message: 'Scheme not found'
      });
    }

    // Check if farmer is eligible
    let isEligible = false;
    if (req.user.state && req.user.landSize) {
      isEligible = scheme.isEligible(req.user.state, req.user.landSize);
    }

    res.status(200).json({
      success: true,
      data: {
        scheme,
        is_eligible: isEligible
      }
    });

  } catch (error) {
    console.error('Get scheme by ID error:', error);
    next(error);
  }
};

// @desc    Search schemes
// @route   GET /api/schemes/search
// @access  Private
exports.searchSchemes = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Please provide search query'
      });
    }

    const schemes = await Scheme.find({
      is_active: true,
      $or: [
        { scheme_name: new RegExp(query, 'i') },
        { description: new RegExp(query, 'i') },
        { scheme_type: new RegExp(query, 'i') }
      ]
    });

    res.status(200).json({
      success: true,
      count: schemes.length,
      data: schemes
    });

  } catch (error) {
    console.error('Search schemes error:', error);
    next(error);
  }
};

// @desc    Add new scheme (Admin only)
// @route   POST /api/schemes
// @access  Private/Admin
exports.createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Scheme created successfully',
      data: scheme
    });

  } catch (error) {
    console.error('Create scheme error:', error);
    next(error);
  }
};
