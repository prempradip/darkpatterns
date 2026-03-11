// Export functionality for detailed PES reports

function generateDetailedReport(pesResults) {
    const report = {
        overall_score: pesResults.overallScore,
        weighted_pes: pesResults.weightedPES,
        pattern: pesResults.interpretation.label,
        pattern_category: pesResults.interpretation.category,
        meaning: pesResults.interpretation.meaning,
        
        // Critical flags
        has_critical_flags: pesResults.hasCriticalFlags,
        critical_flags: pesResults.criticalFlags.map(flag => flag.name),
        
        // Pattern distribution
        pattern_distribution: {
            dark_patterns: pesResults.darkCount,
            grey_patterns: pesResults.greyCount,
            white_patterns: pesResults.whiteCount,
            total_patterns: pesResults.totalPatterns
        },
        
        pattern_percentages: {
            dark: pesResults.darkPercentage,
            grey: pesResults.greyPercentage,
            white: pesResults.whitePercentage
        },
        
        // Dimension scores (0-5 scale)
        dimension_scores: {},
        
        // Risk areas
        risk_areas: pesResults.riskAreas,
        
        // Timestamp
        analyzed_at: new Date().toISOString()
    };
    
    // Format dimension scores
    Object.values(pesResults.dimensionScores).forEach(dim => {
        report.dimension_scores[dim.name] = {
            score: parseFloat(dim.score.toFixed(2)),
            weight: dim.weight,
            description: dim.description,
            patterns_detected: dim.patterns.length
        };
    });
    
    return report;
}

function exportReportAsJSON(pesResults) {
    const report = generateDetailedReport(pesResults);
    const jsonString = JSON.stringify(report, null, 2);
    
    // Create download link
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dark-pattern-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function exportReportAsText(pesResults) {
    const report = generateDetailedReport(pesResults);
    
    let textReport = `DARK PATTERN ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════════════════

OVERALL SCORE: ${report.overall_score}/100
Pattern Type: ${report.pattern}
Category: ${report.meaning}

${report.has_critical_flags ? `
🚨 CRITICAL FLAGS DETECTED:
${report.critical_flags.map(flag => `  ⚠ ${flag}`).join('\n')}
` : ''}

═══════════════════════════════════════════════════════════

PATTERN DISTRIBUTION:
  Dark Patterns:  ${report.pattern_distribution.dark_patterns} (${report.pattern_percentages.dark}%)
  Grey Patterns:  ${report.pattern_distribution.grey_patterns} (${report.pattern_percentages.grey}%)
  White Patterns: ${report.pattern_distribution.white_patterns} (${report.pattern_percentages.white}%)
  Total Detected: ${report.pattern_distribution.total_patterns}

═══════════════════════════════════════════════════════════

DIMENSION SCORES (0-5 scale):
`;
    
    Object.entries(report.dimension_scores).forEach(([name, data]) => {
        textReport += `
  ${name}: ${data.score}/5 (Weight: ${(data.weight * 100).toFixed(0)}%)
  ${data.description}
  Patterns detected: ${data.patterns_detected}
`;
    });
    
    if (report.risk_areas.length > 0) {
        textReport += `
═══════════════════════════════════════════════════════════

RISK AREAS IDENTIFIED:
${report.risk_areas.map((risk, i) => `  ${i + 1}. ${risk}`).join('\n')}
`;
    }
    
    textReport += `
═══════════════════════════════════════════════════════════

End of Report
`;
    
    // Create download link
    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dark-pattern-report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateDetailedReport,
        exportReportAsJSON,
        exportReportAsText
    };
}
