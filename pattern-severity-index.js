// Pattern Severity Index (PSI)
// Advanced severity calculation for enterprise risk prioritization

// PSI = PES × User Impact × Scale Exposure

const SEVERITY_FACTORS = {
    userImpact: {
        low: 1,      // Minor inconvenience
        medium: 2,   // Moderate user harm
        high: 3      // Significant user harm or financial loss
    },
    
    scaleExposure: {
        low: 1,      // < 1,000 users affected
        medium: 2,   // 1,000 - 100,000 users
        high: 3      // > 100,000 users
    }
};

// Calculate Pattern Severity Index
function calculatePSI(pesScore, userImpact = 'medium', scaleExposure = 'medium') {
    const impactMultiplier = SEVERITY_FACTORS.userImpact[userImpact] || 2;
    const exposureMultiplier = SEVERITY_FACTORS.scaleExposure[scaleExposure] || 2;
    
    // PSI = PES × User Impact × Scale Exposure
    const psi = pesScore * impactMultiplier * exposureMultiplier;
    
    // Normalize to 0-100 scale (max PSI = 100 × 3 × 3 = 900)
    const normalizedPSI = Math.min(100, (psi / 900) * 100);
    
    return {
        psi: Math.round(psi),
        normalizedPSI: Math.round(normalizedPSI),
        pesScore,
        userImpact,
        scaleExposure,
        impactMultiplier,
        exposureMultiplier,
        severity: getPSISeverity(normalizedPSI),
        priority: getPSIPriority(normalizedPSI)
    };
}

// Get PSI severity level
function getPSISeverity(normalizedPSI) {
    if (normalizedPSI >= 80) return 'critical';
    if (normalizedPSI >= 60) return 'high';
    if (normalizedPSI >= 40) return 'medium';
    if (normalizedPSI >= 20) return 'low';
    return 'minimal';
}

// Get PSI priority for remediation
function getPSIPriority(normalizedPSI) {
    if (normalizedPSI >= 80) return 'P0 - Immediate action required';
    if (normalizedPSI >= 60) return 'P1 - Address within 1 week';
    if (normalizedPSI >= 40) return 'P2 - Address within 1 month';
    if (normalizedPSI >= 20) return 'P3 - Address in next quarter';
    return 'P4 - Monitor and review';
}

// Calculate PSI for multiple scenarios
function calculatePSIMatrix(pesScore) {
    const matrix = [];
    
    Object.keys(SEVERITY_FACTORS.userImpact).forEach(impact => {
        Object.keys(SEVERITY_FACTORS.scaleExposure).forEach(exposure => {
            const psiResult = calculatePSI(pesScore, impact, exposure);
            matrix.push({
                scenario: `${impact} impact, ${exposure} exposure`,
                userImpact: impact,
                scaleExposure: exposure,
                ...psiResult
            });
        });
    });
    
    return matrix;
}

// Get recommended actions based on PSI
function getPSIRecommendations(psiResult) {
    const recommendations = [];
    
    if (psiResult.severity === 'critical') {
        recommendations.push({
            priority: 'immediate',
            action: 'Halt deployment and fix critical dark patterns',
            timeline: 'Within 24 hours'
        });
        recommendations.push({
            priority: 'immediate',
            action: 'Notify legal and compliance teams',
            timeline: 'Immediately'
        });
        recommendations.push({
            priority: 'immediate',
            action: 'Prepare user communication plan',
            timeline: 'Within 48 hours'
        });
    } else if (psiResult.severity === 'high') {
        recommendations.push({
            priority: 'urgent',
            action: 'Schedule emergency design review',
            timeline: 'Within 1 week'
        });
        recommendations.push({
            priority: 'urgent',
            action: 'Implement quick fixes for top violations',
            timeline: 'Within 2 weeks'
        });
    } else if (psiResult.severity === 'medium') {
        recommendations.push({
            priority: 'standard',
            action: 'Add to sprint backlog for remediation',
            timeline: 'Within 1 month'
        });
        recommendations.push({
            priority: 'standard',
            action: 'Conduct user testing on affected flows',
            timeline: 'Within 6 weeks'
        });
    } else {
        recommendations.push({
            priority: 'low',
            action: 'Monitor and include in quarterly UX review',
            timeline: 'Next quarter'
        });
    }
    
    return recommendations;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        SEVERITY_FACTORS,
        calculatePSI,
        calculatePSIMatrix,
        getPSIRecommendations,
        getPSISeverity,
        getPSIPriority
    };
}
