const puppeteer = require('puppeteer');

class URLAnalyzer {
    async analyzeURL(url) {
        let browser;
        
        try {
            // Launch browser
            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            
            // Set viewport and user agent
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
            
            // Navigate to URL with timeout
            await page.goto(url, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });
            
            // Detect patterns
            const patterns = [];
            
            // 1. Check for pre-checked boxes (sneak into basket)
            const preCheckedBoxes = await page.$$eval('input[type="checkbox"][checked], input[type="checkbox"]:checked', 
                elements => elements.length
            ).catch(() => 0);
            
            if (preCheckedBoxes > 0) {
                patterns.push({
                    category: 'dark',
                    type: 'sneak_into_basket',
                    confidence: 0.9,
                    evidence: `Found ${preCheckedBoxes} pre-checked checkbox(es)`,
                    location: 'Form inputs'
                });
            }
            
            // 2. Check for countdown timers (urgency messaging)
            const urgencyKeywords = ['countdown', 'timer', 'expires', 'limited time', 'hurry', 'ending soon'];
            const bodyText = await page.evaluate(() => document.body.textContent.toLowerCase());

            const hasUrgency = urgencyKeywords.some(keyword => bodyText.includes(keyword));
            
            if (hasUrgency) {
                patterns.push({
                    category: 'grey',
                    type: 'urgency_messaging',
                    confidence: 0.7,
                    evidence: 'Urgency-inducing language detected',
                    location: 'Page content'
                });
            }
            
            // 3. Check for confirmshaming
            const confirmShamingPhrases = [
                'no thanks', 'no, i hate', 'i don\'t want', 'miss out', 
                'i\'ll pay full price', 'no, i prefer'
            ];
            const buttons = await page.$$eval('button, a, input[type="button"], input[type="submit"]', 
                elements => elements.map(el => el.textContent.toLowerCase())
            ).catch(() => []);
            
            const hasConfirmshaming = buttons.some(text => 
                confirmShamingPhrases.some(phrase => text.includes(phrase))
            );
            
            if (hasConfirmshaming) {
                patterns.push({
                    category: 'dark',
                    type: 'confirmshaming',
                    confidence: 0.95,
                    evidence: 'Guilt-tripping decline language found',
                    location: 'Buttons/CTAs'
                });
            }
            
            // 4. Check for hidden costs
            const priceElements = await page.$$eval('.price, .cost, [class*="price"], [class*="cost"]', 
                elements => elements.length
            ).catch(() => 0);
            const checkoutPrices = await page.$$eval('.checkout .price, .cart .price, [class*="checkout"] .price', 
                elements => elements.length
            ).catch(() => 0);
            
            if (checkoutPrices > priceElements && priceElements > 0) {
                patterns.push({
                    category: 'dark',
                    type: 'hidden_costs',
                    confidence: 0.8,
                    evidence: 'Additional prices appear in checkout',
                    location: 'Checkout/Cart'
                });
            }

            
            // 5. Check for difficult unsubscribe (roach motel)
            const unsubscribeLinks = await page.$$eval('a[href*="unsubscribe"]', 
                elements => elements.length
            ).catch(() => 0);
            const cancelLinks = await page.$$eval('a[href*="cancel"], button', 
                elements => elements.filter(el => el.textContent.toLowerCase().includes('cancel')).length
            ).catch(() => 0);
            
            if (unsubscribeLinks === 0 && cancelLinks === 0) {
                const hasSubscription = bodyText.includes('subscription') || bodyText.includes('subscribe');
                if (hasSubscription) {
                    patterns.push({
                        category: 'dark',
                        type: 'roach_motel',
                        confidence: 0.75,
                        evidence: 'No visible unsubscribe/cancel option found',
                        location: 'Navigation/Footer'
                    });
                }
            }
            
            // 6. Check for fake scarcity
            const scarcityPhrases = ['only', 'left in stock', 'selling fast', 'almost gone'];
            const hasScarcity = scarcityPhrases.some(phrase => bodyText.includes(phrase));
            
            if (hasScarcity) {
                patterns.push({
                    category: 'grey',
                    type: 'urgency_messaging',
                    confidence: 0.65,
                    evidence: 'Scarcity messaging detected',
                    location: 'Product pages'
                });
            }
            
            // 7. Check for social proof
            const socialProofPhrases = ['people bought', 'customers love', 'reviews', 'ratings'];
            const hasSocialProof = socialProofPhrases.some(phrase => bodyText.includes(phrase));
            
            if (hasSocialProof) {
                const hasVerification = bodyText.includes('verified') || bodyText.includes('authentic');
                patterns.push({
                    category: hasVerification ? 'white' : 'grey',
                    type: hasVerification ? 'verified_social_proof' : 'social_proof_unverified',
                    confidence: 0.6,
                    evidence: hasVerification ? 'Verified social proof found' : 'Unverified social proof detected',
                    location: 'Product/Service pages'
                });
            }

            
            // 8. Check for clear pricing (white pattern)
            const hasPricing = priceElements > 0;
            const hasBreakdown = bodyText.includes('total') && bodyText.includes('shipping');
            
            if (hasPricing && hasBreakdown) {
                patterns.push({
                    category: 'white',
                    type: 'clear_pricing',
                    confidence: 0.8,
                    evidence: 'Clear price breakdown visible',
                    location: 'Product/Checkout pages'
                });
            }
            
            // 9. Check for cookie consent
            const cookieBanner = await page.$('[class*="cookie"], [id*="cookie"], [class*="consent"]');
            if (cookieBanner) {
                const cookieText = await page.evaluate(el => el?.textContent || '', cookieBanner);
                const hasRejectAll = cookieText.toLowerCase().includes('reject all');
                const hasAcceptAll = cookieText.toLowerCase().includes('accept all');
                
                if (hasAcceptAll && !hasRejectAll) {
                    patterns.push({
                        category: 'grey',
                        type: 'obstruction',
                        confidence: 0.7,
                        evidence: 'Cookie banner lacks clear reject option',
                        location: 'Cookie consent banner'
                    });
                } else if (hasRejectAll && hasAcceptAll) {
                    patterns.push({
                        category: 'white',
                        type: 'explicit_consent',
                        confidence: 0.85,
                        evidence: 'Clear cookie consent options provided',
                        location: 'Cookie consent banner'
                    });
                }
            }
            
            // 10. Check for clear navigation
            const navLinks = await page.$$eval('nav a, header a, [role="navigation"] a', 
                elements => elements.length
            ).catch(() => 0);
            
            if (navLinks > 5) {
                patterns.push({
                    category: 'white',
                    type: 'clear_navigation',
                    confidence: 0.75,
                    evidence: 'Clear navigation structure present',
                    location: 'Header/Navigation'
                });
            }

            
            // Get page metadata
            const title = await page.title();
            const description = await page.$eval('meta[name="description"]', 
                el => el.content
            ).catch(() => 'No description');
            
            return {
                patterns,
                metadata: {
                    title,
                    description,
                    url,
                    analyzedElements: {
                        checkboxes: preCheckedBoxes,
                        priceElements,
                        navigationLinks: navLinks
                    }
                },
                summary: {
                    totalPatterns: patterns.length,
                    darkPatterns: patterns.filter(p => p.category === 'dark').length,
                    greyPatterns: patterns.filter(p => p.category === 'grey').length,
                    whitePatterns: patterns.filter(p => p.category === 'white').length
                }
            };
            
        } catch (error) {
            console.error('URL analysis error:', error);
            throw new Error(`Failed to analyze URL: ${error.message}`);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}

module.exports = new URLAnalyzer();
