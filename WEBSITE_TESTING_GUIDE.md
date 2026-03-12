# Website Testing Guide for Dark Pattern Detector

## Overview
This guide helps you test the Dark Pattern Detector with various websites to verify accuracy and identify areas for improvement.

## Prerequisites

1. **Backend must be running**:
   ```bash
   cd backend
   npm install  # (if not already done)
   npm start
   ```

2. **Verify backend is running**:
   - Open browser to: http://localhost:3000/health
   - Should see: `{"status":"ok","message":"Dark Pattern Detector API is running"}`

## Testing Methods

### Method 1: Automated Testing Script

Run the automated test script:

```bash
node test-websites.js
```

This will test 5 different websites and provide detailed results.

### Method 2: Manual Testing via Frontend

1. Open `index.html` in your browser (or run `start-frontend.bat`)
2. Enter a URL in the input field
3. Click "Analyze"
4. Review the results

### Method 3: Direct API Testing

Use curl or Postman to test the API directly:

```bash
curl -X POST http://localhost:3000/api/analyze-url \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://example.com\"}"
```

## Test Websites by Category

### 1. Clean Websites (Expected: Mostly White Patterns)

| Website | URL | Why Test |
|---------|-----|----------|
| Example.com | https://example.com | Minimal, clean design |
| Wikipedia | https://wikipedia.org | Non-profit, transparent |
| MDN Web Docs | https://developer.mozilla.org | Educational, no commerce |

**Expected Results**:
- Few or no dark patterns
- High white pattern count
- Clear pricing/navigation patterns
- PES Score: 70-100

### 2. E-Commerce Sites (Expected: Grey/Dark Patterns)

| Website | URL | Why Test |
|---------|-----|----------|
| Amazon | https://amazon.com | Large e-commerce, complex UX |
| eBay | https://ebay.com | Auction site with urgency |
| AliExpress | https://aliexpress.com | International marketplace |

**Expected Results**:
- Urgency messaging ("Only 2 left!")
- Social proof ("1000+ bought this")
- Hidden costs (shipping at checkout)
- Pre-selected options
- PES Score: 30-60

### 3. Travel/Booking Sites (Expected: High Grey Patterns)

| Website | URL | Why Test |
|---------|-----|----------|
| Booking.com | https://booking.com | Known for urgency tactics |
| Expedia | https://expedia.com | Travel booking with timers |
| Airbnb | https://airbnb.com | Peer-to-peer booking |

**Expected Results**:
- Countdown timers
- "X people viewing this"
- Scarcity messaging
- Complex pricing
- PES Score: 20-50

### 4. Social Media (Expected: Mixed Patterns)

| Website | URL | Why Test |
|---------|-----|----------|
| LinkedIn | https://linkedin.com | Professional network |
| Twitter/X | https://twitter.com | Social platform |
| Facebook | https://facebook.com | Social network |

**Expected Results**:
- Nagging (notifications)
- Privacy concerns
- Default options
- Obstruction (settings)
- PES Score: 40-70

### 5. News/Media Sites (Expected: Grey Patterns)

| Website | URL | Why Test |
|---------|-----|----------|
| CNN | https://cnn.com | News with ads |
| Medium | https://medium.com | Content platform |
| YouTube | https://youtube.com | Video platform |

**Expected Results**:
- Disguised ads
- Nagging (subscribe popups)
- Obstruction (cookie walls)
- PES Score: 40-65

## What to Look For

### 1. Consistency
- ✅ Same URL should give same results
- ✅ Similar sites should have similar patterns
- ❌ Random results each time = problem

### 2. Accuracy
Compare detected patterns with manual inspection:
- Open the website in browser
- Look for the patterns the tool detected
- Verify they actually exist

### 3. False Positives
- Tool detects pattern that doesn't exist
- Example: Flags "urgency" but no countdown/scarcity present

### 4. False Negatives  
- Tool misses obvious patterns
- Example: Clear pre-checked box not detected

### 5. Confidence Scores
- High confidence (>0.8) should be accurate
- Low confidence (<0.5) may need verification

## Recording Test Results

Create a spreadsheet or document with:

| Website | URL | Dark | Grey | White | PES Score | Notes |
|---------|-----|------|------|-------|-----------|-------|
| Amazon | amazon.com | 3 | 5 | 2 | 42 | Detected urgency correctly |
| Wikipedia | wikipedia.org | 0 | 1 | 7 | 88 | Accurate, clean site |

## Common Issues & Solutions

### Issue: "Cannot connect to backend"
**Solution**: Make sure backend is running on port 3000

### Issue: Analysis takes too long (>30 seconds)
**Solution**: 
- JavaScript-heavy sites need more time
- Increase timeout in `backend/analyzers/url-analyzer.js`

### Issue: "Navigation timeout" error
**Solution**:
- Site may be blocking automated access
- Try a different URL
- Check if site requires login

### Issue: No patterns detected on obvious dark pattern site
**Solution**:
- Detection rules may need improvement
- Check `backend/analyzers/url-analyzer.js`
- Add more specific detection logic

## Improving Detection Accuracy

### 1. Add More Detection Rules

Edit `backend/analyzers/url-analyzer.js`:

```javascript
// Example: Detect "limited time" messaging
const limitedTimeText = text.toLowerCase();
if (limitedTimeText.includes('limited time') || 
    limitedTimeText.includes('expires soon')) {
    patterns.push({
        category: 'grey',
        type: 'urgency_messaging',
        confidence: 0.8,
        evidence: 'Limited time language detected',
        location: 'Page content'
    });
}
```

### 2. Adjust Confidence Scores

Based on testing, adjust confidence values:
- If pattern is always accurate: increase confidence
- If pattern has false positives: decrease confidence

### 3. Add Site-Specific Rules

For known problematic sites:

```javascript
if (url.includes('booking.com')) {
    // Booking.com specific detection
}
```

## Expected Accuracy Benchmarks

Based on initial testing:

| Pattern Type | Expected Accuracy |
|--------------|-------------------|
| Pre-checked boxes | 85-95% |
| Urgency messaging | 70-80% |
| Hidden costs | 60-70% |
| Confirmshaming | 80-90% |
| Social proof | 65-75% |
| Clear pricing | 75-85% |

## Next Steps After Testing

1. **Document findings** in a test report
2. **Identify patterns** that need better detection
3. **Update detection rules** based on results
4. **Re-test** to verify improvements
5. **Build pattern database** of known sites

## Sample Test Report Template

```markdown
# Test Report - [Date]

## Summary
- Total sites tested: X
- Average PES score: X
- Most common pattern: X
- Accuracy rate: X%

## Detailed Results

### Amazon.com
- PES Score: 42
- Patterns detected: 10 (3 dark, 5 grey, 2 white)
- Accuracy: 80%
- Notes: Correctly identified urgency messaging and pre-selected shipping options
- False positives: None
- False negatives: Missed hidden subscription checkbox

### [Next site...]

## Recommendations
1. Improve detection for...
2. Add new pattern type for...
3. Adjust confidence scores for...
```

## Continuous Testing

Set up regular testing:
1. Test weekly with same sites
2. Track accuracy improvements
3. Add new test cases
4. Update detection rules

---

Ready to start testing! Run `node test-websites.js` or open the frontend and start analyzing websites manually.
