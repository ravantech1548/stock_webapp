(function () {
  'use strict';

  /* ---- BUILT-IN NIFTY PRESETS (All 11 NSE Sectoral Watchlists) ---- */
  const NIFTY_PRESETS = {
    "ZERODHA-LIST": {
        "id": "ZERODHA-LIST",
        "name": "Zerodha List",
        "description": "Custom Zerodha Watchlist with 190+ tracked stocks and ETFs",
        "stocks": [
            {
                "symbol": "AXISBANK",
                "name": "Axis Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "EQUITASBNK",
                "name": "Equitas Small Finance Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HDFCBANK",
                "name": "HDFC Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ICICIBANK",
                "name": "ICICI Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IDBI",
                "name": "IDBI Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IDFCFIRSTB",
                "name": "IDFC First Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "INDUSINDBK",
                "name": "IndusInd Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SBIN",
                "name": "State Bank of India",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SOUTHBANK",
                "name": "The South Indian Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "YESBANK",
                "name": "Yes Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BAJFINANCE",
                "name": "Bajaj Finance Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SAMMAANCAP",
                "name": "Sammaan Capital Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LICHSGFIN",
                "name": "LIC Housing Finance Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MANAPPURAM",
                "name": "Manappuram Finance Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PFC",
                "name": "Power Finance Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PFS",
                "name": "PTC India Financial Services Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PTC",
                "name": "PTC India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PTL",
                "name": "PTL Enterprises Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RECLTD",
                "name": "REC Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SHRIRAMFIN",
                "name": "Shriram Finance Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HDFCAMC",
                "name": "HDFC Asset Management Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NAM-INDIA",
                "name": "Nippon Life India Asset Management Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CDSL",
                "name": "Central Depository Services (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IVC",
                "name": "IL&FS Investment Managers Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ISEC",
                "name": "ICICI Securities Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "AUROPHARMA",
                "name": "Aurobindo Pharma Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CIPLA",
                "name": "Cipla Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GLAND",
                "name": "Gland Pharma Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GLENMARK",
                "name": "Glenmark Pharmaceuticals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IOLCP",
                "name": "IOL Chemicals and Pharmaceuticals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JUBLPHARMA",
                "name": "Jubilant Pharmova Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SUNPHARMA",
                "name": "Sun Pharmaceutical Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IEX",
                "name": "Indian Energy Exchange Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BCG",
                "name": "Brightcom Group Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BALMLAWRIE",
                "name": "Balmer Lawrie & Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BLIL",
                "name": "Balmer Lawrie Investments Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BPCL",
                "name": "Bharat Petroleum Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "COALINDIA",
                "name": "Coal India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GAIL",
                "name": "GAIL (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GMDCLTD",
                "name": "Gujarat Mineral Development Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HINDZINC",
                "name": "Hindustan Zinc Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IOC",
                "name": "Indian Oil Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JINDALSTEL",
                "name": "JINDAL STEEL LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MAANALU",
                "name": "Maan Aluminium Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MOIL",
                "name": "MOIL Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NATIONALUM",
                "name": "National Aluminium Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NLCINDIA",
                "name": "NLC India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NMDC",
                "name": "NMDC Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NTPC",
                "name": "NTPC Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ONGC",
                "name": "Oil & Natural Gas Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SAIL",
                "name": "Steel Authority of India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TATASTEEL",
                "name": "Tata Steel Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VEDL",
                "name": "Vedanta Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HGINFRA",
                "name": "H.G. Infra Engineering Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IRB",
                "name": "IRB Infrastructure Developers Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IRCON",
                "name": "Ircon International Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IRCTC",
                "name": "Indian Railway Catering And Tourism Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JPASSOCIAT",
                "name": "Jaiprakash Associates Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KEC",
                "name": "KEC International Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LT",
                "name": "Larsen & Toubro Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NBCC",
                "name": "NBCC (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NCC",
                "name": "NCC Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PARSVNATH",
                "name": "Parsvnath Developers Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RITES",
                "name": "RITES Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SADBHAV",
                "name": "Sadbhav Engineering Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SIMPLEXINF",
                "name": "Simplex Infrastructures Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SOBHA",
                "name": "Sobha Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SREINFRA",
                "name": "SREI Infrastructure Finance Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KAJARIACER",
                "name": "Kajaria Ceramics Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "POKARNA",
                "name": "Pokarna Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PRSMJOHNSN",
                "name": "Prism Johnson Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ULTRACEMCO",
                "name": "UltraTech Cement Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "EMBASSY",
                "name": "Embassy Office Parks REIT",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "APLAPOLLO",
                "name": "APL Apollo Tubes Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "APOLLOPIPE",
                "name": "Apollo Pipes Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GRAPHITE",
                "name": "Graphite India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HEG",
                "name": "HEG Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GOACARBON",
                "name": "Goa Carbon Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PCBL",
                "name": "PCBL Chemical Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RAIN",
                "name": "Rain Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GMBREW",
                "name": "GM Breweries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IONEXCHANG",
                "name": "ION Exchange (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VSTIND",
                "name": "VST Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ARE&M",
                "name": "Amara Raja Energy & Mobility Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ASHOKLEY",
                "name": "Ashok Leyland Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BAJAJ-AUTO",
                "name": "Bajaj Auto Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BANCOINDIA",
                "name": "Banco Products (I) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GABRIEL",
                "name": "Gabriel India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JAMNAAUTO",
                "name": "Jamna Auto Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MINDACORP",
                "name": "Minda Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "M&M",
                "name": "Mahindra & Mahindra Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "OMAXAUTO",
                "name": "Omax Autos Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SAMKRG",
                "name": "Samkrg Pistons and Rings Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TALBROAUTO",
                "name": "Talbros Automotive Components Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TMPV",
                "name": "Tata Motors Passenger Vehicles Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TVSMOTOR",
                "name": "TVS Motor Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DEN",
                "name": "Den Networks Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GTPL",
                "name": "GTPL Hathway Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HATHWAY",
                "name": "Hathway Cable & Datacom Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PVRINOX",
                "name": "PVR INOX Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SAREGAMA",
                "name": "Saregama India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SUNTV",
                "name": "Sun TV Network Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NETWORK18",
                "name": "Network18 Media & Investments Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TTML",
                "name": "Tata Teleservices (Maharashtra) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ZEEL",
                "name": "Zee Entertainment Enterprises Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "AKSHOPTFBR",
                "name": "Aksh Optifibre Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IDEA",
                "name": "Vodafone Idea Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TATACOMM",
                "name": "Tata Communications Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "INDIGO",
                "name": "InterGlobe Aviation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MANAKSIA",
                "name": "Manaksia Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TCI",
                "name": "Transport Corporation of India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TITAGARH",
                "name": "TITAGARH RAIL SYSTEMS LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BORORENEW",
                "name": "BOROSIL RENEWABLES LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MPSLTD",
                "name": "MPS Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "UFLEX",
                "name": "UFLEX Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "XPROINDIA",
                "name": "Xpro India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PAKKA",
                "name": "PAKKA LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BAJAJHIND",
                "name": "Bajaj Hindusthan Sugar Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RENUKA",
                "name": "Shree Renuka Sugars Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GRWRHITECH",
                "name": "Garware Hi-Tech Films Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "AVTNPL",
                "name": "AVT Natural Products Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BRITANNIA",
                "name": "Britannia Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RBA",
                "name": "Restaurant Brands Asia Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "COLPAL",
                "name": "Colgate Palmolive (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HATSUN",
                "name": "Hatsun Agro Product Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "UMANGDAIRY",
                "name": "Umang Dairies Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HINDUNILVR",
                "name": "Hindustan Unilever Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JUBLFOOD",
                "name": "Jubilant Foodworks Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MARICO",
                "name": "Marico Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NESTLEIND",
                "name": "Nestle India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PGHL",
                "name": "Procter & Gamble Health Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PATANJALI",
                "name": "Patanjali Foods Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TASTYBITE",
                "name": "Tasty Bite Eatables Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TATACONSUM",
                "name": "TATA CONSUMER PRODUCTS LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DMART",
                "name": "Avenue Supermarts Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "FCONSUMER",
                "name": "Future Consumer Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "FEL",
                "name": "Future Enterprises Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "FRETAIL",
                "name": "Future Retail Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SHOPERSTOP",
                "name": "Shoppers Stop Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "V2RETAIL",
                "name": "V2 Retail Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VMART",
                "name": "V-Mart Retail Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BATAINDIA",
                "name": "Bata India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RELAXO",
                "name": "Relaxo Footwears Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BAJAJELEC",
                "name": "Bajaj Electricals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CROMPTON",
                "name": "Crompton Greaves Consumer Electricals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "FINCABLES",
                "name": "Finolex Cables Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GODREJIND",
                "name": "Godrej Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IFBIND",
                "name": "IFB Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KEI",
                "name": "KEI Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "POLYCAB",
                "name": "Polycab India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VGUARD",
                "name": "V-Guard Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VOLTAS",
                "name": "Voltas Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ADANIGREEN",
                "name": "Adani Green Energy Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ADANIPOWER",
                "name": "Adani Power Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CGPOWER",
                "name": "CG Power and Industrial Solutions Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GVPIL",
                "name": "GE Power India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GVT&D",
                "name": "GE Vernova T&D India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GREENPOWER",
                "name": "Orient Green Power Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JPPOWER",
                "name": "Jaiprakash Power Ventures Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KPIL",
                "name": "Kalpataru Projects International Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NHPC",
                "name": "NHPC Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RPOWER",
                "name": "Reliance Power Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SJVN",
                "name": "SJVN Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SUZLON",
                "name": "Suzlon Energy Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TATAPOWER",
                "name": "Tata Power Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TORNTPOWER",
                "name": "Torrent Power Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "3IINFOLTD",
                "name": "3i Infotech Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "AFFLE",
                "name": "Affle 3i Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CYIENT",
                "name": "Cyient Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HAPPSTMNDS",
                "name": "Happiest Minds Technologies Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "INFY",
                "name": "Infosys Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LTM",
                "name": "LTM Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ROUTE",
                "name": "ROUTE MOBILE LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SUBEXLTD",
                "name": "Subex Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TANLA",
                "name": "Tanla Platforms Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TCS",
                "name": "Tata Consultancy Services Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TECHM",
                "name": "Tech Mahindra Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "WIPRO",
                "name": "Wipro Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LEMONTREE",
                "name": "Lemon Tree Hotels Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ORIENTHOT",
                "name": "Oriental Hotels Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ROHLTD",
                "name": "Royal Orchid Hotels Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TAJGVK",
                "name": "Taj GVK Hotels & Resorts Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ALOKINDS",
                "name": "Alok Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JBFIND",
                "name": "JBF Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NDL",
                "name": "Nandan Denim Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ORBTEXP",
                "name": "Orbit Exports Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PAGEIND",
                "name": "Page Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RAYMOND",
                "name": "Raymond Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SPAL",
                "name": "S. P. Apparels Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TRIDENT",
                "name": "Trident Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "WELSPUNLIV",
                "name": "Welspun Living Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ABB",
                "name": "ABB India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HONAUT",
                "name": "Honeywell Automation India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LMW",
                "name": "LMW Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RELIANCE",
                "name": "Reliance Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SIEMENS",
                "name": "Siemens Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TITAN",
                "name": "Titan Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BALAMINES",
                "name": "Balaji Amines Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SUDARCOLOR",
                "name": "Sudarshan Colorants India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DEEPAKNTR",
                "name": "Deepak Nitrite Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DEEPAKFERT",
                "name": "Deepak Fertilizers and Petrochemicals Corporation Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ESTER",
                "name": "Ester Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GNFC",
                "name": "Gujarat Narmada Valley Fertilizers and Chemicals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KANCHI",
                "name": "Kanchi Karpooram Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NAGARFERT",
                "name": "Nagarjuna Fertilizers and Chemicals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ROSSARI",
                "name": "Rossari Biotech Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TATACHEM",
                "name": "Tata Chemicals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "UPL",
                "name": "UPL Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "QUESS",
                "name": "Quess Corp Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ASTRAMICRO",
                "name": "Astra Microwave Products Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BDL",
                "name": "Bharat Dynamics Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HAL",
                "name": "Hindustan Aeronautics Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SIKA",
                "name": "Sika Interplant Systems Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GUJGASLTD",
                "name": "Gujarat Energy Limited (erstwhile Gujarat Gas Limited)",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MGL",
                "name": "Mahanagar Gas Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JMFINANCIL",
                "name": "JM Financial Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PAYTM",
                "name": "One 97 Communications Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JSL",
                "name": "Jindal Stainless Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JKPAPER",
                "name": "JK Paper Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IVP",
                "name": "IVP Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RALLIS",
                "name": "Rallis India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ASALCBR",
                "name": "Associated Alcohols & Breweries Ltd.",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BEML",
                "name": "BEML Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CARTRADE",
                "name": "Cartrade Tech Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "COCHINSHIP",
                "name": "Cochin Shipyard Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DATAPATTNS",
                "name": "Data Patterns (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GESHIP",
                "name": "The Great Eastern Shipping Company Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GMRP&UI",
                "name": "GMR Power and Urban Infra Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GUJENERGY",
                "name": "GUJARAT ENERGY LIMITED",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IDEAFORGE",
                "name": "Ideaforge Technology Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "INTERARCH",
                "name": "Interarch Building Solutions Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KAYNES",
                "name": "Kaynes Technology India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KRBL",
                "name": "KRBL Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KRN",
                "name": "KRN Heat Exchanger and Refrigeration Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LICI",
                "name": "Life Insurance Corporation Of India",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "LTFOODS",
                "name": "LT Foods Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MICEL",
                "name": "MIC Electronics Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MOSCHIP",
                "name": "Moschip Technologies Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MTARTECH",
                "name": "Mtar Technologies Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NETWEB",
                "name": "Netweb Technologies India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NITTAGELA",
                "name": "Nitta Gelatin India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "OLAELEC",
                "name": "Ola Electric Mobility Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PREMEXPLN",
                "name": "Premier Explosives Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "RIR",
                "name": "RIR Power Electronics Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SCI",
                "name": "Shipping Corporation Of India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SHAKTIPUMP",
                "name": "Shakti Pumps (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SPANDANA",
                "name": "Spandana Sphoorty Financial Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SUNTECK",
                "name": "Sunteck Realty Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TIMKEN",
                "name": "Timken India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TMCV",
                "name": "Tata Motors Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VASWANI",
                "name": "Vaswani Industries Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VBL",
                "name": "Varun Beverages Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "WAAREEENER",
                "name": "Waaree Energies Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "WEBELSOLAR",
                "name": "Websol Energy System Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "JUNIORBEES",
                "name": "Nippon India ETF Nifty Next 50 Junior BeES",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MID150BEES",
                "name": "Nippon India ETF Nifty Midcap 150",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SILVERBEES",
                "name": "Nippon India Silver ETF",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PHARMABEES",
                "name": "Nippon India ETF Nifty Pharma",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GILT5YBEES",
                "name": "Nippon India ETF Nifty 5 Year Benchmark G-Sec",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NIFTYBEES",
                "name": "Nippon India ETF Nifty 50 BeES",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "INFRABEES",
                "name": "Nippon India ETF Nifty Infrastructure BeES",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GOLDBEES",
                "name": "Nippon India ETF Gold BeES",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ITBEES",
                "name": "Nippon India ETF Nifty IT",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SETFGOLD",
                "name": "SBI ETF Gold",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SETFNIFBK",
                "name": "SBI ETF Nifty Bank",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SETFNN50",
                "name": "SBI ETF Nifty Next 50",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IDFNIFTYET",
                "name": "Bandhan Nifty 50 ETF",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NIFTYETF",
                "name": "Mirae Asset Nifty 50 ETF",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DIACABS",
                "name": "Diamond Power Infrastructure Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CUPID",
                "name": "Cupid Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ATHERENERG",
                "name": "Ather Energy Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MAZDOCK",
                "name": "Mazagon Dock Shipbuilders Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "GENUSPOWER",
                "name": "Genus Power Infrastructures Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KALYANKJIL",
                "name": "Kalyan Jewellers India Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "INDIANB",
                "name": "Indian Bank",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "SENCO",
                "name": "Senco Gold Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "NORTHARC",
                "name": "Northern Arc Capital Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "WELCORP",
                "name": "Welspun Corp Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "WABAG",
                "name": "VA Tech Wabag Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "J&KBANK",
                "name": "The Jammu & Kashmir Bank Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IFCI",
                "name": "IFCI Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "BBOX",
                "name": "Black Box Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "REDINGTON",
                "name": "Redington Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "IBULLSLTD",
                "name": "Indiabulls Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TARIL",
                "name": "Transformers And Rectifiers (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "AEGISLOG",
                "name": "Aegis Logistics Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "MEESHO",
                "name": "Meesho Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "KERNEX",
                "name": "Kernex Microsystems (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "CONCORD",
                "name": "Concord Control Systems Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "HBLENGINE",
                "name": "HBL Engineering Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "OFSS",
                "name": "Oracle Financial Services Software Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "DIXON",
                "name": "Dixon Technologies (India) Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VEDANT",
                "name": "Vedant Asset Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VEDPOWER",
                "name": "Vedanta Power Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VAML",
                "name": "Vedanta Aluminium Metal Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VISL",
                "name": "Vedanta Iron and Steel Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VOGL",
                "name": "Vedanta Oil and Gas Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "AMAGI",
                "name": "Amagi Media Labs Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "PINELABS",
                "name": "Pine Labs Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "FLUOROCHEM",
                "name": "Gujarat Fluorochemicals Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "E2E",
                "name": "E2E Networks Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TDPOWERSYS",
                "name": "TD Power Systems Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "VSSL",
                "name": "Vardhman Special Steels Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "ITC",
                "name": "ITC Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            },
            {
                "symbol": "TBZ",
                "name": "Tribhovandas Bhimji Zaveri Limited",
                "ltp": 0,
                "changePct": 0,
                "high52w": 0,
                "low52w": 0
            }
        ]
    },
    "NIFTY-100": {
        "id": "NIFTY-100",
        "name": "NIFTY 100",
        "description": "NIFTY 100 sector constituent stocks",
        "stocks": [
            {
                "symbol": "BAJFINANCE",
                "ltp": 1053.5,
                "changePct": 87.7,
                "high52w": 1151.5,
                "low52w": 1083.6
            },
            {
                "symbol": "M&M",
                "ltp": 3283.7,
                "changePct": 109.3,
                "high52w": 3457,
                "low52w": 3243.3
            },
            {
                "symbol": "HDFCBANK",
                "ltp": 753.95,
                "changePct": -5.95,
                "high52w": 757.55,
                "low52w": 747.2
            },
            {
                "symbol": "INFY",
                "ltp": 1155.1,
                "changePct": -25.2,
                "high52w": 1139.3,
                "low52w": 1107.2
            },
            {
                "symbol": "BHARTIARTL",
                "ltp": 1956.8,
                "changePct": 11.2,
                "high52w": 1976.4,
                "low52w": 1947.4
            },
            {
                "symbol": "TVSMOTOR",
                "ltp": 4208.4,
                "changePct": 102.6,
                "high52w": 4325,
                "low52w": 4198
            },
            {
                "symbol": "ICICIBANK",
                "ltp": 1433.9,
                "changePct": 0,
                "high52w": 1441.9,
                "low52w": 1431.4
            },
            {
                "symbol": "HYUNDAI",
                "ltp": 2018.2,
                "changePct": 164.8,
                "high52w": 2208,
                "low52w": 2090
            },
            {
                "symbol": "ETERNAL",
                "ltp": 310.65,
                "changePct": -8,
                "high52w": 316,
                "low52w": 301.8
            },
            {
                "symbol": "RELIANCE",
                "ltp": 1292.9,
                "changePct": 12.1,
                "high52w": 1309.7,
                "low52w": 1293.6
            },
            {
                "symbol": "SBIN",
                "ltp": 1025.3,
                "changePct": 2.3,
                "high52w": 1034.3,
                "low52w": 1023.5
            },
            {
                "symbol": "JIOFIN",
                "ltp": 246.95,
                "changePct": 9.15,
                "high52w": 257.06,
                "low52w": 247
            },
            {
                "symbol": "TCS",
                "ltp": 2431.8,
                "changePct": -65.8,
                "high52w": 2391,
                "low52w": 2326.1
            },
            {
                "symbol": "SUNPHARMA",
                "ltp": 2001.1,
                "changePct": -14.1,
                "high52w": 2046.9,
                "low52w": 1965.3
            },
            {
                "symbol": "AXISBANK",
                "ltp": 1228.9,
                "changePct": -1.8,
                "high52w": 1239.7,
                "low52w": 1226
            },
            {
                "symbol": "TMCV",
                "ltp": 414.95,
                "changePct": 20.55,
                "high52w": 440.65,
                "low52w": 414.25
            },
            {
                "symbol": "ADANIPORTS",
                "ltp": 1664.1,
                "changePct": 27.8,
                "high52w": 1708.1,
                "low52w": 1650
            },
            {
                "symbol": "MARUTI",
                "ltp": 14188,
                "changePct": 52,
                "high52w": 14348,
                "low52w": 14124
            },
            {
                "symbol": "BAJAJFINSV",
                "ltp": 1909.4,
                "changePct": 121.6,
                "high52w": 2036.6,
                "low52w": 1930
            },
            {
                "symbol": "TORNTPHARM",
                "ltp": 4872.1,
                "changePct": 267.8,
                "high52w": 5140.7,
                "low52w": 4894.4
            },
            {
                "symbol": "GAIL",
                "ltp": 173.64,
                "changePct": 7.36,
                "high52w": 182.21,
                "low52w": 173.5
            },
            {
                "symbol": "LT",
                "ltp": 3937.7,
                "changePct": 0.3,
                "high52w": 3973.1,
                "low52w": 3923.2
            },
            {
                "symbol": "BEL",
                "ltp": 384.9,
                "changePct": 2.9,
                "high52w": 390.6,
                "low52w": 385
            },
            {
                "symbol": "SHRIRAMFIN",
                "ltp": 1027.2,
                "changePct": 19,
                "high52w": 1054.6,
                "low52w": 1029.1
            },
            {
                "symbol": "TATASTEEL",
                "ltp": 186.92,
                "changePct": 3.07,
                "high52w": 191.84,
                "low52w": 186.31
            },
            {
                "symbol": "DIVISLAB",
                "ltp": 7835,
                "changePct": 250,
                "high52w": 8090,
                "low52w": 7870.5
            },
            {
                "symbol": "HDFCLIFE",
                "ltp": 545.4,
                "changePct": 5.5,
                "high52w": 550.9,
                "low52w": 544.05
            },
            {
                "symbol": "CGPOWER",
                "ltp": 832.6,
                "changePct": 29.3,
                "high52w": 878.8,
                "low52w": 850
            },
            {
                "symbol": "EICHERMOT",
                "ltp": 7912.5,
                "changePct": 4.5,
                "high52w": 7899,
                "low52w": 7794
            },
            {
                "symbol": "TECHM",
                "ltp": 1669,
                "changePct": -15.1,
                "high52w": 1661.5,
                "low52w": 1610.5
            },
            {
                "symbol": "HINDALCO",
                "ltp": 970.4,
                "changePct": 4.1,
                "high52w": 988,
                "low52w": 971.05
            },
            {
                "symbol": "CHOLAFIN",
                "ltp": 1773.8,
                "changePct": 71.4,
                "high52w": 1863.1,
                "low52w": 1779.4
            },
            {
                "symbol": "TITAN",
                "ltp": 4850,
                "changePct": 35,
                "high52w": 4886,
                "low52w": 4820.9
            },
            {
                "symbol": "ITC",
                "ltp": 285.05,
                "changePct": -4.05,
                "high52w": 285.8,
                "low52w": 280.05
            },
            {
                "symbol": "ULTRACEMCO",
                "ltp": 11847,
                "changePct": 37,
                "high52w": 12009,
                "low52w": 11799
            },
            {
                "symbol": "LODHA",
                "ltp": 1287.15,
                "changePct": -43.95,
                "high52w": 1297,
                "low52w": 1239.55
            },
            {
                "symbol": "HCLTECH",
                "ltp": 1352.7,
                "changePct": -7,
                "high52w": 1356.5,
                "low52w": 1294.3
            },
            {
                "symbol": "PFC",
                "ltp": 426.25,
                "changePct": 2.7,
                "high52w": 427.1,
                "low52w": 420.35
            },
            {
                "symbol": "VEDL",
                "ltp": 267.5,
                "changePct": -3.15,
                "high52w": 269,
                "low52w": 263
            },
            {
                "symbol": "MUTHOOTFIN",
                "ltp": 3008.7,
                "changePct": 119.8,
                "high52w": 3144.8,
                "low52w": 3015.1
            },
            {
                "symbol": "MAZDOCK",
                "ltp": 2319.1,
                "changePct": 62.8,
                "high52w": 2401.8,
                "low52w": 2328.8
            },
            {
                "symbol": "NESTLEIND",
                "ltp": 1520.7,
                "changePct": -15.7,
                "high52w": 1529,
                "low52w": 1497.5
            },
            {
                "symbol": "HINDUNILVR",
                "ltp": 2107.9,
                "changePct": -8.5,
                "high52w": 2119.6,
                "low52w": 2091.1
            },
            {
                "symbol": "VBL",
                "ltp": 451.35,
                "changePct": -10.85,
                "high52w": 451,
                "low52w": 439.85
            },
            {
                "symbol": "MOTHERSON",
                "ltp": 146.72,
                "changePct": 4.18,
                "high52w": 152.4,
                "low52w": 146.42
            },
            {
                "symbol": "HAL",
                "ltp": 4581.4,
                "changePct": 62.6,
                "high52w": 4669,
                "low52w": 4591.1
            },
            {
                "symbol": "WIPRO",
                "ltp": 186.33,
                "changePct": -2.58,
                "high52w": 185.24,
                "low52w": 180.83
            },
            {
                "symbol": "ADANIPOWER",
                "ltp": 208.97,
                "changePct": 1.78,
                "high52w": 212.68,
                "low52w": 209.11
            },
            {
                "symbol": "NTPC",
                "ltp": 344.85,
                "changePct": 1.75,
                "high52w": 348.25,
                "low52w": 343.55
            },
            {
                "symbol": "ADANIENSOL",
                "ltp": 1659,
                "changePct": -21,
                "high52w": 1682,
                "low52w": 1628.8
            },
            {
                "symbol": "SHREECEM",
                "ltp": 26455,
                "changePct": 135,
                "high52w": 26590,
                "low52w": 25500
            },
            {
                "symbol": "TMPV",
                "ltp": 334.2,
                "changePct": 5.9,
                "high52w": 341.95,
                "low52w": 334.5
            },
            {
                "symbol": "KOTAKBANK",
                "ltp": 389.4,
                "changePct": -0.55,
                "high52w": 391.85,
                "low52w": 388
            },
            {
                "symbol": "ADANIENT",
                "ltp": 3049.1,
                "changePct": -40,
                "high52w": 3067.5,
                "low52w": 3002.4
            },
            {
                "symbol": "ABB",
                "ltp": 7291.5,
                "changePct": -47.5,
                "high52w": 7485,
                "low52w": 7201.5
            },
            {
                "symbol": "BAJAJ-AUTO",
                "ltp": 11432,
                "changePct": 87,
                "high52w": 11590,
                "low52w": 11329.5
            },
            {
                "symbol": "COALINDIA",
                "ltp": 417.2,
                "changePct": 2.7,
                "high52w": 415.1,
                "low52w": 410.15
            },
            {
                "symbol": "ASIANPAINT",
                "ltp": 2746.2,
                "changePct": -8.2,
                "high52w": 2774.9,
                "low52w": 2732.4
            },
            {
                "symbol": "ONGC",
                "ltp": 241.59,
                "changePct": 0.71,
                "high52w": 242.96,
                "low52w": 238.17
            },
            {
                "symbol": "INDIGO",
                "ltp": 5230.5,
                "changePct": -53.5,
                "high52w": 5282,
                "low52w": 5137.5
            },
            {
                "symbol": "APOLLOHOSP",
                "ltp": 8988,
                "changePct": -47,
                "high52w": 9036.5,
                "low52w": 8931
            },
            {
                "symbol": "BRITANNIA",
                "ltp": 5524.5,
                "changePct": -29,
                "high52w": 5460,
                "low52w": 5364
            },
            {
                "symbol": "MAXHEALTH",
                "ltp": 1124.8,
                "changePct": -23.4,
                "high52w": 1132,
                "low52w": 1091.2
            },
            {
                "symbol": "HINDZINC",
                "ltp": 535.9,
                "changePct": 3.35,
                "high52w": 543.9,
                "low52w": 535.35
            },
            {
                "symbol": "POWERGRID",
                "ltp": 285.7,
                "changePct": -1.5,
                "high52w": 287.4,
                "low52w": 283
            },
            {
                "symbol": "DMART",
                "ltp": 3874,
                "changePct": 47,
                "high52w": 3946.5,
                "low52w": 3889.7
            },
            {
                "symbol": "ADANIGREEN",
                "ltp": 1358.7,
                "changePct": 19.3,
                "high52w": 1397,
                "low52w": 1353
            },
            {
                "symbol": "HDFCAMC",
                "ltp": 2546.3,
                "changePct": 71.7,
                "high52w": 2630,
                "low52w": 2550.1
            },
            {
                "symbol": "SIEMENS",
                "ltp": 3658.8,
                "changePct": 83.2,
                "high52w": 3808.4,
                "low52w": 3662.1
            },
            {
                "symbol": "INDHOTEL",
                "ltp": 749.25,
                "changePct": -9.45,
                "high52w": 757.4,
                "low52w": 736.85
            },
            {
                "symbol": "CUMMINSIND",
                "ltp": 5396,
                "changePct": 115.5,
                "high52w": 5567,
                "low52w": 5461.5
            },
            {
                "symbol": "BANKBARODA",
                "ltp": 241.65,
                "changePct": 1.15,
                "high52w": 244.5,
                "low52w": 242.1
            },
            {
                "symbol": "JSWSTEEL",
                "ltp": 1270.8,
                "changePct": 0.6,
                "high52w": 1282.2,
                "low52w": 1262
            },
            {
                "symbol": "TRENT",
                "ltp": 2999.2,
                "changePct": 1.8,
                "high52w": 3026.7,
                "low52w": 2990.9
            },
            {
                "symbol": "CIPLA",
                "ltp": 1466.4,
                "changePct": 5.6,
                "high52w": 1478.8,
                "low52w": 1462.3
            },
            {
                "symbol": "ENRIN",
                "ltp": 3121.7,
                "changePct": 114.3,
                "high52w": 3247.9,
                "low52w": 3152
            },
            {
                "symbol": "CANBK",
                "ltp": 124.28,
                "changePct": 0.62,
                "high52w": 125.44,
                "low52w": 124.25
            },
            {
                "symbol": "SOLARINDS",
                "ltp": 18053,
                "changePct": 307,
                "high52w": 18619,
                "low52w": 18110
            },
            {
                "symbol": "BPCL",
                "ltp": 315.8,
                "changePct": 4.4,
                "high52w": 320.4,
                "low52w": 314.4
            },
            {
                "symbol": "TATACONSUM",
                "ltp": 1094.2,
                "changePct": -12.1,
                "high52w": 1098.9,
                "low52w": 1081
            },
            {
                "symbol": "SBILIFE",
                "ltp": 1877.5,
                "changePct": 13,
                "high52w": 1898.9,
                "low52w": 1870.6
            },
            {
                "symbol": "IOC",
                "ltp": 139.94,
                "changePct": 0.05,
                "high52w": 140.69,
                "low52w": 138.86
            },
            {
                "symbol": "RECLTD",
                "ltp": 374.9,
                "changePct": 2.2,
                "high52w": 374,
                "low52w": 370
            },
            {
                "symbol": "PIDILITIND",
                "ltp": 1629.9,
                "changePct": -22.2,
                "high52w": 1637.9,
                "low52w": 1601
            },
            {
                "symbol": "PNB",
                "ltp": 111.64,
                "changePct": 1.01,
                "high52w": 113,
                "low52w": 111.69
            },
            {
                "symbol": "DRREDDY",
                "ltp": 1144.8,
                "changePct": 0.7,
                "high52w": 1154.3,
                "low52w": 1141.7
            },
            {
                "symbol": "UNITDSPR",
                "ltp": 1531.9,
                "changePct": -16.9,
                "high52w": 1535,
                "low52w": 1510.6
            },
            {
                "symbol": "TATAPOWER",
                "ltp": 375.95,
                "changePct": 4.85,
                "high52w": 381.35,
                "low52w": 377.15
            },
            {
                "symbol": "LTM",
                "ltp": 4441.4,
                "changePct": -76,
                "high52w": 4385.1,
                "low52w": 4284
            },
            {
                "symbol": "IRFC",
                "ltp": 88.92,
                "changePct": 0.18,
                "high52w": 89.88,
                "low52w": 88.43
            },
            {
                "symbol": "BAJAJHLDNG",
                "ltp": 10970,
                "changePct": 365,
                "high52w": 11467,
                "low52w": 10951
            },
            {
                "symbol": "GRASIM",
                "ltp": 3104.8,
                "changePct": -8.8,
                "high52w": 3135.9,
                "low52w": 3092.6
            },
            {
                "symbol": "UNIONBANK",
                "ltp": 170.4,
                "changePct": 0.36,
                "high52w": 172.8,
                "low52w": 169.82
            },
            {
                "symbol": "DLF",
                "ltp": 654.85,
                "changePct": 2.15,
                "high52w": 661.95,
                "low52w": 656.25
            },
            {
                "symbol": "JINDALSTEL",
                "ltp": 1093.7,
                "changePct": 8.3,
                "high52w": 1114,
                "low52w": 1093.6
            },
            {
                "symbol": "ZYDUSLIFE",
                "ltp": 1115.1,
                "changePct": 9.9,
                "high52w": 1134.3,
                "low52w": 1117.7
            },
            {
                "symbol": "BOSCHLTD",
                "ltp": 41550,
                "changePct": -490,
                "high52w": 41715,
                "low52w": 40920
            },
            {
                "symbol": "GODREJCP",
                "ltp": 1072.1,
                "changePct": -5.9,
                "high52w": 1076.3,
                "low52w": 1054.7
            },
            {
                "symbol": "TATACAP",
                "ltp": 360.9,
                "changePct": 5.6,
                "high52w": 367,
                "low52w": 358
            },
            {
                "symbol": "AMBUJACEM",
                "ltp": 434.2,
                "changePct": -2.2,
                "high52w": 438.95,
                "low52w": 430.25
            }
        ]
    },
    "NIFTY-AUTO": {
        "id": "NIFTY-AUTO",
        "name": "NIFTY AUTO",
        "description": "NIFTY AUTO sector constituent stocks",
        "stocks": [
            {
                "symbol": "M&M",
                "ltp": 3283.7,
                "changePct": 109.3,
                "high52w": 3457,
                "low52w": 3243.3
            },
            {
                "symbol": "TVSMOTOR",
                "ltp": 4208.4,
                "changePct": 102.6,
                "high52w": 4325,
                "low52w": 4198
            },
            {
                "symbol": "ASHOKLEY",
                "ltp": 158.09,
                "changePct": 7.6,
                "high52w": 166.7,
                "low52w": 159.17
            },
            {
                "symbol": "MARUTI",
                "ltp": 14188,
                "changePct": 52,
                "high52w": 14348,
                "low52w": 14124
            },
            {
                "symbol": "EICHERMOT",
                "ltp": 7912.5,
                "changePct": 4.5,
                "high52w": 7899,
                "low52w": 7794
            },
            {
                "symbol": "HEROMOTOCO",
                "ltp": 5325,
                "changePct": 63,
                "high52w": 5394.7,
                "low52w": 5297.5
            },
            {
                "symbol": "MOTHERSON",
                "ltp": 146.72,
                "changePct": 4.18,
                "high52w": 152.4,
                "low52w": 146.42
            },
            {
                "symbol": "EXIDEIND",
                "ltp": 452.7,
                "changePct": -5.2,
                "high52w": 459.6,
                "low52w": 444.15
            },
            {
                "symbol": "TMPV",
                "ltp": 334.2,
                "changePct": 5.9,
                "high52w": 341.95,
                "low52w": 334.5
            },
            {
                "symbol": "BAJAJ-AUTO",
                "ltp": 11432,
                "changePct": 87,
                "high52w": 11590,
                "low52w": 11329.5
            },
            {
                "symbol": "SONACOMS",
                "ltp": 763.75,
                "changePct": 4.95,
                "high52w": 773.2,
                "low52w": 761.95
            },
            {
                "symbol": "BHARATFORG",
                "ltp": 2164.7,
                "changePct": 40.3,
                "high52w": 2212.6,
                "low52w": 2161.5
            },
            {
                "symbol": "TIINDIA",
                "ltp": 2688.8,
                "changePct": 61.4,
                "high52w": 2775,
                "low52w": 2689
            },
            {
                "symbol": "UNOMINDA",
                "ltp": 1172.8,
                "changePct": 7.2,
                "high52w": 1188,
                "low52w": 1167.6
            },
            {
                "symbol": "BOSCHLTD",
                "ltp": 41550,
                "changePct": -490,
                "high52w": 41715,
                "low52w": 40920
            }
        ]
    },
    "NIFTY-CHEMICALS": {
        "id": "NIFTY-CHEMICALS",
        "name": "NIFTY CHEMICALS",
        "description": "NIFTY CHEMICALS sector constituent stocks",
        "stocks": [
            {
                "symbol": "AARTIIND",
                "ltp": 480.2,
                "changePct": 6,
                "high52w": 516.95,
                "low52w": 485.1
            },
            {
                "symbol": "HSCL",
                "ltp": 760.5,
                "changePct": -12.7,
                "high52w": 781.9,
                "low52w": 742.5
            },
            {
                "symbol": "PCBL",
                "ltp": 328,
                "changePct": -10.6,
                "high52w": 330.6,
                "low52w": 313.3
            },
            {
                "symbol": "DEEPAKFERT",
                "ltp": 1532.4,
                "changePct": 11.5,
                "high52w": 1608.8,
                "low52w": 1511.2
            },
            {
                "symbol": "SOLARINDS",
                "ltp": 18053,
                "changePct": 307,
                "high52w": 18619,
                "low52w": 18110
            },
            {
                "symbol": "NAVINFLUOR",
                "ltp": 7386.5,
                "changePct": 193.5,
                "high52w": 7655,
                "low52w": 7473.5
            },
            {
                "symbol": "PIDILITIND",
                "ltp": 1629.9,
                "changePct": -22.2,
                "high52w": 1637.9,
                "low52w": 1601
            },
            {
                "symbol": "SRF",
                "ltp": 2604.8,
                "changePct": 20,
                "high52w": 2639.1,
                "low52w": 2597.8
            },
            {
                "symbol": "UPL",
                "ltp": 602.55,
                "changePct": 0.15,
                "high52w": 607.6,
                "low52w": 599.05
            },
            {
                "symbol": "CHAMBLFERT",
                "ltp": 445.85,
                "changePct": -6.95,
                "high52w": 448.2,
                "low52w": 436.25
            },
            {
                "symbol": "LINDEINDIA",
                "ltp": 6637,
                "changePct": 133,
                "high52w": 6810,
                "low52w": 6646.5
            },
            {
                "symbol": "ATUL",
                "ltp": 6803,
                "changePct": -54,
                "high52w": 6871.5,
                "low52w": 6703
            },
            {
                "symbol": "COROMANDEL",
                "ltp": 2054.2,
                "changePct": 25.7,
                "high52w": 2082,
                "low52w": 2026
            },
            {
                "symbol": "SWANCORP",
                "ltp": 306.65,
                "changePct": 0.35,
                "high52w": 310,
                "low52w": 304
            },
            {
                "symbol": "SUMICHEM",
                "ltp": 508.4,
                "changePct": 4,
                "high52w": 514.05,
                "low52w": 502.1
            },
            {
                "symbol": "PIIND",
                "ltp": 2777.3,
                "changePct": -20.1,
                "high52w": 2781.3,
                "low52w": 2740
            },
            {
                "symbol": "DEEPAKNTR",
                "ltp": 1643.9,
                "changePct": 14.2,
                "high52w": 1671,
                "low52w": 1645.5
            },
            {
                "symbol": "TATACHEM",
                "ltp": 670.3,
                "changePct": 2.7,
                "high52w": 676.4,
                "low52w": 668.2
            },
            {
                "symbol": "FLUOROCHEM",
                "ltp": 4395,
                "changePct": -30,
                "high52w": 4471,
                "low52w": 4344.6
            },
            {
                "symbol": "BAYERCROP",
                "ltp": 4226.5,
                "changePct": -6.5,
                "high52w": 4264.9,
                "low52w": 4188.2
            }
        ]
    },
    "NIFTY-DIVIDEND-OPPORTUNITIES-50": {
        "id": "NIFTY-DIVIDEND-OPPORTUNITIES-50",
        "name": "NIFTY DIVIDEND OPPORTUNITIES 50",
        "description": "NIFTY DIVIDEND OPPORTUNITIES 50 sector constituent stocks",
        "stocks": [
            {
                "symbol": "INFY",
                "ltp": 1155.1,
                "changePct": -25.2,
                "high52w": 1139.3,
                "low52w": 1107.2
            },
            {
                "symbol": "SBIN",
                "ltp": 1025.3,
                "changePct": 2.3,
                "high52w": 1034.3,
                "low52w": 1023.5
            },
            {
                "symbol": "TCS",
                "ltp": 2431.8,
                "changePct": -65.8,
                "high52w": 2391,
                "low52w": 2326.1
            },
            {
                "symbol": "ASHOKLEY",
                "ltp": 158.09,
                "changePct": 7.6,
                "high52w": 166.7,
                "low52w": 159.17
            },
            {
                "symbol": "REDINGTON",
                "ltp": 310.95,
                "changePct": 9.6,
                "high52w": 327.65,
                "low52w": 306.95
            },
            {
                "symbol": "GAIL",
                "ltp": 173.64,
                "changePct": 7.36,
                "high52w": 182.21,
                "low52w": 173.5
            },
            {
                "symbol": "SHRIRAMFIN",
                "ltp": 1027.2,
                "changePct": 19,
                "high52w": 1054.6,
                "low52w": 1029.1
            },
            {
                "symbol": "TATASTEEL",
                "ltp": 186.92,
                "changePct": 3.07,
                "high52w": 191.84,
                "low52w": 186.31
            },
            {
                "symbol": "TECHM",
                "ltp": 1669,
                "changePct": -15.1,
                "high52w": 1661.5,
                "low52w": 1610.5
            },
            {
                "symbol": "ITC",
                "ltp": 285.05,
                "changePct": -4.05,
                "high52w": 285.8,
                "low52w": 280.05
            },
            {
                "symbol": "HCLTECH",
                "ltp": 1352.7,
                "changePct": -7,
                "high52w": 1356.5,
                "low52w": 1294.3
            },
            {
                "symbol": "PFC",
                "ltp": 426.25,
                "changePct": 2.7,
                "high52w": 427.1,
                "low52w": 420.35
            },
            {
                "symbol": "HEROMOTOCO",
                "ltp": 5325,
                "changePct": 63,
                "high52w": 5394.7,
                "low52w": 5297.5
            },
            {
                "symbol": "VEDL",
                "ltp": 267.5,
                "changePct": -3.15,
                "high52w": 269,
                "low52w": 263
            },
            {
                "symbol": "HINDUNILVR",
                "ltp": 2107.9,
                "changePct": -8.5,
                "high52w": 2119.6,
                "low52w": 2091.1
            },
            {
                "symbol": "WIPRO",
                "ltp": 186.33,
                "changePct": -2.58,
                "high52w": 185.24,
                "low52w": 180.83
            },
            {
                "symbol": "OFSS",
                "ltp": 11136,
                "changePct": 64,
                "high52w": 11270,
                "low52w": 10882
            },
            {
                "symbol": "HINDPETRO",
                "ltp": 388.45,
                "changePct": 1,
                "high52w": 391.9,
                "low52w": 385.6
            },
            {
                "symbol": "NTPC",
                "ltp": 344.85,
                "changePct": 1.75,
                "high52w": 348.25,
                "low52w": 343.55
            },
            {
                "symbol": "SAIL",
                "ltp": 169.05,
                "changePct": -0.25,
                "high52w": 171.85,
                "low52w": 167.97
            },
            {
                "symbol": "NATIONALUM",
                "ltp": 347.65,
                "changePct": 2.85,
                "high52w": 355.75,
                "low52w": 347.65
            },
            {
                "symbol": "BAJAJ-AUTO",
                "ltp": 11432,
                "changePct": 87,
                "high52w": 11590,
                "low52w": 11329.5
            },
            {
                "symbol": "COALINDIA",
                "ltp": 417.2,
                "changePct": 2.7,
                "high52w": 415.1,
                "low52w": 410.15
            },
            {
                "symbol": "ONGC",
                "ltp": 241.59,
                "changePct": 0.71,
                "high52w": 242.96,
                "low52w": 238.17
            },
            {
                "symbol": "BRITANNIA",
                "ltp": 5524.5,
                "changePct": -29,
                "high52w": 5460,
                "low52w": 5364
            },
            {
                "symbol": "HINDZINC",
                "ltp": 535.9,
                "changePct": 3.35,
                "high52w": 543.9,
                "low52w": 535.35
            },
            {
                "symbol": "POWERGRID",
                "ltp": 285.7,
                "changePct": -1.5,
                "high52w": 287.4,
                "low52w": 283
            },
            {
                "symbol": "HDFCAMC",
                "ltp": 2546.3,
                "changePct": 71.7,
                "high52w": 2630,
                "low52w": 2550.1
            },
            {
                "symbol": "CUMMINSIND",
                "ltp": 5396,
                "changePct": 115.5,
                "high52w": 5567,
                "low52w": 5461.5
            },
            {
                "symbol": "BANKBARODA",
                "ltp": 241.65,
                "changePct": 1.15,
                "high52w": 244.5,
                "low52w": 242.1
            },
            {
                "symbol": "CANBK",
                "ltp": 124.28,
                "changePct": 0.62,
                "high52w": 125.44,
                "low52w": 124.25
            },
            {
                "symbol": "BPCL",
                "ltp": 315.8,
                "changePct": 4.4,
                "high52w": 320.4,
                "low52w": 314.4
            },
            {
                "symbol": "M&MFIN",
                "ltp": 392.55,
                "changePct": -5.2,
                "high52w": 401,
                "low52w": 384.25
            },
            {
                "symbol": "ANGELONE",
                "ltp": 291.65,
                "changePct": 5.85,
                "high52w": 299.95,
                "low52w": 292.5
            },
            {
                "symbol": "IOC",
                "ltp": 139.94,
                "changePct": 0.05,
                "high52w": 140.69,
                "low52w": 138.86
            },
            {
                "symbol": "RECLTD",
                "ltp": 374.9,
                "changePct": 2.2,
                "high52w": 374,
                "low52w": 370
            },
            {
                "symbol": "MPHASIS",
                "ltp": 2346.7,
                "changePct": -16.7,
                "high52w": 2351.8,
                "low52w": 2222.3
            },
            {
                "symbol": "PNB",
                "ltp": 111.64,
                "changePct": 1.01,
                "high52w": 113,
                "low52w": 111.69
            },
            {
                "symbol": "INDIANB",
                "ltp": 827.25,
                "changePct": 6.85,
                "high52w": 840.9,
                "low52w": 828
            },
            {
                "symbol": "NMDC",
                "ltp": 85.01,
                "changePct": 0.04,
                "high52w": 85.6,
                "low52w": 84.69
            },
            {
                "symbol": "IRFC",
                "ltp": 88.92,
                "changePct": 0.18,
                "high52w": 89.88,
                "low52w": 88.43
            },
            {
                "symbol": "PAGEIND",
                "ltp": 41085,
                "changePct": -830,
                "high52w": 41160,
                "low52w": 39890
            },
            {
                "symbol": "UNIONBANK",
                "ltp": 170.4,
                "changePct": 0.36,
                "high52w": 172.8,
                "low52w": 169.82
            },
            {
                "symbol": "BANKINDIA",
                "ltp": 137.22,
                "changePct": 0.5,
                "high52w": 138.68,
                "low52w": 136.87
            },
            {
                "symbol": "OIL",
                "ltp": 456.9,
                "changePct": 2.35,
                "high52w": 459.4,
                "low52w": 451.2
            },
            {
                "symbol": "GODREJCP",
                "ltp": 1072.1,
                "changePct": -5.9,
                "high52w": 1076.3,
                "low52w": 1054.7
            },
            {
                "symbol": "COLPAL",
                "ltp": 2084.8,
                "changePct": -16.2,
                "high52w": 2109.5,
                "low52w": 2047.3
            },
            {
                "symbol": "MAHABANK",
                "ltp": 79.26,
                "changePct": 0.04,
                "high52w": 80.2,
                "low52w": 78.96
            },
            {
                "symbol": "NHPC",
                "ltp": 78.07,
                "changePct": 0.63,
                "high52w": 78.86,
                "low52w": 77.91
            },
            {
                "symbol": "HUDCO",
                "ltp": 197.11,
                "changePct": -1.16,
                "high52w": 197.98,
                "low52w": 194.4
            }
        ]
    },
    "NIFTY-FMCG": {
        "id": "NIFTY-FMCG",
        "name": "NIFTY FMCG",
        "description": "NIFTY FMCG sector constituent stocks",
        "stocks": [
            {
                "symbol": "ITC",
                "ltp": 285.05,
                "changePct": -4.05,
                "high52w": 285.8,
                "low52w": 280.05
            },
            {
                "symbol": "NESTLEIND",
                "ltp": 1520.7,
                "changePct": -15.7,
                "high52w": 1529,
                "low52w": 1497.5
            },
            {
                "symbol": "HINDUNILVR",
                "ltp": 2107.9,
                "changePct": -8.5,
                "high52w": 2119.6,
                "low52w": 2091.1
            },
            {
                "symbol": "VBL",
                "ltp": 451.35,
                "changePct": -10.85,
                "high52w": 451,
                "low52w": 439.85
            },
            {
                "symbol": "BRITANNIA",
                "ltp": 5524.5,
                "changePct": -29,
                "high52w": 5460,
                "low52w": 5364
            },
            {
                "symbol": "MARICO",
                "ltp": 885.35,
                "changePct": -16.35,
                "high52w": 889,
                "low52w": 868
            },
            {
                "symbol": "TATACONSUM",
                "ltp": 1094.2,
                "changePct": -12.1,
                "high52w": 1098.9,
                "low52w": 1081
            },
            {
                "symbol": "RADICO",
                "ltp": 4366.6,
                "changePct": -18.6,
                "high52w": 4390,
                "low52w": 4321
            },
            {
                "symbol": "UNITDSPR",
                "ltp": 1531.9,
                "changePct": -16.9,
                "high52w": 1535,
                "low52w": 1510.6
            },
            {
                "symbol": "DABUR",
                "ltp": 426.1,
                "changePct": -4.4,
                "high52w": 429.75,
                "low52w": 420.25
            },
            {
                "symbol": "PATANJALI",
                "ltp": 356.35,
                "changePct": -2.45,
                "high52w": 360.65,
                "low52w": 353.15
            },
            {
                "symbol": "GODREJCP",
                "ltp": 1072.1,
                "changePct": -5.9,
                "high52w": 1076.3,
                "low52w": 1054.7
            },
            {
                "symbol": "COLPAL",
                "ltp": 2084.8,
                "changePct": -16.2,
                "high52w": 2109.5,
                "low52w": 2047.3
            },
            {
                "symbol": "UBL",
                "ltp": 1436.1,
                "changePct": -6.1,
                "high52w": 1459.1,
                "low52w": 1411.2
            },
            {
                "symbol": "EMAMILTD",
                "ltp": 403.35,
                "changePct": -5.45,
                "high52w": 407.5,
                "low52w": 396.5
            }
        ]
    },
    "NIFTY-IT": {
        "id": "NIFTY-IT",
        "name": "NIFTY IT",
        "description": "NIFTY IT sector constituent stocks",
        "stocks": [
            {
                "symbol": "INFY",
                "ltp": 1155.1,
                "changePct": -25.2,
                "high52w": 1139.3,
                "low52w": 1107.2
            },
            {
                "symbol": "TCS",
                "ltp": 2431.8,
                "changePct": -65.8,
                "high52w": 2391,
                "low52w": 2326.1
            },
            {
                "symbol": "PERSISTENT",
                "ltp": 5514.7,
                "changePct": 19.3,
                "high52w": 5580,
                "low52w": 5263.4
            },
            {
                "symbol": "COFORGE",
                "ltp": 1746.9,
                "changePct": -24.9,
                "high52w": 1738.8,
                "low52w": 1681.7
            },
            {
                "symbol": "TECHM",
                "ltp": 1669,
                "changePct": -15.1,
                "high52w": 1661.5,
                "low52w": 1610.5
            },
            {
                "symbol": "HCLTECH",
                "ltp": 1352.7,
                "changePct": -7,
                "high52w": 1356.5,
                "low52w": 1294.3
            },
            {
                "symbol": "WIPRO",
                "ltp": 186.33,
                "changePct": -2.58,
                "high52w": 185.24,
                "low52w": 180.83
            },
            {
                "symbol": "OFSS",
                "ltp": 11136,
                "changePct": 64,
                "high52w": 11270,
                "low52w": 10882
            },
            {
                "symbol": "MPHASIS",
                "ltp": 2346.7,
                "changePct": -16.7,
                "high52w": 2351.8,
                "low52w": 2222.3
            },
            {
                "symbol": "LTM",
                "ltp": 4441.4,
                "changePct": -76,
                "high52w": 4385.1,
                "low52w": 4284
            }
        ]
    },
    "NIFTY-MEDIA": {
        "id": "NIFTY-MEDIA",
        "name": "NIFTY MEDIA",
        "description": "NIFTY MEDIA sector constituent stocks",
        "stocks": [
            {
                "symbol": "ZEEL",
                "ltp": 112.21,
                "changePct": 1.97,
                "high52w": 117.32,
                "low52w": 112.4
            },
            {
                "symbol": "NAZARA",
                "ltp": 308.05,
                "changePct": 29.95,
                "high52w": 343.8,
                "low52w": 306.5
            },
            {
                "symbol": "PFOCUS",
                "ltp": 290.26,
                "changePct": -3.26,
                "high52w": 290.68,
                "low52w": 275.55
            },
            {
                "symbol": "PVRINOX",
                "ltp": 1131.45,
                "changePct": -7.35,
                "high52w": 1143.55,
                "low52w": 1123.1
            },
            {
                "symbol": "TIPSMUSIC",
                "ltp": 664.9,
                "changePct": 2,
                "high52w": 675,
                "low52w": 656.15
            },
            {
                "symbol": "SAREGAMA",
                "ltp": 521.4,
                "changePct": -1.4,
                "high52w": 531.3,
                "low52w": 517.3
            },
            {
                "symbol": "SUNTV",
                "ltp": 511.5,
                "changePct": -3.05,
                "high52w": 517.8,
                "low52w": 505.8
            },
            {
                "symbol": "NETWORK18",
                "ltp": 29.29,
                "changePct": 0.17,
                "high52w": 29.7,
                "low52w": 29.05
            },
            {
                "symbol": "DBCORP",
                "ltp": 211.02,
                "changePct": -2.33,
                "high52w": 211.39,
                "low52w": 208.1
            },
            {
                "symbol": "HATHWAY",
                "ltp": 10.75,
                "changePct": 0.03,
                "high52w": 10.84,
                "low52w": 10.72
            }
        ]
    },
    "NIFTY-METAL": {
        "id": "NIFTY-METAL",
        "name": "NIFTY METAL",
        "description": "NIFTY METAL sector constituent stocks",
        "stocks": [
            {
                "symbol": "TATASTEEL",
                "ltp": 186.92,
                "changePct": 3.07,
                "high52w": 191.84,
                "low52w": 186.31
            },
            {
                "symbol": "HINDALCO",
                "ltp": 970.4,
                "changePct": 4.1,
                "high52w": 988,
                "low52w": 971.05
            },
            {
                "symbol": "VEDL",
                "ltp": 267.5,
                "changePct": -3.15,
                "high52w": 269,
                "low52w": 263
            },
            {
                "symbol": "HINDCOPPER",
                "ltp": 480.25,
                "changePct": 12.25,
                "high52w": 499,
                "low52w": 482.55
            },
            {
                "symbol": "SAIL",
                "ltp": 169.05,
                "changePct": -0.25,
                "high52w": 171.85,
                "low52w": 167.97
            },
            {
                "symbol": "ADANIENT",
                "ltp": 3049.1,
                "changePct": -40,
                "high52w": 3067.5,
                "low52w": 3002.4
            },
            {
                "symbol": "NATIONALUM",
                "ltp": 347.65,
                "changePct": 2.85,
                "high52w": 355.75,
                "low52w": 347.65
            },
            {
                "symbol": "HINDZINC",
                "ltp": 535.9,
                "changePct": 3.35,
                "high52w": 543.9,
                "low52w": 535.35
            },
            {
                "symbol": "JSWSTEEL",
                "ltp": 1270.8,
                "changePct": 0.6,
                "high52w": 1282.2,
                "low52w": 1262
            },
            {
                "symbol": "LLOYDSME",
                "ltp": 2015.1,
                "changePct": 20.9,
                "high52w": 2100,
                "low52w": 2015.1
            },
            {
                "symbol": "APLAPOLLO",
                "ltp": 1893.1,
                "changePct": -85.1,
                "high52w": 1908,
                "low52w": 1805
            },
            {
                "symbol": "NMDC",
                "ltp": 85.01,
                "changePct": 0.04,
                "high52w": 85.6,
                "low52w": 84.69
            },
            {
                "symbol": "JINDALSTEL",
                "ltp": 1093.7,
                "changePct": 8.3,
                "high52w": 1114,
                "low52w": 1093.6
            },
            {
                "symbol": "WELCORP",
                "ltp": 1655,
                "changePct": -4.8,
                "high52w": 1671,
                "low52w": 1645
            },
            {
                "symbol": "JSL",
                "ltp": 737.75,
                "changePct": -4.15,
                "high52w": 745.85,
                "low52w": 725
            }
        ]
    },
    "NIFTY-OIL-GAS": {
        "id": "NIFTY-OIL-GAS",
        "name": "NIFTY OIL & GAS",
        "description": "NIFTY OIL & GAS sector constituent stocks",
        "stocks": [
            {
                "symbol": "RELIANCE",
                "ltp": 1292.9,
                "changePct": 12.1,
                "high52w": 1309.7,
                "low52w": 1293.6
            },
            {
                "symbol": "GAIL",
                "ltp": 173.64,
                "changePct": 7.36,
                "high52w": 182.21,
                "low52w": 173.5
            },
            {
                "symbol": "HINDPETRO",
                "ltp": 388.45,
                "changePct": 1,
                "high52w": 391.9,
                "low52w": 385.6
            },
            {
                "symbol": "ONGC",
                "ltp": 241.59,
                "changePct": 0.71,
                "high52w": 242.96,
                "low52w": 238.17
            },
            {
                "symbol": "CHENNPETRO",
                "ltp": 1238.2,
                "changePct": 20.6,
                "high52w": 1274,
                "low52w": 1222.3
            },
            {
                "symbol": "BPCL",
                "ltp": 315.8,
                "changePct": 4.4,
                "high52w": 320.4,
                "low52w": 314.4
            },
            {
                "symbol": "IOC",
                "ltp": 139.94,
                "changePct": 0.05,
                "high52w": 140.69,
                "low52w": 138.86
            },
            {
                "symbol": "AEGISLOG",
                "ltp": 1249.3,
                "changePct": 28.3,
                "high52w": 1291.4,
                "low52w": 1222.3
            },
            {
                "symbol": "MGL",
                "ltp": 1118.5,
                "changePct": -5,
                "high52w": 1179,
                "low52w": 1111.1
            },
            {
                "symbol": "OIL",
                "ltp": 456.9,
                "changePct": 2.35,
                "high52w": 459.4,
                "low52w": 451.2
            },
            {
                "symbol": "PETRONET",
                "ltp": 278.9,
                "changePct": 1.15,
                "high52w": 281.3,
                "low52w": 276.95
            },
            {
                "symbol": "ATGL",
                "ltp": 650.15,
                "changePct": 1.35,
                "high52w": 657.5,
                "low52w": 647.75
            },
            {
                "symbol": "AEGISVOPAK",
                "ltp": 292.3,
                "changePct": -1.7,
                "high52w": 295.47,
                "low52w": 288
            },
            {
                "symbol": "CASTROLIND",
                "ltp": 184.82,
                "changePct": 0.51,
                "high52w": 185.61,
                "low52w": 184.93
            },
            {
                "symbol": "IGL",
                "ltp": 151.74,
                "changePct": 0.26,
                "high52w": 152.69,
                "low52w": 151.06
            }
        ]
    },
    "NIFTY-PHARMA": {
        "id": "NIFTY-PHARMA",
        "name": "NIFTY PHARMA",
        "description": "NIFTY PHARMA sector constituent stocks",
        "stocks": [
            {
                "symbol": "SUNPHARMA",
                "ltp": 2001.1,
                "changePct": -14.1,
                "high52w": 2046.9,
                "low52w": 1965.3
            },
            {
                "symbol": "TORNTPHARM",
                "ltp": 4872.1,
                "changePct": 267.8,
                "high52w": 5140.7,
                "low52w": 4894.4
            },
            {
                "symbol": "DIVISLAB",
                "ltp": 7835,
                "changePct": 250,
                "high52w": 8090,
                "low52w": 7870.5
            },
            {
                "symbol": "MANKIND",
                "ltp": 2575.9,
                "changePct": -103.9,
                "high52w": 2613.5,
                "low52w": 2422
            },
            {
                "symbol": "LAURUSLABS",
                "ltp": 1781.3,
                "changePct": 33.7,
                "high52w": 1826.6,
                "low52w": 1785
            },
            {
                "symbol": "LUPIN",
                "ltp": 2421.2,
                "changePct": -7.3,
                "high52w": 2435,
                "low52w": 2404
            },
            {
                "symbol": "CIPLA",
                "ltp": 1466.4,
                "changePct": 5.6,
                "high52w": 1478.8,
                "low52w": 1462.3
            },
            {
                "symbol": "PPLPHARMA",
                "ltp": 196.72,
                "changePct": -1.73,
                "high52w": 200.8,
                "low52w": 193.19
            },
            {
                "symbol": "WOCKPHARMA",
                "ltp": 1904,
                "changePct": 53.7,
                "high52w": 1966,
                "low52w": 1888.1
            },
            {
                "symbol": "DRREDDY",
                "ltp": 1144.8,
                "changePct": 0.7,
                "high52w": 1154.3,
                "low52w": 1141.7
            },
            {
                "symbol": "BIOCON",
                "ltp": 425.35,
                "changePct": 0.65,
                "high52w": 428.25,
                "low52w": 422.9
            },
            {
                "symbol": "GLENMARK",
                "ltp": 2190.3,
                "changePct": 59.7,
                "high52w": 2256.7,
                "low52w": 2207
            },
            {
                "symbol": "ZYDUSLIFE",
                "ltp": 1115.1,
                "changePct": 9.9,
                "high52w": 1134.3,
                "low52w": 1117.7
            },
            {
                "symbol": "AJANTPHARM",
                "ltp": 3436.4,
                "changePct": 33.6,
                "high52w": 3498,
                "low52w": 3350
            },
            {
                "symbol": "AUROPHARMA",
                "ltp": 1576.3,
                "changePct": 3.7,
                "high52w": 1588.5,
                "low52w": 1566.1
            },
            {
                "symbol": "ALKEM",
                "ltp": 5816.5,
                "changePct": -81.5,
                "high52w": 5833,
                "low52w": 5735
            },
            {
                "symbol": "GLAND",
                "ltp": 2517,
                "changePct": -12,
                "high52w": 2535.9,
                "low52w": 2500
            },
            {
                "symbol": "SAILIFE",
                "ltp": 1315.2,
                "changePct": 4.8,
                "high52w": 1338,
                "low52w": 1303.6
            },
            {
                "symbol": "IPCALAB",
                "ltp": 1758.8,
                "changePct": -16.8,
                "high52w": 1780.3,
                "low52w": 1741
            },
            {
                "symbol": "ABBOTINDIA",
                "ltp": 27555,
                "changePct": 195,
                "high52w": 27880,
                "low52w": 27430
            }
        ]
    },
    "NIFTY-PRIVATE-BANK": {
        "id": "NIFTY-PRIVATE-BANK",
        "name": "NIFTY PRIVATE BANK",
        "description": "NIFTY PRIVATE BANK sector constituent stocks",
        "stocks": [
            {
                "symbol": "HDFCBANK",
                "ltp": 753.95,
                "changePct": -5.95,
                "high52w": 757.55,
                "low52w": 747.2
            },
            {
                "symbol": "ICICIBANK",
                "ltp": 1433.9,
                "changePct": 0,
                "high52w": 1441.9,
                "low52w": 1431.4
            },
            {
                "symbol": "AXISBANK",
                "ltp": 1228.9,
                "changePct": -1.8,
                "high52w": 1239.7,
                "low52w": 1226
            },
            {
                "symbol": "INDUSINDBK",
                "ltp": 1011.45,
                "changePct": -0.45,
                "high52w": 1017.9,
                "low52w": 996.4
            },
            {
                "symbol": "KOTAKBANK",
                "ltp": 389.4,
                "changePct": -0.55,
                "high52w": 391.85,
                "low52w": 388
            },
            {
                "symbol": "RBLBANK",
                "ltp": 378.05,
                "changePct": -4.5,
                "high52w": 381.8,
                "low52w": 373
            },
            {
                "symbol": "FEDERALBNK",
                "ltp": 354.15,
                "changePct": 4.5,
                "high52w": 359.7,
                "low52w": 354.75
            },
            {
                "symbol": "BANDHANBNK",
                "ltp": 172.72,
                "changePct": 1.18,
                "high52w": 175.4,
                "low52w": 173.28
            },
            {
                "symbol": "IDFCFIRSTB",
                "ltp": 84.76,
                "changePct": 0.08,
                "high52w": 85.74,
                "low52w": 84.51
            },
            {
                "symbol": "YESBANK",
                "ltp": 22.54,
                "changePct": 0.24,
                "high52w": 22.85,
                "low52w": 22.48
            }
        ]
    }
};

  let activeCategoryInModal = null;

  /* ---- NUMBER SANITIZATION ---- */
  function parseNum(str) {
    if (typeof str === 'number') return isNaN(str) ? 0 : str;
    const clean = String(str || '')
      .replace(/[₹$,\s]/g, '')
      .replace(/^\((.*)\)$/, '-$1')
      .trim();
    return parseFloat(clean) || 0;
  }

  function cleanCategoryName(filename) {
    let name = String(filename || '')
      .replace(/^MW[-_]/i, '')
      .replace(/-\d{1,2}-[A-Za-z]+-\d{4}\.(csv|xlsx|xls)$/i, '')
      .replace(/\([0-9]+\)/g, '')
      .replace(/\.(csv|xlsx|xls)$/i, '');
    name = name.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim().toUpperCase();
    return name || 'CUSTOM WATCHLIST';
  }

  /* ---- FALLBACK MANUAL CSV PARSER ---- */
  function parseCSVTextManual(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    return lines.map(line => {
      const res = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') inQuotes = !inQuotes;
        else if (ch === ',' && !inQuotes) { res.push(cur.trim()); cur = ''; }
        else cur += ch;
      }
      res.push(cur.trim());
      return res;
    });
  }

  /* ---- EXCEL & CSV FILE PARSER ---- */
  function parseSingleFile(file) {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const fileName = file.name.toLowerCase();

      if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            const cat = processRawRows(rawRows, file.name);
            resolve(cat);
          } catch (err) {
            console.error('Failed to parse Excel:', err);
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsArrayBuffer(file);
      } else {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const text = e.target.result;
            // First try Papa.parse
            if (typeof Papa !== 'undefined') {
              Papa.parse(text, {
                skipEmptyLines: true,
                complete: result => {
                  let cat = null;
                  if (result && Array.isArray(result.data) && result.data.length > 0) {
                    cat = processRawRows(result.data, file.name);
                  }
                  if (!cat) {
                    // Fallback to manual line parser
                    const manualRows = parseCSVTextManual(text);
                    cat = processRawRows(manualRows, file.name);
                  }
                  resolve(cat);
                },
                error: () => {
                  const manualRows = parseCSVTextManual(text);
                  const cat = processRawRows(manualRows, file.name);
                  resolve(cat);
                }
              });
            } else {
              const manualRows = parseCSVTextManual(text);
              const cat = processRawRows(manualRows, file.name);
              resolve(cat);
            }
          } catch (err) {
            console.error('CSV reader error:', err);
            resolve(null);
          }
        };
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
      }
    });
  }

  function processRawRows(rawRows, filename) {
    if (!rawRows || !Array.isArray(rawRows) || rawRows.length < 2) return null;

    let headerIdx = -1;
    for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
      if (!Array.isArray(rawRows[i])) continue;
      const row = rawRows[i].map(c => String(c || '').replace(/^\uFEFF/, '').trim().toUpperCase());
      if (row.some(c => c.includes('SYMBOL') || c.includes('SECURITY') || c.includes('STOCK') || c.includes('TICKER') || c.includes('COMPANY') || c.includes('NAME'))) {
        headerIdx = i;
        break;
      }
    }

    let rawCategoryName = '';
    if (headerIdx > 0 && Array.isArray(rawRows[0]) && rawRows[0][0]) {
      const topCell = String(rawRows[0][0]).replace(/^\uFEFF/, '').trim();
      if (topCell && !topCell.toUpperCase().includes('SYMBOL') && topCell.length > 2) {
        rawCategoryName = topCell;
      }
    }
    if (!rawCategoryName) {
      rawCategoryName = cleanCategoryName(filename);
    }

    const headers = (headerIdx !== -1 && Array.isArray(rawRows[headerIdx]) ? rawRows[headerIdx] : rawRows[0]).map(c => String(c || '').replace(/^\uFEFF/, '').trim().toUpperCase());
    const dataRows = rawRows.slice(headerIdx !== -1 ? headerIdx + 1 : 1);

    const symbolCol = headers.findIndex(h => h.includes('SYMBOL') || h.includes('TICKER') || h.includes('SECURITY') || h.includes('STOCK') || h.includes('COMPANY') || h.includes('NAME'));
    const ltpCol = headers.findIndex(h => h.includes('LTP') || h.includes('PRICE') || h.includes('LAST') || h.includes('CLOSE') || h.includes('RATE') || h.includes('VAL'));
    const chgCol = headers.findIndex(h => h.includes('%') || h.includes('CHG') || h.includes('CHANGE'));
    const highCol = headers.findIndex(h => h.includes('52W H') || h.includes('HIGH') || h.includes('52 W H') || h.includes('52WH'));
    const lowCol = headers.findIndex(h => h.includes('52W L') || h.includes('LOW') || h.includes('52 W L') || h.includes('52WL'));

    if (symbolCol === -1) return null;

    const stocks = [];
    const seen = new Set();

    dataRows.forEach(row => {
      if (!row || !Array.isArray(row) || !row[symbolCol]) return;
      let sym = String(row[symbolCol]).replace(/^\uFEFF/, '').replace(/[",]/g, '').trim().toUpperCase();
      if (!sym || sym.startsWith('NIFTY') || sym === 'SYMBOL' || sym.startsWith('INDEX') || sym === '-' || sym === 'TOTAL') return;

      sym = window.PriceService ? PriceService.cleanSymbol(sym) : sym;
      if (!sym || seen.has(sym)) return;
      seen.add(sym);

      stocks.push({
        symbol: sym,
        ltp: ltpCol !== -1 ? parseNum(row[ltpCol]) : 0,
        changePct: chgCol !== -1 ? parseNum(row[chgCol]) : 0,
        high52w: highCol !== -1 ? parseNum(row[highCol]) : 0,
        low52w: lowCol !== -1 ? parseNum(row[lowCol]) : 0
      });
    });

    if (stocks.length === 0) return null;

    const catId = rawCategoryName.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toUpperCase() || 'CUSTOM-LIST';

    const categoryObj = {
      id: catId,
      name: rawCategoryName,
      stocks: stocks,
      importedAt: new Date().toISOString()
    };

    Storage.upsertWatchlistCategory(categoryObj);
    return categoryObj;
  }

  async function parseFiles(files) {
    if (!files || files.length === 0) return;
    App.toast(`Importing ${files.length} file(s)...`, 'info');

    let count = 0;
    let totalStocks = 0;

    for (const f of files) {
      const cat = await parseSingleFile(f);
      if (cat) {
        count++;
        totalStocks += cat.stocks.length;
      }
    }

    renderWatchlist();

    if (count > 0) {
      App.toast(`Successfully imported ${count} watchlist categories (${totalStocks} total stocks)!`, 'success');
    } else {
      App.toast('Could not extract stock data from selected files.', 'warn');
    }
  }

  /* ---- PRESET LOADER ---- */
  function loadPreset(presetKey) {
    const preset = NIFTY_PRESETS[presetKey];
    if (!preset) return;

    Storage.upsertWatchlistCategory({
      id: preset.id,
      name: preset.name,
      stocks: preset.stocks,
      importedAt: new Date().toISOString()
    });

    renderWatchlist();
    App.toast(`Loaded ${preset.name} watchlist (${preset.stocks.length} stocks)`, 'success');
  }

  function loadAllPresets() {
    const keys = Object.keys(NIFTY_PRESETS);
    let totalStocks = 0;
    keys.forEach(k => {
      const preset = NIFTY_PRESETS[k];
      totalStocks += preset.stocks.length;
      Storage.upsertWatchlistCategory({
        id: preset.id,
        name: preset.name,
        stocks: preset.stocks,
        importedAt: new Date().toISOString()
      });
    });

    renderWatchlist();
    App.toast(`All ${keys.length} NIFTY Sectoral Watchlists (${totalStocks} stocks) loaded!`, 'success');
  }

  /* ---- RENDER CATEGORY GRID ---- */
  function renderWatchlist() {
    const wl = Storage.getWatchlist();
    const cats = Object.values(wl);
    const grid = document.getElementById('watchlist-categories-grid');

    const elCats = document.getElementById('wl-card-cats');
    const elStocks = document.getElementById('wl-card-stocks');
    if (elCats) elCats.textContent = cats.length;
    if (elStocks) elStocks.textContent = cats.reduce((s, c) => s + (c.stocks ? c.stocks.length : 0), 0);

    if (!grid) return;

    if (cats.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;background:var(--card-bg);padding:2.5rem;border-radius:12px;text-align:center;border:1px dashed var(--border)">
          <div style="font-size:2.5rem;margin-bottom:.5rem">📊</div>
          <h3 style="margin-bottom:.5rem">No Watchlists Added Yet</h3>
          <p style="color:var(--text-muted);margin-bottom:1.5rem;max-width:500px;margin-left:auto;margin-right:auto">
            You can load all ${Object.keys(NIFTY_PRESETS).length} built-in NIFTY sectoral watchlists with one click, or import custom CSV / Excel sheets from the NSE website.
          </p>
          <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap">
            <button class="btn btn-primary" onclick="Watchlist.loadAllPresets()">⚡ Load All NIFTY Sector Watchlists</button>
            <button class="btn btn-secondary" id="btn-empty-import" onclick="document.getElementById('watchlist-file-input').click()">📁 Import CSV/Excel</button>
          </div>
        </div>
      `;
      return;
    }

    grid.innerHTML = cats.map(cat => {
      const dateStr = cat.importedAt ? Utils.formatDate(cat.importedAt) : 'Preset';
      const stocksList = Array.isArray(cat.stocks) ? cat.stocks : [];
      const sampleStocks = stocksList.slice(0, 4).map(s => s.symbol).join(', ') + (stocksList.length > 4 ? '...' : '');

      return `
        <div class="wl-card">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div>
              <div class="wl-card-name">${Utils.escHtml(cat.name)}</div>
              <div class="wl-card-meta">${stocksList.length} stocks &middot; ${dateStr}</div>
            </div>
            <span class="badge" style="background:#e0f2fe;color:#0369a1;font-weight:600">${stocksList.length} Stocks</span>
          </div>
          <div style="margin:.75rem 0;font-size:.8rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
            ${Utils.escHtml(sampleStocks)}
          </div>
          <div class="btn-group" style="margin-top:.75rem">
            <button class="btn btn-secondary btn-sm" data-view-cat="${cat.id}">👁️ View Stocks</button>
            <button class="btn btn-secondary btn-sm" data-refresh-cat="${cat.id}" title="Refresh Live Prices">&#8635; Refresh</button>
            <button class="btn btn-danger btn-sm" data-delete-cat="${cat.id}" title="Delete Category">&#128465;</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ---- VIEW MODAL ---- */
  function openViewModal(id) {
    const wl = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat) return;
    activeCategoryInModal = id;

    const titleEl = document.getElementById('wl-view-title');
    const stocksList = Array.isArray(cat.stocks) ? cat.stocks : [];
    if (titleEl) titleEl.textContent = `${cat.name} (${stocksList.length} stocks)`;

    renderModalStocks(cat);
    App.openModal('modal-watchlist-view');
  }

  function renderModalStocks(cat) {
    const tbody = document.getElementById('wl-stocks-tbody');
    if (!tbody) return;

    const stocksList = Array.isArray(cat.stocks) ? cat.stocks : [];
    tbody.innerHTML = stocksList.map(s => {
      const pData = Storage.getPrice(s.symbol);
      const ltp = pData && pData.price ? pData.price : (s.ltp || 0);
      const changePct = pData && pData.changePct != null ? pData.changePct : (s.changePct || 0);
      const high52 = pData && pData.fiftyTwoWeekHigh ? pData.fiftyTwoWeekHigh : (s.high52w || 0);
      const low52 = pData && pData.fiftyTwoWeekLow ? pData.fiftyTwoWeekLow : (s.low52w || 0);

      const pctClass = changePct >= 0 ? 'gain' : 'loss';
      const pctSign = changePct >= 0 ? '+' : '';

      return `<tr>
        <td style="text-align:left">
          <strong>${Utils.escHtml(s.symbol)}</strong>
        </td>
        <td><strong>${Utils.formatCurrency(ltp)}</strong></td>
        <td class="${pctClass}">${pctSign}${(typeof changePct === 'number' ? changePct : 0).toFixed(2)}%</td>
        <td class="col-hide-md">${high52 ? Utils.formatCurrency(high52) : '—'}</td>
        <td class="col-hide-md">${low52 ? Utils.formatCurrency(low52) : '—'}</td>
        <td>
          <button class="btn btn-secondary btn-sm" onclick="Watchlist.quickAddToPlan('${s.symbol}', ${ltp})" title="Set purchase target for ${s.symbol}">+ Plan</button>
        </td>
      </tr>`;
    }).join('');
  }

  /* ---- REFRESH CATEGORY PRICES ---- */
  async function refreshCategoryPrices(id) {
    const wl = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat || !cat.stocks || !cat.stocks.length) return;

    if (window.PriceService) {
      App.toast(`Fetching live prices for ${cat.name}...`, 'info');
      await PriceService.fetchMultiple(cat.stocks);

      cat.stocks.forEach(s => {
        const p = Storage.getPrice(s.symbol);
        if (p && p.price) {
          s.ltp = p.price;
          s.changePct = p.changePct || 0;
          if (p.fiftyTwoWeekHigh) s.high52w = p.fiftyTwoWeekHigh;
          if (p.fiftyTwoWeekLow) s.low52w = p.fiftyTwoWeekLow;
        }
      });
      Storage.upsertWatchlistCategory(cat);

      if (activeCategoryInModal === id) {
        renderModalStocks(cat);
      }
      renderWatchlist();
      App.toast(`Live prices updated for ${cat.name}`, 'success');
    }
  }

  /* ---- QUICK ADD TO PLAN HELPER ---- */
  function quickAddToPlan(symbol, curPrice) {
    App.closeModal('modal-watchlist-view');
    const tabPlanBtn = document.querySelector('.tab-btn[data-tab="plan"]');
    if (tabPlanBtn) tabPlanBtn.click();

    setTimeout(() => {
      const btnAdd = document.getElementById('btn-add-plan');
      if (btnAdd) btnAdd.click();

      setTimeout(() => {
        const inpSym = document.getElementById('p-symbol');
        const inpPrice = document.getElementById('p-price');
        const catSel = document.getElementById('p-category');

        if (catSel) {
          catSel.value = '';
          const symbolGroup = document.getElementById('p-symbol-group');
          const stockGroup = document.getElementById('p-stock-select-group');
          if (symbolGroup) symbolGroup.style.display = '';
          if (stockGroup) stockGroup.style.display = 'none';
        }

        if (inpSym) inpSym.value = symbol;
        if (inpPrice && curPrice) inpPrice.value = (curPrice * 0.97).toFixed(2);
      }, 100);
    }, 150);
  }

  /* ---- DELETE CATEGORY ---- */
  function deleteCategory(id) {
    const wl = Storage.getWatchlist();
    const cat = wl[id];
    if (!cat) return;

    const confirmText = document.getElementById('confirm-text');
    const confirmBtn = document.getElementById('btn-confirm-ok');

    confirmText.innerHTML = `Delete watchlist <strong>"${Utils.escHtml(cat.name)}"</strong> (${cat.stocks.length} stocks)?`;

    function handler() {
      confirmBtn.removeEventListener('click', handler);
      App.closeModal('modal-confirm');
      Storage.deleteWatchlistCategory(id);
      renderWatchlist();
      App.toast(`Watchlist "${cat.name}" deleted.`, 'success');
    }

    confirmBtn.addEventListener('click', handler);
    App.openModal('modal-confirm');
  }

  /* ---- INIT ---- */
  function init() {
    const importBtn = document.getElementById('btn-import-watchlist');
    const fileInput = document.getElementById('watchlist-file-input');

    if (importBtn && fileInput) {
      importBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', function () {
        const files = Array.from(this.files);
        if (files.length) {
          parseFiles(files);
        }
        this.value = '';
      });
    }

    const grid = document.getElementById('watchlist-categories-grid');
    if (grid) {
      grid.addEventListener('click', e => {
        const viewBtn = e.target.closest('[data-view-cat]');
        const refreshBtn = e.target.closest('[data-refresh-cat]');
        const deleteBtn = e.target.closest('[data-delete-cat]');

        if (viewBtn) openViewModal(viewBtn.dataset.viewCat);
        if (refreshBtn) refreshCategoryPrices(refreshBtn.dataset.refreshCat);
        if (deleteBtn) deleteCategory(deleteBtn.dataset.deleteCat);
      });
    }

    renderWatchlist();
  }

  window.Watchlist = {
    init,
    render: renderWatchlist,
    loadPreset,
    loadAllPresets,
    quickAddToPlan,
    refreshCategoryPrices,
    parseFiles
  };
})();
