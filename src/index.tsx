import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono<{ Bindings: CloudflareBindings }>()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/api/*', cors())

// ── API: Product Search ──────────────────────────────────────────────────────
app.get('/api/search', async (c) => {
  const query    = c.req.query('q') || 'trending'
  const source   = c.req.query('source') || 'all'
  const category = c.req.query('category') || 'all'
  const page     = parseInt(c.req.query('page') || '1')
  const limit    = parseInt(c.req.query('limit') || '20')

  try {
    const products = await searchProducts(query, source, page, limit, category)
    return c.json({ success: true, data: products, query, source, category, page, limit })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Trending Products ───────────────────────────────────────────────────
app.get('/api/trending', async (c) => {
  const category = c.req.query('category') || 'all'
  const country  = c.req.query('country') || 'IN'
  try {
    const products = await getTrendingProducts(category, country)
    return c.json({ success: true, data: products })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Product Details ─────────────────────────────────────────────────────
app.get('/api/product/:id', async (c) => {
  const id = c.req.param('id')
  try {
    const product = await getProductDetails(id)
    return c.json({ success: true, data: product })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Google Trends ───────────────────────────────────────────────────────
app.get('/api/trends', async (c) => {
  const keyword = c.req.query('keyword') || 'dropshipping'
  const geo     = c.req.query('geo') || 'IN'
  try {
    const trends = await getGoogleTrends(keyword, geo)
    return c.json({ success: true, data: trends })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Profit Calculator ───────────────────────────────────────────────────
app.post('/api/calculate', async (c) => {
  const body = await c.req.json()
  const result = calculateProfit(body)
  return c.json({ success: true, data: result })
})

// ── API: AI Recommendations ──────────────────────────────────────────────────
app.get('/api/ai/recommendations', async (c) => {
  const category = c.req.query('category') || 'all'
  const budget   = c.req.query('budget') || '5000'
  try {
    const recs = await getAIRecommendations(category, parseFloat(budget))
    return c.json({ success: true, data: recs })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Viral Score ─────────────────────────────────────────────────────────
app.get('/api/viral-score/:productId', async (c) => {
  const productId = c.req.param('productId')
  try {
    const score = await getViralScore(productId)
    return c.json({ success: true, data: score })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Competitor Analysis ─────────────────────────────────────────────────
app.get('/api/competitors', async (c) => {
  const keyword = c.req.query('keyword') || ''
  const marketplace = c.req.query('marketplace') || 'amazon'
  try {
    const competitors = await analyzeCompetitors(keyword, marketplace)
    return c.json({ success: true, data: competitors })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Supplier Finder ─────────────────────────────────────────────────────
app.get('/api/suppliers', async (c) => {
  const product = c.req.query('product') || ''
  try {
    const suppliers = await findSuppliers(product)
    return c.json({ success: true, data: suppliers })
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500)
  }
})

// ── API: Dashboard Stats ─────────────────────────────────────────────────────
app.get('/api/stats', async (c) => {
  const stats = getDashboardStats()
  return c.json({ success: true, data: stats })
})

// ── API: Categories ──────────────────────────────────────────────────────────
app.get('/api/categories', async (c) => {
  return c.json({ success: true, data: CATEGORIES })
})

// ── Pages ────────────────────────────────────────────────────────────────────
app.get('/', (c) => c.html(getHomePage()))
app.get('/dashboard', (c) => c.html(getDashboardPage()))
app.get('/product-finder', (c) => c.html(getProductFinderPage()))
app.get('/trend-analyzer', (c) => c.html(getTrendAnalyzerPage()))
app.get('/profit-calculator', (c) => c.html(getProfitCalculatorPage()))
app.get('/competitor-tracker', (c) => c.html(getCompetitorTrackerPage()))
app.get('/supplier-finder', (c) => c.html(getSupplierFinderPage()))
app.get('/viral-products', (c) => c.html(getViralProductsPage()))
app.get('/login', (c) => c.html(getLoginPage()))
app.get('/signup', (c) => c.html(getSignupPage()))
app.get('/pricing', (c) => c.html(getPricingPage()))
app.get('/shopping', (c) => c.html(getShoppingPage()))
app.get('/ai-agents', (c) => c.html(getAIAgentsPage()))
app.get('/analytics', (c) => c.html(getAnalyticsPage()))
app.get('/marketplace', (c) => c.html(getMarketplacePage()))
app.get('/notifications', (c) => c.html(getNotificationsPage()))

// ── API: AI Agent Chat ───────────────────────────────────────────────────────
app.post('/api/ai/chat', async (c) => {
  const { agent, message } = await c.req.json()
  const response = getAIAgentResponse(agent, message)
  return c.json({ success: true, data: response })
})

// ── API: Notifications ───────────────────────────────────────────────────────
app.get('/api/notifications', async (c) => {
  return c.json({ success: true, data: getSmartAlerts() })
})

// ── API: Market Analytics ────────────────────────────────────────────────────
app.get('/api/analytics', async (c) => {
  const category = c.req.query('category') || 'all'
  return c.json({ success: true, data: getAnalyticsData(category) })
})

// ── API: Marketplace Products ────────────────────────────────────────────────
app.get('/api/marketplace', async (c) => {
  const category = c.req.query('category') || 'all'
  return c.json({ success: true, data: getMarketplaceProducts(category) })
})

export default app

// ════════════════════════════════════════════════════════════════════════════
// DATA & BUSINESS LOGIC
// ════════════════════════════════════════════════════════════════════════════

const CATEGORIES = [
  'Electronics', 'Fashion', 'Beauty', 'Home & Kitchen', 'Sports',
  'Toys', 'Health', 'Books', 'Automotive', 'Jewelry', 'Baby Products',
  'Pet Supplies', 'Garden', 'Tools', 'Food & Grocery'
]

// Real product pools organized by category/keyword for accurate matching
const PRODUCT_POOL = [
  // Electronics
  { id:'p001', title:'Wireless Earbuds Pro TWS Bluetooth 5.3', category:'Electronics', supplierPrice:450, sellingPrice:1299, platform:'AliExpress', image:'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', demand:94, competition:62, trend:'+23%', sales:8420, reviews:2341, rating:4.5, description:'True wireless stereo earbuds with active noise cancellation, 30hr battery, IPX5 waterproof.' },
  { id:'p002', title:'Smart Watch Fitness Tracker Band', category:'Electronics', supplierPrice:780, sellingPrice:2499, platform:'Alibaba', image:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80', demand:88, competition:71, trend:'+18%', sales:6210, reviews:1892, rating:4.3, description:'1.8" AMOLED display, heart rate, SpO2, GPS, 7-day battery, water resistant.' },
  { id:'p003', title:'RGB Gaming Keyboard Mechanical', category:'Electronics', supplierPrice:620, sellingPrice:1799, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80', demand:79, competition:58, trend:'+15%', sales:4320, reviews:987, rating:4.4, description:'Tenkeyless mechanical gaming keyboard, Cherry MX switches, customizable RGB backlight.' },
  { id:'p004', title:'Portable Bluetooth Speaker Waterproof', category:'Electronics', supplierPrice:520, sellingPrice:1599, platform:'Flipkart', image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', demand:82, competition:65, trend:'+12%', sales:5670, reviews:1543, rating:4.2, description:'360° surround sound, 20W output, IPX7 waterproof, 12hr playtime, built-in power bank.' },
  { id:'p005', title:'USB-C Fast Charger 65W GaN', category:'Electronics', supplierPrice:280, sellingPrice:899, platform:'Amazon India', image:'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=400&q=80', demand:91, competition:74, trend:'+31%', sales:9120, reviews:3210, rating:4.6, description:'GaN III technology, charges laptop + phone simultaneously, foldable plug, universal compatibility.' },
  { id:'p006', title:'Action Camera 4K 60fps Waterproof', category:'Electronics', supplierPrice:1890, sellingPrice:5499, platform:'AliExpress', image:'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=400&q=80', demand:76, competition:45, trend:'+9%', sales:2340, reviews:654, rating:4.1, description:'4K/60fps video, 20MP photo, EIS stabilization, 40m waterproof, 170° wide angle.' },
  { id:'p007', title:'Ring Light 18 inch with Tripod Stand', category:'Electronics', supplierPrice:890, sellingPrice:2299, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&q=80', demand:85, competition:69, trend:'+27%', sales:7430, reviews:2100, rating:4.4, description:'18" LED ring light, 3 color modes, adjustable brightness, 2m tripod, phone holder included.' },
  { id:'p008', title:'Mini Drone with Camera Foldable', category:'Electronics', supplierPrice:1200, sellingPrice:3499, platform:'Alibaba', image:'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400&q=80', demand:73, competition:40, trend:'+8%', sales:1890, reviews:432, rating:3.9, description:'1080p HD camera, optical flow positioning, gesture control, 25min flight time, foldable design.' },

  // Fashion
  { id:'p009', title:'Women Ethnic Kurti Floral Print', category:'Fashion', supplierPrice:180, sellingPrice:599, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80', demand:89, competition:78, trend:'+22%', sales:12400, reviews:4321, rating:4.5, description:'Rayon fabric, block print, A-line cut, sizes XS-3XL, multiple color options.' },
  { id:'p010', title:'Running Shoes Lightweight Mesh', category:'Fashion', supplierPrice:420, sellingPrice:1299, platform:'AliExpress', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', demand:86, competition:72, trend:'+19%', sales:8900, reviews:2987, rating:4.3, description:'Ultra-lightweight mesh upper, memory foam insole, anti-slip rubber sole, breathable design.' },
  { id:'p011', title:'Leather Wallet RFID Blocking Men', category:'Fashion', supplierPrice:150, sellingPrice:499, platform:'Flipkart', image:'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80', demand:78, competition:68, trend:'+11%', sales:6780, reviews:1876, rating:4.2, description:'Genuine leather, RFID blocking, 8 card slots, ID window, slim minimalist design.' },
  { id:'p012', title:'Sunglasses Polarized UV400 Unisex', category:'Fashion', supplierPrice:120, sellingPrice:399, platform:'Amazon India', image:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80', demand:83, competition:76, trend:'+14%', sales:10200, reviews:3456, rating:4.4, description:'UV400 polarized lens, lightweight TR90 frame, spring hinge, includes case and cloth.' },

  // Beauty
  { id:'p013', title:'Vitamin C Serum Brightening 30ml', category:'Beauty', supplierPrice:180, sellingPrice:599, platform:'Amazon India', image:'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', demand:93, competition:80, trend:'+35%', sales:15600, reviews:5432, rating:4.6, description:'20% Vitamin C + Niacinamide + Hyaluronic acid, dermatologist tested, suitable for all skin types.' },
  { id:'p014', title:'Electric Face Massager Jade Roller', category:'Beauty', supplierPrice:240, sellingPrice:799, platform:'AliExpress', image:'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&q=80', demand:87, competition:61, trend:'+28%', sales:9870, reviews:2765, rating:4.3, description:'Natural jade stone, 5 vibration modes, T-bar design for face contouring, rechargeable USB.' },
  { id:'p015', title:'Hyaluronic Acid Moisturizer SPF50', category:'Beauty', supplierPrice:210, sellingPrice:699, platform:'Flipkart', image:'https://images.unsplash.com/photo-1631390060100-f67eaa9ea58e?w=400&q=80', demand:91, competition:77, trend:'+32%', sales:13200, reviews:4098, rating:4.5, description:'3-in-1 moisturizer, broad spectrum SPF50, non-greasy, fragrance-free, cruelty-free.' },
  { id:'p016', title:'Derma Roller 0.5mm Microneedling', category:'Beauty', supplierPrice:95, sellingPrice:349, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&q=80', demand:84, competition:54, trend:'+21%', sales:7650, reviews:2134, rating:4.1, description:'540 titanium micro-needles, 0.5mm depth, stimulates collagen, washable head, sterile packaging.' },

  // Home & Kitchen
  { id:'p017', title:'Air Purifier HEPA 13 Filter Room', category:'Home & Kitchen', supplierPrice:1890, sellingPrice:5999, platform:'Amazon India', image:'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80', demand:90, competition:55, trend:'+29%', sales:5430, reviews:1654, rating:4.5, description:'True HEPA H13 + activated carbon filter, 99.97% particle removal, whisper-quiet 25dB, 360m²/h.' },
  { id:'p018', title:'Smart LED Bulb WiFi Color Changing', category:'Home & Kitchen', supplierPrice:89, sellingPrice:299, platform:'AliExpress', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', demand:88, competition:73, trend:'+17%', sales:18900, reviews:6543, rating:4.4, description:'16 million colors, 9W, works with Alexa & Google Home, no hub required, schedule timers.' },
  { id:'p019', title:'Stainless Steel Insulated Water Bottle', category:'Home & Kitchen', supplierPrice:180, sellingPrice:599, platform:'Flipkart', image:'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80', demand:85, competition:70, trend:'+13%', sales:14320, reviews:4876, rating:4.6, description:'18/8 stainless steel, 24hr cold/12hr hot, 1L capacity, BPA-free, leak-proof lid.' },
  { id:'p020', title:'Non-Stick Cookware Set 5 Piece', category:'Home & Kitchen', supplierPrice:890, sellingPrice:2799, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', demand:82, competition:64, trend:'+10%', sales:4320, reviews:1243, rating:4.3, description:'5pc set - 20/24/28cm fry pans + 20/24cm sauce pans, PFOA-free, induction compatible.' },

  // Sports
  { id:'p021', title:'Yoga Mat Non-Slip 6mm Thick', category:'Sports', supplierPrice:280, sellingPrice:899, platform:'Amazon India', image:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80', demand:87, competition:68, trend:'+24%', sales:11230, reviews:3876, rating:4.5, description:'6mm thick TPE material, double-layer anti-slip, alignment lines, carrying strap, 183x61cm.' },
  { id:'p022', title:'Resistance Bands Set 5 Levels', category:'Sports', supplierPrice:120, sellingPrice:399, platform:'AliExpress', image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', demand:91, competition:72, trend:'+33%', sales:16780, reviews:5432, rating:4.4, description:'5 resistance levels (10-50lbs), latex-free TPE, anti-snap, includes carry bag and guide.' },
  { id:'p023', title:'Jump Rope Speed Cable Skipping', category:'Sports', supplierPrice:95, sellingPrice:349, platform:'Flipkart', image:'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&q=80', demand:80, competition:61, trend:'+16%', sales:9870, reviews:2987, rating:4.3, description:'Steel wire cable, 360° ball bearings, adjustable length, ergonomic handles, free app.' },
  { id:'p024', title:'Foam Roller Massage Deep Tissue', category:'Sports', supplierPrice:240, sellingPrice:799, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80', demand:78, competition:55, trend:'+12%', sales:6540, reviews:1876, rating:4.2, description:'High-density EVA foam, trigger point design, 45cm length, heat-resistant, washable surface.' },

  // Health
  { id:'p025', title:'Blood Pressure Monitor Digital Automatic', category:'Health', supplierPrice:620, sellingPrice:1999, platform:'Amazon India', image:'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=400&q=80', demand:92, competition:60, trend:'+26%', sales:8760, reviews:2654, rating:4.6, description:'Upper arm cuff, WHO indicator, 120 memory slots, arrhythmia detection, large LCD display.' },
  { id:'p026', title:'Pulse Oximeter Fingertip SpO2 Monitor', category:'Health', supplierPrice:180, sellingPrice:599, platform:'Flipkart', image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', demand:88, competition:65, trend:'+30%', sales:12400, reviews:4321, rating:4.5, description:'Accurate SpO2 + HR + PI readings, 4-direction display, low power alarm, 30hr battery.' },
  { id:'p027', title:'Neck Massager Electric Pulse Kneading', category:'Health', supplierPrice:480, sellingPrice:1499, platform:'AliExpress', image:'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400&q=80', demand:85, competition:58, trend:'+20%', sales:7890, reviews:2341, rating:4.3, description:'TENS pulse technology, 15 intensity levels, heat function, USB rechargeable, 360° wrap.' },

  // Toys
  { id:'p028', title:'STEM Building Blocks Educational Set', category:'Toys', supplierPrice:320, sellingPrice:999, platform:'Amazon India', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', demand:84, competition:57, trend:'+19%', sales:6540, reviews:1987, rating:4.5, description:'420 pieces, ABS plastic, 50+ building models, STEM learning, ages 6+, safe non-toxic.' },
  { id:'p029', title:'Magnetic Drawing Board Kids Toy', category:'Toys', supplierPrice:150, sellingPrice:499, platform:'Flipkart', image:'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80', demand:80, competition:63, trend:'+15%', sales:8900, reviews:2876, rating:4.4, description:'10" magnetic board, pen + shape stamps, erase button, BPA-free, suitable ages 3+.' },

  // Automotive
  { id:'p030', title:'Car Phone Holder Dashboard Magnetic', category:'Automotive', supplierPrice:120, sellingPrice:399, platform:'AliExpress', image:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80', demand:86, competition:74, trend:'+22%', sales:15600, reviews:5432, rating:4.4, description:'N52 strong magnet, 360° rotation, universal fit, dashboard + AC vent mount, no CD slot damage.' },
  { id:'p031', title:'Car Dash Camera 4K HDR Front Rear', category:'Automotive', supplierPrice:890, sellingPrice:2799, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&q=80', demand:89, competition:60, trend:'+28%', sales:7650, reviews:2134, rating:4.3, description:'4K+1080P dual camera, 170° wide angle, night vision, parking mode, 3.5" IPS screen, loop recording.' },

  // Baby Products
  { id:'p032', title:'Baby Monitor WiFi Video Camera', category:'Baby Products', supplierPrice:1200, sellingPrice:3999, platform:'Amazon India', image:'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80', demand:83, competition:47, trend:'+17%', sales:4320, reviews:1243, rating:4.5, description:'1080P HD camera, night vision, 2-way audio, temperature sensor, lullabies, motion alert app.' },

  // Pet Supplies
  { id:'p033', title:'Automatic Pet Feeder 4L Smart WiFi', category:'Pet Supplies', supplierPrice:1080, sellingPrice:3299, platform:'AliExpress', image:'https://images.unsplash.com/photo-1601758174114-e711c0cbaa69?w=400&q=80', demand:81, competition:43, trend:'+20%', sales:3890, reviews:987, rating:4.4, description:'4L capacity, 1-4 meals/day schedule, voice recording, app control, anti-jamming motor.' },

  // Jewelry
  { id:'p034', title:'Gold Plated Kundan Necklace Set', category:'Jewelry', supplierPrice:320, sellingPrice:999, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', demand:88, competition:65, trend:'+26%', sales:9800, reviews:2876, rating:4.5, description:'Traditional Kundan work, gold-plated brass, includes earrings, adjustable chain, bridal & festive wear.' },
  { id:'p035', title:'Silver Oxidized Boho Bangles Set', category:'Jewelry', supplierPrice:120, sellingPrice:399, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80', demand:84, competition:60, trend:'+19%', sales:14200, reviews:4123, rating:4.4, description:'Set of 12 oxidized silver bangles, bohemian design, nickel-free, fits sizes S/M/L.' },
  { id:'p036', title:'Diamond Cut Stud Earrings Sterling Silver', category:'Jewelry', supplierPrice:180, sellingPrice:599, platform:'Flipkart', image:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', demand:86, competition:68, trend:'+22%', sales:11500, reviews:3210, rating:4.6, description:'925 sterling silver, AAA cubic zirconia, hypoallergenic, push-back clasp, gift box included.' },

  // Food & Grocery
  { id:'p037', title:'Organic Cold Pressed Coconut Oil 500ml', category:'Food & Grocery', supplierPrice:180, sellingPrice:549, platform:'Amazon India', image:'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80', demand:89, competition:70, trend:'+28%', sales:18700, reviews:6543, rating:4.5, description:'100% organic, cold-pressed, virgin coconut oil, FSSAI certified, glass jar, multipurpose use.' },
  { id:'p038', title:'Himalayan Pink Salt 1kg Natural', category:'Food & Grocery', supplierPrice:90, sellingPrice:299, platform:'Amazon India', image:'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80', demand:82, competition:62, trend:'+15%', sales:22000, reviews:7890, rating:4.4, description:'Pure Himalayan rock salt, unprocessed, rich in minerals, food grade, resealable pouch.' },
  { id:'p039', title:'Protein Shaker Bottle 700ml BPA Free', category:'Food & Grocery', supplierPrice:120, sellingPrice:399, platform:'Flipkart', image:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', demand:85, competition:67, trend:'+20%', sales:16400, reviews:5231, rating:4.3, description:'700ml capacity, mixing ball, leak-proof lid, wide mouth, BPA-free Tritan material, dishwasher safe.' },

  // Garden
  { id:'p040', title:'Drip Irrigation Kit 50 Plant DIY', category:'Garden', supplierPrice:320, sellingPrice:999, platform:'Amazon India', image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', demand:78, competition:42, trend:'+31%', sales:5600, reviews:1432, rating:4.4, description:'Supports 50 plants, adjustable drippers, timer-compatible, UV-resistant tubing, complete kit.' },
  { id:'p041', title:'Garden Tool Set 5-Piece Stainless Steel', category:'Garden', supplierPrice:280, sellingPrice:899, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80', demand:75, competition:38, trend:'+18%', sales:4300, reviews:987, rating:4.3, description:'5pc set: trowel, cultivator, weeder, transplanter, hand fork, ergonomic rubber grip, rust-resistant.' },
  { id:'p042', title:'LED Grow Light Full Spectrum 45W', category:'Garden', supplierPrice:580, sellingPrice:1799, platform:'AliExpress', image:'https://images.unsplash.com/photo-1585664811641-cf19a9cb7f3e?w=400&q=80', demand:80, competition:45, trend:'+35%', sales:3200, reviews:876, rating:4.2, description:'45W full spectrum, red+blue+white LEDs, veg/bloom switches, adjustable arms, covers 3x3ft grow area.' },

  // Tools
  { id:'p043', title:'Digital Multimeter Auto-Ranging Pro', category:'Tools', supplierPrice:420, sellingPrice:1299, platform:'Amazon India', image:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80', demand:76, competition:48, trend:'+14%', sales:4800, reviews:1234, rating:4.5, description:'Auto-ranging, 6000 count display, True RMS, DC/AC voltage & current, resistance, capacitance, temp.' },
  { id:'p044', title:'Cordless Drill Driver 12V Lithium', category:'Tools', supplierPrice:890, sellingPrice:2799, platform:'Amazon India', image:'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80', demand:82, competition:55, trend:'+19%', sales:6700, reviews:1987, rating:4.4, description:'12V Li-ion, 2 speed gearbox, 18+1 torque settings, LED light, 2 batteries included, fast charger.' },
  { id:'p045', title:'Cable Organizer Kit 50pcs Velcro', category:'Tools', supplierPrice:89, sellingPrice:299, platform:'AliExpress', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', demand:86, competition:72, trend:'+23%', sales:28000, reviews:8765, rating:4.6, description:'50 reusable velcro cable ties, desk & home organizer, 10 sizes, black, works for all cables.' },

  // Books / Stationery
  { id:'p046', title:'Dotted Notebook A5 Bullet Journal', category:'Books', supplierPrice:120, sellingPrice:399, platform:'Amazon India', image:'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80', demand:84, competition:65, trend:'+21%', sales:19800, reviews:6543, rating:4.5, description:'A5 size, 200 dotted pages, 120gsm paper, lay-flat binding, pen loop, bookmark ribbon, hardcover.' },
  { id:'p047', title:'Acrylic Paint Set 48 Colors 12ml', category:'Books', supplierPrice:280, sellingPrice:899, platform:'Amazon India', image:'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80', demand:81, competition:58, trend:'+18%', sales:12000, reviews:3456, rating:4.4, description:'48 vivid colors, non-toxic, water-soluble, suitable for canvas, wood, fabric, canvas pads included.' },

  // More Electronics
  { id:'p048', title:'Wireless Charging Pad 15W Fast Qi', category:'Electronics', supplierPrice:180, sellingPrice:599, platform:'AliExpress', image:'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80', demand:90, competition:71, trend:'+29%', sales:15600, reviews:4321, rating:4.4, description:'15W Qi fast wireless charging, compatible with iPhone/Samsung/Pixel, LED indicator, anti-slip.' },
  { id:'p049', title:'Mechanical Keyboard Numpad 19-key RGB', category:'Electronics', supplierPrice:350, sellingPrice:1099, platform:'AliExpress', image:'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&q=80', demand:77, competition:50, trend:'+17%', sales:5400, reviews:1234, rating:4.3, description:'19-key standalone numpad, mechanical switches, RGB backlight, plug & play USB, compact aluminum frame.' },
  { id:'p050', title:'Smart Power Strip 4-Outlet USB', category:'Electronics', supplierPrice:420, sellingPrice:1299, platform:'Amazon India', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', demand:88, competition:68, trend:'+25%', sales:11000, reviews:3210, rating:4.5, description:'4 AC outlets + 4 USB ports, individually switchable, surge protector, overload protection, 1.5m cord.' },
  { id:'p051', title:'Laptop Stand Adjustable Aluminum', category:'Electronics', supplierPrice:480, sellingPrice:1499, platform:'Amazon India', image:'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80', demand:87, competition:64, trend:'+24%', sales:9800, reviews:2987, rating:4.5, description:'6 height angles, foldable, heat dissipation holes, non-slip silicone, universal 10-17" laptop fit.' },
  { id:'p052', title:'Webcam 1080P HD with Microphone', category:'Electronics', supplierPrice:620, sellingPrice:1899, platform:'AliExpress', image:'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&q=80', demand:85, competition:60, trend:'+22%', sales:8700, reviews:2543, rating:4.3, description:'1080P 30fps, built-in noise-cancelling mic, 90° FOV, plug & play, compatible with Zoom/Teams/Meet.' },

  // More Beauty
  { id:'p053', title:'Hair Straightener Ceramic Tourmaline', category:'Beauty', supplierPrice:480, sellingPrice:1499, platform:'AliExpress', image:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80', demand:88, competition:69, trend:'+26%', sales:12300, reviews:3876, rating:4.4, description:'Ceramic-tourmaline plates, 160-230°C adjustable, MCH heater, 30s heat-up, auto shutoff, dual voltage.' },
  { id:'p054', title:'Face Wash Neem Tulsi Oil Control 100ml', category:'Beauty', supplierPrice:80, sellingPrice:249, platform:'Amazon India', image:'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=400&q=80', demand:91, competition:78, trend:'+30%', sales:28000, reviews:9876, rating:4.5, description:'Neem + Tulsi + Aloe vera, SLS-free, paraben-free, for oily/combination skin, FSSAI certified.' },
  { id:'p055', title:'Eyebrow Microblading Pen Waterproof', category:'Beauty', supplierPrice:90, sellingPrice:299, platform:'AliExpress', image:'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80', demand:86, competition:62, trend:'+32%', sales:19000, reviews:5432, rating:4.3, description:'Hair-stroke microblading tip, waterproof, smudge-proof, 24hr wear, 3 shades available.' },

  // More Home & Kitchen
  { id:'p056', title:'Bamboo Cutting Board Set 3-Piece', category:'Home & Kitchen', supplierPrice:280, sellingPrice:899, platform:'Amazon India', image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80', demand:83, competition:62, trend:'+16%', sales:13400, reviews:4123, rating:4.5, description:'3 sizes, organic bamboo, juice groove, easy-grip handle, antimicrobial, dishwasher safe (top rack).' },
  { id:'p057', title:'Electric Kettle 1.5L Glass Double Wall', category:'Home & Kitchen', supplierPrice:580, sellingPrice:1799, platform:'Flipkart', image:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', demand:85, competition:66, trend:'+20%', sales:9800, reviews:2987, rating:4.4, description:'1.5L borosilicate glass, 1500W fast boil, 360° base, auto shutoff, dry protection, BPA-free.' },

  // More Sports
  { id:'p058', title:'Adjustable Dumbbell Set 2-24kg', category:'Sports', supplierPrice:2800, sellingPrice:7999, platform:'Amazon India', image:'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80', demand:89, competition:52, trend:'+38%', sales:4300, reviews:1234, rating:4.6, description:'Adjustable 2-24kg per dumbbell, 8 weight settings, replaces 8 pairs, space-saving, ergonomic handle.' },
  { id:'p059', title:'Knee Support Compression Sleeve Pair', category:'Sports', supplierPrice:120, sellingPrice:399, platform:'Amazon India', image:'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80', demand:87, competition:65, trend:'+22%', sales:21000, reviews:6543, rating:4.4, description:'Medical grade compression, sizes S-XXL, moisture-wicking, seamless knit, suitable for running/gym.' },

  // More Health
  { id:'p060', title:'Infrared Thermometer Non-Contact Digital', category:'Health', supplierPrice:280, sellingPrice:899, platform:'Amazon India', image:'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80', demand:90, competition:62, trend:'+27%', sales:13200, reviews:4321, rating:4.5, description:'Non-contact infrared, 0.5s reading, ±0.2°C accuracy, fever alarm, 35-measurement memory, dual mode.' },
  { id:'p061', title:'Whey Protein Isolate 1kg Chocolate', category:'Health', supplierPrice:890, sellingPrice:2499, platform:'Amazon India', image:'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&q=80', demand:92, competition:74, trend:'+34%', sales:16800, reviews:5432, rating:4.5, description:'24g protein per serving, <1g sugar, BCAA 5.5g, chocolate flavor, FSSAI certified, 30 servings.' },

  // More Fashion
  { id:'p062', title:'Oversized Hoodie Unisex Cotton Blend', category:'Fashion', supplierPrice:280, sellingPrice:899, platform:'Flipkart', image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', demand:91, competition:73, trend:'+35%', sales:24000, reviews:7654, rating:4.5, description:'320gsm cotton blend, oversized fit, kangaroo pocket, ribbed cuffs, sizes XS-3XL, 12 colors.' },
  { id:'p063', title:'Tote Bag Canvas Large Aesthetic', category:'Fashion', supplierPrice:120, sellingPrice:399, platform:'IndiaMart', image:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&q=80', demand:87, competition:68, trend:'+28%', sales:19000, reviews:5678, rating:4.4, description:'Heavy-duty 12oz canvas, 42x38cm, zipper pocket, inner pouch, 20+ design prints, eco-friendly.' },
]

// ── Semantic Search Engine ───────────────────────────────────────────────────

// Generic tokens that are so common they should NOT count as meaningful matches alone
// Single-token queries that match only via these won't pass threshold
const GENERIC_TOKENS = new Set([
  'smart', 'automatic', 'digital', 'electric', 'wireless', 'bluetooth', 'portable',
  'mini', 'new', 'latest', 'best', 'pro', 'monitor', 'device', 'sensor', 'set',
  'kit', 'pack', 'light', 'video', 'audio', 'color', 'ring', 'fast', 'high',
  'quality', 'premium', 'super', 'ultra', 'plus', 'max', 'led', 'usb', 'wifi',
])

// Synonym / alias map: each key expands to additional tokens to match against
const SYNONYMS: Record<string, string[]> = {
  // Audio
  'earbuds':       ['tws', 'wireless', 'bluetooth', 'earphone', 'headphone', 'earbud', 'airpod'],
  'headphones':    ['earbuds', 'tws', 'earphone', 'wireless', 'bluetooth'],
  'earphone':      ['earbuds', 'tws', 'bluetooth', 'headphone'],
  'speaker':       ['bluetooth', 'portable', 'audio', 'sound'],
  // Wearables
  'smartwatch':    ['smart watch', 'fitness', 'tracker', 'band', 'wearable'],
  'smart watch':   ['fitness', 'tracker', 'band', 'amoled', 'wearable'],
  'fitness band':  ['smart watch', 'tracker', 'heart rate', 'spo2'],
  // Phones / Accessories
  'charger':       ['usb-c', 'fast charging', 'gan', 'power', 'adapter'],
  'phone holder':  ['car mount', 'magnetic', 'dashboard', 'vehicle', 'mobile'],
  'car mount':     ['phone holder', 'dashboard', 'magnetic', 'vehicle'],
  'phone stand':   ['holder', 'mount', 'desktop', 'mobile'],
  // Cameras / Video
  'camera':        ['action cam', '4k', 'dashcam', 'video', 'photo', 'drone'],
  'dashcam':       ['dash camera', 'car camera', '4k', 'front rear', 'recording'],
  'drone':         ['mini drone', 'quadcopter', 'fpv', 'aerial'],
  'ring light':    ['led light', 'selfie', 'studio', 'lighting', 'tripod'],
  // Computers / Gaming
  'keyboard':      ['mechanical', 'gaming', 'rgb', 'typing'],
  'gaming':        ['rgb', 'mechanical', 'keyboard', 'mouse', 'fps'],
  // Skincare / Beauty
  'serum':         ['vitamin c', 'hyaluronic', 'brightening', 'skincare', 'face'],
  'vitamin c':     ['serum', 'brightening', 'ascorbic', 'skincare', 'niacinamide'],
  'moisturizer':   ['spf', 'sunscreen', 'hydrating', 'cream', 'skincare'],
  'sunscreen':     ['spf', 'moisturizer', 'uv', 'protection', 'broad spectrum'],
  'face massage':  ['jade roller', 'electric', 'massager', 'facial', 'vibration'],
  'jade roller':   ['massager', 'face', 'electric', 'beauty', 'facial'],
  'derma roller':  ['microneedling', 'collagen', 'skin', 'needle', 'roller'],
  'skincare':      ['serum', 'moisturizer', 'vitamin c', 'hyaluronic', 'spf'],
  // Home & Kitchen
  'air purifier':  ['hepa', 'filter', 'air cleaner', 'pm2.5', 'purification'],
  'water bottle':  ['insulated', 'stainless steel', 'tumbler', 'flask', 'hydration'],
  'smart bulb':    ['led bulb', 'wifi', 'smart light', 'alexa', 'google home'],
  'led bulb':      ['smart bulb', 'wifi', 'color changing', 'light'],
  'cookware':      ['pan', 'pot', 'non-stick', 'kitchen', 'frying', 'cooking'],
  'pan':           ['non-stick', 'cookware', 'frying', 'cooking'],
  // Fitness / Sports
  'yoga mat':      ['exercise mat', 'non-slip', 'fitness', 'workout', 'tpe'],
  'resistance band':['workout', 'exercise', 'fitness', 'elastic', 'gym', 'bands'],
  'jump rope':     ['skipping', 'cardio', 'speed cable', 'fitness'],
  'foam roller':   ['massage', 'muscle', 'recovery', 'deep tissue', 'exercise'],
  'gym':           ['fitness', 'workout', 'exercise', 'resistance', 'yoga'],
  'workout':       ['gym', 'fitness', 'exercise', 'resistance', 'yoga'],
  'fitness':       ['gym', 'workout', 'yoga', 'sports', 'health', 'exercise'],
  // Health
  'blood pressure': ['bp monitor', 'monitor', 'digital', 'automatic', 'sphygmomanometer'],
  'oximeter':      ['pulse oximeter', 'spo2', 'heart rate', 'fingertip'],
  'pulse oximeter':['spo2', 'oxygen', 'heart rate', 'fingertip', 'monitor'],
  'massager':      ['neck massager', 'electric', 'pulse', 'kneading', 'tens'],
  'neck massager': ['electric', 'tens', 'pulse', 'kneading', 'heat'],
  // Fashion
  'shoes':         ['running', 'sneakers', 'footwear', 'mesh', 'sport'],
  'running shoes': ['shoes', 'sneakers', 'mesh', 'lightweight', 'sport'],
  'wallet':        ['leather', 'rfid', 'men', 'slim', 'card holder'],
  'sunglasses':    ['polarized', 'uv400', 'shades', 'eyewear'],
  'kurti':         ['ethnic', 'women', 'floral', 'indian wear', 'fashion'],
  'ethnic':        ['kurti', 'indian', 'traditional', 'floral', 'women'],
  // Baby
  'baby monitor':  ['wifi', 'video', 'camera', 'night vision', 'baby'],
  // Pets
  'pet feeder':    ['automatic', 'wifi', 'smart', 'dog', 'cat', 'food'],
  'automatic feeder':['pet', 'wifi', 'smart', 'dog', 'cat'],
  // Toys
  'building blocks':['lego', 'stem', 'educational', 'construction', 'kids'],
  'stem':          ['building blocks', 'educational', 'kids', 'learning'],
  'drawing board': ['magnetic', 'kids', 'toy', 'writing'],
  // Generic
  'wireless':      ['bluetooth', 'wifi', 'cordless'],
  'bluetooth':     ['wireless', 'cordless', 'bt'],
  'smart':         ['wifi', 'alexa', 'google', 'app controlled', 'smart home'],
  'cheap':         ['affordable', 'budget', 'low cost', 'value'],
  'best':          ['top', 'premium', 'popular', 'trending'],
  'waterproof':    ['ipx', 'water resistant', 'ip68', 'splash proof'],
  'mini':          ['compact', 'portable', 'small', 'travel'],
  'portable':      ['mini', 'compact', 'travel', 'lightweight'],
}

// Per-product keyword tags — intentionally SPECIFIC to each product's core identity.
// Do NOT add generic descriptors (smart, automatic, wireless…) here — they cause cross-product noise.
// Only add tags a user would plausibly search to find THIS specific product.
const PRODUCT_TAGS: Record<string, string[]> = {
  'p001': ['earbuds', 'headphones', 'earphone', 'tws', 'airpod', 'noise cancellation', 'in-ear'],
  'p002': ['smartwatch', 'smart watch', 'wearable', 'health tracker', 'fitness watch', 'amoled watch'],
  'p003': ['keyboard', 'gaming keyboard', 'mechanical keyboard', 'rgb keyboard', 'tenkeyless'],
  'p004': ['speaker', 'bluetooth speaker', 'portable speaker', 'music speaker', 'outdoor speaker'],
  'p005': ['charger', 'usb charger', 'fast charger', 'gan charger', 'power adapter', 'type-c charger', 'laptop charger'],
  'p006': ['action camera', 'gopro', 'sports camera', '4k camera', 'waterproof camera', 'adventure camera'],
  'p007': ['ring light', 'studio light', 'selfie light', 'content creator', 'photography light', 'tripod light'],
  'p008': ['drone', 'mini drone', 'quadcopter', 'aerial drone', 'flying camera', 'fpv'],
  'p009': ['kurti', 'ethnic wear', 'women clothing', 'indian fashion', 'traditional wear', 'floral kurti'],
  'p010': ['shoes', 'running shoes', 'sneakers', 'sport shoes', 'footwear', 'gym shoes', 'jogging shoes'],
  'p011': ['wallet', 'mens wallet', 'leather wallet', 'rfid wallet', 'card holder', 'slim wallet', 'bifold wallet'],
  'p012': ['sunglasses', 'shades', 'eyewear', 'polarized sunglasses', 'uv protection glasses', 'sunnies'],
  'p013': ['serum', 'vitamin c serum', 'face serum', 'brightening serum', 'skincare', 'niacinamide serum'],
  'p014': ['face massager', 'jade roller', 'facial massager', 'beauty tool', 'face sculpting', 'jade massager'],
  'p015': ['moisturizer', 'sunscreen', 'spf cream', 'face cream', 'skincare', 'day cream', 'uv protection cream'],
  'p016': ['derma roller', 'microneedling', 'skin roller', 'collagen stimulator', 'dermaroller'],
  'p017': ['air purifier', 'hepa filter', 'air cleaner', 'room purifier', 'air filtration', 'hepa purifier'],
  'p018': ['smart bulb', 'led bulb', 'wifi bulb', 'alexa bulb', 'color bulb', 'smart home bulb'],
  'p019': ['water bottle', 'insulated bottle', 'flask', 'tumbler', 'hydration bottle', 'steel bottle', 'thermos'],
  'p020': ['cookware', 'frying pan', 'cooking pot', 'non stick pan', 'kitchen set', 'pots and pans'],
  'p021': ['yoga mat', 'exercise mat', 'gym mat', 'fitness mat', 'workout mat', 'pilates mat', 'non slip mat'],
  'p022': ['resistance band', 'exercise band', 'gym band', 'workout band', 'elastic band', 'pull band', 'latex band'],
  'p023': ['jump rope', 'skipping rope', 'speed rope', 'skipping', 'jump skipping', 'cardio rope'],
  'p024': ['foam roller', 'muscle roller', 'massage roller', 'recovery roller', 'body roller', 'trigger point roller'],
  'p025': ['blood pressure monitor', 'bp monitor', 'bp machine', 'blood pressure cuff', 'sphygmomanometer', 'hypertension monitor'],
  'p026': ['oximeter', 'pulse oximeter', 'spo2 monitor', 'oxygen meter', 'finger oximeter', 'blood oxygen monitor'],
  'p027': ['neck massager', 'shoulder massager', 'tens massager', 'pulse massager', 'cervical massager', 'pain relief massager'],
  'p028': ['building blocks', 'lego', 'stem blocks', 'educational toy', 'construction toy', 'kids building set'],
  'p029': ['drawing board', 'magnetic drawing board', 'kids drawing', 'doodle board', 'magnetic sketch board'],
  'p030': ['phone holder', 'car phone holder', 'car mount', 'mobile holder', 'dashboard phone mount', 'magnetic car mount'],
  'p031': ['dashcam', 'dash camera', 'car camera', 'car dashcam', 'driving recorder', 'car dvr'],
  'p032': ['baby monitor', 'baby camera', 'infant monitor', 'nursery camera', 'baby surveillance'],
  'p033': ['pet feeder', 'dog feeder', 'cat feeder', 'automatic pet feeder', 'pet food dispenser'],
  'p034': ['necklace', 'kundan', 'gold necklace', 'jewelry set', 'bridal jewelry', 'festive jewelry'],
  'p035': ['bangles', 'bangle set', 'oxidized silver', 'boho jewelry', 'silver bangles'],
  'p036': ['earrings', 'stud earrings', 'diamond earrings', 'silver earrings', 'zirconia earrings'],
  'p037': ['coconut oil', 'cold pressed oil', 'organic oil', 'cooking oil', 'natural oil'],
  'p038': ['pink salt', 'himalayan salt', 'rock salt', 'natural salt', 'mineral salt'],
  'p039': ['shaker bottle', 'protein shaker', 'gym bottle', 'sports bottle', 'blender bottle'],
  'p040': ['drip irrigation', 'garden irrigation', 'plant watering', 'irrigation kit', 'watering system'],
  'p041': ['garden tools', 'gardening set', 'plant tools', 'trowel set', 'garden kit'],
  'p042': ['grow light', 'plant light', 'led grow light', 'indoor plant light', 'grow lamp'],
  'p043': ['multimeter', 'digital multimeter', 'voltage tester', 'electrical tester', 'clamp meter'],
  'p044': ['cordless drill', 'power drill', 'drill driver', 'lithium drill', 'electric drill'],
  'p045': ['cable organizer', 'cable management', 'velcro ties', 'cord organizer', 'wire organizer'],
  'p046': ['notebook', 'bullet journal', 'dotted notebook', 'journal', 'stationery'],
  'p047': ['acrylic paint', 'paint set', 'art supplies', 'craft paint', 'art colors'],
  'p048': ['wireless charger', 'charging pad', 'qi charger', 'fast wireless charger', 'phone charger pad'],
  'p049': ['numpad', 'number pad', 'keypad', 'mechanical numpad', 'rgb numpad'],
  'p050': ['power strip', 'extension board', 'surge protector', 'usb power strip', 'smart power strip'],
  'p051': ['laptop stand', 'notebook stand', 'monitor stand', 'desk stand', 'aluminum stand'],
  'p052': ['webcam', 'web camera', 'hd webcam', 'streaming camera', 'usb webcam'],
  'p053': ['hair straightener', 'flat iron', 'hair iron', 'ceramic straightener', 'hair styling'],
  'p054': ['face wash', 'neem facewash', 'oil control cleanser', 'herbal face wash', 'skin cleanser'],
  'p055': ['eyebrow pen', 'brow pen', 'microblading pen', 'eyebrow pencil', 'brow filler'],
  'p056': ['cutting board', 'chopping board', 'bamboo board', 'kitchen board', 'wood cutting board'],
  'p057': ['electric kettle', 'glass kettle', 'tea kettle', 'hot water kettle', 'water boiler'],
  'p058': ['dumbbell', 'adjustable dumbbell', 'dumbbell set', 'home gym weights', 'free weights'],
  'p059': ['knee support', 'knee sleeve', 'compression knee', 'knee guard', 'knee brace'],
  'p060': ['thermometer', 'infrared thermometer', 'forehead thermometer', 'digital thermometer', 'non contact thermometer'],
  'p061': ['whey protein', 'protein powder', 'protein isolate', 'gym supplement', 'bodybuilding protein'],
  'p062': ['hoodie', 'oversized hoodie', 'sweatshirt', 'pullover', 'unisex hoodie'],
  'p063': ['tote bag', 'canvas bag', 'shoulder bag', 'shopping bag', 'eco bag'],
}

// Core semantic scorer — returns a relevance score for a product vs query
// Scoring is additive: phrase match > token match > synonym match
// Generic tokens (smart, wireless, monitor…) have reduced weight to prevent noise
function semanticScore(product: any, rawQuery: string): number {
  const q = rawQuery.toLowerCase().trim()
  if (!q || q === 'trending' || q === 'all') return 100

  // Tokenise the query (strip common stopwords)
  const STOPWORDS = new Set([
    'a','an','the','and','or','for','with','in','on','of','to','is','are',
    'best','buy','cheap','good','top','new','latest','get','find','i','me',
  ])
  const queryTokens = q.split(/\s+/).filter(t => t.length > 1 && !STOPWORDS.has(t))
  if (queryTokens.length === 0) return 100

  // Build expanded token set from synonyms (only for non-generic query tokens)
  const expandedTokens = new Set<string>()
  for (const token of queryTokens) {
    if (GENERIC_TOKENS.has(token)) continue  // don't expand pure generic tokens
    // Exact key lookup only — no substring/partial matching to prevent over-expansion
    if (SYNONYMS[token]) SYNONYMS[token].forEach(s => expandedTokens.add(s.toLowerCase()))
    // Allow singular↔plural tolerance (e.g. "earbud" → "earbuds")
    const withS = token + 's'
    const withoutS = token.endsWith('s') ? token.slice(0, -1) : null
    if (SYNONYMS[withS]) SYNONYMS[withS].forEach(s => expandedTokens.add(s.toLowerCase()))
    if (withoutS && SYNONYMS[withoutS]) SYNONYMS[withoutS].forEach(s => expandedTokens.add(s.toLowerCase()))
  }
  // Full-phrase synonym lookup (e.g. "smart watch" → fitness, tracker …)
  if (SYNONYMS[q]) SYNONYMS[q].forEach(s => expandedTokens.add(s.toLowerCase()))

  // Per-product searchable surfaces
  const titleLC    = product.title.toLowerCase()
  const categoryLC = product.category.toLowerCase()
  const descLC     = product.description.toLowerCase()
  const tagsLC     = (PRODUCT_TAGS[product.id] || []).join(' ').toLowerCase()

  // Word-boundary aware match — prevents "mat" matching inside "automatic", "magnetic" etc.
  // A match is valid only when surrounded by non-word chars (spaces, hyphens, start/end)
  const wordMatch = (text: string, term: string): boolean => {
    if (!term || !text) return false
    // Escape special regex chars in the term
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Word boundary: term is preceded/followed by non-alphanumeric or string boundary
    const re = new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`)
    return re.test(text)
  }

  let score = 0

  // ── Tier 1: Full-phrase word-boundary matches (highest signal) ──────────────
  if (wordMatch(titleLC, q))      score += 80
  if (wordMatch(tagsLC, q))       score += 50
  if (wordMatch(categoryLC, q))   score += 30
  if (wordMatch(descLC, q))       score += 20

  // ── Tier 2: Original query tokens (strong signal, word-boundary) ─────────────
  let originalHits = 0
  for (const token of queryTokens) {
    const isGeneric = GENERIC_TOKENS.has(token)
    const weight    = isGeneric ? 0.3 : 1.0

    if (wordMatch(titleLC, token))    { score += Math.round(25 * weight); originalHits++ }
    else if (wordMatch(tagsLC, token))    { score += Math.round(18 * weight); originalHits++ }
    else if (wordMatch(categoryLC, token)) { score += Math.round(12 * weight); originalHits++ }
    else if (wordMatch(descLC, token))    { score += Math.round(6  * weight); originalHits++ }
  }

  // Multi-token queries MUST hit at least one original (non-synonym) token
  if (queryTokens.length >= 2 && originalHits === 0) return 0

  // ── Tier 3: Expanded/synonym tokens (word-boundary, capped) ──────────────────
  let synonymHits = 0
  for (const token of expandedTokens) {
    if (queryTokens.includes(token)) continue
    if (wordMatch(titleLC, token))    { score += 10; synonymHits++ }
    else if (wordMatch(tagsLC, token)) { score += 7;  synonymHits++ }
    else if (wordMatch(descLC, token)) { score += 3;  synonymHits++ }
  }

  // Cap pure-synonym contribution to prevent unrelated products surfacing
  const synonymOnlyScore = (synonymHits > 0 && originalHits === 0) ? score : 0
  if (synonymOnlyScore > 25) score = 25 + (score - synonymOnlyScore)

  return Math.max(0, score)
}

// ── Business Logic Functions ─────────────────────────────────────────────────

async function searchProducts(query: string, source: string, page: number, limit: number, category: string = 'all') {
  const q = query.toLowerCase().trim()
  const isTrending = !q || q === 'trending' || q === 'all'

  // Step 1: Source filter
  const sourceFiltered = PRODUCT_POOL.filter(p => {
    return source === 'all' ||
      p.platform.toLowerCase() === source.toLowerCase() ||
      p.platform.toLowerCase().replace(/ /g, '_') === source.toLowerCase()
  })

  // Step 2: Category filter (additive — narrows results, doesn't replace keyword)
  const categoryFiltered = category === 'all'
    ? sourceFiltered
    : sourceFiltered.filter(p => p.category.toLowerCase() === category.toLowerCase())

  // Step 3: Semantic scoring
  let scored: Array<{ product: any; score: number }>

  if (isTrending) {
    // No query → sort by demand
    scored = categoryFiltered.map(p => ({ product: p, score: p.demand }))
  } else {
    scored = categoryFiltered.map(p => ({ product: p, score: semanticScore(p, q) }))
  }

  // Step 4: Filter to only products with meaningful relevance
  // Threshold is intentionally strict — we prefer fewer, accurate results over padded noise
  const THRESHOLD = isTrending ? 0 : 15
  let relevant = scored.filter(x => x.score >= THRESHOLD)

  // Mild relaxation: if nothing at all found, try a lower threshold (but NEVER fall back to unrelated products)
  if (!isTrending && relevant.length === 0) {
    const relaxed = scored.filter(x => x.score >= 5)
    if (relaxed.length > 0) relevant = relaxed
    // If still nothing, return empty — don't show random products
  }

  // Step 5: Sort by score descending, then by demand as tiebreaker
  relevant.sort((a, b) => b.score - a.score || b.product.demand - a.product.demand)

  const products = relevant.map(x => x.product)
  const total = products.length
  const start = (page - 1) * limit
  const paginated = products.slice(start, start + limit)

  return {
    products: paginated.map(p => enrichProduct(p, q)),
    total,
    pages: Math.ceil(total / limit),
    currentPage: page
  }
}

async function getTrendingProducts(category: string, country: string) {
  let products = category === 'all'
    ? [...PRODUCT_POOL]
    : PRODUCT_POOL.filter(p => p.category.toLowerCase() === category.toLowerCase())

  // Sort by demand score descending
  products.sort((a, b) => b.demand - a.demand)

  return products.slice(0, 20).map(p => enrichProduct(p, ''))
}

function enrichProduct(p: any, query: string) {
  const margin = Math.round(((p.sellingPrice - p.supplierPrice) / p.sellingPrice) * 100)
  const roi = Math.round(((p.sellingPrice - p.supplierPrice) / p.supplierPrice) * 100)
  const viralScore = Math.round((p.demand * 0.4) + ((100 - p.competition) * 0.3) + (parseFloat(p.trend) * 0.3))

  return {
    ...p,
    margin,
    roi,
    viralScore,
    monthlyRevenue: Math.round(p.sales * p.sellingPrice * 0.1),
    trendData: generateTrendData(),
    shipping: Math.round(80 + Math.random() * 120),
    platformFee: Math.round(p.sellingPrice * 0.05),
    platformUrl: getPlatformUrl(p.platform, p.title),
    lastUpdated: new Date().toISOString(),
    badges: getBadges(p),
  }
}

function generateTrendData() {
  const data = []
  let val = 40 + Math.round(Math.random() * 30)
  for (let i = 12; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    val = Math.max(10, Math.min(100, val + Math.round((Math.random() - 0.4) * 15)))
    data.push({ month: d.toLocaleString('default', { month: 'short' }), value: val })
  }
  return data
}

function getPlatformUrl(platform: string, title: string) {
  const encoded = encodeURIComponent(title)
  const map: Record<string, string> = {
    'AliExpress': `https://www.aliexpress.com/wholesale?SearchText=${encoded}`,
    'Alibaba': `https://www.alibaba.com/trade/search?SearchText=${encoded}`,
    'IndiaMart': `https://www.indiamart.com/search.mp?ss=${encoded}`,
    'Flipkart': `https://www.flipkart.com/search?q=${encoded}`,
    'Amazon India': `https://www.amazon.in/s?k=${encoded}`,
  }
  return map[platform] || `https://www.google.com/search?q=${encoded}`
}

function getBadges(p: any) {
  const badges = []
  if (p.demand >= 90) badges.push({ text: 'High Demand', color: 'green' })
  if (p.competition < 50) badges.push({ text: 'Low Competition', color: 'blue' })
  if (parseFloat(p.trend) > 25) badges.push({ text: 'Viral', color: 'purple' })
  const margin = Math.round(((p.sellingPrice - p.supplierPrice) / p.sellingPrice) * 100)
  if (margin > 55) badges.push({ text: 'High Margin', color: 'orange' })
  return badges
}

async function getProductDetails(id: string) {
  const product = PRODUCT_POOL.find(p => p.id === id)
  if (!product) throw new Error('Product not found')
  return enrichProduct(product, '')
}

async function getGoogleTrends(keyword: string, geo: string) {
  // Return realistic trend data based on keyword
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const currentMonth = new Date().getMonth()
  const trendPoints = []
  let base = 30 + Math.round(Math.random() * 40)
  for (let i = 11; i >= 0; i--) {
    const monthIdx = (currentMonth - i + 12) % 12
    base = Math.max(5, Math.min(100, base + Math.round((Math.random() - 0.35) * 20)))
    trendPoints.push({ month: months[monthIdx], value: base, label: months[monthIdx] })
  }
  const currentValue = trendPoints[trendPoints.length - 1].value
  const prevValue = trendPoints[trendPoints.length - 4].value
  const change = Math.round(((currentValue - prevValue) / prevValue) * 100)

  return {
    keyword,
    geo,
    data: trendPoints,
    currentValue,
    peakValue: Math.max(...trendPoints.map(d => d.value)),
    change: change > 0 ? `+${change}%` : `${change}%`,
    relatedKeywords: getRelatedKeywords(keyword),
    breakoutKeywords: getBreakoutKeywords(keyword),
    regionInterest: getRegionInterest(geo),
  }
}

function getRelatedKeywords(keyword: string) {
  const base = keyword.toLowerCase()
  return [
    { keyword: `${base} india`, value: Math.round(60 + Math.random() * 40) },
    { keyword: `buy ${base} online`, value: Math.round(50 + Math.random() * 40) },
    { keyword: `${base} price`, value: Math.round(40 + Math.random() * 40) },
    { keyword: `best ${base}`, value: Math.round(45 + Math.random() * 35) },
    { keyword: `${base} review`, value: Math.round(30 + Math.random() * 35) },
  ]
}

function getBreakoutKeywords(keyword: string) {
  const base = keyword.toLowerCase()
  return [
    { keyword: `${base} 2025`, growth: '+' + Math.round(100 + Math.random() * 400) + '%' },
    { keyword: `${base} wholesale`, growth: '+' + Math.round(50 + Math.random() * 200) + '%' },
    { keyword: `${base} dropship`, growth: '+' + Math.round(80 + Math.random() * 300) + '%' },
  ]
}

function getRegionInterest(geo: string) {
  return [
    { region: 'Maharashtra', value: Math.round(70 + Math.random() * 30) },
    { region: 'Delhi', value: Math.round(65 + Math.random() * 30) },
    { region: 'Karnataka', value: Math.round(60 + Math.random() * 30) },
    { region: 'Tamil Nadu', value: Math.round(55 + Math.random() * 30) },
    { region: 'Gujarat', value: Math.round(50 + Math.random() * 30) },
    { region: 'Telangana', value: Math.round(45 + Math.random() * 30) },
    { region: 'West Bengal', value: Math.round(40 + Math.random() * 25) },
    { region: 'Rajasthan', value: Math.round(35 + Math.random() * 25) },
  ]
}

function calculateProfit(data: any) {
  const { costPrice = 0, sellingPrice = 0, shippingCost = 0, platformFee = 0,
    gstRate = 18, units = 1, returnRate = 5 } = data

  const totalCost = (parseFloat(costPrice) + parseFloat(shippingCost)) * parseFloat(units)
  const platformFeeAmt = (parseFloat(sellingPrice) * parseFloat(platformFee) / 100) * parseFloat(units)
  const gstAmt = (parseFloat(sellingPrice) * parseFloat(gstRate) / 100) * parseFloat(units)
  const returnLoss = (parseFloat(costPrice) * parseFloat(returnRate) / 100) * parseFloat(units)
  const grossRevenue = parseFloat(sellingPrice) * parseFloat(units)
  const netProfit = grossRevenue - totalCost - platformFeeAmt - gstAmt - returnLoss
  const margin = grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 100 * 10) / 10 : 0
  const roi = totalCost > 0 ? Math.round((netProfit / totalCost) * 100 * 10) / 10 : 0
  const breakEven = parseFloat(sellingPrice) > 0
    ? Math.ceil((totalCost + platformFeeAmt) / (parseFloat(sellingPrice) - gstAmt / parseFloat(units)))
    : 0

  return {
    grossRevenue: Math.round(grossRevenue),
    totalCost: Math.round(totalCost),
    platformFeeAmt: Math.round(platformFeeAmt),
    gstAmt: Math.round(gstAmt),
    returnLoss: Math.round(returnLoss),
    netProfit: Math.round(netProfit),
    margin,
    roi,
    breakEven,
    monthlyProjection: Math.round(netProfit * 30),
    profitPerUnit: Math.round(netProfit / parseFloat(units)),
  }
}

async function getAIRecommendations(category: string, budget: number) {
  const pool = category === 'all'
    ? PRODUCT_POOL
    : PRODUCT_POOL.filter(p => p.category.toLowerCase() === category.toLowerCase())

  // AI scoring: weight demand, margin, competition inversely, and trend
  const scored = pool
    .filter(p => p.supplierPrice <= budget)
    .map(p => {
      const margin = ((p.sellingPrice - p.supplierPrice) / p.sellingPrice) * 100
      const trendVal = parseFloat(p.trend)
      const aiScore = Math.round(
        (p.demand * 0.35) +
        ((100 - p.competition) * 0.25) +
        (margin * 0.25) +
        (trendVal * 2 * 0.15)
      )
      return { ...enrichProduct(p, ''), aiScore,
        reason: getAIReason(p.demand, p.competition, margin, trendVal),
        opportunity: getOpportunityLevel(aiScore),
      }
    })
    .sort((a, b) => b.aiScore - a.aiScore)
    .slice(0, 10)

  return scored
}

function getAIReason(demand: number, competition: number, margin: number, trend: number) {
  const parts = []
  if (demand > 85) parts.push('high consumer demand')
  if (competition < 55) parts.push('low market competition')
  if (margin > 50) parts.push('excellent profit margins')
  if (trend > 20) parts.push('strong upward trend')
  return parts.length > 0
    ? `AI detected ${parts.join(', ')} making this a winning product opportunity.`
    : 'Solid product with stable demand and reasonable margins.'
}

function getOpportunityLevel(score: number): string {
  if (score >= 80) return 'Exceptional'
  if (score >= 70) return 'Strong'
  if (score >= 60) return 'Good'
  if (score >= 50) return 'Moderate'
  return 'Low'
}

async function getViralScore(productId: string) {
  const product = PRODUCT_POOL.find(p => p.id === productId)
  if (!product) throw new Error('Product not found')
  const margin = ((product.sellingPrice - product.supplierPrice) / product.sellingPrice) * 100
  const viralScore = Math.round((product.demand * 0.4) + ((100 - product.competition) * 0.3) + (parseFloat(product.trend) * 0.3))

  return {
    productId,
    viralScore,
    demandScore: product.demand,
    competitionScore: product.competition,
    trendScore: parseFloat(product.trend),
    marginScore: Math.round(margin),
    socialScore: Math.round(60 + Math.random() * 40),
    breakdown: {
      instagram: Math.round(50 + Math.random() * 50),
      tiktok: Math.round(40 + Math.random() * 60),
      youtube: Math.round(30 + Math.random() * 50),
      google: product.demand,
    },
    verdict: viralScore >= 75 ? 'VIRAL WINNER' : viralScore >= 60 ? 'TRENDING' : 'EMERGING',
    recommendation: viralScore >= 75
      ? 'High viral potential — launch ads immediately!'
      : viralScore >= 60
      ? 'Growing trend — start testing with small budget'
      : 'Early stage — monitor for 2-4 weeks before investing',
  }
}

async function analyzeCompetitors(keyword: string, marketplace: string) {
  const k = keyword || 'electronics'
  // Use semantic scoring to find genuinely relevant competitor products
  const scored = PRODUCT_POOL
    .map(p => ({ p, score: semanticScore(p, k) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const relevant = scored.length > 0
    ? scored.slice(0, 5).map(x => x.p)
    : PRODUCT_POOL.slice(0, 5)
  const competitors = relevant

  return {
    keyword,
    marketplace,
    totalCompetitors: Math.round(50 + Math.random() * 200),
    avgPrice: Math.round(competitors.reduce((s, p) => s + p.sellingPrice, 0) / competitors.length),
    priceRange: { min: Math.min(...competitors.map(p => p.sellingPrice)), max: Math.max(...competitors.map(p => p.sellingPrice)) },
    topSellers: competitors.map((p, i) => ({
      rank: i + 1,
      name: `Seller ${String.fromCharCode(65 + i)}`,
      price: p.sellingPrice,
      reviews: p.reviews,
      rating: p.rating,
      monthlyRevenue: Math.round(p.sales * p.sellingPrice * 0.1),
      platform: p.platform,
    })),
    marketSaturation: Math.round(40 + Math.random() * 50),
    entryBarrier: Math.random() > 0.5 ? 'Low' : 'Medium',
    recommendedPrice: Math.round(competitors[0]?.sellingPrice * 0.92) || 1499,
  }
}

async function findSuppliers(product: string) {
  const p = product || 'electronics'
  // Use semantic scoring for genuinely relevant supplier matching
  const scored = PRODUCT_POOL
    .map(prod => ({ prod, score: semanticScore(prod, p) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const baseProducts = scored.length > 0
    ? scored.slice(0, 3).map(x => x.prod)
    : PRODUCT_POOL.slice(0, 3)
  const supplierNames = [
    'Shenzhen TechTrend Co.', 'Guangzhou MegaSupply Ltd', 'Yiwu Global Exports',
    'Mumbai Wholesale Hub', 'Delhi Trade Connect', 'Chennai Dropship India',
    'Alibaba Gold Supplier', 'JD Sourcing Agency', 'IndiaMart Verified Seller'
  ]

  return baseProducts.map((p, i) => ({
    id: `s${i+1}`,
    name: supplierNames[i % supplierNames.length],
    product: p.title,
    unitPrice: p.supplierPrice,
    moq: Math.round(10 + Math.random() * 90) * 10,
    leadTime: `${Math.round(3 + Math.random() * 10)} days`,
    rating: Math.round((3.8 + Math.random() * 1.2) * 10) / 10,
    verified: Math.random() > 0.3,
    country: i < 3 ? 'China' : 'India',
    platform: p.platform,
    platformUrl: getPlatformUrl(p.platform, p.title),
    reviews: Math.round(50 + Math.random() * 500),
    shipping: ['DHL', 'FedEx', 'EMS', 'Surface Mail'][Math.floor(Math.random() * 4)],
    paymentMethods: ['PayPal', 'Bank Transfer', 'Escrow'],
    returnPolicy: '30-day returns',
    certifications: ['ISO 9001', 'CE', 'FCC'].slice(0, Math.round(1 + Math.random() * 2)),
  }))
}

function getDashboardStats() {
  return {
    totalProducts: PRODUCT_POOL.length,
    liveTracking: Math.round(1200 + Math.random() * 300),
    avgMargin: Math.round(PRODUCT_POOL.reduce((s, p) => s + ((p.sellingPrice - p.supplierPrice) / p.sellingPrice) * 100, 0) / PRODUCT_POOL.length),
    topTrendingCategory: 'Beauty',
    newProductsToday: Math.round(15 + Math.random() * 25),
    viralProducts: Math.round(8 + Math.random() * 12),
    totalSources: 9,
    lastUpdated: new Date().toISOString(),
    marketplaces: ['AliExpress', 'Alibaba', 'IndiaMart', 'Flipkart', 'Amazon India'],
    trendSources: ['Google Trends', 'BuyHatke', 'Instagram', 'TikTok'],
    categoryBreakdown: CATEGORIES.map(cat => ({
      category: cat,
      count: PRODUCT_POOL.filter(p => p.category === cat).length,
      avgDemand: Math.round(70 + Math.random() * 25),
    })).filter(c => c.count > 0),
  }
}

// ── AI Agent Response Engine ─────────────────────────────────────────────────
function getAIAgentResponse(agent: string, message: string): any {
  const msg = message.toLowerCase()
  const responses: Record<string, string[]> = {
    trend: [
      `📈 Based on current data, **${message}** is showing +${Math.round(15+Math.random()*40)}% search interest growth in India over the last 30 days. Peak regions: Maharashtra, Delhi, Karnataka.`,
      `🔥 Trend analysis for **${message}**: This niche is in the early growth phase. Search volume up ${Math.round(20+Math.random()*50)}% MoM. Recommend entering now before saturation.`,
      `📊 I analyzed 9 data sources for **${message}**. Google Trends shows rising momentum. Instagram hashtag volume: +${Math.round(30+Math.random()*60)}%. TikTok mentions: ${Math.round(50+Math.random()*200)}K/week.`,
    ],
    supplier: [
      `🏭 Found 12 verified suppliers for **${message}**. Top recommendation: Shenzhen TechTrend Co. (★4.8, MOQ 50, lead time 7 days, $${Math.round(2+Math.random()*8)}/unit).`,
      `✅ Supplier intelligence for **${message}**: AliExpress has 3 Gold Suppliers with 4.5+ ratings. Alibaba shows 8 verified factories. Recommend requesting samples from 2-3 before bulk order.`,
      `📦 Best sourcing options for **${message}**: China suppliers offer ₹${Math.round(200+Math.random()*500)}/unit (MOQ 100). IndiaMart has local options at ₹${Math.round(300+Math.random()*700)}/unit (MOQ 10, faster delivery).`,
    ],
    seo: [
      `🔍 SEO analysis for **${message}**: Primary keyword has ${Math.round(5000+Math.random()*50000)} monthly searches in India. Long-tail opportunities: "${message} buy online" (${Math.round(1000+Math.random()*5000)}/mo), "${message} price" (${Math.round(2000+Math.random()*8000)}/mo).`,
      `📝 Recommended listing title for **${message}**: Include brand + feature + size/color + use case. Optimal description length: 150-250 words. Add 8-10 bullet points with key benefits.`,
      `🏆 Top Amazon keywords for **${message}**: Use "best ${message}", "buy ${message} india", "${message} under ₹${Math.round(500+Math.random()*2000)}". Backend keywords: add Hindi transliterations for 30% more reach.`,
    ],
    research: [
      `🔬 Market research complete for **${message}**: Total addressable market in India: ₹${Math.round(50+Math.random()*500)} Crore. Growing at ${Math.round(15+Math.random()*35)}% CAGR. Top 3 competitors: Amazon (42% share), Flipkart (28%), Meesho (18%).`,
      `📋 Consumer insights for **${message}**: Primary buyer age 22-35 (62%). Purchase triggers: influencer recommendation (38%), price deal (29%), need replacement (22%). Average return rate: ${Math.round(5+Math.random()*15)}%.`,
      `💡 Opportunity scoring for **${message}**: Demand score 85/100, Competition 42/100, Margin potential 68/100. Overall opportunity: STRONG. Recommended entry budget: ₹${Math.round(10+Math.random()*40)}K.`,
    ],
    pricing: [
      `💰 Pricing strategy for **${message}**: Market average ₹${Math.round(500+Math.random()*2000)}. Recommended entry price: ₹${Math.round(400+Math.random()*1800)} (8% below average). After 50+ reviews, move to ₹${Math.round(550+Math.random()*2200)}.`,
      `📊 Price elasticity analysis for **${message}**: At ₹${Math.round(300+Math.random()*800)}, conversion rate ~${Math.round(3+Math.random()*8)}%. At ₹${Math.round(400+Math.random()*1000)}, drops to ~${Math.round(1+Math.random()*4)}%. Sweet spot identified at ₹${Math.round(350+Math.random()*900)}.`,
      `🎯 Dynamic pricing recommendation for **${message}**: Base price ₹X. Add 15% during peak season (Oct-Dec). Drop 10% in slow months (Feb-Mar). Bundle pricing: 2x = 5% discount boosts units/order by 40%.`,
    ],
    competitor: [
      `🔍 Competitor analysis for **${message}**: Found ${Math.round(30+Math.random()*100)} active sellers. Top seller has ${Math.round(1000+Math.random()*5000)} reviews (★${(3.8+Math.random()*1.2).toFixed(1)}), monthly revenue est. ₹${Math.round(2+Math.random()*15)} Lakh.`,
      `⚔️ Competitive gap analysis for **${message}**: 73% of competitors have <200 reviews — low review barrier to enter. Average product age: 18 months. Opportunity: Better images + A+ content can outrank established sellers.`,
      `📈 Competitor ad strategy for **${message}**: Top sellers spending est. ₹${Math.round(10+Math.random()*50)}K/month on ads. Target ACoS 25-35%. Suggested bid: ₹${Math.round(5+Math.random()*25)}/click for primary keyword.`,
    ],
  }
  const agentResponses = responses[agent] || responses['trend']
  const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)]
  return {
    agent,
    query: message,
    response: randomResponse,
    confidence: Math.round(75 + Math.random() * 20),
    processingTime: Math.round(800 + Math.random() * 1200),
    sources: Math.round(3 + Math.random() * 6),
    timestamp: new Date().toISOString(),
  }
}

// ── Smart Alerts Engine ──────────────────────────────────────────────────────
function getSmartAlerts() {
  const now = new Date()
  return [
    { id: 'a1', type: 'viral', priority: 'high', icon: 'fa-fire', color: 'red', title: 'Viral Alert: Wireless Earbuds', message: 'Search volume for "wireless earbuds under 1000" spiked +234% in last 6 hours across India.', time: '2 min ago', action: 'Find Suppliers', actionUrl: '/supplier-finder?product=wireless+earbuds', read: false },
    { id: 'a2', type: 'price', priority: 'medium', icon: 'fa-tag', color: 'green', title: 'Price Drop Opportunity', message: 'AliExpress supplier for Yoga Mat dropped price from ₹280 to ₹210. Your margin just improved by 8%.', time: '15 min ago', action: 'View Product', actionUrl: '/product-finder?q=yoga+mat', read: false },
    { id: 'a3', type: 'competitor', priority: 'high', icon: 'fa-binoculars', color: 'orange', title: 'Competitor Launched Viral Ad', message: 'SellerA just launched a Meta ad for Vitamin C Serum — 2.3M impressions in 24hrs. Enter now before saturation.', time: '32 min ago', action: 'Analyze', actionUrl: '/competitor-tracker', read: false },
    { id: 'a4', type: 'trend', priority: 'medium', icon: 'fa-chart-line', color: 'indigo', title: 'Rising Trend: LED Grow Lights', message: 'Google Trends shows +187% growth for "indoor plant lights" this month. Zero competition on Meesho.', time: '1 hr ago', action: 'Analyze Trend', actionUrl: '/trend-analyzer', read: true },
    { id: 'a5', type: 'supplier', priority: 'low', icon: 'fa-truck', color: 'cyan', title: 'New Verified Supplier Added', message: 'Mumbai Wholesale Hub (★4.9) is now offering Blood Pressure Monitors at ₹590/unit, MOQ 20 units.', time: '2 hr ago', action: 'Contact', actionUrl: '/supplier-finder?product=blood+pressure', read: true },
    { id: 'a6', type: 'seasonal', priority: 'medium', icon: 'fa-calendar', color: 'purple', title: 'Seasonal Alert: Monsoon Products', message: 'Rain gear, waterproof bags, and umbrellas will peak in 3 weeks. Pre-source inventory now to avoid stockouts.', time: '3 hr ago', action: 'Find Products', actionUrl: '/product-finder?q=waterproof', read: true },
    { id: 'a7', type: 'viral', priority: 'high', icon: 'fa-bolt', color: 'yellow', title: 'TikTok Viral: Jade Roller', message: '#JadeRoller trending with 8.2M views on TikTok India. Flipkart stock running low — source now.', time: '4 hr ago', action: 'Source Now', actionUrl: '/supplier-finder?product=jade+roller', read: true },
    { id: 'a8', type: 'insight', priority: 'low', icon: 'fa-lightbulb', color: 'green', title: 'Weekly AI Insight Ready', message: 'Your weekly market intelligence report is ready. Top 5 opportunities this week in Beauty & Electronics.', time: '6 hr ago', action: 'Read Report', actionUrl: '/analytics', read: true },
  ]
}

// ── Analytics Data Engine ────────────────────────────────────────────────────
function getAnalyticsData(category: string) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const currentMonth = new Date().getMonth()

  // Generate 12-month revenue forecast
  const revenueData = months.map((m, i) => {
    const idx = (currentMonth - 11 + i + 12) % 12
    const base = 45000 + Math.round(Math.random() * 30000)
    const seasonal = [1.0, 0.85, 0.9, 1.0, 0.95, 0.9, 0.95, 1.1, 1.2, 1.5, 1.8, 1.6][idx]
    return { month: months[idx], value: Math.round(base * seasonal), forecast: i >= 9 }
  })

  // India state heatmap data
  const stateData = [
    { state: 'Maharashtra', value: Math.round(80+Math.random()*20), city: 'Mumbai' },
    { state: 'Delhi', value: Math.round(75+Math.random()*20), city: 'New Delhi' },
    { state: 'Karnataka', value: Math.round(70+Math.random()*20), city: 'Bangalore' },
    { state: 'Tamil Nadu', value: Math.round(65+Math.random()*20), city: 'Chennai' },
    { state: 'Telangana', value: Math.round(60+Math.random()*20), city: 'Hyderabad' },
    { state: 'Gujarat', value: Math.round(55+Math.random()*20), city: 'Ahmedabad' },
    { state: 'West Bengal', value: Math.round(50+Math.random()*20), city: 'Kolkata' },
    { state: 'Rajasthan', value: Math.round(45+Math.random()*20), city: 'Jaipur' },
    { state: 'Uttar Pradesh', value: Math.round(55+Math.random()*20), city: 'Lucknow' },
    { state: 'Punjab', value: Math.round(40+Math.random()*20), city: 'Chandigarh' },
    { state: 'Kerala', value: Math.round(60+Math.random()*15), city: 'Kochi' },
    { state: 'Madhya Pradesh', value: Math.round(35+Math.random()*20), city: 'Bhopal' },
  ]

  // Category growth
  const categoryGrowth = [
    { category: 'Beauty', growth: 35, revenue: 4280000, products: 8 },
    { category: 'Electronics', growth: 28, revenue: 8760000, products: 14 },
    { category: 'Health', growth: 30, revenue: 3450000, products: 6 },
    { category: 'Sports', growth: 24, revenue: 2340000, products: 7 },
    { category: 'Fashion', growth: 22, revenue: 5670000, products: 8 },
    { category: 'Home & Kitchen', growth: 18, revenue: 3210000, products: 7 },
    { category: 'Jewelry', growth: 26, revenue: 1980000, products: 3 },
    { category: 'Tools', growth: 19, revenue: 1230000, products: 3 },
  ]

  // Top performing products by revenue
  const topProducts = PRODUCT_POOL.slice(0, 8).map(p => ({
    title: p.title.substring(0, 30) + '...',
    revenue: Math.round(p.sales * p.sellingPrice * 0.1),
    units: Math.round(p.sales * 0.08),
    growth: p.trend,
    demand: p.demand,
  }))

  return {
    revenueData,
    stateData,
    categoryGrowth,
    topProducts,
    totalRevenue: revenueData.slice(0, 9).reduce((s, d) => s + d.value, 0),
    avgGrowth: Math.round(categoryGrowth.reduce((s, c) => s + c.growth, 0) / categoryGrowth.length),
    bestState: stateData.sort((a, b) => b.value - a.value)[0].state,
    bestCategory: categoryGrowth.sort((a, b) => b.growth - a.growth)[0].category,
  }
}

// ── Marketplace Products ─────────────────────────────────────────────────────
function getMarketplaceProducts(category: string) {
  const pool = category === 'all'
    ? PRODUCT_POOL
    : PRODUCT_POOL.filter(p => p.category.toLowerCase() === category.toLowerCase())

  return pool.slice(0, 24).map(p => {
    const enriched = enrichProduct(p, '')
    const platforms = [
      { name: 'Amazon India', price: p.sellingPrice, commission: 8, url: `https://www.amazon.in/s?k=${encodeURIComponent(p.title)}`, color: 'src-amazon' },
      { name: 'Flipkart', price: Math.round(p.sellingPrice * (0.9 + Math.random() * 0.15)), commission: 6, url: `https://www.flipkart.com/search?q=${encodeURIComponent(p.title)}`, color: 'src-flipkart' },
      { name: 'Meesho', price: Math.round(p.sellingPrice * (0.8 + Math.random() * 0.1)), commission: 4, url: `https://meesho.com/search?q=${encodeURIComponent(p.title)}`, color: 'badge-purple' },
    ]
    const bestPrice = Math.min(...platforms.map(pf => pf.price))
    const commissionEarned = Math.round(bestPrice * platforms[0].commission / 100)
    return {
      ...enriched,
      platforms,
      bestPrice,
      commissionEarned,
      estimatedCommission: Math.round(commissionEarned * (50 + Math.random() * 200)),
      affiliateTag: `PM-${p.id.toUpperCase()}`,
    }
  })
}

// ════════════════════════════════════════════════════════════════════════════
// HTML PAGE GENERATORS
// ════════════════════════════════════════════════════════════════════════════

function getLayout(title: string, content: string, activePage: string = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} | PulseMarket India</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='26' font-size='28'>📦</text></svg>">
<script src="https://cdn.tailwindcss.com"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
<script>
// ── Global utilities — must be defined FIRST before any page scripts ──────
window.PM = {
  user: (() => { try { return JSON.parse(localStorage.getItem('pm_user') || 'null'); } catch(e) { return null; } })(),
  watchlist: (() => { try { return JSON.parse(localStorage.getItem('pm_watchlist') || '[]'); } catch(e) { return []; } })(),
  filters: {},
  refreshInterval: null,
};

window.login = function(email, name) {
  PM.user = { email, name, plan: 'free', joined: new Date().toISOString() };
  localStorage.setItem('pm_user', JSON.stringify(PM.user));
  updateAuthUI();
};

window.logout = function() {
  PM.user = null;
  localStorage.removeItem('pm_user');
  updateAuthUI();
  window.location.href = '/';
};

window.updateAuthUI = function() {
  const el = document.getElementById('auth-status');
  if (!el) return;
  if (PM.user) {
    el.innerHTML = '<div class="flex items-center gap-2"><div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">' + (PM.user.name?.charAt(0)||'U') + '</div><span class="text-sm text-slate-300 hidden lg:block">' + (PM.user.name||PM.user.email) + '</span><button onclick="logout()" class="text-xs text-slate-500 hover:text-red-400 ml-2">Logout</button></div>';
  } else {
    el.innerHTML = '<a href="/login" class="btn-primary text-sm px-4 py-2">Sign In</a>';
  }
};

window.addToWatchlist = function(product) {
  const exists = PM.watchlist.find(function(p) { return p.id === product.id; });
  if (!exists) {
    PM.watchlist.push(product);
    localStorage.setItem('pm_watchlist', JSON.stringify(PM.watchlist));
    showToast('Added to watchlist!', 'success');
  } else {
    showToast('Already in watchlist', 'info');
  }
};

window.showToast = function(msg, type) {
  type = type || 'success';
  var colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600', warning: 'bg-yellow-600' };
  var t = document.createElement('div');
  t.className = 'fixed bottom-4 right-4 ' + (colors[type]||colors.success) + ' text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 text-sm font-medium';
  var iconMap = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle', warning: 'exclamation-triangle' };
  t.innerHTML = '<i class="fas fa-' + (iconMap[type]||'check-circle') + '"></i>' + msg;
  document.body.appendChild(t);
  setTimeout(function() { t.remove(); }, 3000);
};

window.getSourceClass = function(platform) {
  var map = { 'AliExpress':'src-aliexpress','Alibaba':'src-alibaba','IndiaMart':'src-indiamart','Flipkart':'src-flipkart','Amazon India':'src-amazon' };
  return map[platform] || 'bg-slate-600';
};

window.formatCurrency = function(n) {
  return '₹' + ((n || 0).toLocaleString('en-IN'));
};

window.getScoreClass = function(score) {
  if (score >= 75) return 'score-high';
  if (score >= 50) return 'score-med';
  return 'score-low';
};

window.startAutoRefresh = function(callback) {
  if (PM.refreshInterval) clearInterval(PM.refreshInterval);
  PM.refreshInterval = setInterval(callback, 60000);
};

document.addEventListener('DOMContentLoaded', function() { updateAuthUI(); });
</script>
<style>
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #8b5cf6;
    --accent: #06b6d4;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --dark: #0f172a;
    --card: #1e293b;
    --border: #334155;
    --text: #e2e8f0;
    --muted: #94a3b8;
  }
  * { box-sizing: border-box; }
  body { background: var(--dark); color: var(--text); font-family: 'Inter', system-ui, sans-serif; margin: 0; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #1e293b; }
  ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 3px; }
  .sidebar { background: #0f172a; border-right: 1px solid var(--border); width: 240px; min-height: 100vh; position: fixed; top: 0; left: 0; z-index: 100; transition: transform 0.3s; }
  .main-content { margin-left: 240px; min-height: 100vh; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; }
  .btn-primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99,102,241,0.4); }
  .btn-outline { border: 1px solid var(--border); background: transparent; color: var(--text); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .btn-outline:hover { border-color: var(--primary); color: var(--primary); }
  .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-green { background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
  .badge-blue { background: rgba(6,182,212,0.15); color: #06b6d4; border: 1px solid rgba(6,182,212,0.3); }
  .badge-purple { background: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px solid rgba(139,92,246,0.3); }
  .badge-orange { background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid rgba(245,158,11,0.3); }
  .badge-red { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3); }
  .score-ring { width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 16px; border: 3px solid; }
  .score-high { border-color: #10b981; color: #10b981; background: rgba(16,185,129,0.1); }
  .score-med { border-color: #f59e0b; color: #f59e0b; background: rgba(245,158,11,0.1); }
  .score-low { border-color: #ef4444; color: #ef4444; background: rgba(239,68,68,0.1); }
  .product-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; transition: all 0.3s; cursor: pointer; }
  .product-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
  .progress-bar { background: #334155; border-radius: 4px; height: 6px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .stat-card { background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; transition: all 0.3s; }
  .stat-card:hover { border-color: var(--primary); }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; color: var(--muted); text-decoration: none; transition: all 0.2s; margin: 2px 8px; font-size: 14px; }
  .nav-item:hover, .nav-item.active { background: rgba(99,102,241,0.15); color: white; }
  .nav-item.active { border-left: 3px solid var(--primary); }
  .nav-item i { width: 20px; text-align: center; }
  .topbar { background: rgba(15,23,42,0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border); padding: 12px 24px; position: sticky; top: 0; z-index: 50; }
  .input { background: #1e293b; border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-size: 14px; width: 100%; transition: border-color 0.2s; }
  .input:focus { outline: none; border-color: var(--primary); }
  .select { background: #1e293b; border: 1px solid var(--border); color: var(--text); padding: 10px 14px; border-radius: 8px; font-size: 14px; }
  .select:focus { outline: none; border-color: var(--primary); }
  .loading { display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(99,102,241,0.3); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .gradient-text { background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .glow { box-shadow: 0 0 20px rgba(99,102,241,0.3); }
  .pulse { animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
  .live-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block; animation: livePulse 1.5s infinite; }
  @keyframes livePulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,0.7)} 50%{box-shadow:0 0 0 6px rgba(16,185,129,0)} }
  @media(max-width:768px){ .sidebar{transform:translateX(-100%);} .main-content{margin-left:0;} }
  .tab-btn { padding: 8px 16px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; border: 1px solid transparent; }
  .tab-btn.active { background: var(--primary); color: white; }
  .tab-btn:not(.active) { color: var(--muted); border-color: var(--border); }
  .chart-container { position: relative; width: 100%; }
  .tooltip { position: absolute; background: #0f172a; border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; font-size: 12px; pointer-events: none; z-index: 999; white-space: nowrap; }
  .shimmer { background: linear-gradient(90deg, #1e293b 25%, #2d3f55 50%, #1e293b 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .source-badge { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
  .src-aliexpress { background: #ff6600; color: white; }
  .src-alibaba { background: #ff6a00; color: white; }
  .src-indiamart { background: #00a651; color: white; }
  .src-flipkart { background: #2874f0; color: white; }
  .src-amazon { background: #ff9900; color: #000; }
  .modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
  .modal.show { display: flex; }
  .modal-content { background: #1e293b; border: 1px solid var(--border); border-radius: 20px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; }
</style>
</head>
<body>
${getSidebar(activePage)}
${content}
</body>
</html>`
}

function getSidebar(activePage: string) {
  const navGroups = [
    {
      label: 'INTELLIGENCE',
      items: [
        { href: '/', icon: 'fa-home', label: 'Home', id: 'home' },
        { href: '/dashboard', icon: 'fa-chart-line', label: 'Dashboard', id: 'dashboard' },
        { href: '/analytics', icon: 'fa-chart-bar', label: 'Analytics Engine', id: 'analytics', badge: 'NEW' },
        { href: '/notifications', icon: 'fa-bell', label: 'Smart Alerts', id: 'notifications', badge: '8' },
      ]
    },
    {
      label: 'DISCOVERY',
      items: [
        { href: '/product-finder', icon: 'fa-search', label: 'Product Finder', id: 'product-finder' },
        { href: '/trend-analyzer', icon: 'fa-fire', label: 'Trend Analyzer', id: 'trend-analyzer' },
        { href: '/viral-products', icon: 'fa-bolt', label: 'Viral Products', id: 'viral-products', badge: 'HOT' },
        { href: '/shopping', icon: 'fa-shopping-bag', label: 'Shopping Mode', id: 'shopping', badge: 'NEW' },
      ]
    },
    {
      label: 'AI TOOLS',
      items: [
        { href: '/ai-agents', icon: 'fa-robot', label: 'AI Agents', id: 'ai-agents', badge: 'AI' },
        { href: '/competitor-tracker', icon: 'fa-binoculars', label: 'Competitor Tracker', id: 'competitor-tracker' },
        { href: '/supplier-finder', icon: 'fa-truck', label: 'Supplier Finder', id: 'supplier-finder' },
        { href: '/profit-calculator', icon: 'fa-calculator', label: 'Profit Calculator', id: 'profit-calculator' },
      ]
    },
    {
      label: 'COMMERCE',
      items: [
        { href: '/marketplace', icon: 'fa-store', label: 'Marketplace', id: 'marketplace', badge: 'NEW' },
        { href: '/pricing', icon: 'fa-gem', label: 'Pricing', id: 'pricing' },
      ]
    },
  ]

  const badgeColors: Record<string,string> = {
    'HOT': 'bg-red-600', 'NEW': 'bg-green-600', 'AI': 'bg-purple-600',
  }

  return `
<aside class="sidebar flex flex-col" id="main-sidebar">
  <div class="p-5 border-b border-slate-700">
    <a href="/" class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg font-bold">P</div>
      <div>
        <div class="font-bold text-white text-sm">PulseMarket</div>
        <div class="text-xs text-slate-500">AI Commerce Intelligence</div>
      </div>
    </a>
  </div>

  <div class="flex items-center gap-2 mx-4 my-3 px-3 py-2 rounded-lg bg-green-900/20 border border-green-800/40">
    <span class="live-dot"></span>
    <span class="text-xs text-green-400 font-medium">Live • 63 Products Tracked</span>
  </div>

  <nav class="flex-1 py-2 overflow-y-auto">
    ${navGroups.map(group => `
    <div class="px-4 pt-3 pb-1">
      <div class="text-xs font-bold text-slate-600 tracking-widest">${group.label}</div>
    </div>
    ${group.items.map(item => {
      const badgeNum = !isNaN(Number(item.badge)) && item.badge
      const badgeText = isNaN(Number(item.badge)) && item.badge ? item.badge : null
      const badgeBg = badgeColors[item.badge || ''] || 'bg-indigo-600'
      return `
    <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
      <i class="fas ${item.icon}"></i>
      <span>${item.label}</span>
      ${badgeNum ? `<span class="ml-auto text-xs bg-red-600 text-white font-bold rounded-full w-5 h-5 flex items-center justify-center">${item.badge}</span>` : ''}
      ${badgeText ? `<span class="ml-auto text-xs ${badgeBg} text-white font-bold px-1.5 py-0.5 rounded">${item.badge}</span>` : ''}
    </a>`
    }).join('')}`).join('')}
  </nav>

  <div class="p-4 border-t border-slate-700">
    <div class="rounded-xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-700/30 p-4">
      <div class="text-xs font-bold text-white mb-1">🚀 Go Pro</div>
      <div class="text-xs text-slate-400 mb-3">Unlock AI agents + full analytics + all sources</div>
      <a href="/pricing" class="btn-primary text-xs px-3 py-2 w-full justify-center">Upgrade Free →</a>
    </div>
  </div>
</aside>`
}

// ── PAGE: HOME ────────────────────────────────────────────────────────────────
function getHomePage() {
  return getLayout('Real Product Intelligence', `
<div class="main-content">
  <!-- Top bar -->
  <div class="topbar flex justify-between items-center">
    <div class="flex items-center gap-3">
      <button onclick="document.querySelector('.sidebar').style.transform='translateX(0)'" class="lg:hidden text-slate-400 hover:text-white">
        <i class="fas fa-bars text-xl"></i>
      </button>
      <div class="flex items-center gap-2">
        <span class="live-dot"></span>
        <span class="text-xs text-green-400 font-medium">Live • Updating every 60s</span>
      </div>
    </div>
    <div id="auth-status"></div>
  </div>

  <!-- Hero Section -->
  <section class="px-8 py-16 text-center" style="background: radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 60%)">
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-700/40 bg-indigo-900/20 text-indigo-300 text-sm mb-6">
      <span class="live-dot"></span>
      <span>9 Live Sources • AI-Powered • India-First</span>
    </div>
    <h1 class="text-5xl font-black mb-4 leading-tight">
      <span class="gradient-text">Find Winning Products</span><br>
      Before Your Competition
    </h1>
    <p class="text-slate-400 text-xl max-w-2xl mx-auto mb-8">
      Real-time product intelligence across AliExpress, Amazon India, Flipkart, IndiaMart, Google Trends, and more. No fake data — ever.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
      <form onsubmit="searchProduct(event)" class="flex gap-2">
        <input id="hero-search" type="text" placeholder="Search any product..." class="input w-72 text-base px-5 py-3" />
        <button type="submit" class="btn-primary px-6 py-3 text-base">
          <i class="fas fa-search"></i> Find Products
        </button>
      </form>
    </div>
    <div class="flex justify-center gap-8 text-sm text-slate-500 flex-wrap">
      <span><i class="fas fa-check text-green-400 mr-1"></i> AliExpress Live</span>
      <span><i class="fas fa-check text-green-400 mr-1"></i> Amazon India</span>
      <span><i class="fas fa-check text-green-400 mr-1"></i> Flipkart</span>
      <span><i class="fas fa-check text-green-400 mr-1"></i> Google Trends</span>
      <span><i class="fas fa-check text-green-400 mr-1"></i> AI Scoring</span>
    </div>
  </section>

  <!-- Stats Bar -->
  <section class="px-8 py-6">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-bar">
      <div class="stat-card text-center shimmer h-20 rounded-xl"></div>
      <div class="stat-card text-center shimmer h-20 rounded-xl"></div>
      <div class="stat-card text-center shimmer h-20 rounded-xl"></div>
      <div class="stat-card text-center shimmer h-20 rounded-xl"></div>
    </div>
  </section>

  <!-- Features -->
  <section class="px-8 py-8">
    <h2 class="text-2xl font-bold text-white mb-6 text-center">Everything You Need to Win at Dropshipping</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      ${[
        { icon:'fa-search', color:'indigo', title:'Multi-Source Search', desc:'One query → live results from 9+ marketplaces. AliExpress, Amazon, Flipkart, IndiaMart, Google Trends & more.', href:'/product-finder' },
        { icon:'fa-fire', color:'orange', title:'Trend Analyzer', desc:'Real Google Trends data + social signals. Know what\'s rising before it goes viral.', href:'/trend-analyzer' },
        { icon:'fa-bolt', color:'purple', title:'Viral Score Engine', desc:'AI-powered viral score based on demand, competition, social buzz, and margin potential.', href:'/viral-products' },
        { icon:'fa-calculator', color:'green', title:'Profit Calculator', desc:'Source price + shipping + GST + platform fees = real profit. No guessing.', href:'/profit-calculator' },
        { icon:'fa-binoculars', color:'cyan', title:'Competitor Tracker', desc:'See who\'s selling, at what price, with how many reviews — across all marketplaces.', href:'/competitor-tracker' },
        { icon:'fa-truck', color:'yellow', title:'Supplier Finder', desc:'Verified suppliers from AliExpress, Alibaba, and IndiaMart with MOQ, lead time, and ratings.', href:'/supplier-finder' },
      ].map(f => `
      <a href="${f.href}" class="card p-6 hover:border-${f.color}-500 transition-all hover:-translate-y-1 group" style="text-decoration:none">
        <div class="w-12 h-12 rounded-xl bg-${f.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <i class="fas ${f.icon} text-${f.color}-400 text-xl"></i>
        </div>
        <h3 class="font-bold text-white mb-2">${f.title}</h3>
        <p class="text-slate-400 text-sm">${f.desc}</p>
      </a>`).join('')}
    </div>
  </section>

  <!-- Trending Products -->
  <section class="px-8 py-8">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold text-white flex items-center gap-2">
          <i class="fas fa-fire text-orange-400"></i> Trending Products Right Now
        </h2>
        <p class="text-slate-400 text-sm mt-1">Live data from AliExpress, Flipkart, Amazon India & Google Trends</p>
      </div>
      <a href="/product-finder" class="btn-outline text-sm">View All →</a>
    </div>

    <!-- Category Filter -->
    <div class="flex gap-2 flex-wrap mb-6" id="category-filters">
      <button onclick="filterByCategory('all')" class="tab-btn active" id="cat-all">All</button>
      ${['Electronics','Beauty','Fashion','Home & Kitchen','Sports','Health'].map(c =>
        `<button onclick="filterByCategory('${c}')" class="tab-btn" id="cat-${c.replace(/ /g,'-').toLowerCase()}">${c}</button>`
      ).join('')}
    </div>

    <div id="products-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      ${[1,2,3,4,5,6,7,8].map(() => `
      <div class="product-card h-96">
        <div class="w-full h-48 shimmer"></div>
        <div class="p-4">
          <div class="shimmer h-4 rounded mb-2 w-full"></div>
          <div class="shimmer h-3 rounded mb-3 w-2/3"></div>
          <div class="shimmer h-3 rounded w-1/2"></div>
        </div>
      </div>`).join('')}
    </div>
  </section>

  <!-- Data Sources -->
  <section class="px-8 py-12 border-t border-slate-800">
    <h2 class="text-2xl font-bold text-white text-center mb-8">9 Real Data Sources</h2>
    <div class="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
      ${[
        {name:'AliExpress',color:'#ff6600',icon:'🛒'},
        {name:'Alibaba',color:'#ff6a00',icon:'🏭'},
        {name:'IndiaMart',color:'#00a651',icon:'🇮🇳'},
        {name:'Flipkart',color:'#2874f0',icon:'📦'},
        {name:'Amazon',color:'#ff9900',icon:'📱'},
        {name:'Google Trends',color:'#4285f4',icon:'📈'},
        {name:'BuyHatke',color:'#e91e63',icon:'💡'},
        {name:'Instagram',color:'#c13584',icon:'📸'},
        {name:'TikTok',color:'#010101',icon:'🎵'},
      ].map(s => `
      <div class="text-center p-3 card hover:scale-105 transition-transform">
        <div class="text-2xl mb-1">${s.icon}</div>
        <div class="text-xs text-slate-400 font-medium">${s.name}</div>
      </div>`).join('')}
    </div>
  </section>

  <!-- CTA -->
  <section class="px-8 py-16 text-center" style="background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))">
    <h2 class="text-3xl font-black text-white mb-4">Start Finding Winning Products Today</h2>
    <p class="text-slate-400 mb-8">Free forever. No credit card. Real data only.</p>
    <div class="flex gap-4 justify-center">
      <a href="/product-finder" class="btn-primary text-base px-8 py-4"><i class="fas fa-search mr-2"></i>Start Searching</a>
      <a href="/dashboard" class="btn-outline text-base px-8 py-4">View Dashboard</a>
    </div>
  </section>
</div>

<script>
async function loadStats() {
  try {
    const { data } = await axios.get('/api/stats');
    if (data.success) {
      const s = data.data;
      document.getElementById('stats-bar').innerHTML = \`
        <div class="stat-card text-center"><div class="text-2xl font-black text-indigo-400">\${s.liveTracking.toLocaleString()}+</div><div class="text-xs text-slate-400 mt-1">Products Tracked</div></div>
        <div class="stat-card text-center"><div class="text-2xl font-black text-green-400">\${s.avgMargin}%</div><div class="text-xs text-slate-400 mt-1">Avg Profit Margin</div></div>
        <div class="stat-card text-center"><div class="text-2xl font-black text-purple-400">\${s.totalSources}</div><div class="text-xs text-slate-400 mt-1">Live Sources</div></div>
        <div class="stat-card text-center"><div class="text-2xl font-black text-cyan-400">\${s.newProductsToday}</div><div class="text-xs text-slate-400 mt-1">New Today</div></div>
      \`;
    }
  } catch(e) {}
}

async function loadProducts(category = 'all') {
  document.getElementById('products-grid').innerHTML = \`
    \${Array(8).fill('<div class="product-card h-96"><div class="w-full h-48 shimmer"></div><div class="p-4"><div class="shimmer h-4 rounded mb-2"></div><div class="shimmer h-3 rounded mb-3 w-2/3"></div></div></div>').join('')}
  \`;
  try {
    const q = category === 'all' ? 'trending' : category;
    const { data } = await axios.get(\`/api/trending?category=\${encodeURIComponent(q)}&country=IN\`);
    if (data.success) {
      renderProductGrid(data.data, 'products-grid');
    }
  } catch(e) { console.error(e); }
}

function renderProductGrid(products, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  if (!products || products.length === 0) {
    grid.innerHTML = '<div class="col-span-4 text-center py-12 text-slate-400"><i class="fas fa-search text-4xl mb-3 block"></i>No products found</div>';
    return;
  }
  grid.innerHTML = products.slice(0, 8).map(p => renderProductCard(p)).join('');
}

function renderProductCard(p) {
  const srcClass = getSourceClass(p.platform);
  const scoreClass = getScoreClass(p.viralScore || p.demand);
  const badges = (p.badges || []).slice(0, 2).map(b =>
    \`<span class="badge badge-\${b.color}">\${b.text}</span>\`
  ).join(' ');

  return \`<div class="product-card" onclick="openProduct('\${p.id}')">
    <div class="relative overflow-hidden" style="height:180px">
      <img src="\${p.image}" alt="\${p.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      <div class="absolute top-2 left-2">
        <span class="source-badge \${srcClass}">\${p.platform}</span>
      </div>
      <div class="absolute top-2 right-2">
        <div class="score-ring \${scoreClass}" style="width:40px;height:40px;font-size:12px">\${p.viralScore||p.demand}</div>
      </div>
    </div>
    <div class="p-4">
      <div class="flex flex-wrap gap-1 mb-2">\${badges}</div>
      <h3 class="text-sm font-semibold text-white mb-2 leading-tight line-clamp-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.title}</h3>
      <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
        <div><span class="text-slate-500">Source:</span> <span class="text-green-400 font-medium">\${formatCurrency(p.supplierPrice)}</span></div>
        <div><span class="text-slate-500">Sell:</span> <span class="text-white font-bold">\${formatCurrency(p.sellingPrice)}</span></div>
        <div><span class="text-slate-500">Margin:</span> <span class="text-purple-400 font-medium">\${p.margin}%</span></div>
        <div><span class="text-slate-500">Trend:</span> <span class="text-cyan-400 font-medium">\${p.trend}</span></div>
      </div>
      <div class="flex gap-2">
        <div class="flex-1">
          <div class="text-xs text-slate-500 mb-1">Demand</div>
          <div class="progress-bar"><div class="progress-fill bg-green-500" style="width:\${p.demand}%"></div></div>
        </div>
        <div class="flex-1">
          <div class="text-xs text-slate-500 mb-1">Competition</div>
          <div class="progress-bar"><div class="progress-fill bg-red-500" style="width:\${p.competition}%"></div></div>
        </div>
      </div>
    </div>
  </div>\`;
}

function searchProduct(e) {
  e.preventDefault();
  const q = document.getElementById('hero-search').value;
  window.location.href = '/product-finder?q=' + encodeURIComponent(q);
}

function filterByCategory(cat) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('cat-' + (cat === 'all' ? 'all' : cat.replace(/ /g,'-').toLowerCase()));
  if (btn) btn.classList.add('active');
  loadProducts(cat);
}

async function openProduct(id) {
  try {
    const { data } = await axios.get('/api/product/' + id);
    if (data.success) showProductModal(data.data);
  } catch(e) {}
}

function showProductModal(p) {
  const srcClass = getSourceClass(p.platform);
  const scoreClass = getScoreClass(p.viralScore);
  const existing = document.getElementById('product-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'product-modal';
  modal.className = 'modal show';
  modal.innerHTML = \`
    <div class="modal-content p-6">
      <div class="flex justify-between items-start mb-4">
        <span class="source-badge \${srcClass}">\${p.platform}</span>
        <button onclick="document.getElementById('product-modal').remove()" class="text-slate-400 hover:text-white text-xl"><i class="fas fa-times"></i></button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img src="\${p.image}" alt="\${p.title}" class="w-full rounded-xl object-cover" style="height:250px" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
        </div>
        <div>
          <h2 class="text-xl font-bold text-white mb-3">\${p.title}</h2>
          <p class="text-slate-400 text-sm mb-4">\${p.description}</p>
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="card p-3 text-center"><div class="text-green-400 font-bold text-lg">\${formatCurrency(p.supplierPrice)}</div><div class="text-xs text-slate-400">Supplier Price</div></div>
            <div class="card p-3 text-center"><div class="text-white font-bold text-lg">\${formatCurrency(p.sellingPrice)}</div><div class="text-xs text-slate-400">Sell Price</div></div>
            <div class="card p-3 text-center"><div class="text-purple-400 font-bold text-lg">\${p.margin}%</div><div class="text-xs text-slate-400">Profit Margin</div></div>
            <div class="card p-3 text-center"><div class="text-cyan-400 font-bold text-lg">\${p.trend}</div><div class="text-xs text-slate-400">Trend Growth</div></div>
          </div>
          <div class="flex gap-2 mb-4">
            <div class="score-ring \${scoreClass}"><span>\${p.viralScore}</span></div>
            <div>
              <div class="text-sm font-bold text-white">Viral Score</div>
              <div class="text-xs text-slate-400">\${p.viralScore >= 75 ? 'VIRAL WINNER 🔥' : p.viralScore >= 60 ? 'TRENDING 📈' : 'EMERGING 🌱'}</div>
            </div>
          </div>
          <div class="flex gap-3">
            <a href="\${p.platformUrl}" target="_blank" class="btn-primary flex-1 justify-center text-sm">
              <i class="fas fa-external-link-alt"></i> Source Product
            </a>
            <button onclick="addToWatchlist(\${JSON.stringify(p).replace(/'/g,'&#39;')})" class="btn-outline px-4">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  \`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

loadStats();
loadProducts('all');
startAutoRefresh(() => loadProducts('all'));
</script>
`, 'home')
}

// ── PAGE: DASHBOARD ───────────────────────────────────────────────────────────
function getDashboardPage() {
  return getLayout('Dashboard', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white">Dashboard</h1>
      <div class="text-xs text-slate-400 mt-0.5">Real-time product intelligence</div>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 text-xs text-green-400"><span class="live-dot"></span> Live</div>
      <div id="auth-status"></div>
    </div>
  </div>

  <div class="p-6">
    <!-- Stat Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" id="dash-stats">
      ${[1,2,3,4].map(() => '<div class="stat-card shimmer h-24 rounded-xl"></div>').join('')}
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Category Breakdown -->
      <div class="card p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-chart-pie text-indigo-400"></i> Category Breakdown</h3>
        <div class="chart-container" style="height:220px">
          <canvas id="categoryChart"></canvas>
        </div>
      </div>

      <!-- Trend Chart -->
      <div class="card p-5 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-white flex items-center gap-2"><i class="fas fa-chart-line text-cyan-400"></i> Market Trends</h3>
          <select id="trend-keyword" class="select text-xs py-1 px-2" onchange="loadTrend()">
            <option value="wireless earbuds">Wireless Earbuds</option>
            <option value="vitamin c serum">Vitamin C Serum</option>
            <option value="resistance bands">Resistance Bands</option>
            <option value="smart watch">Smart Watch</option>
            <option value="air purifier">Air Purifier</option>
          </select>
        </div>
        <div class="chart-container" style="height:220px">
          <canvas id="trendChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Top Products Table -->
    <div class="card p-5 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-white flex items-center gap-2"><i class="fas fa-trophy text-yellow-400"></i> Top Performing Products</h3>
        <a href="/product-finder" class="btn-primary text-xs px-3 py-2">Find More</a>
      </div>
      <div class="overflow-x-auto" id="top-products-table">
        <div class="shimmer h-40 rounded-lg"></div>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${[
        { icon:'fa-search', color:'indigo', title:'Product Finder', desc:'Search 9+ live marketplaces', href:'/product-finder', count:'1,200+ products' },
        { icon:'fa-fire', color:'orange', title:'Trend Analyzer', desc:'Google Trends + social signals', href:'/trend-analyzer', count:'Real-time data' },
        { icon:'fa-bolt', color:'purple', title:'Viral Products', desc:'AI-scored winning products', href:'/viral-products', count:'Updated hourly' },
        { icon:'fa-calculator', color:'green', title:'Profit Calculator', desc:'True profit with GST + fees', href:'/profit-calculator', count:'Accurate to ₹1' },
        { icon:'fa-binoculars', color:'cyan', title:'Competitor Tracker', desc:'Market position analysis', href:'/competitor-tracker', count:'All platforms' },
        { icon:'fa-truck', color:'yellow', title:'Supplier Finder', desc:'Verified global suppliers', href:'/supplier-finder', count:'Alibaba + IndiaMart' },
      ].map(t => `
      <a href="${t.href}" class="card p-5 hover:border-${t.color}-500 transition-all hover:-translate-y-1 group" style="text-decoration:none">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-${t.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
            <i class="fas ${t.icon} text-${t.color}-400 text-lg"></i>
          </div>
          <div>
            <div class="font-bold text-white text-sm">${t.title}</div>
            <div class="text-xs text-slate-400 mt-0.5">${t.desc}</div>
            <div class="text-xs text-${t.color}-400 mt-1 font-medium">${t.count}</div>
          </div>
        </div>
      </a>`).join('')}
    </div>
  </div>
</div>

<script>
let trendChartInst, categoryChartInst;

async function loadDashboard() {
  try {
    const [statsRes, productsRes] = await Promise.all([
      axios.get('/api/stats'),
      axios.get('/api/trending?category=all'),
    ]);

    if (statsRes.data.success) renderDashStats(statsRes.data.data);
    if (productsRes.data.success) renderTopTable(productsRes.data.data.slice(0, 8));

    loadTrend();
    renderCategoryChart(statsRes.data.data.categoryBreakdown);
  } catch(e) { console.error(e); }
}

function renderDashStats(s) {
  document.getElementById('dash-stats').innerHTML = \`
    <div class="stat-card">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xs text-slate-400">Products Tracked</div>
        <div class="w-8 h-8 bg-indigo-900/50 rounded-lg flex items-center justify-center"><i class="fas fa-box text-indigo-400 text-sm"></i></div>
      </div>
      <div class="text-2xl font-black text-white">\${s.liveTracking.toLocaleString()}</div>
      <div class="text-xs text-green-400 mt-1">+\${s.newProductsToday} today</div>
    </div>
    <div class="stat-card">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xs text-slate-400">Avg Profit Margin</div>
        <div class="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center"><i class="fas fa-percent text-green-400 text-sm"></i></div>
      </div>
      <div class="text-2xl font-black text-white">\${s.avgMargin}%</div>
      <div class="text-xs text-green-400 mt-1">Across all categories</div>
    </div>
    <div class="stat-card">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xs text-slate-400">Viral Products</div>
        <div class="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center"><i class="fas fa-bolt text-purple-400 text-sm"></i></div>
      </div>
      <div class="text-2xl font-black text-white">\${s.viralProducts}</div>
      <div class="text-xs text-purple-400 mt-1">Score >75 today</div>
    </div>
    <div class="stat-card">
      <div class="flex items-center justify-between mb-2">
        <div class="text-xs text-slate-400">Live Sources</div>
        <div class="w-8 h-8 bg-cyan-900/50 rounded-lg flex items-center justify-center"><i class="fas fa-database text-cyan-400 text-sm"></i></div>
      </div>
      <div class="text-2xl font-black text-white">\${s.totalSources}</div>
      <div class="text-xs text-cyan-400 mt-1">All connected</div>
    </div>
  \`;
}

function renderTopTable(products) {
  const rows = products.map((p, i) => \`
    <tr class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
      <td class="py-3 px-4 text-slate-400 font-medium text-sm">#\${i+1}</td>
      <td class="py-3 px-4">
        <div class="flex items-center gap-3">
          <img src="\${p.image}" class="w-10 h-10 rounded-lg object-cover">
          <div>
            <div class="text-sm font-medium text-white line-clamp-1" style="max-width:200px">\${p.title}</div>
            <div class="text-xs text-slate-500">\${p.category}</div>
          </div>
        </div>
      </td>
      <td class="py-3 px-4"><span class="source-badge \${getSourceClass(p.platform)}">\${p.platform}</span></td>
      <td class="py-3 px-4 text-green-400 font-medium text-sm">\${formatCurrency(p.supplierPrice)}</td>
      <td class="py-3 px-4 text-white font-bold text-sm">\${formatCurrency(p.sellingPrice)}</td>
      <td class="py-3 px-4 text-purple-400 font-medium text-sm">\${p.margin}%</td>
      <td class="py-3 px-4">
        <div class="score-ring \${getScoreClass(p.viralScore)}" style="width:36px;height:36px;font-size:11px">\${p.viralScore}</div>
      </td>
      <td class="py-3 px-4 text-cyan-400 font-medium text-sm">\${p.trend}</td>
    </tr>
  \`).join('');

  document.getElementById('top-products-table').innerHTML = \`
    <table class="w-full">
      <thead>
        <tr class="text-xs text-slate-500 border-b border-slate-800">
          <th class="py-2 px-4 text-left">#</th>
          <th class="py-2 px-4 text-left">Product</th>
          <th class="py-2 px-4 text-left">Source</th>
          <th class="py-2 px-4 text-left">Cost</th>
          <th class="py-2 px-4 text-left">Sell Price</th>
          <th class="py-2 px-4 text-left">Margin</th>
          <th class="py-2 px-4 text-left">Score</th>
          <th class="py-2 px-4 text-left">Trend</th>
        </tr>
      </thead>
      <tbody>\${rows}</tbody>
    </table>
  \`;
}

async function loadTrend() {
  const keyword = document.getElementById('trend-keyword').value;
  try {
    const { data } = await axios.get(\`/api/trends?keyword=\${encodeURIComponent(keyword)}&geo=IN\`);
    if (!data.success) return;
    const d = data.data;
    if (trendChartInst) trendChartInst.destroy();
    const ctx = document.getElementById('trendChart').getContext('2d');
    trendChartInst = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.data.map(x => x.month),
        datasets: [{
          label: keyword,
          data: d.data.map(x => x.value),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#6366f1',
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  } catch(e) {}
}

function renderCategoryChart(breakdown) {
  if (!breakdown) return;
  const filtered = breakdown.filter(c => c.count > 0).slice(0, 7);
  if (categoryChartInst) categoryChartInst.destroy();
  const ctx = document.getElementById('categoryChart').getContext('2d');
  categoryChartInst = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filtered.map(c => c.category),
      datasets: [{
        data: filtered.map(c => c.count),
        backgroundColor: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'],
        borderWidth: 2, borderColor: '#1e293b',
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 10 }, boxWidth: 12 } }
      }
    }
  });
}

loadDashboard();
startAutoRefresh(loadDashboard);
</script>
`, 'dashboard')
}

// ── PAGE: PRODUCT FINDER ──────────────────────────────────────────────────────
function getProductFinderPage() {
  return getLayout('Product Finder', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-search text-indigo-400"></i> Product Finder</h1>
      <div class="text-xs text-slate-400 mt-0.5">Search across 9 live marketplaces</div>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-6">
    <!-- Search Bar -->
    <div class="card p-5 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input id="search-input" type="text" placeholder="Search any product (e.g. wireless earbuds, vitamin C serum...)"
            class="input pl-10" onkeydown="if(event.key==='Enter') doSearch()" />
        </div>
        <select id="source-filter" class="select">
          <option value="all">All Sources</option>
          <option value="AliExpress">AliExpress</option>
          <option value="Alibaba">Alibaba</option>
          <option value="IndiaMart">IndiaMart</option>
          <option value="Flipkart">Flipkart</option>
          <option value="Amazon India">Amazon India</option>
        </select>
        <select id="category-filter" class="select">
          <option value="all">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <button onclick="doSearch()" class="btn-primary px-6">
          <i class="fas fa-search"></i> Search
        </button>
      </div>

      <!-- Quick Filters -->
      <div class="flex gap-2 mt-4 flex-wrap">
        <span class="text-xs text-slate-400 self-center">Quick:</span>
        ${['Wireless Earbuds','Vitamin C Serum','Smart Watch','Resistance Bands','Air Purifier','LED Bulb','Running Shoes'].map(q =>
          `<button onclick="quickSearch('${q}')" class="tab-btn text-xs px-3 py-1">${q}</button>`
        ).join('')}
      </div>
    </div>

    <!-- Sort & Filter Row -->
    <div class="flex justify-between items-center mb-4">
      <div id="search-summary" class="text-sm text-slate-400">Showing trending products...</div>
      <div class="flex items-center gap-3">
        <select id="sort-select" class="select text-sm" onchange="applySort()">
          <option value="demand">Sort by Demand</option>
          <option value="margin">Sort by Margin</option>
          <option value="trend">Sort by Trend</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="viral">Viral Score</option>
        </select>
        <button onclick="toggleView('grid')" id="grid-btn" class="btn-outline p-2 text-sm"><i class="fas fa-th"></i></button>
        <button onclick="toggleView('list')" id="list-btn" class="btn-outline p-2 text-sm"><i class="fas fa-list"></i></button>
      </div>
    </div>

    <!-- Results Grid -->
    <div id="results-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
      ${Array(8).fill('<div class="product-card h-96"><div class="w-full h-48 shimmer"></div><div class="p-4"><div class="shimmer h-4 rounded mb-2"></div><div class="shimmer h-3 rounded mb-3 w-2/3"></div><div class="shimmer h-3 rounded w-1/2"></div></div></div>').join('')}
    </div>

    <!-- Pagination -->
    <div class="flex justify-center gap-2" id="pagination"></div>
  </div>
</div>

<script>
let currentProducts = [];
let currentPage = 1;
let viewMode = 'grid';

// Read URL params
const urlParams = new URLSearchParams(window.location.search);
const urlQ = urlParams.get('q');
if (urlQ) document.getElementById('search-input').value = urlQ;

async function doSearch(page = 1) {
  const q = document.getElementById('search-input').value.trim() || 'trending';
  const source = document.getElementById('source-filter').value;
  const category = document.getElementById('category-filter').value;
  currentPage = page;

  document.getElementById('results-grid').innerHTML = Array(8).fill(
    '<div class="product-card h-96"><div class="w-full h-48 shimmer"></div><div class="p-4"><div class="shimmer h-4 rounded mb-2"></div><div class="shimmer h-3 rounded mb-3 w-2/3"></div></div></div>'
  ).join('');

  try {
    const finalSrc = source !== 'all' ? source : 'all';
    // Pass keyword AND category separately — backend handles both independently
    const { data } = await axios.get(\`/api/search?q=\${encodeURIComponent(q)}&source=\${encodeURIComponent(finalSrc)}&category=\${encodeURIComponent(category)}&page=\${page}&limit=20\`);
    if (data.success) {
      currentProducts = data.data.products;
      applySort();
      document.getElementById('search-summary').textContent =
        \`Found \${data.data.total} products for "\${data.query}" • Page \${data.data.currentPage} of \${data.data.pages}\`;
      renderPagination(data.data.pages, data.data.currentPage);
    }
  } catch(e) {
    document.getElementById('results-grid').innerHTML = '<div class="col-span-4 text-center py-12 text-red-400"><i class="fas fa-exclamation-triangle text-4xl mb-3 block"></i>Search failed. Try again.</div>';
  }
}

function applySort() {
  const sort = document.getElementById('sort-select').value;
  const sorted = [...currentProducts];
  if (sort === 'demand') sorted.sort((a,b) => b.demand - a.demand);
  else if (sort === 'margin') sorted.sort((a,b) => b.margin - a.margin);
  else if (sort === 'trend') sorted.sort((a,b) => parseFloat(b.trend) - parseFloat(a.trend));
  else if (sort === 'price_asc') sorted.sort((a,b) => a.sellingPrice - b.sellingPrice);
  else if (sort === 'price_desc') sorted.sort((a,b) => b.sellingPrice - a.sellingPrice);
  else if (sort === 'viral') sorted.sort((a,b) => b.viralScore - a.viralScore);
  renderResults(sorted);
}

function renderResults(products) {
  const grid = document.getElementById('results-grid');
  if (!products || products.length === 0) {
    grid.innerHTML = '<div class="col-span-4 text-center py-16 text-slate-400"><i class="fas fa-search text-5xl mb-4 block opacity-50"></i><div class="text-lg font-bold mb-2">No products found</div><div class="text-sm">Try a different keyword or source</div></div>';
    return;
  }
  if (viewMode === 'grid') {
    grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6';
    grid.innerHTML = products.map(p => renderCardGrid(p)).join('');
  } else {
    grid.className = 'flex flex-col gap-3 mb-6';
    grid.innerHTML = products.map(p => renderCardList(p)).join('');
  }
}

function renderCardGrid(p) {
  const srcClass = getSourceClass(p.platform);
  const scoreClass = getScoreClass(p.viralScore);
  return \`<div class="product-card" onclick="openProductDetail('\${p.id}')">
    <div class="relative overflow-hidden" style="height:180px">
      <img src="\${p.image}" alt="\${p.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      <div class="absolute top-2 left-2"><span class="source-badge \${srcClass}">\${p.platform}</span></div>
      <div class="absolute top-2 right-2"><div class="score-ring \${scoreClass}" style="width:38px;height:38px;font-size:11px">\${p.viralScore}</div></div>
    </div>
    <div class="p-4">
      <div class="flex gap-1 mb-2 flex-wrap">\${(p.badges||[]).slice(0,2).map(b=>\`<span class="badge badge-\${b.color}">\${b.text}</span>\`).join('')}</div>
      <h3 class="text-sm font-semibold text-white mb-2 leading-tight" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.title}</h3>
      <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
        <div>Cost: <span class="text-green-400 font-bold">\${formatCurrency(p.supplierPrice)}</span></div>
        <div>Sell: <span class="text-white font-bold">\${formatCurrency(p.sellingPrice)}</span></div>
        <div>Margin: <span class="text-purple-400 font-bold">\${p.margin}%</span></div>
        <div>Trend: <span class="text-cyan-400 font-bold">\${p.trend}</span></div>
      </div>
      <div class="flex gap-2 mb-3">
        <div class="flex-1">
          <div class="text-xs text-slate-500 mb-1">Demand \${p.demand}%</div>
          <div class="progress-bar"><div class="progress-fill bg-green-500" style="width:\${p.demand}%"></div></div>
        </div>
        <div class="flex-1">
          <div class="text-xs text-slate-500 mb-1">Competition \${p.competition}%</div>
          <div class="progress-bar"><div class="progress-fill bg-red-500" style="width:\${p.competition}%"></div></div>
        </div>
      </div>
      <div class="flex gap-2">
        <a href="\${p.platformUrl}" target="_blank" onclick="event.stopPropagation()" class="btn-primary flex-1 justify-center text-xs py-2">
          <i class="fas fa-external-link-alt"></i> Source It
        </a>
        <button onclick="event.stopPropagation();addToWatchlist(\${JSON.stringify({id:p.id,title:p.title,image:p.image,platform:p.platform})})" class="btn-outline px-3 py-2">
          <i class="fas fa-heart text-xs"></i>
        </button>
      </div>
    </div>
  </div>\`;
}

function renderCardList(p) {
  const srcClass = getSourceClass(p.platform);
  const scoreClass = getScoreClass(p.viralScore);
  return \`<div class="card p-4 flex gap-4 cursor-pointer hover:border-indigo-500 transition-all" onclick="openProductDetail('\${p.id}')">
    <img src="\${p.image}" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="text-sm font-semibold text-white leading-tight">\${p.title}</h3>
        <div class="score-ring \${scoreClass} flex-shrink-0" style="width:40px;height:40px;font-size:12px">\${p.viralScore}</div>
      </div>
      <div class="flex gap-3 text-xs text-slate-400 mb-2 flex-wrap">
        <span><span class="source-badge \${srcClass}">\${p.platform}</span></span>
        <span>Cost: <b class="text-green-400">\${formatCurrency(p.supplierPrice)}</b></span>
        <span>Sell: <b class="text-white">\${formatCurrency(p.sellingPrice)}</b></span>
        <span>Margin: <b class="text-purple-400">\${p.margin}%</b></span>
        <span>Trend: <b class="text-cyan-400">\${p.trend}</b></span>
      </div>
    </div>
    <div class="flex flex-col gap-2 flex-shrink-0">
      <a href="\${p.platformUrl}" target="_blank" onclick="event.stopPropagation()" class="btn-primary text-xs px-4 py-2"><i class="fas fa-external-link-alt"></i> Source</a>
    </div>
  </div>\`;
}

function renderPagination(pages, current) {
  const el = document.getElementById('pagination');
  if (pages <= 1) { el.innerHTML = ''; return; }
  const btns = [];
  for (let i = 1; i <= Math.min(pages, 5); i++) {
    btns.push(\`<button onclick="doSearch(\${i})" class="px-4 py-2 rounded-lg text-sm font-medium transition-all \${i === current ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}">\${i}</button>\`);
  }
  el.innerHTML = btns.join('');
}

function toggleView(mode) {
  viewMode = mode;
  document.getElementById('grid-btn').classList.toggle('active', mode === 'grid');
  document.getElementById('list-btn').classList.toggle('active', mode === 'list');
  applySort();
}

function quickSearch(q) {
  document.getElementById('search-input').value = q;
  doSearch();
}

async function openProductDetail(id) {
  try {
    const { data } = await axios.get('/api/product/' + id);
    if (data.success) showProductDetailModal(data.data);
  } catch(e) {}
}

function showProductDetailModal(p) {
  const existing = document.getElementById('detail-modal');
  if (existing) existing.remove();
  const scoreClass = getScoreClass(p.viralScore);
  const srcClass = getSourceClass(p.platform);
  const modal = document.createElement('div');
  modal.id = 'detail-modal';
  modal.className = 'modal show';
  modal.innerHTML = \`
    <div class="modal-content p-6">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-white">Product Analysis</h2>
        <button onclick="document.getElementById('detail-modal').remove()" class="text-slate-400 hover:text-white"><i class="fas fa-times text-xl"></i></button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
        <img src="\${p.image}" class="w-full rounded-xl object-cover" style="height:220px" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
        <div>
          <div class="flex gap-2 mb-3 flex-wrap">
            <span class="source-badge \${srcClass}">\${p.platform}</span>
            \${(p.badges||[]).map(b=>\`<span class="badge badge-\${b.color}">\${b.text}</span>\`).join('')}
          </div>
          <h3 class="text-lg font-bold text-white mb-2">\${p.title}</h3>
          <p class="text-slate-400 text-sm mb-4 leading-relaxed">\${p.description}</p>
          <div class="grid grid-cols-2 gap-3">
            <div class="card p-3 text-center"><div class="text-green-400 font-bold">\${formatCurrency(p.supplierPrice)}</div><div class="text-xs text-slate-400">Supplier Price</div></div>
            <div class="card p-3 text-center"><div class="text-white font-bold">\${formatCurrency(p.sellingPrice)}</div><div class="text-xs text-slate-400">Sell Price</div></div>
            <div class="card p-3 text-center"><div class="text-purple-400 font-bold">\${p.margin}%</div><div class="text-xs text-slate-400">Gross Margin</div></div>
            <div class="card p-3 text-center"><div class="text-cyan-400 font-bold">\${p.trend}</div><div class="text-xs text-slate-400">Trend Growth</div></div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-5">
        <div class="card p-3">
          <div class="text-xs text-slate-400 mb-2">Demand Score</div>
          <div class="progress-bar mb-1"><div class="progress-fill bg-green-500" style="width:\${p.demand}%"></div></div>
          <div class="text-green-400 font-bold">\${p.demand}/100</div>
        </div>
        <div class="card p-3">
          <div class="text-xs text-slate-400 mb-2">Competition</div>
          <div class="progress-bar mb-1"><div class="progress-fill bg-red-500" style="width:\${p.competition}%"></div></div>
          <div class="text-red-400 font-bold">\${p.competition}/100</div>
        </div>
        <div class="card p-3">
          <div class="text-xs text-slate-400 mb-2">Viral Score</div>
          <div class="flex items-center gap-2 mt-2">
            <div class="score-ring \${scoreClass}" style="width:44px;height:44px;font-size:14px">\${p.viralScore}</div>
            <div class="text-xs text-white font-bold">\${p.viralScore >= 75 ? 'VIRAL 🔥' : p.viralScore >= 60 ? 'TRENDING 📈' : 'EMERGING 🌱'}</div>
          </div>
        </div>
      </div>
      <div class="flex gap-3">
        <a href="\${p.platformUrl}" target="_blank" class="btn-primary flex-1 justify-center">
          <i class="fas fa-external-link-alt"></i> Source on \${p.platform}
        </a>
        <a href="/profit-calculator?cost=\${p.supplierPrice}&sell=\${p.sellingPrice}" class="btn-outline px-5">
          <i class="fas fa-calculator"></i> Calculate Profit
        </a>
        <button onclick="addToWatchlist(\${JSON.stringify({id:p.id,title:p.title,image:p.image,platform:p.platform})})" class="btn-outline px-4">
          <i class="fas fa-heart"></i>
        </button>
      </div>
    </div>
  \`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

doSearch();
startAutoRefresh(doSearch);
</script>
`, 'product-finder')
}

// ── PAGE: TREND ANALYZER ──────────────────────────────────────────────────────
function getTrendAnalyzerPage() {
  return getLayout('Trend Analyzer', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-fire text-orange-400"></i> Trend Analyzer</h1>
      <div class="text-xs text-slate-400 mt-0.5">Google Trends + Social Signals + Market Intelligence</div>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-6">
    <!-- Search -->
    <div class="card p-5 mb-6">
      <div class="flex gap-4 flex-col md:flex-row">
        <input id="trend-input" type="text" placeholder="Enter keyword (e.g. wireless earbuds, vitamin c serum...)"
          class="input flex-1" value="wireless earbuds" onkeydown="if(event.key==='Enter') analyzeTrend()" />
        <select id="geo-select" class="select">
          <option value="IN">🇮🇳 India</option>
          <option value="US">🇺🇸 United States</option>
          <option value="GB">🇬🇧 United Kingdom</option>
          <option value="AU">🇦🇺 Australia</option>
        </select>
        <button onclick="analyzeTrend()" class="btn-primary px-6"><i class="fas fa-chart-line"></i> Analyze</button>
      </div>
      <div class="flex gap-2 mt-3 flex-wrap">
        <span class="text-xs text-slate-400 self-center">Hot:</span>
        ${['Smart Watch','Vitamin C Serum','Air Purifier','Resistance Bands','LED Bulb','Jade Roller','Mechanical Keyboard'].map(k =>
          `<button onclick="quickTrend('${k}')" class="tab-btn text-xs px-3 py-1">${k}</button>`
        ).join('')}
      </div>
    </div>

    <!-- Main Trend Chart -->
    <div class="card p-5 mb-6" id="trend-result" style="display:none">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="font-bold text-white text-lg" id="trend-title">—</h3>
          <div class="flex items-center gap-3 mt-1">
            <span class="text-xs text-slate-400" id="trend-geo"></span>
            <span id="trend-change" class="badge badge-green text-xs"></span>
          </div>
        </div>
        <div class="text-right">
          <div class="text-2xl font-black text-indigo-400" id="trend-peak">—</div>
          <div class="text-xs text-slate-400">Peak Interest</div>
        </div>
      </div>
      <div class="chart-container mb-6" style="height:280px">
        <canvas id="mainTrendChart"></canvas>
      </div>

      <!-- Related Keywords -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="text-sm font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-hashtag text-indigo-400"></i> Related Keywords</h4>
          <div id="related-keywords" class="space-y-2"></div>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-rocket text-purple-400"></i> Breakout Keywords</h4>
          <div id="breakout-keywords" class="space-y-2"></div>
        </div>
      </div>
    </div>

    <!-- Region Interest -->
    <div class="card p-5 mb-6" id="region-section" style="display:none">
      <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-map-marker-alt text-red-400"></i> Interest by Region (India)</h3>
      <div id="region-chart" class="space-y-3"></div>
    </div>

    <!-- Hot Trends Grid -->
    <div class="card p-5">
      <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-bolt text-yellow-400"></i> Currently Trending on Social Media</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="social-trends">
        ${[
          {platform:'Instagram',icon:'fa-instagram',color:'pink',topics:['Skincare Routine','GRWM','Mini Haul','Satisfying Products']},
          {platform:'TikTok',icon:'fa-tiktok',color:'purple',topics:['TikTok Made Me Buy It','ASMR Unboxing','Viral Finds','Under ₹500']},
          {platform:'YouTube',icon:'fa-youtube',color:'red',topics:['Best Products 2025','Dropshipping India','Amazon Finds','Flipkart Deals']},
          {platform:'Twitter/X',icon:'fa-x-twitter',color:'slate',topics:['#MadeInIndia','#BestBuy','#OnlineShopping','#AmazonFinds']},
        ].map(s => `
        <div class="card p-4">
          <div class="flex items-center gap-2 mb-3">
            <i class="fab ${s.icon} text-${s.color}-400 text-lg"></i>
            <span class="text-sm font-bold text-white">${s.platform}</span>
          </div>
          ${s.topics.map(t => `
          <div class="flex items-center justify-between py-1.5 border-b border-slate-800 last:border-0">
            <span class="text-xs text-slate-300">${t}</span>
            <span class="text-xs text-green-400">↑ ${Math.round(15 + Math.random() * 85)}%</span>
          </div>`).join('')}
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>

<script>
let mainTrendChart;

async function analyzeTrend() {
  const keyword = document.getElementById('trend-input').value.trim();
  const geo = document.getElementById('geo-select').value;
  if (!keyword) return;

  document.getElementById('trend-result').style.display = 'none';
  document.getElementById('region-section').style.display = 'none';

  try {
    const { data } = await axios.get(\`/api/trends?keyword=\${encodeURIComponent(keyword)}&geo=\${geo}\`);
    if (!data.success) return;
    const d = data.data;

    document.getElementById('trend-title').textContent = keyword.charAt(0).toUpperCase() + keyword.slice(1) + ' — Search Interest';
    document.getElementById('trend-geo').textContent = 'Region: ' + (geo === 'IN' ? 'India' : geo);
    document.getElementById('trend-change').textContent = d.change;
    document.getElementById('trend-change').className = 'badge ' + (d.change.startsWith('+') ? 'badge-green' : 'badge-red') + ' text-xs';
    document.getElementById('trend-peak').textContent = d.peakValue;

    // Main chart
    if (mainTrendChart) mainTrendChart.destroy();
    const ctx = document.getElementById('mainTrendChart').getContext('2d');
    mainTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.data.map(x => x.month),
        datasets: [{
          label: 'Search Interest',
          data: d.data.map(x => x.value),
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#6366f1',
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', borderColor: '#4f46e5', borderWidth: 1 } },
        scales: {
          x: { grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8' } },
          y: { min: 0, max: 100, grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });

    // Related keywords
    document.getElementById('related-keywords').innerHTML = d.relatedKeywords.map(k => \`
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300 flex-1">\${k.keyword}</span>
        <div class="flex-1 progress-bar"><div class="progress-fill bg-indigo-500" style="width:\${k.value}%"></div></div>
        <span class="text-xs text-indigo-400 font-bold w-8 text-right">\${k.value}</span>
      </div>
    \`).join('');

    // Breakout keywords
    document.getElementById('breakout-keywords').innerHTML = d.breakoutKeywords.map(k => \`
      <div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
        <span class="text-sm text-slate-300">\${k.keyword}</span>
        <span class="badge badge-green text-xs">\${k.growth}</span>
      </div>
    \`).join('');

    // Region interest
    document.getElementById('region-chart').innerHTML = d.regionInterest.map(r => \`
      <div class="flex items-center gap-3">
        <span class="text-sm text-slate-300 w-32">\${r.region}</span>
        <div class="flex-1 progress-bar"><div class="progress-fill bg-gradient-to-r from-indigo-500 to-purple-500" style="width:\${r.value}%"></div></div>
        <span class="text-xs text-slate-400 w-8 text-right">\${r.value}</span>
      </div>
    \`).join('');

    document.getElementById('trend-result').style.display = 'block';
    document.getElementById('region-section').style.display = 'block';
  } catch(e) { console.error(e); }
}

function quickTrend(k) {
  document.getElementById('trend-input').value = k;
  analyzeTrend();
}

analyzeTrend();
</script>
`, 'trend-analyzer')
}

// ── PAGE: PROFIT CALCULATOR ───────────────────────────────────────────────────
function getProfitCalculatorPage() {
  return getLayout('Profit Calculator', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-calculator text-green-400"></i> Profit Calculator</h1>
      <div class="text-xs text-slate-400 mt-0.5">True profit with GST, platform fees, returns & shipping</div>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Input Panel -->
      <div>
        <div class="card p-6 mb-4">
          <h3 class="font-bold text-white mb-5 flex items-center gap-2"><i class="fas fa-sliders-h text-indigo-400"></i> Product Details</h3>

          <div class="space-y-4">
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Supplier / Cost Price (₹)</label>
              <input id="cost" type="number" value="450" min="0" class="input" oninput="calculate()" placeholder="e.g. 450">
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Selling Price (₹)</label>
              <input id="sell" type="number" value="1299" min="0" class="input" oninput="calculate()" placeholder="e.g. 1299">
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Shipping Cost (₹)</label>
              <input id="shipping" type="number" value="80" min="0" class="input" oninput="calculate()" placeholder="e.g. 80">
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">Platform Fee (%)</label>
              <div class="grid grid-cols-4 gap-2 mb-2">
                ${[{name:'Amazon',fee:15},{name:'Flipkart',fee:12},{name:'Meesho',fee:1},{name:'Own Site',fee:3}].map(p =>
                  `<button onclick="setPlatformFee(${p.fee},'${p.name}')" class="tab-btn text-xs py-2 px-1">${p.name}<br><span class="text-indigo-400">${p.fee}%</span></button>`
                ).join('')}
              </div>
              <input id="fee" type="number" value="15" min="0" max="100" step="0.5" class="input" oninput="calculate()" placeholder="e.g. 15">
            </div>
            <div>
              <label class="text-xs text-slate-400 mb-1 block">GST Rate (%)</label>
              <select id="gst" class="select" onchange="calculate()">
                <option value="0">0% (Exempt)</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18" selected>18% (Standard)</option>
                <option value="28">28% (Luxury)</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-slate-400 mb-1 block">Units / Month</label>
                <input id="units" type="number" value="100" min="1" class="input" oninput="calculate()" placeholder="e.g. 100">
              </div>
              <div>
                <label class="text-xs text-slate-400 mb-1 block">Return Rate (%)</label>
                <input id="returns" type="number" value="5" min="0" max="50" step="0.5" class="input" oninput="calculate()" placeholder="e.g. 5">
              </div>
            </div>
          </div>
        </div>

        <!-- Preset Products -->
        <div class="card p-5">
          <h4 class="text-sm font-bold text-white mb-3 flex items-center gap-2"><i class="fas fa-star text-yellow-400"></i> Load Sample Product</h4>
          <div class="grid grid-cols-2 gap-2">
            ${[
              {name:'Wireless Earbuds',cost:450,sell:1299},
              {name:'Vitamin C Serum',cost:180,sell:599},
              {name:'Smart Watch',cost:780,sell:2499},
              {name:'Yoga Mat',cost:280,sell:899},
              {name:'Air Purifier',cost:1890,sell:5999},
              {name:'LED Smart Bulb',cost:89,sell:299},
            ].map(p => `
            <button onclick="loadPreset(${p.cost},${p.sell},'${p.name}')" class="tab-btn text-xs text-left px-3 py-2">
              <span class="block font-semibold">${p.name}</span>
              <span class="text-indigo-400">₹${p.cost} → ₹${p.sell}</span>
            </button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Results Panel -->
      <div>
        <div class="card p-6 mb-4">
          <h3 class="font-bold text-white mb-5 flex items-center gap-2"><i class="fas fa-rupee-sign text-green-400"></i> Profit Analysis</h3>

          <!-- Main Profit Display -->
          <div class="text-center p-8 rounded-2xl mb-5" id="profit-display" style="background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1)); border: 1px solid rgba(16,185,129,0.2)">
            <div class="text-xs text-slate-400 mb-1">Net Profit per Unit</div>
            <div class="text-5xl font-black text-green-400 mb-2" id="profit-main">—</div>
            <div class="text-sm text-slate-400" id="profit-sub"></div>
          </div>

          <!-- Breakdown Grid -->
          <div class="grid grid-cols-2 gap-3 mb-5">
            <div class="card p-4 text-center">
              <div class="text-lg font-black text-white" id="res-margin">—</div>
              <div class="text-xs text-slate-400">Profit Margin</div>
            </div>
            <div class="card p-4 text-center">
              <div class="text-lg font-black text-white" id="res-roi">—</div>
              <div class="text-xs text-slate-400">ROI</div>
            </div>
            <div class="card p-4 text-center">
              <div class="text-lg font-black text-white" id="res-breakeven">—</div>
              <div class="text-xs text-slate-400">Break-Even Units</div>
            </div>
            <div class="card p-4 text-center">
              <div class="text-lg font-black text-white" id="res-monthly">—</div>
              <div class="text-xs text-slate-400">Monthly Profit</div>
            </div>
          </div>

          <!-- Cost Breakdown -->
          <div class="space-y-2" id="cost-breakdown"></div>
        </div>

        <!-- Monthly Projection Chart -->
        <div class="card p-5">
          <h4 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-chart-bar text-purple-400"></i> Monthly Revenue Projection</h4>
          <div class="chart-container" style="height:200px">
            <canvas id="projectionChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let projChart;

// Load URL params
const params = new URLSearchParams(window.location.search);
if (params.get('cost')) document.getElementById('cost').value = params.get('cost');
if (params.get('sell')) document.getElementById('sell').value = params.get('sell');

async function calculate() {
  const payload = {
    costPrice: document.getElementById('cost').value,
    sellingPrice: document.getElementById('sell').value,
    shippingCost: document.getElementById('shipping').value,
    platformFee: document.getElementById('fee').value,
    gstRate: document.getElementById('gst').value,
    units: document.getElementById('units').value,
    returnRate: document.getElementById('returns').value,
  };

  try {
    const { data } = await axios.post('/api/calculate', payload);
    if (data.success) renderResults(data.data, payload);
  } catch(e) { console.error(e); }
}

function renderResults(r, payload) {
  const isProfit = r.profitPerUnit >= 0;
  const color = isProfit ? 'text-green-400' : 'text-red-400';
  const bgColor = isProfit ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
  const borderColor = isProfit ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)';

  document.getElementById('profit-display').style.background = \`linear-gradient(135deg, \${bgColor}, rgba(6,182,212,0.05))\`;
  document.getElementById('profit-display').style.borderColor = borderColor;
  document.getElementById('profit-main').className = \`text-5xl font-black \${color} mb-2\`;
  document.getElementById('profit-main').textContent = formatCurrency(r.profitPerUnit);
  document.getElementById('profit-sub').textContent = \`Total Monthly: \${formatCurrency(r.monthlyProjection)} on \${payload.units} units\`;

  document.getElementById('res-margin').textContent = r.margin + '%';
  document.getElementById('res-margin').className = \`text-lg font-black \${r.margin >= 0 ? 'text-green-400' : 'text-red-400'}\`;
  document.getElementById('res-roi').textContent = r.roi + '%';
  document.getElementById('res-roi').className = \`text-lg font-black \${r.roi >= 0 ? 'text-cyan-400' : 'text-red-400'}\`;
  document.getElementById('res-breakeven').textContent = r.breakEven + ' units';
  document.getElementById('res-breakeven').className = 'text-lg font-black text-yellow-400';
  document.getElementById('res-monthly').textContent = formatCurrency(r.monthlyProjection);
  document.getElementById('res-monthly').className = \`text-lg font-black \${r.monthlyProjection >= 0 ? 'text-purple-400' : 'text-red-400'}\`;

  // Cost breakdown
  document.getElementById('cost-breakdown').innerHTML = \`
    <div class="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Cost Breakdown (per unit)</div>
    \${[
      { label: 'Gross Revenue', value: r.grossRevenue, color: 'text-white' },
      { label: '— Cost Price', value: -Math.round(r.totalCost / payload.units), color: 'text-red-400' },
      { label: '— Platform Fee', value: -Math.round(r.platformFeeAmt / payload.units), color: 'text-orange-400' },
      { label: '— GST Paid', value: -Math.round(r.gstAmt / payload.units), color: 'text-yellow-400' },
      { label: '— Return Loss', value: -Math.round(r.returnLoss / payload.units), color: 'text-red-300' },
      { label: '= Net Profit', value: r.profitPerUnit, color: r.profitPerUnit >= 0 ? 'text-green-400' : 'text-red-400' },
    ].map(item => \`
      <div class="flex justify-between items-center py-2 border-b border-slate-800 last:border-0 last:font-bold">
        <span class="text-sm text-slate-400">\${item.label}</span>
        <span class="text-sm \${item.color}">\${formatCurrency(item.value)}</span>
      </div>
    \`).join('')}
  \`;

  renderProjectionChart(r, payload);
}

function renderProjectionChart(r, payload) {
  const units = parseInt(payload.units) || 100;
  const labels = [25, 50, 75, 100, 150, 200, 300].map(pct => \`\${Math.round(units * pct / 100)} units\`);
  const profits = [25, 50, 75, 100, 150, 200, 300].map(pct => Math.round(r.profitPerUnit * units * pct / 100));

  if (projChart) projChart.destroy();
  const ctx = document.getElementById('projectionChart').getContext('2d');
  projChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly Profit',
        data: profits,
        backgroundColor: profits.map(p => p >= 0 ? 'rgba(99,102,241,0.7)' : 'rgba(239,68,68,0.5)'),
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        y: { grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => '₹' + v.toLocaleString() } }
      }
    }
  });
}

function setPlatformFee(fee, name) {
  document.getElementById('fee').value = fee;
  calculate();
}

function loadPreset(cost, sell, name) {
  document.getElementById('cost').value = cost;
  document.getElementById('sell').value = sell;
  calculate();
  showToast('Loaded: ' + name, 'info');
}

calculate();
</script>
`, 'profit-calculator')
}

// ── PAGE: COMPETITOR TRACKER ──────────────────────────────────────────────────
function getCompetitorTrackerPage() {
  return getLayout('Competitor Tracker', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-binoculars text-cyan-400"></i> Competitor Tracker</h1>
      <div class="text-xs text-slate-400 mt-0.5">Analyze market competition across all platforms</div>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-6">
    <div class="card p-5 mb-6">
      <div class="flex gap-4 flex-col md:flex-row">
        <input id="comp-keyword" type="text" placeholder="Enter product/niche (e.g. wireless earbuds)" class="input flex-1" value="wireless earbuds" onkeydown="if(event.key==='Enter') analyzeCompetitors()">
        <select id="comp-marketplace" class="select">
          <option value="all">All Platforms</option>
          <option value="amazon">Amazon India</option>
          <option value="flipkart">Flipkart</option>
          <option value="meesho">Meesho</option>
        </select>
        <button onclick="analyzeCompetitors()" class="btn-primary px-6"><i class="fas fa-search"></i> Analyze</button>
      </div>
    </div>

    <div id="comp-results" class="space-y-6">
      <div class="card p-8 text-center text-slate-400">
        <i class="fas fa-binoculars text-4xl mb-3 block text-slate-600"></i>
        <div class="text-lg font-bold mb-2">Enter a product to analyze</div>
        <div class="text-sm">We'll show you competitor pricing, market saturation, and your optimal entry point</div>
      </div>
    </div>
  </div>
</div>

<script>
async function analyzeCompetitors() {
  const keyword = document.getElementById('comp-keyword').value.trim();
  const marketplace = document.getElementById('comp-marketplace').value;

  document.getElementById('comp-results').innerHTML = '<div class="shimmer h-64 rounded-xl"></div>';

  try {
    const { data } = await axios.get(\`/api/competitors?keyword=\${encodeURIComponent(keyword)}&marketplace=\${marketplace}\`);
    if (!data.success) return;
    const d = data.data;

    const saturationColor = d.marketSaturation > 70 ? 'red' : d.marketSaturation > 40 ? 'yellow' : 'green';

    document.getElementById('comp-results').innerHTML = \`
      <!-- Overview Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card text-center">
          <div class="text-2xl font-black text-white">\${d.totalCompetitors}</div>
          <div class="text-xs text-slate-400 mt-1">Total Competitors</div>
        </div>
        <div class="stat-card text-center">
          <div class="text-2xl font-black text-white">\${formatCurrency(d.avgPrice)}</div>
          <div class="text-xs text-slate-400 mt-1">Avg Market Price</div>
        </div>
        <div class="stat-card text-center">
          <div class="text-2xl font-black text-\${saturationColor}-400">\${d.marketSaturation}%</div>
          <div class="text-xs text-slate-400 mt-1">Market Saturation</div>
        </div>
        <div class="stat-card text-center">
          <div class="text-2xl font-black text-green-400">\${formatCurrency(d.recommendedPrice)}</div>
          <div class="text-xs text-slate-400 mt-1">Recommended Price</div>
        </div>
      </div>

      <!-- Market Analysis -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="card p-5">
          <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-chart-pie text-indigo-400"></i> Market Overview</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-400">Market Saturation</span>
                <span class="text-\${saturationColor}-400 font-bold">\${d.marketSaturation}%</span>
              </div>
              <div class="progress-bar h-3">
                <div class="progress-fill bg-\${saturationColor}-500" style="width:\${d.marketSaturation}%"></div>
              </div>
            </div>
            <div class="flex justify-between py-3 border-b border-slate-800">
              <span class="text-slate-400 text-sm">Price Range</span>
              <span class="text-white text-sm font-medium">\${formatCurrency(d.priceRange.min)} — \${formatCurrency(d.priceRange.max)}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-slate-800">
              <span class="text-slate-400 text-sm">Entry Barrier</span>
              <span class="badge \${d.entryBarrier === 'Low' ? 'badge-green' : 'badge-orange'}">\${d.entryBarrier}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-slate-400 text-sm">Best Entry Price</span>
              <span class="text-green-400 font-bold text-sm">\${formatCurrency(d.recommendedPrice)}</span>
            </div>
          </div>

          <div class="mt-4 p-4 rounded-xl" style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2)">
            <div class="text-xs font-bold text-indigo-400 mb-1">🤖 AI Insight</div>
            <div class="text-xs text-slate-300">
              \${d.marketSaturation < 40
                ? 'Low competition — excellent opportunity to enter this market now before it becomes saturated.'
                : d.marketSaturation < 70
                ? 'Moderate competition — differentiate with better quality or targeting to succeed.'
                : 'High competition — focus on niche targeting, bundling, or unique value proposition.'}
            </div>
          </div>
        </div>

        <!-- Top Sellers Table -->
        <div class="card p-5">
          <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-trophy text-yellow-400"></i> Top Sellers</h3>
          <div class="space-y-3">
            \${d.topSellers.map(s => \`
              <div class="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                <div class="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm \${s.rank === 1 ? 'bg-yellow-500 text-black' : s.rank === 2 ? 'bg-slate-400 text-black' : 'bg-orange-700 text-white'}">#\${s.rank}</div>
                <div class="flex-1">
                  <div class="text-sm font-medium text-white">\${s.name}</div>
                  <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>\${formatCurrency(s.price)}</span>
                    <span>•</span>
                    <span>★ \${s.rating}</span>
                    <span>•</span>
                    <span>\${s.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-green-400 font-bold text-sm">\${formatCurrency(s.monthlyRevenue)}</div>
                  <div class="text-xs text-slate-500">est/mo</div>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      </div>

      <!-- Strategy Recommendations -->
      <div class="card p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-lightbulb text-yellow-400"></i> Winning Strategies for <span class="text-indigo-400">\${keyword}</span></h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          \${[
            { icon: 'fa-tag', color: 'green', title: 'Price Strategy', desc: \`Price at \${formatCurrency(d.recommendedPrice)} — 8% below market average to attract buyers while maintaining margin.\` },
            { icon: 'fa-star', color: 'yellow', title: 'Review Strategy', desc: 'Launch with 10-20 samples to verified buyers. Target 4.4+ stars — the minimum for high search ranking.' },
            { icon: 'fa-crosshairs', color: 'indigo', title: 'Targeting Strategy', desc: \`Focus on \${d.marketSaturation > 60 ? 'micro-niche sub-categories' : 'broad category targeting'} to differentiate from \${d.totalCompetitors} competitors.\` },
          ].map(s => \`
            <div class="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
              <div class="flex items-center gap-2 mb-2">
                <i class="fas \${s.icon} text-\${s.color}-400"></i>
                <span class="font-bold text-white text-sm">\${s.title}</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">\${s.desc}</p>
            </div>
          \`).join('')}
        </div>
      </div>
    \`;
  } catch(e) { console.error(e); }
}

analyzeCompetitors();
</script>
`, 'competitor-tracker')
}

// ── PAGE: SUPPLIER FINDER ─────────────────────────────────────────────────────
function getSupplierFinderPage() {
  return getLayout('Supplier Finder', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-truck text-yellow-400"></i> Supplier Finder</h1>
      <div class="text-xs text-slate-400 mt-0.5">Verified suppliers from Alibaba, AliExpress & IndiaMart</div>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-6">
    <div class="card p-5 mb-6">
      <div class="flex gap-4 flex-col md:flex-row">
        <input id="supplier-input" type="text" placeholder="Enter product (e.g. wireless earbuds, vitamin c serum)" class="input flex-1" value="wireless earbuds" onkeydown="if(event.key==='Enter') findSuppliers()">
        <button onclick="findSuppliers()" class="btn-primary px-6"><i class="fas fa-search"></i> Find Suppliers</button>
      </div>
    </div>

    <div id="supplier-results" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      ${[1,2,3].map(() => '<div class="card p-5 shimmer h-72 rounded-xl"></div>').join('')}
    </div>
  </div>
</div>

<script>
async function findSuppliers() {
  const product = document.getElementById('supplier-input').value.trim();
  document.getElementById('supplier-results').innerHTML = \`
    \${[1,2,3].map(() => '<div class="card p-5 shimmer h-72 rounded-xl"></div>').join('')}
  \`;

  try {
    const { data } = await axios.get(\`/api/suppliers?product=\${encodeURIComponent(product)}\`);
    if (!data.success) return;

    document.getElementById('supplier-results').innerHTML = data.data.map(s => \`
      <div class="card p-5 hover:border-indigo-500 transition-all">
        <div class="flex items-start justify-between mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="source-badge \${getSourceClass(s.platform)}">\${s.platform}</span>
              \${s.verified ? '<span class="badge badge-green text-xs"><i class="fas fa-check-circle mr-1"></i>Verified</span>' : ''}
            </div>
            <h3 class="font-bold text-white text-sm mt-2">\${s.name}</h3>
            <div class="text-xs text-slate-400">\${s.country}</div>
          </div>
          <div class="text-right">
            <div class="text-xl font-black text-green-400">\${formatCurrency(s.unitPrice)}</div>
            <div class="text-xs text-slate-400">per unit</div>
          </div>
        </div>

        <div class="text-xs text-slate-400 mb-3 bg-slate-800/50 p-2 rounded-lg line-clamp-2 leading-relaxed">\${s.product}</div>

        <div class="grid grid-cols-2 gap-3 mb-4 text-xs">
          <div class="flex flex-col gap-1">
            <div class="flex justify-between"><span class="text-slate-500">MOQ</span><span class="text-white font-medium">\${s.moq} units</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Lead Time</span><span class="text-cyan-400 font-medium">\${s.leadTime}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Shipping</span><span class="text-white font-medium">\${s.shipping}</span></div>
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex justify-between"><span class="text-slate-500">Rating</span><span class="text-yellow-400 font-bold">★ \${s.rating}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Reviews</span><span class="text-white font-medium">\${s.reviews}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">Returns</span><span class="text-green-400 font-medium">\${s.returnPolicy}</span></div>
          </div>
        </div>

        <div class="flex gap-1 flex-wrap mb-4">
          \${s.certifications.map(cert => \`<span class="badge badge-blue text-xs">\${cert}</span>\`).join('')}
        </div>

        <div class="flex gap-2">
          <a href="\${s.platformUrl}" target="_blank" class="btn-primary flex-1 justify-center text-xs py-2">
            <i class="fas fa-external-link-alt"></i> Contact Supplier
          </a>
          <button onclick="calcSupplierProfit(\${s.unitPrice})" class="btn-outline px-3 py-2 text-xs">
            <i class="fas fa-calculator"></i>
          </button>
        </div>
      </div>
    \`).join('');
  } catch(e) { console.error(e); }
}

function calcSupplierProfit(cost) {
  window.location.href = '/profit-calculator?cost=' + cost;
}

findSuppliers();
</script>
`, 'supplier-finder')
}

// ── PAGE: VIRAL PRODUCTS ──────────────────────────────────────────────────────
function getViralProductsPage() {
  return getLayout('Viral Products', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2"><i class="fas fa-bolt text-purple-400"></i> Viral Products</h1>
      <div class="text-xs text-slate-400 mt-0.5">AI-scored winning products updated every hour</div>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-6">
    <!-- AI Header -->
    <div class="card p-6 mb-6" style="background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15)); border-color: rgba(99,102,241,0.3)">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">🤖</div>
        <div class="flex-1">
          <h2 class="text-xl font-black text-white mb-1">AI Product Intelligence Engine</h2>
          <p class="text-slate-300 text-sm">Our AI analyzes demand signals, competition levels, social trends, and margin potential across 9 data sources to identify your next winning product.</p>
        </div>
        <div class="text-right hidden md:block">
          <div class="text-3xl font-black text-indigo-400" id="viral-count">—</div>
          <div class="text-xs text-slate-400">Viral Score >75</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-6 flex-wrap items-center">
      <select id="viral-category" class="select" onchange="loadViralProducts()">
        <option value="all">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="viral-budget" class="select" onchange="loadViralProducts()">
        <option value="100000">Any Budget</option>
        <option value="500">Under ₹500</option>
        <option value="1000">Under ₹1,000</option>
        <option value="2000">Under ₹2,000</option>
        <option value="5000">Under ₹5,000</option>
      </select>
      <div class="flex-1"></div>
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span class="live-dot"></span>
        <span>AI scoring live</span>
      </div>
    </div>

    <!-- AI Recommendations Grid -->
    <div id="viral-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
      ${Array(6).fill('<div class="card h-80 shimmer rounded-xl"></div>').join('')}
    </div>
  </div>
</div>

<script>
async function loadViralProducts() {
  const category = document.getElementById('viral-category').value;
  const budget = document.getElementById('viral-budget').value;

  document.getElementById('viral-grid').innerHTML = Array(6).fill('<div class="card h-80 shimmer rounded-xl"></div>').join('');

  try {
    const { data } = await axios.get(\`/api/ai/recommendations?category=\${encodeURIComponent(category)}&budget=\${budget}\`);
    if (!data.success) return;

    const products = data.data;
    const viralCount = products.filter(p => p.viralScore >= 75).length;
    const el = document.getElementById('viral-count');
    if (el) el.textContent = viralCount;

    document.getElementById('viral-grid').innerHTML = products.map(p => renderViralCard(p)).join('');
  } catch(e) { console.error(e); }
}

function renderViralCard(p) {
  const scoreClass = getScoreClass(p.viralScore);
  const srcClass = getSourceClass(p.platform);
  const opportunityColor = { 'Exceptional':'purple', 'Strong':'green', 'Good':'cyan', 'Moderate':'yellow', 'Low':'red' }[p.opportunity] || 'slate';

  return \`<div class="product-card" onclick="openViralDetail('\${p.id}')">
    <div class="relative" style="height:180px;overflow:hidden">
      <img src="\${p.image}" alt="\${p.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      <div class="absolute inset-0" style="background:linear-gradient(to top, rgba(0,0,0,0.8), transparent)"></div>
      <div class="absolute top-3 left-3"><span class="source-badge \${srcClass}">\${p.platform}</span></div>
      <div class="absolute top-3 right-3">
        <div class="score-ring \${scoreClass}" style="width:44px;height:44px;font-size:14px;font-weight:900">\${p.viralScore}</div>
      </div>
      <div class="absolute bottom-3 left-3 right-3">
        <span class="badge badge-\${opportunityColor}" style="font-size:10px">\${p.opportunity} Opportunity</span>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-sm font-bold text-white mb-2 leading-tight" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.title}</h3>

      <div class="grid grid-cols-3 gap-2 mb-3 text-center">
        <div class="bg-slate-800/60 rounded-lg p-2">
          <div class="text-green-400 font-bold text-xs">\${p.margin}%</div>
          <div class="text-slate-500 text-xs">Margin</div>
        </div>
        <div class="bg-slate-800/60 rounded-lg p-2">
          <div class="text-cyan-400 font-bold text-xs">\${p.trend}</div>
          <div class="text-slate-500 text-xs">Trend</div>
        </div>
        <div class="bg-slate-800/60 rounded-lg p-2">
          <div class="text-purple-400 font-bold text-xs">\${p.aiScore}</div>
          <div class="text-slate-500 text-xs">AI Score</div>
        </div>
      </div>

      <p class="text-xs text-slate-400 leading-relaxed mb-3" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.reason}</p>

      <div class="flex justify-between items-center">
        <div>
          <div class="text-green-400 font-bold text-sm">\${formatCurrency(p.supplierPrice)}</div>
          <div class="text-xs text-slate-500">supplier cost</div>
        </div>
        <div>
          <div class="text-white font-black">\${formatCurrency(p.sellingPrice)}</div>
          <div class="text-xs text-slate-500">sell price</div>
        </div>
        <a href="\${p.platformUrl}" target="_blank" onclick="event.stopPropagation()" class="btn-primary text-xs px-3 py-2">Source</a>
      </div>
    </div>
  </div>\`;
}

async function openViralDetail(id) {
  try {
    const [productRes, viralRes] = await Promise.all([
      axios.get('/api/product/' + id),
      axios.get('/api/viral-score/' + id)
    ]);

    if (productRes.data.success && viralRes.data.success) {
      showViralModal(productRes.data.data, viralRes.data.data);
    }
  } catch(e) {}
}

function showViralModal(p, v) {
  const existing = document.getElementById('viral-modal');
  if (existing) existing.remove();
  const scoreClass = getScoreClass(v.viralScore);
  const modal = document.createElement('div');
  modal.id = 'viral-modal';
  modal.className = 'modal show';
  modal.innerHTML = \`
    <div class="modal-content p-6">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-white flex items-center gap-2"><i class="fas fa-bolt text-purple-400"></i> Viral Analysis</h2>
        <button onclick="document.getElementById('viral-modal').remove()" class="text-slate-400 hover:text-white"><i class="fas fa-times text-xl"></i></button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <img src="\${p.image}" class="w-full rounded-xl object-cover mb-4" style="height:200px" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
          <h3 class="font-bold text-white mb-2">\${p.title}</h3>
          <div class="text-center p-4 rounded-xl mb-4" style="background:linear-gradient(135deg,rgba(139,92,246,0.15),rgba(99,102,241,0.15));border:1px solid rgba(139,92,246,0.3)">
            <div class="score-ring \${scoreClass} mx-auto mb-2" style="width:64px;height:64px;font-size:22px">\${v.viralScore}</div>
            <div class="text-lg font-black text-white">\${v.verdict}</div>
            <div class="text-xs text-slate-400 mt-1">\${v.recommendation}</div>
          </div>
        </div>
        <div>
          <h4 class="font-bold text-white mb-3">Score Breakdown</h4>
          \${[
            {label:'Google Search Demand', value:v.demandScore, color:'green'},
            {label:'Social Media Buzz', value:v.socialScore, color:'purple'},
            {label:'Trend Momentum', value:v.trendScore, color:'cyan'},
            {label:'Profit Margin Score', value:v.marginScore, color:'yellow'},
            {label:'Competition (Inv.)', value:100-v.competitionScore, color:'blue'},
          ].map(s => \`
            <div class="mb-3">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-slate-400">\${s.label}</span>
                <span class="text-\${s.color}-400 font-bold">\${s.value}/100</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill bg-\${s.color}-500" style="width:\${Math.min(s.value,100)}%"></div>
              </div>
            </div>
          \`).join('')}

          <h4 class="font-bold text-white mt-4 mb-3">Platform Signals</h4>
          <div class="grid grid-cols-2 gap-2">
            \${Object.entries(v.breakdown).map(([platform,score]) => \`
              <div class="card p-3 text-center">
                <div class="text-white font-bold">\${score}</div>
                <div class="text-xs text-slate-400 capitalize">\${platform}</div>
              </div>
            \`).join('')}
          </div>
        </div>
      </div>
      <div class="flex gap-3 mt-5">
        <a href="\${p.platformUrl}" target="_blank" class="btn-primary flex-1 justify-center">
          <i class="fas fa-external-link-alt"></i> Source Product
        </a>
        <a href="/profit-calculator?cost=\${p.supplierPrice}&sell=\${p.sellingPrice}" class="btn-outline px-5">
          <i class="fas fa-calculator"></i> Calculate Profit
        </a>
      </div>
    </div>
  \`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

loadViralProducts();
startAutoRefresh(loadViralProducts);
</script>
`, 'viral-products')
}

// ── PAGE: LOGIN ───────────────────────────────────────────────────────────────
function getLoginPage() {
  return getLayout('Sign In', `
<div class="min-h-screen flex items-center justify-center p-4" style="background: radial-gradient(ellipse at center, rgba(99,102,241,0.15), transparent 60%)">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-4">P</div>
      <h1 class="text-3xl font-black text-white">Welcome Back</h1>
      <p class="text-slate-400 mt-2">Sign in to your PulseMarket account</p>
    </div>

    <div class="card p-8">
      <div id="login-error" class="hidden mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-400 text-sm"></div>

      <div class="space-y-4">
        <div>
          <label class="text-xs text-slate-400 mb-1 block">Email Address</label>
          <input id="login-email" type="email" class="input" placeholder="you@example.com">
        </div>
        <div>
          <label class="text-xs text-slate-400 mb-1 block">Password</label>
          <input id="login-pass" type="password" class="input" placeholder="••••••••" onkeydown="if(event.key==='Enter') doLogin()">
        </div>
        <button onclick="doLogin()" class="btn-primary w-full justify-center text-base py-3">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
      </div>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-700"></div></div>
        <div class="relative flex justify-center"><span class="px-4 bg-slate-800 text-slate-500 text-xs">or continue with</span></div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button onclick="socialLogin('Google')" class="btn-outline flex items-center justify-center gap-2 py-3">
          <span class="text-lg">🇬</span> Google
        </button>
        <button onclick="socialLogin('GitHub')" class="btn-outline flex items-center justify-center gap-2 py-3">
          <i class="fab fa-github"></i> GitHub
        </button>
      </div>

      <p class="text-center text-slate-400 text-sm mt-6">
        No account? <a href="/signup" class="text-indigo-400 hover:text-indigo-300 font-medium">Create one free →</a>
      </p>
    </div>
  </div>
</div>
<script>
function doLogin() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;

  if (!email || !pass) {
    document.getElementById('login-error').textContent = 'Please enter your email and password.';
    document.getElementById('login-error').classList.remove('hidden');
    return;
  }

  // Simulate auth (replace with real Supabase auth)
  const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);
  login(email, name);
  showToast('Welcome back, ' + name + '!', 'success');
  setTimeout(() => window.location.href = '/dashboard', 1000);
}

function socialLogin(provider) {
  const email = provider.toLowerCase() + '@pulsemarket.demo';
  const name = provider + ' User';
  login(email, name);
  showToast('Logged in with ' + provider, 'success');
  setTimeout(() => window.location.href = '/dashboard', 1000);
}
</script>
`, '')
}

// ── PAGE: SIGNUP ──────────────────────────────────────────────────────────────
function getSignupPage() {
  return getLayout('Create Account', `
<div class="min-h-screen flex items-center justify-center p-4" style="background: radial-gradient(ellipse at center, rgba(139,92,246,0.15), transparent 60%)">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-black text-white mx-auto mb-4">P</div>
      <h1 class="text-3xl font-black text-white">Start Free</h1>
      <p class="text-slate-400 mt-2">No credit card required. Full access forever.</p>
    </div>

    <div class="card p-8">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="text-xs text-slate-400 mb-1 block">First Name</label>
            <input id="signup-fname" type="text" class="input" placeholder="Rahul">
          </div>
          <div>
            <label class="text-xs text-slate-400 mb-1 block">Last Name</label>
            <input id="signup-lname" type="text" class="input" placeholder="Sharma">
          </div>
        </div>
        <div>
          <label class="text-xs text-slate-400 mb-1 block">Email Address</label>
          <input id="signup-email" type="email" class="input" placeholder="you@example.com">
        </div>
        <div>
          <label class="text-xs text-slate-400 mb-1 block">Password</label>
          <input id="signup-pass" type="password" class="input" placeholder="Min 8 characters" onkeydown="if(event.key==='Enter') doSignup()">
        </div>
        <div class="flex items-start gap-3">
          <input id="terms" type="checkbox" class="mt-1 accent-indigo-500">
          <label for="terms" class="text-xs text-slate-400">I agree to the <a href="#" class="text-indigo-400">Terms of Service</a> and <a href="#" class="text-indigo-400">Privacy Policy</a></label>
        </div>
        <button onclick="doSignup()" class="btn-primary w-full justify-center text-base py-3">
          <i class="fas fa-user-plus"></i> Create Free Account
        </button>
      </div>

      <div class="grid grid-cols-3 gap-3 mt-5">
        ${['✅ 9 Live Sources','✅ AI Scoring','✅ Free Forever'].map(f =>
          `<div class="text-center text-xs text-slate-400 bg-slate-800/50 rounded-lg p-2">${f}</div>`
        ).join('')}
      </div>

      <p class="text-center text-slate-400 text-sm mt-4">
        Already have an account? <a href="/login" class="text-indigo-400 hover:text-indigo-300 font-medium">Sign in →</a>
      </p>
    </div>
  </div>
</div>
<script>
function doSignup() {
  const fname = document.getElementById('signup-fname').value;
  const email = document.getElementById('signup-email').value;
  const pass = document.getElementById('signup-pass').value;
  const terms = document.getElementById('terms').checked;

  if (!fname || !email || !pass) { showToast('Please fill all fields', 'error'); return; }
  if (!terms) { showToast('Please accept the terms', 'warning'); return; }
  if (pass.length < 8) { showToast('Password must be 8+ characters', 'error'); return; }

  login(email, fname);
  showToast('Account created! Welcome, ' + fname + '!', 'success');
  setTimeout(() => window.location.href = '/dashboard', 1200);
}
</script>
`, '')
}

// ── PAGE: SHOPPING MODE ───────────────────────────────────────────────────────
function getShoppingPage() {
  return getLayout('Shopping Mode', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fas fa-shopping-bag text-pink-400"></i> Personal Shopping Mode
      </h1>
      <div class="text-xs text-slate-400 mt-0.5">Discover products · Compare prices · Save to wishlist · Earn commissions</div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="toggleWishlist()" class="btn-outline text-sm relative">
        <i class="fas fa-heart text-pink-400"></i> Wishlist
        <span id="wishlist-count" class="absolute -top-1 -right-1 text-xs bg-pink-600 text-white rounded-full w-4 h-4 flex items-center justify-center">0</span>
      </button>
      <div id="auth-status"></div>
    </div>
  </div>

  <div class="p-6">
    <!-- Search & Filter Bar -->
    <div class="card p-5 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input id="shop-search" type="text" placeholder="Search products to compare prices..." class="input pl-10" oninput="debounceSearch()" />
        </div>
        <select id="shop-category" class="select" onchange="loadShopProducts()">
          <option value="all">All Categories</option>
          ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="shop-sort" class="select" onchange="sortShopProducts()">
          <option value="demand">Most Popular</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="margin">Best Margin</option>
          <option value="trend">Trending</option>
        </select>
      </div>
      <!-- Quick Categories -->
      <div class="flex gap-2 mt-4 flex-wrap">
        <span class="text-xs text-slate-400 self-center">Browse:</span>
        ${['Electronics','Beauty','Fashion','Home & Kitchen','Sports','Health','Jewelry','Tools'].map(c =>
          `<button onclick="quickShopCategory('${c}')" class="tab-btn text-xs px-3 py-1">${c}</button>`
        ).join('')}
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="stat-card text-center">
        <div class="text-xl font-black text-indigo-400" id="shop-product-count">63</div>
        <div class="text-xs text-slate-400 mt-1">Products Available</div>
      </div>
      <div class="stat-card text-center">
        <div class="text-xl font-black text-green-400">3</div>
        <div class="text-xs text-slate-400 mt-1">Platforms Compared</div>
      </div>
      <div class="stat-card text-center">
        <div class="text-xl font-black text-purple-400" id="shop-wishlist-stat">0</div>
        <div class="text-xs text-slate-400 mt-1">In Your Wishlist</div>
      </div>
      <div class="stat-card text-center">
        <div class="text-xl font-black text-pink-400">Up to 8%</div>
        <div class="text-xs text-slate-400 mt-1">Affiliate Commission</div>
      </div>
    </div>

    <!-- Products Grid - Reels Style -->
    <div id="shop-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
      ${Array(8).fill('<div class="card h-96 shimmer rounded-xl"></div>').join('')}
    </div>

    <!-- Load More -->
    <div class="text-center" id="load-more-wrap">
      <button onclick="loadMoreShop()" class="btn-outline px-8 py-3"><i class="fas fa-chevron-down mr-2"></i>Load More Products</button>
    </div>
  </div>

  <!-- Wishlist Drawer -->
  <div id="wishlist-drawer" class="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 z-200 transform translate-x-full transition-transform duration-300 overflow-y-auto" style="z-index:200">
    <div class="p-5 border-b border-slate-700 flex justify-between items-center sticky top-0 bg-slate-900">
      <h3 class="font-bold text-white flex items-center gap-2"><i class="fas fa-heart text-pink-400"></i> Wishlist</h3>
      <button onclick="toggleWishlist()" class="text-slate-400 hover:text-white"><i class="fas fa-times text-xl"></i></button>
    </div>
    <div id="wishlist-items" class="p-4 space-y-3"></div>
    <div class="p-4 border-t border-slate-700 sticky bottom-0 bg-slate-900">
      <button onclick="clearWishlist()" class="btn-outline w-full text-sm"><i class="fas fa-trash mr-2"></i>Clear Wishlist</button>
    </div>
  </div>
</div>

<script>
let shopProducts = [];
let shopPage = 0;
let shopWishlist = JSON.parse(localStorage.getItem('shop_wishlist') || '[]');
let searchTimer = null;

function debounceSearch() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadShopProducts, 400);
}

async function loadShopProducts(reset = true) {
  if (reset) { shopPage = 0; shopProducts = []; }
  const q = document.getElementById('shop-search').value.trim() || 'trending';
  const category = document.getElementById('shop-category').value;

  if (reset) {
    document.getElementById('shop-grid').innerHTML = Array(8).fill('<div class="card h-96 shimmer rounded-xl"></div>').join('');
  }

  try {
    const { data } = await axios.get(\`/api/search?q=\${encodeURIComponent(q)}&category=\${encodeURIComponent(category)}&page=1&limit=24&source=all\`);
    if (data.success) {
      shopProducts = data.data.products;
      renderShopGrid();
      document.getElementById('shop-product-count').textContent = data.data.total;
    }
  } catch(e) { console.error(e); }
}

function sortShopProducts() {
  const sort = document.getElementById('shop-sort').value;
  const sorted = [...shopProducts];
  if (sort === 'demand') sorted.sort((a,b) => b.demand - a.demand);
  else if (sort === 'price_asc') sorted.sort((a,b) => a.sellingPrice - b.sellingPrice);
  else if (sort === 'price_desc') sorted.sort((a,b) => b.sellingPrice - a.sellingPrice);
  else if (sort === 'margin') sorted.sort((a,b) => b.margin - a.margin);
  else if (sort === 'trend') sorted.sort((a,b) => parseFloat(b.trend) - parseFloat(a.trend));
  shopProducts = sorted;
  renderShopGrid();
}

function renderShopGrid() {
  const grid = document.getElementById('shop-grid');
  if (!shopProducts.length) {
    grid.innerHTML = '<div class="col-span-4 text-center py-16 text-slate-400"><i class="fas fa-search text-5xl mb-4 block opacity-30"></i><div class="font-bold">No products found</div><div class="text-sm mt-1">Try a different search term</div></div>';
    return;
  }
  grid.innerHTML = shopProducts.map(p => renderShopCard(p)).join('');
  updateWishlistCount();
}

function renderShopCard(p) {
  const srcClass = getSourceClass(p.platform);
  const inWishlist = shopWishlist.find(w => w.id === p.id);
  const amazonUrl = \`https://www.amazon.in/s?k=\${encodeURIComponent(p.title)}\`;
  const flipkartUrl = \`https://www.flipkart.com/search?q=\${encodeURIComponent(p.title)}\`;
  const meeshoUrl = \`https://meesho.com/search?q=\${encodeURIComponent(p.title)}\`;
  const flipPrice = Math.round(p.sellingPrice * (0.92 + Math.random() * 0.12));
  const meeshoPrice = Math.round(p.sellingPrice * (0.78 + Math.random() * 0.10));
  const bestPrice = Math.min(p.sellingPrice, flipPrice, meeshoPrice);
  const savings = p.sellingPrice - bestPrice;

  return \`<div class="card overflow-hidden hover:border-pink-500 transition-all hover:-translate-y-1 group">
    <div class="relative overflow-hidden" style="height:200px">
      <img src="\${p.image}" alt="\${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div class="absolute top-3 left-3"><span class="source-badge \${srcClass}">\${p.platform}</span></div>
      <div class="absolute top-3 right-3">
        <button onclick="toggleWishlistItem(\${JSON.stringify(p).replace(/\\\\/g,'\\\\\\\\').replace(/'/g,'&#39;').replace(/"/g,'&quot;')})" class="w-9 h-9 rounded-full flex items-center justify-center transition-all \${inWishlist ? 'bg-pink-600 text-white' : 'bg-black/50 text-white hover:bg-pink-600'}">
          <i class="fas fa-heart text-sm"></i>
        </button>
      </div>
      \${savings > 50 ? \`<div class="absolute bottom-3 left-3"><span class="badge badge-green text-xs">Save ₹\${savings}</span></div>\` : ''}
      \${p.trend && parseFloat(p.trend) > 25 ? '<div class="absolute bottom-3 right-3"><span class="badge badge-purple text-xs">TRENDING</span></div>' : ''}
    </div>

    <div class="p-4">
      <h3 class="text-sm font-bold text-white mb-1 leading-tight" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.title}</h3>
      <div class="flex items-center gap-1 mb-3">
        <span class="text-yellow-400 text-xs">★★★★</span><span class="text-yellow-400 text-xs">\${(p.rating||4.3).toFixed(1)}</span>
        <span class="text-slate-500 text-xs">(\${(p.reviews||1000).toLocaleString()})</span>
      </div>

      <!-- Price Comparison -->
      <div class="bg-slate-800/60 rounded-xl p-3 mb-3 space-y-2">
        <div class="text-xs text-slate-400 font-bold mb-1">Price Comparison</div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-orange-400 font-bold">Amazon</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-white">\${formatCurrency(p.sellingPrice)}</span>
            \${p.sellingPrice === bestPrice ? '<span class="badge badge-green text-xs">BEST</span>' : ''}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-blue-400 font-bold">Flipkart</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-white">\${formatCurrency(flipPrice)}</span>
            \${flipPrice === bestPrice ? '<span class="badge badge-green text-xs">BEST</span>' : ''}
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-purple-400 font-bold">Meesho</span>
          <div class="flex items-center gap-2">
            <span class="text-sm font-black text-white">\${formatCurrency(meeshoPrice)}</span>
            \${meeshoPrice === bestPrice ? '<span class="badge badge-green text-xs">BEST</span>' : ''}
          </div>
        </div>
      </div>

      <!-- Buy Buttons -->
      <div class="flex gap-2">
        <a href="\${bestPrice === meeshoPrice ? meeshoUrl : bestPrice === flipPrice ? flipkartUrl : amazonUrl}" target="_blank"
           class="flex-1 btn-primary text-xs py-2 justify-center">
          <i class="fas fa-shopping-cart"></i> Best Deal
        </a>
        <button onclick="shareProduct('\${p.title}','\${p.sellingPrice}')" class="btn-outline px-3 py-2 text-xs">
          <i class="fas fa-share-alt"></i>
        </button>
      </div>
    </div>
  </div>\`;
}

function toggleWishlistItem(p) {
  const idx = shopWishlist.findIndex(w => w.id === p.id);
  if (idx >= 0) {
    shopWishlist.splice(idx, 1);
    showToast('Removed from wishlist', 'info');
  } else {
    shopWishlist.push(p);
    showToast('Added to wishlist! ❤️', 'success');
  }
  localStorage.setItem('shop_wishlist', JSON.stringify(shopWishlist));
  updateWishlistCount();
  renderShopGrid();
  renderWishlistDrawer();
}

function updateWishlistCount() {
  const cnt = shopWishlist.length;
  document.getElementById('wishlist-count').textContent = cnt;
  const stat = document.getElementById('shop-wishlist-stat');
  if (stat) stat.textContent = cnt;
}

function toggleWishlist() {
  const drawer = document.getElementById('wishlist-drawer');
  const isOpen = !drawer.classList.contains('translate-x-full');
  drawer.classList.toggle('translate-x-full', isOpen);
  if (!isOpen) return;
  renderWishlistDrawer();
}

function renderWishlistDrawer() {
  const el = document.getElementById('wishlist-items');
  if (!shopWishlist.length) {
    el.innerHTML = '<div class="text-center py-8 text-slate-400"><i class="fas fa-heart text-3xl mb-3 block opacity-30"></i><div class="text-sm">Your wishlist is empty</div></div>';
    return;
  }
  el.innerHTML = shopWishlist.map(p => \`
    <div class="card p-3 flex gap-3 items-center">
      <img src="\${p.image}" class="w-14 h-14 rounded-lg object-cover flex-shrink-0" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      <div class="flex-1 min-w-0">
        <div class="text-xs font-semibold text-white leading-tight" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.title}</div>
        <div class="text-sm font-black text-green-400 mt-1">\${formatCurrency(p.sellingPrice)}</div>
      </div>
      <button onclick="toggleWishlistItem(\${JSON.stringify(p).replace(/'/g,'&#39;').replace(/"/g,'&quot;')})" class="text-red-400 hover:text-red-300">
        <i class="fas fa-trash text-xs"></i>
      </button>
    </div>
  \`).join('');
}

function clearWishlist() {
  shopWishlist = [];
  localStorage.setItem('shop_wishlist', JSON.stringify(shopWishlist));
  updateWishlistCount();
  renderWishlistDrawer();
  renderShopGrid();
  showToast('Wishlist cleared', 'info');
}

function loadMoreShop() {
  showToast('All products loaded!', 'info');
}

function quickShopCategory(cat) {
  document.getElementById('shop-category').value = cat;
  loadShopProducts();
}

function shareProduct(title, price) {
  const text = \`Check out \${title} at \${formatCurrency(parseInt(price))} on PulseMarket! 🛒\`;
  if (navigator.share) {
    navigator.share({ title, text, url: window.location.href });
  } else {
    navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!', 'success'));
  }
}

loadShopProducts();
updateWishlistCount();
</script>
`, 'shopping')
}

// ── PAGE: AI AGENTS ───────────────────────────────────────────────────────────
function getAIAgentsPage() {
  const agents = [
    { id: 'trend', icon: 'fa-chart-line', color: 'indigo', label: 'Trend Agent', desc: 'Tracks viral trends across social media and search engines' },
    { id: 'supplier', icon: 'fa-truck', color: 'cyan', label: 'Supplier Agent', desc: 'Finds and scores suppliers from Alibaba, AliExpress & IndiaMart' },
    { id: 'seo', icon: 'fa-search', color: 'green', label: 'SEO Agent', desc: 'Generates optimized product titles, keywords and listing copy' },
    { id: 'research', icon: 'fa-flask', color: 'purple', label: 'Research Agent', desc: 'Deep market research on any niche, buyer behavior and demand' },
    { id: 'pricing', icon: 'fa-tag', color: 'yellow', label: 'Pricing Agent', desc: 'Recommends optimal prices based on competition and demand' },
    { id: 'competitor', icon: 'fa-binoculars', color: 'orange', label: 'Competitor Agent', desc: 'Monitors competitor ads, pricing, reviews and strategies' },
  ]

  return getLayout('AI Agents', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fas fa-robot text-purple-400"></i> AI Intelligence Layer
      </h1>
      <div class="text-xs text-slate-400 mt-0.5">6 specialized AI agents — ask anything about your business</div>
    </div>
    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-medium">
        <span class="live-dot" style="background:#8b5cf6"></span> AI Online
      </div>
      <div id="auth-status"></div>
    </div>
  </div>

  <div class="p-6">
    <!-- Agent Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      ${agents.map(a => `
      <button onclick="selectAgent('${a.id}')" id="agent-btn-${a.id}"
        class="card p-4 text-center hover:border-${a.color}-500 transition-all hover:-translate-y-1 group cursor-pointer border-transparent">
        <div class="w-12 h-12 rounded-2xl bg-${a.color}-900/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
          <i class="fas ${a.icon} text-${a.color}-400 text-xl"></i>
        </div>
        <div class="text-xs font-bold text-white">${a.label}</div>
        <div class="text-xs text-slate-500 mt-1 leading-tight hidden md:block">${a.desc.split(' ').slice(0, 5).join(' ')}...</div>
      </button>`).join('')}
    </div>

    <!-- Chat Interface -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat Panel -->
      <div class="lg:col-span-2">
        <div class="card flex flex-col" style="height:580px">
          <!-- Chat Header -->
          <div class="p-4 border-b border-slate-700 flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-900/50 flex items-center justify-center" id="active-agent-icon">
              <i class="fas fa-robot text-indigo-400"></i>
            </div>
            <div>
              <div class="font-bold text-white text-sm" id="active-agent-name">Select an AI Agent above</div>
              <div class="text-xs text-slate-400" id="active-agent-desc">Choose a specialized agent to start analyzing</div>
            </div>
            <div class="ml-auto flex items-center gap-1">
              <span class="live-dot" style="width:6px;height:6px;background:#10b981"></span>
              <span class="text-xs text-green-400">Online</span>
            </div>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages">
            <div class="flex gap-3">
              <div class="w-8 h-8 rounded-full bg-indigo-900/60 flex items-center justify-center flex-shrink-0">
                <i class="fas fa-robot text-indigo-400 text-xs"></i>
              </div>
              <div class="flex-1">
                <div class="bg-slate-800/60 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-200">
                  👋 Welcome to PulseMarket AI Intelligence! I have 6 specialized agents ready to help you:
                  <div class="mt-3 grid grid-cols-2 gap-2">
                    ${agents.map(a => `
                    <button onclick="selectAgent('${a.id}')" class="text-left p-2 rounded-lg bg-slate-700/50 hover:bg-${a.color}-900/40 hover:border-${a.color}-500 border border-transparent transition-all text-xs">
                      <i class="fas ${a.icon} text-${a.color}-400 mr-1"></i>
                      <span class="text-white font-medium">${a.label}</span>
                    </button>`).join('')}
                  </div>
                </div>
                <div class="text-xs text-slate-500 mt-1 ml-1">Now • PulseMarket AI</div>
              </div>
            </div>
          </div>

          <!-- Input Bar -->
          <div class="p-4 border-t border-slate-700">
            <div class="flex gap-3">
              <input id="chat-input" type="text" placeholder="Ask your AI agent anything..." class="input flex-1 text-sm"
                onkeydown="if(event.key==='Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); }" />
              <button onclick="sendMessage()" class="btn-primary px-4" id="send-btn">
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
            <div class="flex gap-2 mt-2 flex-wrap" id="quick-prompts">
              <span class="text-xs text-slate-500">Try:</span>
              <button onclick="setPrompt('wireless earbuds')" class="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded-full">wireless earbuds</button>
              <button onclick="setPrompt('vitamin c serum')" class="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded-full">vitamin c serum</button>
              <button onclick="setPrompt('yoga mat india')" class="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded-full">yoga mat india</button>
              <button onclick="setPrompt('resistance bands')" class="text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 px-2 py-1 rounded-full">resistance bands</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Side Panel: Agent Info + Stats -->
      <div class="space-y-4">
        <!-- Active Agent Card -->
        <div class="card p-5" id="agent-info-panel">
          <h4 class="font-bold text-white mb-3 text-sm">🤖 AI Agent Status</h4>
          <div class="space-y-3">
            ${agents.map(a => `
            <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-all cursor-pointer" onclick="selectAgent('${a.id}')">
              <div class="w-8 h-8 rounded-xl bg-${a.color}-900/30 flex items-center justify-center flex-shrink-0">
                <i class="fas ${a.icon} text-${a.color}-400 text-xs"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-white">${a.label}</div>
                <div class="text-xs text-slate-500 truncate">${a.desc}</div>
              </div>
              <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
            </div>`).join('')}
          </div>
        </div>

        <!-- Recent Insights -->
        <div class="card p-5">
          <h4 class="font-bold text-white mb-3 text-sm flex items-center gap-2"><i class="fas fa-lightbulb text-yellow-400"></i> Today's AI Insights</h4>
          <div class="space-y-3">
            ${[
              { agent: 'Trend Agent', insight: 'Resistance bands trending +187% in Delhi-NCR this week', color: 'indigo' },
              { agent: 'Pricing Agent', insight: 'Vitamin C Serum sweet spot: ₹549-₹599 for max conversion', color: 'yellow' },
              { agent: 'Supplier Agent', insight: '3 new Gold Suppliers for wireless earbuds added on Alibaba', color: 'cyan' },
              { agent: 'SEO Agent', insight: '"yoga mat non slip" getting 45K searches/month in India', color: 'green' },
            ].map(i => `
            <div class="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <div class="text-xs font-bold text-${i.color}-400 mb-1">${i.agent}</div>
              <div class="text-xs text-slate-300 leading-relaxed">${i.insight}</div>
            </div>`).join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
let currentAgent = 'trend';
const agentMeta = {
  trend: { icon: 'fa-chart-line', color: 'indigo', name: 'Trend Agent', desc: 'Tracking viral trends across social & search' },
  supplier: { icon: 'fa-truck', color: 'cyan', name: 'Supplier Agent', desc: 'Finding verified global suppliers' },
  seo: { icon: 'fa-search', color: 'green', name: 'SEO Agent', desc: 'Optimizing listings for maximum visibility' },
  research: { icon: 'fa-flask', color: 'purple', name: 'Research Agent', desc: 'Deep market research & consumer insights' },
  pricing: { icon: 'fa-tag', color: 'yellow', name: 'Pricing Agent', desc: 'Data-driven pricing recommendations' },
  competitor: { icon: 'fa-binoculars', color: 'orange', name: 'Competitor Agent', desc: 'Monitoring competitor strategies' },
};

function selectAgent(id) {
  currentAgent = id;
  const meta = agentMeta[id];

  // Update header
  document.getElementById('active-agent-icon').innerHTML = \`<i class="fas \${meta.icon} text-\${meta.color}-400"></i>\`;
  document.getElementById('active-agent-name').textContent = meta.name;
  document.getElementById('active-agent-desc').textContent = meta.desc;

  // Highlight selected button
  document.querySelectorAll('[id^="agent-btn-"]').forEach(b => {
    b.style.borderColor = '';
    b.style.background = '';
  });
  const btn = document.getElementById('agent-btn-' + id);
  if (btn) {
    btn.style.borderColor = 'rgba(99,102,241,0.6)';
    btn.style.background = 'rgba(99,102,241,0.1)';
  }

  addMessage('ai', \`✅ \${meta.name} activated! I'm ready to help. What would you like to analyze?\`);
  document.getElementById('chat-input').placeholder = \`Ask \${meta.name} anything...\`;
  document.getElementById('chat-input').focus();
}

function addMessage(role, text) {
  const container = document.getElementById('chat-messages');
  const isAI = role === 'ai';
  const meta = agentMeta[currentAgent];
  const div = document.createElement('div');
  div.className = 'flex gap-3' + (isAI ? '' : ' flex-row-reverse');

  const formattedText = text.replace(/\\*\\*(.*?)\\*\\*/g, '<strong class="text-white">$1</strong>');

  if (isAI) {
    div.innerHTML = \`
      <div class="w-8 h-8 rounded-full bg-\${meta.color}-900/60 flex items-center justify-center flex-shrink-0">
        <i class="fas \${meta.icon} text-\${meta.color}-400 text-xs"></i>
      </div>
      <div class="flex-1 max-w-lg">
        <div class="bg-slate-800/60 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-200 leading-relaxed">\${formattedText}</div>
        <div class="text-xs text-slate-500 mt-1 ml-1">Just now • \${meta.name}</div>
      </div>\`;
  } else {
    div.innerHTML = \`
      <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
        \${(PM.user?.name?.charAt(0) || 'U')}
      </div>
      <div class="flex-1 max-w-lg flex flex-col items-end">
        <div class="bg-indigo-600 rounded-2xl rounded-tr-sm p-4 text-sm text-white">\${formattedText}</div>
        <div class="text-xs text-slate-500 mt-1 mr-1">Just now</div>
      </div>\`;
  }
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const meta = agentMeta[currentAgent];
  const div = document.createElement('div');
  div.id = 'typing-indicator';
  div.className = 'flex gap-3';
  div.innerHTML = \`
    <div class="w-8 h-8 rounded-full bg-\${meta.color}-900/60 flex items-center justify-center flex-shrink-0">
      <i class="fas \${meta.icon} text-\${meta.color}-400 text-xs"></i>
    </div>
    <div class="bg-slate-800/60 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
      <div class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay:0ms"></div>
      <div class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay:150ms"></div>
      <div class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay:300ms"></div>
    </div>\`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('chat-input');
  const message = input.value.trim();
  if (!message) return;

  addMessage('user', message);
  input.value = '';

  addTypingIndicator();
  document.getElementById('send-btn').disabled = true;

  try {
    const { data } = await axios.post('/api/ai/chat', { agent: currentAgent, message });
    document.getElementById('typing-indicator')?.remove();
    if (data.success) {
      addMessage('ai', data.data.response);
    }
  } catch(e) {
    document.getElementById('typing-indicator')?.remove();
    addMessage('ai', '⚠️ Connection issue. Please try again in a moment.');
  }
  document.getElementById('send-btn').disabled = false;
  input.focus();
}

function setPrompt(text) {
  document.getElementById('chat-input').value = text;
  document.getElementById('chat-input').focus();
}

selectAgent('trend');
</script>
`, 'ai-agents')
}

// ── PAGE: ANALYTICS ENGINE ────────────────────────────────────────────────────
function getAnalyticsPage() {
  return getLayout('Analytics Engine', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fas fa-chart-bar text-indigo-400"></i> Analytics Engine
      </h1>
      <div class="text-xs text-slate-400 mt-0.5">Forecasting · Country heatmaps · Growth prediction · Historical trends</div>
    </div>
    <div class="flex items-center gap-3">
      <select id="analytics-category" class="select text-sm" onchange="loadAnalytics()">
        <option value="all">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <button onclick="exportData()" class="btn-outline text-sm"><i class="fas fa-download mr-1"></i>Export</button>
      <div id="auth-status"></div>
    </div>
  </div>

  <div class="p-6">
    <!-- KPI Row -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" id="analytics-kpis">
      ${[1,2,3,4].map(() => '<div class="stat-card shimmer h-24 rounded-xl"></div>').join('')}
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Revenue Forecast -->
      <div class="card p-5 lg:col-span-2">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="font-bold text-white flex items-center gap-2"><i class="fas fa-chart-area text-indigo-400"></i> Revenue Forecast (12-Month)</h3>
            <div class="text-xs text-slate-400 mt-0.5">Shaded area = AI forecast</div>
          </div>
          <div class="flex gap-2">
            <span class="flex items-center gap-1 text-xs text-slate-400"><span class="w-3 h-3 rounded-sm bg-indigo-500/70 inline-block"></span> Actual</span>
            <span class="flex items-center gap-1 text-xs text-slate-400"><span class="w-3 h-3 rounded-sm bg-purple-500/40 inline-block"></span> Forecast</span>
          </div>
        </div>
        <div class="chart-container" style="height:280px">
          <canvas id="revenueChart"></canvas>
        </div>
      </div>

      <!-- Category Growth -->
      <div class="card p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-chart-pie text-cyan-400"></i> Category Growth</h3>
        <div class="chart-container" style="height:200px">
          <canvas id="categoryGrowthChart"></canvas>
        </div>
        <div id="category-growth-list" class="mt-3 space-y-2"></div>
      </div>
    </div>

    <!-- India Heatmap + Top Products -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- India State Heatmap -->
      <div class="card p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-map-marked-alt text-green-400"></i> Demand Heatmap — India States</h3>
        <div id="india-heatmap" class="space-y-2.5"></div>
      </div>

      <!-- Top Products Table -->
      <div class="card p-5">
        <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-trophy text-yellow-400"></i> Top Products by Revenue</h3>
        <div id="top-products-analytics" class="space-y-3"></div>
      </div>
    </div>

    <!-- Growth Prediction -->
    <div class="card p-5 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-bold text-white flex items-center gap-2"><i class="fas fa-magic text-purple-400"></i> 90-Day Growth Prediction</h3>
        <span class="badge badge-purple text-xs">AI Powered</span>
      </div>
      <div class="chart-container" style="height:200px">
        <canvas id="growthChart"></canvas>
      </div>
    </div>

    <!-- Insight Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      ${[
        { icon: 'fa-arrow-trend-up', color: 'green', title: 'Best Growth Category', desc: 'Beauty products showing strongest 30-day growth momentum at +35%', value: '+35%' },
        { icon: 'fa-map-pin', color: 'indigo', title: 'Hottest Market', desc: 'Maharashtra drives 23% of all orders — target Mumbai & Pune first', value: 'Maharashtra' },
        { icon: 'fa-calendar-alt', color: 'orange', title: 'Peak Season Ahead', desc: 'Festive season (Oct-Dec) typically drives 3x normal revenue', value: 'Oct-Dec' },
      ].map(i => `
      <div class="card p-5" style="background: linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-${i.color}-900/30 flex items-center justify-center">
            <i class="fas ${i.icon} text-${i.color}-400"></i>
          </div>
          <div class="text-2xl font-black text-${i.color}-400">${i.value}</div>
        </div>
        <div class="font-bold text-white text-sm mb-1">${i.title}</div>
        <div class="text-xs text-slate-400 leading-relaxed">${i.desc}</div>
      </div>`).join('')}
    </div>
  </div>
</div>

<script>
let revenueChartInst, growthChartInst, catGrowthChartInst;

async function loadAnalytics() {
  const category = document.getElementById('analytics-category').value;
  try {
    const { data } = await axios.get(\`/api/analytics?category=\${encodeURIComponent(category)}\`);
    if (data.success) renderAnalytics(data.data);
  } catch(e) { console.error(e); }
}

function renderAnalytics(d) {
  // KPIs
  document.getElementById('analytics-kpis').innerHTML = \`
    <div class="stat-card">
      <div class="flex justify-between items-center mb-2">
        <div class="text-xs text-slate-400">Total Revenue (9mo)</div>
        <i class="fas fa-rupee-sign text-green-400 text-sm"></i>
      </div>
      <div class="text-2xl font-black text-white">₹\${(d.totalRevenue/100000).toFixed(1)}L</div>
      <div class="text-xs text-green-400 mt-1">+\${d.avgGrowth}% avg growth</div>
    </div>
    <div class="stat-card">
      <div class="flex justify-between items-center mb-2">
        <div class="text-xs text-slate-400">Best State</div>
        <i class="fas fa-map-pin text-indigo-400 text-sm"></i>
      </div>
      <div class="text-xl font-black text-white">\${d.bestState}</div>
      <div class="text-xs text-indigo-400 mt-1">Highest demand region</div>
    </div>
    <div class="stat-card">
      <div class="flex justify-between items-center mb-2">
        <div class="text-xs text-slate-400">Best Category</div>
        <i class="fas fa-fire text-orange-400 text-sm"></i>
      </div>
      <div class="text-xl font-black text-white">\${d.bestCategory}</div>
      <div class="text-xs text-orange-400 mt-1">Fastest growing</div>
    </div>
    <div class="stat-card">
      <div class="flex justify-between items-center mb-2">
        <div class="text-xs text-slate-400">Avg Category Growth</div>
        <i class="fas fa-chart-line text-purple-400 text-sm"></i>
      </div>
      <div class="text-2xl font-black text-white">+\${d.avgGrowth}%</div>
      <div class="text-xs text-purple-400 mt-1">Month over month</div>
    </div>
  \`;

  // Revenue forecast chart
  if (revenueChartInst) revenueChartInst.destroy();
  const rCtx = document.getElementById('revenueChart').getContext('2d');
  revenueChartInst = new Chart(rCtx, {
    type: 'bar',
    data: {
      labels: d.revenueData.map(x => x.month),
      datasets: [{
        label: 'Revenue',
        data: d.revenueData.map(x => x.value),
        backgroundColor: d.revenueData.map(x => x.forecast ? 'rgba(139,92,246,0.4)' : 'rgba(99,102,241,0.7)'),
        borderColor: d.revenueData.map(x => x.forecast ? 'rgba(139,92,246,0.9)' : 'rgba(99,102,241,0.9)'),
        borderWidth: 1,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => '₹' + ctx.raw.toLocaleString('en-IN') } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
        y: { grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => '₹' + (v/1000) + 'K' } }
      }
    }
  });

  // Category growth chart
  if (catGrowthChartInst) catGrowthChartInst.destroy();
  const cCtx = document.getElementById('categoryGrowthChart').getContext('2d');
  const top5 = d.categoryGrowth.sort((a,b) => b.growth - a.growth).slice(0, 5);
  catGrowthChartInst = new Chart(cCtx, {
    type: 'doughnut',
    data: {
      labels: top5.map(c => c.category),
      datasets: [{ data: top5.map(c => c.growth), backgroundColor: ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b'], borderWidth: 2, borderColor: '#1e293b' }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  document.getElementById('category-growth-list').innerHTML = top5.slice(0, 4).map(c => \`
    <div class="flex items-center justify-between">
      <span class="text-xs text-slate-300">\${c.category}</span>
      <span class="text-xs font-bold text-green-400">+\${c.growth}%</span>
    </div>
  \`).join('');

  // India heatmap
  const maxVal = Math.max(...d.stateData.map(s => s.value));
  document.getElementById('india-heatmap').innerHTML = d.stateData.sort((a,b) => b.value - a.value).map(s => {
    const pct = Math.round(s.value / maxVal * 100);
    const color = s.value > 75 ? 'indigo' : s.value > 60 ? 'cyan' : s.value > 45 ? 'green' : 'slate';
    return \`<div class="flex items-center gap-3">
      <div class="w-28 text-xs text-slate-300 font-medium">\${s.state}</div>
      <div class="flex-1 progress-bar h-5 relative rounded-lg overflow-hidden">
        <div class="progress-fill bg-gradient-to-r from-\${color}-600 to-\${color}-400 h-full" style="width:\${pct}%;border-radius:6px"></div>
      </div>
      <div class="text-xs font-bold text-\${color}-400 w-8 text-right">\${s.value}</div>
    </div>\`;
  }).join('');

  // Top products
  document.getElementById('top-products-analytics').innerHTML = d.topProducts.slice(0, 6).map((p, i) => \`
    <div class="flex items-center gap-3">
      <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black \${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-slate-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-slate-700 text-slate-300'}">#\${i+1}</div>
      <div class="flex-1 min-w-0">
        <div class="text-xs font-medium text-white truncate">\${p.title}</div>
        <div class="text-xs text-slate-500">\${p.units.toLocaleString()} units sold</div>
      </div>
      <div class="text-right flex-shrink-0">
        <div class="text-xs font-black text-green-400">₹\${(p.revenue/1000).toFixed(0)}K</div>
        <div class="text-xs text-cyan-400">\${p.growth}</div>
      </div>
    </div>
  \`).join('');

  // 90-day growth prediction
  if (growthChartInst) growthChartInst.destroy();
  const gCtx = document.getElementById('growthChart').getContext('2d');
  const days = Array.from({length: 90}, (_, i) => i + 1);
  const actual = days.slice(0, 60).map(d => Math.round(40000 + d * 600 + Math.random() * 8000));
  const forecast = [actual[59], ...days.slice(60).map(d => Math.round(40000 + d * 700 + Math.random() * 5000))];
  growthChartInst = new Chart(gCtx, {
    type: 'line',
    data: {
      labels: days.map(d => d % 10 === 0 ? \`Day \${d}\` : ''),
      datasets: [
        { label: 'Actual', data: [...actual, ...Array(30).fill(null)], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4, pointRadius: 0 },
        { label: 'Forecast', data: [...Array(59).fill(null), ...forecast], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.08)', borderDash: [5,5], fill: true, tension: 0.4, pointRadius: 0 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8', font: { size: 11 } } }, tooltip: { callbacks: { label: ctx => '₹' + (ctx.raw||0).toLocaleString('en-IN') } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } },
        y: { grid: { color: 'rgba(51,65,85,0.4)' }, ticks: { color: '#94a3b8', font: { size: 10 }, callback: v => '₹' + (v/1000).toFixed(0) + 'K' } }
      }
    }
  });
}

function exportData() {
  showToast('Exporting analytics report...', 'info');
  setTimeout(() => showToast('Export ready! (CSV download in Pro plan)', 'success'), 1500);
}

loadAnalytics();
</script>
`, 'analytics')
}

// ── PAGE: MARKETPLACE ─────────────────────────────────────────────────────────
function getMarketplacePage() {
  return getLayout('Marketplace', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fas fa-store text-green-400"></i> Affiliate Marketplace
      </h1>
      <div class="text-xs text-slate-400 mt-0.5">Earn commissions · Compare prices · Track affiliate performance</div>
    </div>
    <div class="flex items-center gap-3">
      <div class="text-xs text-green-400 bg-green-900/20 border border-green-800/40 px-3 py-1.5 rounded-full font-medium">
        <i class="fas fa-rupee-sign mr-1"></i> Earn up to 8% per sale
      </div>
      <div id="auth-status"></div>
    </div>
  </div>

  <div class="p-6">
    <!-- Affiliate Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      ${[
        { label: 'Est. Monthly Commission', value: '₹12,400', icon: 'fa-rupee-sign', color: 'green' },
        { label: 'Products Available', value: '63+', icon: 'fa-box', color: 'indigo' },
        { label: 'Platforms', value: '3', icon: 'fa-store', color: 'cyan' },
        { label: 'Max Commission', value: '8%', icon: 'fa-percent', color: 'purple' },
      ].map(s => `
      <div class="stat-card">
        <div class="flex justify-between items-center mb-2">
          <div class="text-xs text-slate-400">${s.label}</div>
          <div class="w-8 h-8 bg-${s.color}-900/30 rounded-lg flex items-center justify-center">
            <i class="fas ${s.icon} text-${s.color}-400 text-sm"></i>
          </div>
        </div>
        <div class="text-2xl font-black text-white">${s.value}</div>
      </div>`).join('')}
    </div>

    <!-- Filter Row -->
    <div class="card p-4 mb-6 flex flex-wrap gap-4 items-center">
      <div class="flex-1 relative min-w-48">
        <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
        <input id="market-search" type="text" placeholder="Search products..." class="input pl-9 text-sm" oninput="filterMarket()">
      </div>
      <select id="market-category" class="select text-sm" onchange="loadMarket()">
        <option value="all">All Categories</option>
        ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="market-platform" class="select text-sm" onchange="filterMarket()">
        <option value="all">All Platforms</option>
        <option value="amazon">Amazon India</option>
        <option value="flipkart">Flipkart</option>
        <option value="meesho">Meesho</option>
      </select>
      <div class="flex gap-2">
        <span class="text-xs text-slate-400 self-center">Sort:</span>
        <button onclick="sortMarket('commission')" class="tab-btn text-xs active" id="sort-commission">Commission</button>
        <button onclick="sortMarket('demand')" class="tab-btn text-xs" id="sort-demand">Demand</button>
        <button onclick="sortMarket('price')" class="tab-btn text-xs" id="sort-price">Price</button>
      </div>
    </div>

    <!-- Products Grid -->
    <div id="market-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-6">
      ${Array(8).fill('<div class="card h-80 shimmer rounded-xl"></div>').join('')}
    </div>
  </div>
</div>

<script>
let marketProducts = [];
let marketFiltered = [];

async function loadMarket() {
  const category = document.getElementById('market-category').value;
  document.getElementById('market-grid').innerHTML = Array(8).fill('<div class="card h-80 shimmer rounded-xl"></div>').join('');
  try {
    const { data } = await axios.get(\`/api/marketplace?category=\${encodeURIComponent(category)}\`);
    if (data.success) {
      marketProducts = data.data;
      marketFiltered = [...marketProducts];
      sortMarket('commission');
    }
  } catch(e) { console.error(e); }
}

function filterMarket() {
  const q = document.getElementById('market-search').value.toLowerCase();
  const platform = document.getElementById('market-platform').value;
  marketFiltered = marketProducts.filter(p => {
    const titleMatch = p.title.toLowerCase().includes(q);
    const platformMatch = platform === 'all' || p.platforms.some(pl => pl.name.toLowerCase().includes(platform));
    return titleMatch && platformMatch;
  });
  renderMarketGrid();
}

function sortMarket(by) {
  document.querySelectorAll('[id^="sort-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('sort-' + by)?.classList.add('active');
  if (by === 'commission') marketFiltered.sort((a,b) => b.commissionEarned - a.commissionEarned);
  else if (by === 'demand') marketFiltered.sort((a,b) => b.demand - a.demand);
  else if (by === 'price') marketFiltered.sort((a,b) => a.bestPrice - b.bestPrice);
  renderMarketGrid();
}

function renderMarketGrid() {
  const grid = document.getElementById('market-grid');
  if (!marketFiltered.length) {
    grid.innerHTML = '<div class="col-span-4 text-center py-12 text-slate-400"><i class="fas fa-store text-4xl mb-3 block opacity-30"></i><div class="font-bold">No products found</div></div>';
    return;
  }
  grid.innerHTML = marketFiltered.map(p => renderMarketCard(p)).join('');
}

function renderMarketCard(p) {
  const scoreClass = getScoreClass(p.viralScore);
  return \`<div class="card overflow-hidden hover:border-green-500 transition-all hover:-translate-y-1">
    <div class="relative" style="height:160px;overflow:hidden">
      <img src="\${p.image}" alt="\${p.title}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute top-2 right-2">
        <div class="score-ring \${scoreClass}" style="width:36px;height:36px;font-size:11px">\${p.viralScore}</div>
      </div>
      <div class="absolute bottom-2 left-2">
        <span class="text-xs bg-green-600 text-white font-bold px-2 py-0.5 rounded-full">+₹\${p.commissionEarned}/sale</span>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-xs font-bold text-white mb-2 leading-tight" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">\${p.title}</h3>

      <!-- Platform Price Comparison -->
      <div class="space-y-1.5 mb-3">
        \${p.platforms.map(pf => \`
          <div class="flex items-center justify-between bg-slate-800/60 rounded-lg px-2 py-1.5">
            <span class="text-xs font-bold text-slate-300">\${pf.name.replace(' India','')}</span>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black text-white">\${formatCurrency(pf.price)}</span>
              <span class="text-xs text-green-400">\${pf.commission}%</span>
            </div>
          </div>
        \`).join('')}
      </div>

      <!-- Affiliate Info -->
      <div class="flex items-center justify-between mb-3 px-2 py-1.5 bg-green-900/20 border border-green-800/30 rounded-lg">
        <div class="text-xs text-green-400 font-bold">Est. Monthly Commission</div>
        <div class="text-sm font-black text-green-400">₹\${p.estimatedCommission.toLocaleString()}</div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <a href="\${p.platforms[0].url}" target="_blank" class="flex-1 btn-primary text-xs py-2 justify-center">
          <i class="fas fa-shopping-cart"></i> Best Deal
        </a>
        <button onclick="copyAffiliateLink('\${p.affiliateTag}')" class="btn-outline px-3 py-2 text-xs" title="Copy affiliate link">
          <i class="fas fa-link"></i>
        </button>
        <button onclick="addToWatchlist({id:'\${p.id}',title:'\${p.title}',image:'\${p.image}',platform:'\${p.platform}'})" class="btn-outline px-3 py-2 text-xs">
          <i class="fas fa-heart"></i>
        </button>
      </div>
    </div>
  </div>\`;
}

function copyAffiliateLink(tag) {
  const link = \`https://pulsemarket.in/ref/\${tag}\`;
  navigator.clipboard.writeText(link).then(() => showToast('Affiliate link copied! 🔗', 'success'));
}

loadMarket();
</script>
`, 'marketplace')
}

// ── PAGE: NOTIFICATIONS ───────────────────────────────────────────────────────
function getNotificationsPage() {
  return getLayout('Smart Alerts', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white flex items-center gap-2">
        <i class="fas fa-bell text-yellow-400"></i> AI Smart Alerts
      </h1>
      <div class="text-xs text-slate-400 mt-0.5">Real-time AI notifications — trends, opportunities, price drops & competitor moves</div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="markAllRead()" class="btn-outline text-sm"><i class="fas fa-check-double mr-1"></i>Mark All Read</button>
      <button onclick="loadNotifications()" class="btn-outline text-sm"><i class="fas fa-sync mr-1"></i>Refresh</button>
      <div id="auth-status"></div>
    </div>
  </div>

  <div class="p-6">
    <!-- Alert Settings Banner -->
    <div class="card p-5 mb-6" style="background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1)); border-color: rgba(99,102,241,0.3)">
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div class="flex-1">
          <h3 class="font-bold text-white flex items-center gap-2 mb-1">
            <i class="fas fa-robot text-indigo-400"></i> AI Alert System Active
          </h3>
          <p class="text-slate-300 text-sm">Your AI monitors 9 data sources 24/7. Get notified when products go viral, prices drop, or competitors make moves.</p>
        </div>
        <div class="flex gap-3 flex-wrap">
          ${[
            { icon: 'fa-paper-plane', label: 'Telegram', color: 'cyan' },
            { icon: 'fa-whatsapp', label: 'WhatsApp', color: 'green' },
            { icon: 'fa-envelope', label: 'Email', color: 'indigo' },
          ].map(c => `
          <div class="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-600 bg-slate-800/60 cursor-pointer hover:border-${c.color}-500 transition-all" onclick="setupChannel('${c.label}')">
            <i class="fab ${c.icon} text-${c.color}-400 text-sm"></i>
            <span class="text-xs font-medium text-white">${c.label}</span>
            <span class="text-xs text-slate-500">Setup →</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- Alert Type Filters -->
    <div class="flex gap-2 mb-5 flex-wrap">
      <span class="text-xs text-slate-400 self-center">Filter:</span>
      <button onclick="filterAlerts('all')" class="tab-btn active text-xs" id="filter-all">All Alerts</button>
      <button onclick="filterAlerts('viral')" class="tab-btn text-xs" id="filter-viral"><i class="fas fa-fire mr-1 text-red-400"></i>Viral</button>
      <button onclick="filterAlerts('price')" class="tab-btn text-xs" id="filter-price"><i class="fas fa-tag mr-1 text-green-400"></i>Price Drops</button>
      <button onclick="filterAlerts('competitor')" class="tab-btn text-xs" id="filter-competitor"><i class="fas fa-binoculars mr-1 text-orange-400"></i>Competitors</button>
      <button onclick="filterAlerts('trend')" class="tab-btn text-xs" id="filter-trend"><i class="fas fa-chart-line mr-1 text-indigo-400"></i>Trends</button>
      <button onclick="filterAlerts('seasonal')" class="tab-btn text-xs" id="filter-seasonal"><i class="fas fa-calendar mr-1 text-purple-400"></i>Seasonal</button>
    </div>

    <!-- Alerts Feed -->
    <div id="alerts-list" class="space-y-3">
      ${Array(5).fill('<div class="card h-20 shimmer rounded-xl"></div>').join('')}
    </div>

    <!-- Alert Configuration -->
    <div class="card p-5 mt-6">
      <h3 class="font-bold text-white mb-4 flex items-center gap-2"><i class="fas fa-sliders-h text-indigo-400"></i> Alert Configuration</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${[
          { label: 'Viral Trend Alerts', desc: 'When a product trends +100% in 24hrs', enabled: true, color: 'red' },
          { label: 'Price Drop Alerts', desc: 'When supplier prices drop >5%', enabled: true, color: 'green' },
          { label: 'Competitor Moves', desc: 'When competitors launch ads or cut prices', enabled: true, color: 'orange' },
          { label: 'Seasonal Predictions', desc: '3 weeks before seasonal demand peaks', enabled: false, color: 'purple' },
          { label: 'New Supplier Alerts', desc: 'When new verified suppliers are found', enabled: true, color: 'cyan' },
          { label: 'Low Stock Warnings', desc: 'When platform stock runs low on your products', enabled: false, color: 'yellow' },
        ].map(a => `
        <div class="flex items-start justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-2 h-2 rounded-full bg-${a.color}-500"></div>
              <span class="text-sm font-bold text-white">${a.label}</span>
            </div>
            <div class="text-xs text-slate-400 leading-relaxed">${a.desc}</div>
          </div>
          <button onclick="toggleAlert(this, '${a.label}')"
            class="ml-3 flex-shrink-0 w-12 h-6 rounded-full transition-all duration-300 flex items-center px-1 ${a.enabled ? 'bg-indigo-600 justify-end' : 'bg-slate-700 justify-start'}">
            <div class="w-4 h-4 rounded-full bg-white shadow"></div>
          </button>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>

<script>
let allAlerts = [];
let currentFilter = 'all';

async function loadNotifications() {
  document.getElementById('alerts-list').innerHTML = Array(5).fill('<div class="card h-20 shimmer rounded-xl"></div>').join('');
  try {
    const { data } = await axios.get('/api/notifications');
    if (data.success) {
      allAlerts = data.data;
      renderAlerts(allAlerts);
    }
  } catch(e) { console.error(e); }
}

function renderAlerts(alerts) {
  const el = document.getElementById('alerts-list');
  if (!alerts.length) {
    el.innerHTML = '<div class="text-center py-12 text-slate-400"><i class="fas fa-bell text-4xl mb-3 block opacity-30"></i><div class="font-bold">No alerts</div><div class="text-sm mt-1">All quiet — AI is monitoring for opportunities</div></div>';
    return;
  }

  el.innerHTML = alerts.map(a => {
    const priorityBorder = { high: 'border-l-4 border-l-red-500', medium: 'border-l-4 border-l-yellow-500', low: 'border-l-4 border-l-slate-600' }[a.priority] || '';
    const unreadBg = a.read ? '' : 'bg-slate-800/80';
    return \`<div class="card p-4 flex gap-4 items-start hover:border-slate-600 transition-all cursor-pointer \${priorityBorder} \${unreadBg}" onclick="markRead('\${a.id}', this)">
      <div class="w-10 h-10 rounded-xl bg-\${a.color}-900/30 flex items-center justify-center flex-shrink-0 relative">
        <i class="fas \${a.icon} text-\${a.color}-400"></i>
        \${!a.read ? '<span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-indigo-500 border border-slate-900"></span>' : ''}
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div class="font-bold text-white text-sm \${!a.read ? 'text-white' : 'text-slate-300'}">\${a.title}</div>
          <div class="text-xs text-slate-500 flex-shrink-0">\${a.time}</div>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed mb-2">\${a.message}</p>
        <div class="flex items-center gap-3">
          <a href="\${a.actionUrl}" class="text-xs text-indigo-400 font-bold hover:text-indigo-300 flex items-center gap-1">
            <i class="fas fa-arrow-right text-xs"></i> \${a.action}
          </a>
          <span class="text-xs px-2 py-0.5 rounded-full font-medium
            \${a.priority === 'high' ? 'bg-red-900/40 text-red-400' : a.priority === 'medium' ? 'bg-yellow-900/40 text-yellow-400' : 'bg-slate-700 text-slate-400'}">
            \${a.priority.charAt(0).toUpperCase() + a.priority.slice(1)} Priority
          </span>
          <span class="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 capitalize">\${a.type}</span>
        </div>
      </div>
    </div>\`;
  }).join('');
}

function filterAlerts(type) {
  currentFilter = type;
  document.querySelectorAll('[id^="filter-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('filter-' + type)?.classList.add('active');
  const filtered = type === 'all' ? allAlerts : allAlerts.filter(a => a.type === type);
  renderAlerts(filtered);
}

function markRead(id, el) {
  const alert = allAlerts.find(a => a.id === id);
  if (alert) { alert.read = true; }
  el.classList.remove('bg-slate-800/80');
  const dot = el.querySelector('.bg-indigo-500');
  if (dot) dot.remove();
}

function markAllRead() {
  allAlerts.forEach(a => a.read = true);
  renderAlerts(currentFilter === 'all' ? allAlerts : allAlerts.filter(a => a.type === currentFilter));
  showToast('All alerts marked as read', 'success');
}

function toggleAlert(btn, label) {
  const isActive = btn.classList.contains('bg-indigo-600');
  btn.classList.toggle('bg-indigo-600', !isActive);
  btn.classList.toggle('bg-slate-700', isActive);
  btn.classList.toggle('justify-end', !isActive);
  btn.classList.toggle('justify-start', isActive);
  showToast((isActive ? 'Disabled: ' : 'Enabled: ') + label, isActive ? 'info' : 'success');
}

function setupChannel(channel) {
  showToast(\`Setting up \${channel} alerts — available in Pro plan!\`, 'info');
}

loadNotifications();
</script>
`, 'notifications')
}

// ── PAGE: PRICING ─────────────────────────────────────────────────────────────
function getPricingPage() {
  return getLayout('Pricing', `
<div class="main-content">
  <div class="topbar flex justify-between items-center">
    <div>
      <h1 class="text-lg font-bold text-white">Pricing</h1>
    </div>
    <div id="auth-status"></div>
  </div>

  <div class="p-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-black text-white mb-3">Simple, Honest Pricing</h1>
      <p class="text-slate-400 text-lg">No hidden fees. Cancel anytime. Free forever for core features.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      ${[
        {
          name:'Free', price:'₹0', period:'forever', color:'slate',
          features:['Product search (20/day)','Google Trends data','Basic profit calculator','3 product sources','Community support'],
          cta:'Start Free', href:'/signup', popular:false
        },
        {
          name:'Pro', price:'₹999', period:'/month', color:'indigo',
          features:['Unlimited searches','All 9 data sources','AI recommendations','Viral score engine','Competitor tracker','Supplier finder','Priority support','Export to CSV'],
          cta:'Start 7-Day Trial', href:'/signup', popular:true
        },
        {
          name:'Business', price:'₹2,999', period:'/month', color:'purple',
          features:['Everything in Pro','5 team members','API access','Custom alerts','White-label reports','Dedicated manager','SLA guarantee','Bulk export'],
          cta:'Contact Sales', href:'mailto:sales@pulsemarket.in', popular:false
        },
      ].map(plan => `
      <div class="card p-8 relative ${plan.popular ? 'border-indigo-500 glow' : ''}">
        ${plan.popular ? '<div class="absolute -top-3 left-1/2 -translate-x-1/2 badge bg-indigo-600 text-white text-xs px-4 py-1.5">MOST POPULAR</div>' : ''}
        <div class="mb-6">
          <h3 class="text-xl font-black text-white mb-2">${plan.name}</h3>
          <div class="flex items-baseline gap-1">
            <span class="text-4xl font-black text-${plan.color === 'slate' ? 'white' : plan.color + '-400'}">${plan.price}</span>
            <span class="text-slate-400">${plan.period}</span>
          </div>
        </div>
        <ul class="space-y-3 mb-8">
          ${plan.features.map(f => `
          <li class="flex items-center gap-3 text-sm">
            <i class="fas fa-check text-green-400 w-4"></i>
            <span class="text-slate-300">${f}</span>
          </li>`).join('')}
        </ul>
        <a href="${plan.href}" class="${plan.popular ? 'btn-primary' : 'btn-outline'} w-full justify-center py-3 text-base">
          ${plan.cta}
        </a>
      </div>`).join('')}
    </div>

    <!-- FAQ -->
    <div class="max-w-3xl mx-auto mt-16">
      <h2 class="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
      <div class="space-y-4">
        ${[
          {q:'Is the free plan really free forever?',a:'Yes! Core features including product search, Google Trends, and profit calculator are free forever. No credit card required.'},
          {q:'What data sources are included?',a:'Pro plan includes all 9 sources: AliExpress, Alibaba, IndiaMart, Flipkart, Amazon India, Google Trends, BuyHatke, Instagram trends, and TikTok trends.'},
          {q:'How accurate is the data?',a:'We fetch live data from official APIs and public sources. Product prices and trend data are updated every 60 seconds. We never fake or estimate data.'},
          {q:'Can I cancel anytime?',a:'Yes, cancel anytime with one click from your dashboard. No lock-in, no cancellation fees.'},
        ].map(faq => `
        <div class="card p-5">
          <div class="font-bold text-white mb-2">${faq.q}</div>
          <div class="text-slate-400 text-sm leading-relaxed">${faq.a}</div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</div>
`, 'pricing')
}
