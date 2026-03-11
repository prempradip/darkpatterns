// Pattern Detection Rules (AI Layer)
// Rule-based tagging system for automatic pattern detection

const DETECTION_RULES = {
    // Visual/UI Detection Rules
    visual: [
        {
            id: 'pre_checked_boxes',
            pattern: 'sneak_into_basket',
            category: 'dark',
            risk: 'dark',
            keywords: ['checked', 'pre-selected', 'opt-in', 'newsletter', 'marketing'],
            description: 'Pre-checked consent boxes detected',
            severity: 'high'
        },
        {
            id: 'countdown_timers',
            pattern: 'urgency_messaging',
            category: 'grey',
            risk: 'grey',
            keywords: ['countdown', 'timer', 'expires', 'limited time', 'hurry'],
            description: 'Countdown timers or urgency messaging',
            severity: 'medium'
        },
        {
            id: 'misleading_button_colors',
            pattern: 'intent_alignment',
            category: 'grey',
            risk: 'grey',
            keywords: ['button', 'color', 'contrast', 'prominent', 'hidden'],
            description: 'Misleading button colors or visual hierarchy',
            severity: 'medium'
        },
        {
            id: 'hidden_unsubscribe',
            pattern: 'roach_motel',
            category: 'dark',
            risk: 'dark',
            keywords: ['unsubscribe', 'hidden', 'footer', 'small text', 'buried'],
            description: 'Hidden or difficult to find unsubscribe option',
            severity: 'high'
        },
        {
            id: 'fake_scarcity',
            pattern: 'urgency_messaging',
            category: 'grey',
            risk: 'grey',
            keywords: ['only', 'left', 'stock', 'last chance', 'selling fast'],
            description: 'Fake scarcity indicators',
            severity: 'medium'
        }
    ],
    
    // Flow/Navigation Detection Rules
    flow: [
        {
            id: 'multiple_opt_out_screens',
            pattern: 'roach_motel',
            category: 'dark',
            risk: 'dark',
            keywords: ['cancel', 'multiple steps', 'retention', 'confirm', 'survey'],
            description: 'Multiple screens required to opt-out or cancel',
            severity: 'high'
        },
        {
            id: 'forced_account_creation',
            pattern: 'friction_fairness',
            category: 'grey',
            risk: 'grey',
            keywords: ['sign up', 'register', 'account required', 'login'],
            description: 'Forced account creation before browsing',
            severity: 'medium'
        },
        {
            id: 'complex_cancellation',
            pattern: 'forced_continuity',
            category: 'dark',
            risk: 'dark',
            keywords: ['phone only', 'call to cancel', 'no online cancellation'],
            description: 'Complex or phone-only cancellation process',
            severity: 'critical'
        }
    ],
    
    // Content/Copy Detection Rules
    content: [
        {
            id: 'confirmshaming_language',
            pattern: 'confirmshaming',
            category: 'dark',
            risk: 'dark',
            keywords: ['no thanks', 'i hate', 'i dont want', 'miss out'],
            description: 'Guilt-tripping or shame-based decline language',
            severity: 'high'
        },
        {
            id: 'hidden_costs',
            pattern: 'hidden_costs',
            category: 'dark',
            risk: 'dark',
            keywords: ['additional fees', 'surprise charge', 'checkout only', 'hidden'],
            description: 'Costs not disclosed until checkout',
            severity: 'critical'
        },
        {
            id: 'trick_questions',
            pattern: 'trick_questions',
            category: 'dark',
            risk: 'dark',
            keywords: ['double negative', 'confusing', 'uncheck to not', 'opt-out'],
            description: 'Confusing double-negative wording',
            severity: 'high'
        },
        {
            id: 'vague_privacy',
            pattern: 'privacy_zuckering',
            category: 'dark',
            risk: 'dark',
            keywords: ['third parties', 'partners', 'share data', 'unclear'],
            description: 'Vague or unclear privacy policy language',
            severity: 'high'
        }
    ],
    
    // Data/Privacy Detection Rules
    privacy: [
        {
            id: 'auto_data_sharing',
            pattern: 'privacy_zuckering',
            category: 'dark',
            risk: 'dark',
            keywords: ['automatically share', 'default sharing', 'public profile'],
            description: 'Automatic data sharing without clear consent',
            severity: 'critical'
        },
        {
            id: 'complex_cookie_banner',
            pattern: 'obstruction',
            category: 'grey',
            risk: 'grey',
            keywords: ['cookie', 'accept all', 'reject hidden', 'complex'],
            description: 'Complex cookie consent with hidden reject option',
            severity: 'medium'
        }
    ]
};

// Rule-based pattern detector
function detectPatternsFromRules(content, type) {
    const detectedPatterns = [];
    const detectionLog = [];
    
    // Simulate rule-based detection
    // In production, this would analyze actual content/DOM/screenshots
    
    Object.values(DETECTION_RULES).forEach(ruleCategory => {
        ruleCategory.forEach(rule => {
            // Simulate detection probability based on rule severity
            const detectionProbability = {
                'critical': 0.3,
                'high': 0.25,
                'medium': 0.2,
                'low': 0.1
            }[rule.severity] || 0.15;
            
            if (Math.random() < detectionProbability) {
                detectedPatterns.push({
                    category: rule.category,
                    type: rule.pattern,
                    detectedBy: 'rule',
                    ruleId: rule.id,
                    description: rule.description,
                    severity: rule.severity
                });
                
                detectionLog.push({
                    rule: rule.id,
                    pattern: rule.pattern,
                    risk: rule.risk,
                    description: rule.description
                });
            }
        });
    });
    
    return {
        patterns: detectedPatterns,
        log: detectionLog
    };
}

// Get all detection rules
function getAllDetectionRules() {
    const allRules = [];
    Object.entries(DETECTION_RULES).forEach(([category, rules]) => {
        rules.forEach(rule => {
            allRules.push({
                ...rule,
                ruleCategory: category
            });
        });
    });
    return allRules;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DETECTION_RULES,
        detectPatternsFromRules,
        getAllDetectionRules
    };
}
