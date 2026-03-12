const Tesseract = require('tesseract.js');
const sharp = require('sharp');

class ImageAnalyzer {
    async analyzeImage(imageBuffer) {
        try {
            // Preprocess image for better OCR
            const processedImage = await sharp(imageBuffer)
                .resize(2000, null, { withoutEnlargement: true })
                .greyscale()
                .normalize()
                .toBuffer();
            
            // Extract text using OCR
            const { data: { text } } = await Tesseract.recognize(
                processedImage,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                        }
                    }
                }
            );
            
            console.log('Extracted text length:', text.length);
            
            const patterns = [];
            const textLower = text.toLowerCase();
            
            // 1. Check for confirmshaming
            const confirmShamingPhrases = [
                'no thanks',
                'no, i hate',
                'i don\'t want',
                'miss out',
                'i\'ll pay full price',
                'no, i prefer'
            ];
            
            const foundConfirmshaming = confirmShamingPhrases.filter(phrase => 
                textLower.includes(phrase)
            );
            
            if (foundConfirmshaming.length > 0) {
                patterns.push({
                    category: 'dark',
                    type: 'confirmshaming',
                    confidence: 0.9,
                    evidence: `Found guilt-tripping language: "${foundConfirmshaming[0]}"`,
                    location: 'Button/CTA text'
                });
            }
            
            // 2. Check for urgency messaging
            const urgencyPhrases = [
                'limited time',
                'expires',
                'hurry',
                'only',
                'left',
                'ending soon',
                'last chance',
                'selling fast'
            ];
            
            const foundUrgency = urgencyPhrases.filter(phrase => 
                textLower.includes(phrase)
            );
            
            if (foundUrgency.length > 0) {
                patterns.push({
                    category: 'grey',
                    type: 'urgency_messaging',
                    confidence: 0.75,
                    evidence: `Urgency language detected: "${foundUrgency.join(', ')}"`,
                    location: 'Page content'
                });
            }
            
            // 3. Check for hidden costs indicators
            const costKeywords = ['additional fee', 'extra charge', 'handling fee', 'service charge'];
            const foundCosts = costKeywords.filter(keyword => textLower.includes(keyword));
            
            if (foundCosts.length > 0) {
                patterns.push({
                    category: 'dark',
                    type: 'hidden_costs',
                    confidence: 0.7,
                    evidence: `Additional costs mentioned: "${foundCosts[0]}"`,
                    location: 'Pricing section'
                });
            }
            
            // 4. Check for subscription/cancellation language
            const hasSubscription = textLower.includes('subscription') || textLower.includes('subscribe');
            const hasCancel = textLower.includes('cancel') || textLower.includes('unsubscribe');
            
            if (hasSubscription && !hasCancel) {
                patterns.push({
                    category: 'dark',
                    type: 'forced_continuity',
                    confidence: 0.65,
                    evidence: 'Subscription mentioned without clear cancellation option',
                    location: 'Subscription section'
                });
            }
            
            // 5. Check for pre-checked/default options
            const defaultPhrases = ['pre-selected', 'automatically enrolled', 'default option'];
            const foundDefaults = defaultPhrases.filter(phrase => textLower.includes(phrase));
            
            if (foundDefaults.length > 0) {
                patterns.push({
                    category: 'grey',
                    type: 'default_options',
                    confidence: 0.7,
                    evidence: `Default selection detected: "${foundDefaults[0]}"`,
                    location: 'Form/Options'
                });
            }
            
            // 6. Check for social proof
            const socialProofPhrases = [
                'people bought',
                'customers',
                'reviews',
                'ratings',
                'testimonials'
            ];
            
            const foundSocialProof = socialProofPhrases.filter(phrase => 
                textLower.includes(phrase)
            );
            
            if (foundSocialProof.length > 0) {
                const hasVerified = textLower.includes('verified') || textLower.includes('authentic');
                patterns.push({
                    category: hasVerified ? 'white' : 'grey',
                    type: hasVerified ? 'verified_social_proof' : 'social_proof_unverified',
                    confidence: 0.6,
                    evidence: hasVerified ? 'Verified social proof found' : 'Unverified social proof detected',
                    location: 'Social proof section'
                });
            }
            
            // 7. Check for clear pricing (white pattern)
            const pricingKeywords = ['total', 'price', 'cost', '$', '€', '£'];
            const hasPricing = pricingKeywords.some(keyword => text.includes(keyword));
            const hasBreakdown = textLower.includes('breakdown') || 
                                (textLower.includes('shipping') && textLower.includes('tax'));
            
            if (hasPricing && hasBreakdown) {
                patterns.push({
                    category: 'white',
                    type: 'clear_pricing',
                    confidence: 0.75,
                    evidence: 'Clear price breakdown visible',
                    location: 'Pricing section'
                });
            }
            
            // 8. Check for privacy/data language
            const privacyKeywords = ['privacy', 'data', 'personal information', 'cookies'];
            const hasPrivacy = privacyKeywords.some(keyword => textLower.includes(keyword));
            
            if (hasPrivacy) {
                const hasTransparency = textLower.includes('we collect') || 
                                       textLower.includes('we use') ||
                                       textLower.includes('you can');
                patterns.push({
                    category: hasTransparency ? 'white' : 'grey',
                    type: hasTransparency ? 'transparent_data_usage' : 'obstruction',
                    confidence: 0.65,
                    evidence: hasTransparency ? 'Clear data usage explanation' : 'Vague privacy language',
                    location: 'Privacy section'
                });
            }
            
            // 9. Check for trick questions/double negatives
            const trickPhrases = [
                'do not uncheck',
                'uncheck to not',
                'opt-out by not',
                'disable by unchecking'
            ];
            
            const foundTricks = trickPhrases.filter(phrase => textLower.includes(phrase));
            
            if (foundTricks.length > 0) {
                patterns.push({
                    category: 'dark',
                    type: 'trick_questions',
                    confidence: 0.85,
                    evidence: `Confusing double-negative found: "${foundTricks[0]}"`,
                    location: 'Form/Consent'
                });
            }
            
            // 10. Check for clear CTAs (white pattern)
            const ctaKeywords = ['buy now', 'add to cart', 'subscribe', 'sign up', 'get started'];
            const hasCTA = ctaKeywords.some(keyword => textLower.includes(keyword));
            
            if (hasCTA) {
                const hasCancel = textLower.includes('cancel anytime') || 
                                 textLower.includes('no commitment');
                if (hasCancel) {
                    patterns.push({
                        category: 'white',
                        type: 'easy_cancellation',
                        confidence: 0.8,
                        evidence: 'Clear cancellation terms mentioned',
                        location: 'CTA section'
                    });
                }
            }
            
            // Get image metadata
            const metadata = await sharp(imageBuffer).metadata();
            
            return {
                patterns,
                metadata: {
                    width: metadata.width,
                    height: metadata.height,
                    format: metadata.format,
                    textLength: text.length,
                    extractedText: text.substring(0, 500) // First 500 chars for reference
                },
                summary: {
                    totalPatterns: patterns.length,
                    darkPatterns: patterns.filter(p => p.category === 'dark').length,
                    greyPatterns: patterns.filter(p => p.category === 'grey').length,
                    whitePatterns: patterns.filter(p => p.category === 'white').length
                }
            };
            
        } catch (error) {
            console.error('Image analysis error:', error);
            throw new Error(`Failed to analyze image: ${error.message}`);
        }
    }
}

module.exports = new ImageAnalyzer();
