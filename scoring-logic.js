// Pattern Ethics Score (PES) System
// Classifies patterns into White, Grey, and Dark categories

const PATTERN_CATEGORIES = {
    WHITE: 'white',
    GREY: 'grey',
    DARK: 'dark'
};

// 6 Core Scoring Dimensions (0-5 scale) with Weights
const SCORING_DIMENSIONS = {
    TRANSPARENCY: {
        key: 'transparency',
        name: 'Transparency',
        description: 'Are intentions clear?',
        examples: ['Hidden fees', 'Vague copy', 'Unclear terms'],
        weight: 0.20
    },
    USER_CONTROL: {
        key: 'user_control',
        name: 'User Control',
        description: 'Can users easily opt-out/reverse?',
        examples: ['Hard unsubscribe', 'No cancel button', 'Account deletion barriers'],
        weight: 0.20
    },
    INTENT_ALIGNMENT: {
        key: 'intent_alignment',
        name: 'Intent Alignment',
        description: 'Is design aligned to user goals?',
        examples: ['Misleading CTAs', 'Deceptive buttons', 'Confusing flows'],
        weight: 0.15
    },
    FRICTION_FAIRNESS: {
        key: 'friction_fairness',
        name: 'Friction Fairness',
        description: 'Is friction used ethically?',
        examples: ['Forced account creation', 'Unnecessary steps', 'Artificial delays'],
        weight: 0.15
    },
    DATA_ETHICS: {
        key: 'data_ethics',
        name: 'Data Ethics',
        description: 'Is data collection fair & consented?',
        examples: ['Pre-ticked consent', 'Hidden data collection', 'Unclear privacy'],
        weight: 0.20
    },
    COGNITIVE_LOAD: {
        key: 'cognitive_load',
        name: 'Cognitive Load',
        description: 'Is confusion intentionally created?',
        examples: ['Visual misdirection', 'Trick questions', 'Complex language'],
        weight: 0.10
    }
};

// Rating Scale (0-5)
const RATING_SCALE = {
    0: { label: 'Strong dark pattern', category: 'dark', severity: 'critical' },
    1: { label: 'Clear dark behavior', category: 'dark', severity: 'high' },
    2: { label: 'Grey leaning dark', category: 'grey', severity: 'medium' },
    3: { label: 'Neutral / acceptable', category: 'grey', severity: 'low' },
    4: { label: 'Ethical but improvable', category: 'white', severity: 'none' },
    5: { label: 'Strong white pattern', category: 'white', severity: 'none' }
};

// Score Interpretation (0-100 scale)
const SCORE_INTERPRETATION = {
    ranges: [
        {
            min: 80,
            max: 100,
            category: 'white',
            label: '⚪ White Pattern',
            meaning: 'Ethical & user-first',
            description: 'This design demonstrates strong ethical practices with transparent user interactions and respect for user autonomy.',
            color: '#10b981',
            bgColor: '#f0fdf4'
        },
        {
            min: 60,
            max: 79,
            category: 'light_grey',
            label: '🩶 Light Grey',
            meaning: 'Mostly fair, minor concerns',
            description: 'The design is generally ethical with some areas that could be more transparent or user-friendly.',
            color: '#6b7280',
            bgColor: '#f9fafb'
        },
        {
            min: 40,
            max: 59,
            category: 'grey',
            label: '🩶 Grey',
            meaning: 'Questionable persuasion',
            description: 'This design contains persuasive patterns that may not fully align with user interests. Review recommended.',
            color: '#f59e0b',
            bgColor: '#fffbeb'
        },
        {
            min: 20,
            max: 39,
            category: 'dark_grey',
            label: '⚫ Dark Grey',
            meaning: 'Manipulative elements present',
            description: 'Multiple manipulative patterns detected that may mislead users. Significant improvements needed.',
            color: '#f97316',
            bgColor: '#fff7ed'
        },
        {
            min: 0,
            max: 19,
            category: 'dark',
            label: '⚫ Dark Pattern',
            meaning: 'Highly deceptive design',
            description: 'This design heavily relies on dark patterns that exploit and deceive users. Immediate redesign required.',
            color: '#ef4444',
            bgColor: '#fef2f2'
        }
    ],
    
    getInterpretation: function(score) {
        for (let range of this.ranges) {
            if (score >= range.min && score <= range.max) {
                return range;
            }
        }
        return this.ranges[this.ranges.length - 1]; // Default to dark pattern
    }
};

// Critical Dark Pattern Flags (Boolean triggers)
// These patterns are so severe they override the score interpretation
const CRITICAL_FLAGS = {
    patterns: [
        'hidden_costs',
        'forced_continuity',
        'disguised_ads',
        'roach_motel',
        'confirmshaming',
        'sneak_into_basket',
        'trick_questions',
        'privacy_zuckering'
    ],
    
    override: {
        category: 'dark',
        label: '⚫ Dark Pattern',
        meaning: 'Critical violations detected',
        description: 'CRITICAL: Severe dark patterns detected that exploit users regardless of overall score. These patterns violate user trust and may breach regulations. Immediate action required.',
        color: '#ef4444',
        bgColor: '#fef2f2',
        isCritical: true
    },
    
    checkCriticalFlags: function(detectedPatterns) {
        const criticalDetected = [];
        
        detectedPatterns.forEach(pattern => {
            if (pattern.category === 'dark' && this.patterns.includes(pattern.type)) {
                criticalDetected.push({
                    type: pattern.type,
                    name: PATTERN_DEFINITIONS.dark[pattern.type].description
                });
            }
        });
        
        return criticalDetected;
    },
    
    shouldOverride: function(detectedPatterns) {
        return this.checkCriticalFlags(detectedPatterns).length > 0;
    }
};

// Pattern definitions mapped to 6 dimensions with 0-5 ratings
const PATTERN_DEFINITIONS = {
    // DARK PATTERNS (Rating 0-1)
    dark: {
        hidden_costs: {
            dimensions: {
                transparency: 0,
                user_control: 2,
                intent_alignment: 1,
                friction_fairness: 3,
                data_ethics: 4,
                cognitive_load: 2
            },
            description: 'Fees revealed only at checkout',
            examples: ['Hidden shipping costs', 'Surprise taxes', 'Mandatory service fees']
        },
        forced_continuity: {
            dimensions: {
                transparency: 1,
                user_control: 0,
                intent_alignment: 1,
                friction_fairness: 0,
                data_ethics: 3,
                cognitive_load: 2
            },
            description: 'Difficult to cancel subscriptions',
            examples: ['No online cancellation', 'Phone-only cancellation', 'Hidden unsubscribe']
        },
        sneak_into_basket: {
            dimensions: {
                transparency: 0,
                user_control: 1,
                intent_alignment: 0,
                friction_fairness: 2,
                data_ethics: 3,
                cognitive_load: 1
            },
            description: 'Items added without explicit consent',
            examples: ['Pre-checked add-ons', 'Auto-added insurance', 'Bundled products']
        },
        confirmshaming: {
            dimensions: {
                transparency: 2,
                user_control: 2,
                intent_alignment: 0,
                friction_fairness: 1,
                data_ethics: 4,
                cognitive_load: 0
            },
            description: 'Guilt-tripping decline options',
            examples: ['"No, I hate saving money"', 'Shame-based opt-out text']
        },
        disguised_ads: {
            dimensions: {
                transparency: 0,
                user_control: 3,
                intent_alignment: 0,
                friction_fairness: 3,
                data_ethics: 4,
                cognitive_load: 1
            },
            description: 'Ads disguised as content',
            examples: ['Fake download buttons', 'Sponsored content without labels']
        },
        trick_questions: {
            dimensions: {
                transparency: 1,
                user_control: 2,
                intent_alignment: 0,
                friction_fairness: 2,
                data_ethics: 2,
                cognitive_load: 0
            },
            description: 'Confusing double-negative wording',
            examples: ['Uncheck to not opt-out', 'Confusing consent language']
        },
        roach_motel: {
            dimensions: {
                transparency: 1,
                user_control: 0,
                intent_alignment: 1,
                friction_fairness: 0,
                data_ethics: 3,
                cognitive_load: 1
            },
            description: 'Easy to get in, hard to get out',
            examples: ['Complex account deletion', 'Buried settings', 'Multi-step opt-out']
        },
        privacy_zuckering: {
            dimensions: {
                transparency: 0,
                user_control: 1,
                intent_alignment: 0,
                friction_fairness: 2,
                data_ethics: 0,
                cognitive_load: 1
            },
            description: 'Tricked into sharing more data than intended',
            examples: ['Deceptive privacy settings', 'Hidden data collection']
        }
    },
    
    // GREY PATTERNS (Rating 2-3)
    grey: {
        urgency_messaging: {
            dimensions: {
                transparency: 2,
                user_control: 3,
                intent_alignment: 2,
                friction_fairness: 3,
                data_ethics: 4,
                cognitive_load: 2
            },
            description: 'Time pressure without verification',
            examples: ['Countdown timers', '"Only 2 left"', 'Limited time offers']
        },
        social_proof_unverified: {
            dimensions: {
                transparency: 2,
                user_control: 4,
                intent_alignment: 2,
                friction_fairness: 4,
                data_ethics: 4,
                cognitive_load: 3
            },
            description: 'Unverified testimonials or user counts',
            examples: ['"1000+ bought today"', 'Fake reviews', 'Inflated numbers']
        },
        default_options: {
            dimensions: {
                transparency: 3,
                user_control: 2,
                intent_alignment: 3,
                friction_fairness: 3,
                data_ethics: 2,
                cognitive_load: 3
            },
            description: 'Pre-selected options that benefit business',
            examples: ['Newsletter opt-in', 'Marketing emails', 'Data sharing']
        },
        complex_pricing: {
            dimensions: {
                transparency: 2,
                user_control: 3,
                intent_alignment: 2,
                friction_fairness: 3,
                data_ethics: 4,
                cognitive_load: 2
            },
            description: 'Confusing pricing structures',
            examples: ['Multiple tiers', 'Hidden limitations', 'Unclear billing cycles']
        },
        nagging: {
            dimensions: {
                transparency: 3,
                user_control: 2,
                intent_alignment: 3,
                friction_fairness: 2,
                data_ethics: 4,
                cognitive_load: 2
            },
            description: 'Repeated interruptions for actions',
            examples: ['Persistent popups', 'Review requests', 'App install prompts']
        },
        obstruction: {
            dimensions: {
                transparency: 2,
                user_control: 2,
                intent_alignment: 2,
                friction_fairness: 2,
                data_ethics: 4,
                cognitive_load: 3
            },
            description: 'Making desired actions harder',
            examples: ['Buried unsubscribe', 'Complex cookie settings', 'Hidden options']
        },
        intermediate_currency: {
            dimensions: {
                transparency: 2,
                user_control: 3,
                intent_alignment: 3,
                friction_fairness: 3,
                data_ethics: 4,
                cognitive_load: 2
            },
            description: 'Using points/credits instead of real money',
            examples: ['Gems', 'Coins', 'Credits', 'Points systems']
        }
    },
    
    // WHITE PATTERNS (Rating 4-5)
    white: {
        clear_pricing: {
            dimensions: {
                transparency: 5,
                user_control: 4,
                intent_alignment: 5,
                friction_fairness: 4,
                data_ethics: 5,
                cognitive_load: 5
            },
            description: 'All costs shown upfront',
            examples: ['Total price visible', 'No hidden fees', 'Clear breakdown']
        },
        easy_cancellation: {
            dimensions: {
                transparency: 5,
                user_control: 5,
                intent_alignment: 5,
                friction_fairness: 5,
                data_ethics: 4,
                cognitive_load: 5
            },
            description: 'Simple, accessible cancellation',
            examples: ['One-click cancel', 'Clear cancel button', 'No retention dark patterns']
        },
        explicit_consent: {
            dimensions: {
                transparency: 5,
                user_control: 5,
                intent_alignment: 5,
                friction_fairness: 4,
                data_ethics: 5,
                cognitive_load: 5
            },
            description: 'Clear opt-in with unchecked defaults',
            examples: ['Unchecked boxes', 'Clear language', 'Separate consents']
        },
        transparent_data_usage: {
            dimensions: {
                transparency: 5,
                user_control: 5,
                intent_alignment: 5,
                friction_fairness: 4,
                data_ethics: 5,
                cognitive_load: 4
            },
            description: 'Clear privacy policies and data practices',
            examples: ['Plain language privacy', 'Data dashboard', 'Export options']
        },
        honest_urgency: {
            dimensions: {
                transparency: 5,
                user_control: 4,
                intent_alignment: 4,
                friction_fairness: 4,
                data_ethics: 5,
                cognitive_load: 4
            },
            description: 'Genuine scarcity or time limits',
            examples: ['Real inventory counts', 'Actual sale end dates']
        },
        verified_social_proof: {
            dimensions: {
                transparency: 5,
                user_control: 4,
                intent_alignment: 4,
                friction_fairness: 4,
                data_ethics: 5,
                cognitive_load: 4
            },
            description: 'Verified reviews and testimonials',
            examples: ['Verified purchase badges', 'Third-party reviews', 'Real statistics']
        },
        clear_navigation: {
            dimensions: {
                transparency: 5,
                user_control: 5,
                intent_alignment: 5,
                friction_fairness: 5,
                data_ethics: 4,
                cognitive_load: 5
            },
            description: 'Easy to find settings and options',
            examples: ['Visible settings', 'Clear menu structure', 'Search functionality']
        },
        progressive_disclosure: {
            dimensions: {
                transparency: 5,
                user_control: 4,
                intent_alignment: 5,
                friction_fairness: 4,
                data_ethics: 4,
                cognitive_load: 5
            },
            description: 'Information revealed at appropriate times',
            examples: ['Contextual help', 'Tooltips', 'Clear onboarding']
        }
    }
};

// Calculate Pattern Ethics Score (PES) using weighted 6-dimensional model
function calculatePES(detectedPatterns) {
    // Initialize dimension scores (each starts at 5 - perfect score)
    const dimensionScores = {};
    Object.values(SCORING_DIMENSIONS).forEach(dim => {
        dimensionScores[dim.key] = {
            score: 5,
            name: dim.name,
            description: dim.description,
            weight: dim.weight,
            patterns: [],
            ratings: []
        };
    });
    
    let darkCount = 0;
    let greyCount = 0;
    let whiteCount = 0;
    
    // Process detected patterns and calculate dimension scores
    detectedPatterns.forEach(pattern => {
        const category = pattern.category;
        const patternType = pattern.type;
        
        // Debug logging
        console.log('Processing pattern:', { category, type: patternType });
        
        const patternDef = PATTERN_DEFINITIONS[category]?.[patternType];
        
        if (!patternDef) {
            console.warn(`Pattern definition not found for: ${category}.${patternType}`);
            return;
        }
        
        // Count patterns by category
        if (category === PATTERN_CATEGORIES.DARK) darkCount++;
        else if (category === PATTERN_CATEGORIES.GREY) greyCount++;
        else if (category === PATTERN_CATEGORIES.WHITE) whiteCount++;
        
        // Update each dimension score based on pattern ratings
        Object.keys(patternDef.dimensions).forEach(dimKey => {
            const rating = patternDef.dimensions[dimKey];
            
            if (dimensionScores[dimKey]) {
                dimensionScores[dimKey].ratings.push(rating);
                dimensionScores[dimKey].patterns.push({
                    type: patternType,
                    category: category,
                    rating: rating,
                    description: patternDef.description
                });
            }
        });
    });
    
    // Calculate average score for each dimension
    Object.keys(dimensionScores).forEach(dimKey => {
        const ratings = dimensionScores[dimKey].ratings;
        if (ratings.length > 0) {
            const avgRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
            dimensionScores[dimKey].score = avgRating;
        }
    });
    
    // Calculate weighted PES
    // Formula: PES = Σ(Dimension Score × Weight)
    // Final Score = PES × 20 (to convert to 100 scale)
    let weightedPES = 0;
    Object.values(dimensionScores).forEach(dim => {
        weightedPES += dim.score * dim.weight;
    });
    
    // Convert to 100 scale
    const overallScore = Math.round(weightedPES * 20);
    
    // Get score interpretation
    let interpretation = SCORE_INTERPRETATION.getInterpretation(overallScore);
    
    // Check for critical flags and override if necessary
    const criticalFlags = CRITICAL_FLAGS.checkCriticalFlags(detectedPatterns);
    const hasCriticalFlags = criticalFlags.length > 0;
    
    if (hasCriticalFlags) {
        interpretation = {
            ...CRITICAL_FLAGS.override,
            criticalFlags: criticalFlags
        };
    }
    
    // Calculate percentages based on pattern counts
    const totalPatterns = darkCount + greyCount + whiteCount;
    const darkPercentage = totalPatterns > 0 ? Math.round((darkCount / totalPatterns) * 100) : 0;
    const greyPercentage = totalPatterns > 0 ? Math.round((greyCount / totalPatterns) * 100) : 0;
    const whitePercentage = totalPatterns > 0 ? Math.round((whiteCount / totalPatterns) * 100) : 0;
    
    return {
        overallScore,
        weightedPES: parseFloat(weightedPES.toFixed(2)),
        interpretation,
        hasCriticalFlags,
        criticalFlags,
        dimensionScores,
        riskAreas: generateDimensionRiskAreas(dimensionScores),
        darkPercentage,
        greyPercentage,
        whitePercentage,
        darkCount,
        greyCount,
        whiteCount,
        totalPatterns
    };
}

// Generate risk areas from dimension scores
function generateDimensionRiskAreas(dimensionScores) {
    const riskAreas = [];
    
    Object.values(dimensionScores).forEach(dim => {
        if (dim.score < 3) {
            riskAreas.push(`Low ${dim.name.toLowerCase()}: ${dim.description.toLowerCase()}`);
        }
    });
    
    return riskAreas;
}

// Mock pattern detection (replace with actual detection logic)
function detectPatterns(content, type) {
    // Use rule-based detection if available
    if (typeof detectPatternsFromRules !== 'undefined') {
        const ruleBasedDetection = detectPatternsFromRules(content, type);
        if (ruleBasedDetection.patterns.length > 0) {
            return ruleBasedDetection.patterns;
        }
    }
    
    // Fallback to random detection for demo
    // This is a mock function - in production, this would use:
    // - Computer vision for images
    // - Web scraping and DOM analysis for URLs
    // - ML models for pattern recognition
    
    const detectedPatterns = [];
    
    // Simulate random pattern detection for demo
    const darkPatternTypes = Object.keys(PATTERN_DEFINITIONS.dark);
    const greyPatternTypes = Object.keys(PATTERN_DEFINITIONS.grey);
    const whitePatternTypes = Object.keys(PATTERN_DEFINITIONS.white);
    
    // Randomly detect some patterns
    const numDark = Math.floor(Math.random() * 3);
    const numGrey = Math.floor(Math.random() * 4);
    const numWhite = Math.floor(Math.random() * 5) + 2;
    
    for (let i = 0; i < numDark; i++) {
        const randomType = darkPatternTypes[Math.floor(Math.random() * darkPatternTypes.length)];
        detectedPatterns.push({
            category: PATTERN_CATEGORIES.DARK,
            type: randomType
        });
    }
    
    for (let i = 0; i < numGrey; i++) {
        const randomType = greyPatternTypes[Math.floor(Math.random() * greyPatternTypes.length)];
        detectedPatterns.push({
            category: PATTERN_CATEGORIES.GREY,
            type: randomType
        });
    }
    
    for (let i = 0; i < numWhite; i++) {
        const randomType = whitePatternTypes[Math.floor(Math.random() * whitePatternTypes.length)];
        detectedPatterns.push({
            category: PATTERN_CATEGORIES.WHITE,
            type: randomType
        });
    }
    
    return detectedPatterns;
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PATTERN_CATEGORIES,
        SCORING_DIMENSIONS,
        PATTERN_DEFINITIONS,
        calculatePES,
        detectPatterns
    };
}
