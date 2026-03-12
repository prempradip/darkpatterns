// Automated Website Testing Script for Dark Pattern Detector
// Run this after backend is started: node test-websites.js

const testWebsites = [
    {
        name: "Example.com (Clean)",
        url: "https://example.com",
        expectedPatterns: ["white"],
        description: "Simple, clean website with no dark patterns"
    },
    {
        name: "Amazon (E-commerce)",
        url: "https://www.amazon.com",
        expectedPatterns: ["grey", "dark"],
        description: "Large e-commerce site, may have urgency messaging"
    },
    {
        name: "Booking.com (Travel)",
        url: "https://www.booking.com",
        expectedPatterns: ["grey", "dark"],
        description: "Known for urgency messaging and social proof"
    },
    {
        name: "LinkedIn (Social)",
        url: "https://www.linkedin.com",
        expectedPatterns: ["grey"],
        description: "Professional network with some persuasive patterns"
    },
    {
        name: "Wikipedia (Content)",
        url: "https://www.wikipedia.org",
        expectedPatterns: ["white"],
        description: "Non-profit, transparent content site"
    }
];

async function testWebsite(website) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${website.name}`);
    console.log(`URL: ${website.url}`);
    console.log(`Expected: ${website.expectedPatterns.join(', ')} patterns`);
    console.log(`Description: ${website.description}`);
    console.log('='.repeat(60));

    try {
        const response = await fetch('http://localhost:3000/api/analyze-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: website.url })
        });

        const data = await response.json();

        if (data.success) {
            console.log(`\n✅ Analysis completed successfully`);
            console.log(`\nPatterns detected: ${data.patterns.length}`);
            
            const darkCount = data.patterns.filter(p => p.category === 'dark').length;
            const greyCount = data.patterns.filter(p => p.category === 'grey').length;
            const whiteCount = data.patterns.filter(p => p.category === 'white').length;
            
            console.log(`  - Dark patterns: ${darkCount}`);
            console.log(`  - Grey patterns: ${greyCount}`);
            console.log(`  - White patterns: ${whiteCount}`);
            
            if (data.patterns.length > 0) {
                console.log(`\nDetailed patterns:`);
                data.patterns.forEach((pattern, index) => {
                    console.log(`\n  ${index + 1}. [${pattern.category.toUpperCase()}] ${pattern.type}`);
                    console.log(`     Confidence: ${(pattern.confidence * 100).toFixed(0)}%`);
                    console.log(`     Evidence: ${pattern.evidence}`);
                    console.log(`     Location: ${pattern.location}`);
                });
            }
            
            return { success: true, data };
        } else {
            console.log(`\n❌ Analysis failed: ${data.error}`);
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.log(`\n❌ Request failed: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runAllTests() {
    console.log('\n🔍 Dark Pattern Detector - Website Testing Suite');
    console.log('================================================\n');
    console.log(`Testing ${testWebsites.length} websites...`);
    console.log('This may take several minutes.\n');
    
    const results = [];
    
    for (const website of testWebsites) {
        const result = await testWebsite(website);
        results.push({ website: website.name, ...result });
        
        // Wait 2 seconds between tests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Summary
    console.log(`\n\n${'='.repeat(60)}`);
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`\nTotal tests: ${results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
    
    console.log(`\n\nTest completed! ✨`);
}

// Run tests
runAllTests().catch(console.error);
