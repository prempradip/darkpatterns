// Configuration - automatically detects environment
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://darkpattern-detector-api.onrender.com';

// Tab switching
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// File upload label update
const fileInput = document.getElementById('image-input');
const uploadText = document.querySelector('.upload-text');

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        uploadText.textContent = e.target.files[0].name;
    }
});

// URL form submission
document.getElementById('url-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input').value;
    await analyzeContent('url', url);
});

// Image form submission
document.getElementById('image-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    if (file) {
        await analyzeContent('image', file);
    }
});

// Real analysis function using backend API
async function analyzeContent(type, content) {
    // Show loading state
    const results = document.getElementById('results');
    results.style.display = 'block';
    results.innerHTML = '<div style="text-align: center; padding: 40px;"><h3>Analyzing...</h3><p>This may take 5-15 seconds</p></div>';
    results.scrollIntoView({ behavior: 'smooth' });
    
    try {
        let detectedPatterns;
        
        if (type === 'url') {
            // Analyze URL via backend
            detectedPatterns = await analyzeURL(content);
        } else {
            // Analyze image via backend
            detectedPatterns = await analyzeImage(content);
        }
        
        // Calculate PES using detected patterns
        const pesResults = calculatePES(detectedPatterns);
        
        displayResults(pesResults, detectedPatterns);
        
    } catch (error) {
        console.error('Analysis error:', error);
        results.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #ef4444;">
                <h3>❌ Analysis Failed</h3>
                <p>${error.message}</p>
                <p style="font-size: 0.9rem; color: #666; margin-top: 10px;">
                    Make sure the backend server is running on ${API_BASE_URL}
                </p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #1a1a1a; color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Try Again
                </button>
            </div>
        `;
    }
}

// Analyze URL via backend API
async function analyzeURL(url) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to analyze URL');
        }
        
        const data = await response.json();
        console.log('URL Analysis Result:', data);
        
        return data.patterns || [];
        
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Cannot connect to backend server. Please start the backend with: cd backend && npm start');
        }
        throw error;
    }
}

// Analyze image via backend API
async function analyzeImage(file) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to analyze image');
        }
        
        const data = await response.json();
        console.log('Image Analysis Result:', data);
        
        return data.patterns || [];
        
    } catch (error) {
        if (error.message.includes('fetch')) {
            throw new Error('Cannot connect to backend server. Please start the backend with: cd backend && npm start');
        }
        throw error;
    }
}

// Display results
function displayResults(pesResults, detectedPatterns) {
    const results = document.getElementById('results');
    results.style.display = 'block';
    results.innerHTML = ''; // Clear loading message
    
    // Restore the results HTML structure
    results.innerHTML = `
        <div class="overall-score">
            <div class="score-number" id="overall-score">0</div>
            <div class="score-label">Pattern Ethics Score (PES)</div>
            <div class="score-interpretation" id="score-interpretation"></div>
        </div>

        <div class="score-breakdown">
            <div class="breakdown-item">
                <div class="breakdown-bar">
                    <div class="breakdown-fill dark" id="dark-bar"></div>
                </div>
                <div class="breakdown-info">
                    <span class="breakdown-label">⚫ Dark Patterns</span>
                    <span class="breakdown-value" id="dark-score">0%</span>
                </div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-bar">
                    <div class="breakdown-fill grey" id="grey-bar"></div>
                </div>
                <div class="breakdown-info">
                    <span class="breakdown-label">🩶 Grey Patterns</span>
                    <span class="breakdown-value" id="grey-score">0%</span>
                </div>
            </div>
            <div class="breakdown-item">
                <div class="breakdown-bar">
                    <div class="breakdown-fill white" id="white-bar"></div>
                </div>
                <div class="breakdown-info">
                    <span class="breakdown-label">⚪ White Patterns</span>
                    <span class="breakdown-value" id="white-score">0%</span>
                </div>
            </div>
        </div>

        <div class="insights" id="insights"></div>

        <div class="dimension-insights">
            <h3>Dimension Analysis</h3>
            <p class="dimension-subtitle">Detailed breakdown across 6 scoring dimensions</p>
            <div class="dimension-scores-grid" id="dimension-scores-grid"></div>
            <div class="risk-areas" id="risk-areas"></div>
        </div>

        <div class="benchmark">
            <h3>Industry Benchmark</h3>
            <div class="benchmark-comparison" id="benchmark-comparison"></div>
        </div>

        <div class="regulatory-risk">
            <h3>Regulatory Risk Assessment</h3>
            <div class="risk-cards" id="risk-cards"></div>
            <div class="risk-details" id="risk-details"></div>
        </div>

        <div class="competitor-comparison">
            <h3>Competitor Ethics Comparison</h3>
            <p class="competitor-subtitle">See how this design compares to similar platforms</p>
            <div class="competitor-grid" id="competitor-grid"></div>
        </div>

        <div class="fix-suggestions">
            <h3>Fix Suggestions</h3>
            <p class="fix-subtitle">Actionable recommendations to improve your ethics score</p>
            <div class="suggestions-list" id="suggestions-list"></div>
        </div>

        <div class="findings" id="findings"></div>
    `;
    
    const overallScore = pesResults.overallScore;
    const darkScore = pesResults.darkPercentage;
    const greyScore = pesResults.greyPercentage;
    const whiteScore = pesResults.whitePercentage;
    const interpretation = pesResults.interpretation;
    
    // Update UI
    document.getElementById('dark-score').textContent = `${darkScore}%`;
    document.getElementById('grey-score').textContent = `${greyScore}%`;
    document.getElementById('white-score').textContent = `${whiteScore}%`;
    document.getElementById('overall-score').textContent = overallScore;
    document.getElementById('dark-bar').style.width = `${darkScore}%`;
    document.getElementById('grey-bar').style.width = `${greyScore}%`;
    document.getElementById('white-bar').style.width = `${whiteScore}%`;
    
    // Display score interpretation
    displayScoreInterpretation(interpretation);
    
    // Display dimension insights
    displayDimensionInsights(pesResults);
    
    // Generate insights, benchmark, and findings
    const insight = generateInsight(overallScore, darkScore, greyScore, whiteScore);
    displayInsight(insight);
    
    displayBenchmark(overallScore, darkScore, greyScore, whiteScore);
    
    displayRegulatoryRisk(darkScore, greyScore);
    
    displayCompetitorComparison(overallScore);
    
    displayFixSuggestions(darkScore, greyScore, whiteScore, overallScore);
    
    const findings = generateFindings(detectedPatterns, pesResults);
    displayFindings(findings);
}

function displayScoreInterpretation(interpretation) {
    const interpretationDiv = document.getElementById('score-interpretation');
    interpretationDiv.style.backgroundColor = interpretation.bgColor;
    interpretationDiv.style.color = interpretation.color;
    
    let html = `
        <div class="interpretation-label">${interpretation.label}</div>
        <div class="interpretation-meaning">${interpretation.meaning}</div>
        <div class="interpretation-description">${interpretation.description}</div>
    `;
    
    // Add critical flags warning if present
    if (interpretation.isCritical && interpretation.criticalFlags) {
        html += `
            <div class="critical-flags-warning">
                <div class="critical-flags-title">🚨 Critical Violations:</div>
                <ul class="critical-flags-list">
                    ${interpretation.criticalFlags.map(flag => `
                        <li>${flag.name}</li>
                    `).join('')}
                </ul>
            </div>
        `;
    }
    
    interpretationDiv.innerHTML = html;
}

function displayDimensionInsights(pesResults) {
    const dimensionScoresGrid = document.getElementById('dimension-scores-grid');
    const riskAreasDiv = document.getElementById('risk-areas');
    
    // Display dimension scores
    let dimensionHTML = '';
    Object.values(pesResults.dimensionScores).forEach(dim => {
        const score = dim.score.toFixed(1);
        const weight = (dim.weight * 100).toFixed(0);
        
        let scoreClass = 'good';
        let cardClass = 'good';
        if (score < 2) {
            scoreClass = 'critical';
            cardClass = 'critical';
        } else if (score < 3.5) {
            scoreClass = 'warning';
            cardClass = 'warning';
        }
        
        dimensionHTML += `
            <div class="dimension-card ${cardClass}">
                <div class="dimension-name">${dim.name}</div>
                <div class="dimension-score-display">
                    <span class="dimension-score-value ${scoreClass}">${score}</span>
                    <span class="dimension-score-max">/5</span>
                </div>
                <div class="dimension-weight">Weight: ${weight}%</div>
                <div class="dimension-description">${dim.description}</div>
            </div>
        `;
    });
    
    dimensionScoresGrid.innerHTML = dimensionHTML;
    
    // Generate and display risk areas
    const riskAreas = generateRiskAreas(pesResults.dimensionScores);
    
    if (riskAreas.length > 0) {
        riskAreasDiv.innerHTML = `
            <h4>⚠️ Risk Areas Identified</h4>
            <ul class="risk-areas-list">
                ${riskAreas.map(risk => `<li>${risk}</li>`).join('')}
            </ul>
        `;
    } else {
        riskAreasDiv.innerHTML = `
            <h4>✓ No Major Risk Areas</h4>
            <p style="color: #666; font-size: 0.9rem; margin: 0;">All dimensions score above acceptable thresholds.</p>
        `;
    }
}

function generateRiskAreas(dimensionScores) {
    const riskAreas = [];
    
    Object.values(dimensionScores).forEach(dim => {
        const score = dim.score;
        const patterns = dim.patterns;
        
        // Critical risk (score < 2)
        if (score < 2) {
            if (dim.name === 'Transparency') {
                riskAreas.push(`Critical: Very low transparency - hidden costs or unclear terms detected`);
            } else if (dim.name === 'User Control') {
                riskAreas.push(`Critical: Severely limited user control - difficult cancellation or account deletion`);
            } else if (dim.name === 'Intent Alignment') {
                riskAreas.push(`Critical: Design misaligned with user goals - misleading CTAs or deceptive flows`);
            } else if (dim.name === 'Friction Fairness') {
                riskAreas.push(`Critical: Unfair friction - forced account creation or unnecessary barriers`);
            } else if (dim.name === 'Data Ethics') {
                riskAreas.push(`Critical: Poor data ethics - pre-ticked consent or hidden data collection`);
            } else if (dim.name === 'Cognitive Load') {
                riskAreas.push(`Critical: Intentional confusion - trick questions or visual misdirection`);
            }
        }
        // High risk (score 2-3)
        else if (score < 3) {
            if (dim.name === 'Transparency') {
                riskAreas.push(`High risk: Low transparency in pricing or terms`);
            } else if (dim.name === 'User Control') {
                riskAreas.push(`High risk: Limited user control - difficult opt-out processes`);
            } else if (dim.name === 'Intent Alignment') {
                riskAreas.push(`High risk: Some design elements don't align with user interests`);
            } else if (dim.name === 'Friction Fairness') {
                riskAreas.push(`High risk: Unnecessary friction in key user flows`);
            } else if (dim.name === 'Data Ethics') {
                riskAreas.push(`High risk: Questionable data collection practices`);
            } else if (dim.name === 'Cognitive Load') {
                riskAreas.push(`High risk: Complex or confusing interface elements`);
            }
        }
        // Medium risk (score 3-3.5)
        else if (score < 3.5) {
            if (dim.name === 'Transparency') {
                riskAreas.push(`Medium risk: Some transparency improvements needed`);
            } else if (dim.name === 'User Control') {
                riskAreas.push(`Medium risk: User control could be more accessible`);
            } else if (dim.name === 'Friction Fairness') {
                riskAreas.push(`Medium risk: Some friction points could be reduced`);
            }
        }
    });
    
    return riskAreas;
}

function generateInsight(overallScore, darkScore, greyScore, whiteScore) {
    if (overallScore >= 85) {
        return {
            type: 'good',
            title: 'Excellent Ethics Score',
            message: 'This design demonstrates strong ethical practices with transparent user interactions. The interface respects user autonomy and provides clear, honest information. Continue maintaining these high standards.'
        };
    } else if (overallScore >= 70) {
        return {
            type: 'good',
            title: 'Good Ethics Score',
            message: 'The design shows mostly ethical patterns with minimal manipulation. There are some areas that could be improved for better transparency, but overall the user experience is respectful and honest.'
        };
    } else if (overallScore >= 50) {
        return {
            type: 'caution',
            title: 'Moderate Concerns Detected',
            message: 'This design contains several questionable patterns that may mislead users. Consider reviewing the checkout process, subscription terms, and opt-out mechanisms. Improving transparency will build more trust with users.'
        };
    } else if (overallScore >= 30) {
        return {
            type: 'warning',
            title: 'Significant Dark Patterns Found',
            message: 'Multiple deceptive design practices detected. These patterns manipulate user behavior and erode trust. Immediate action is recommended to remove hidden costs, forced continuity, and misleading language. Prioritize user autonomy and transparency.'
        };
    } else {
        return {
            type: 'warning',
            title: 'Critical Ethics Issues',
            message: 'This design heavily relies on dark patterns that exploit users. The interface contains numerous deceptive practices including hidden fees, difficult cancellation, and manipulative urgency tactics. A complete redesign with ethical principles is strongly recommended.'
        };
    }
}

function displayInsight(insight) {
    const insightsDiv = document.getElementById('insights');
    insightsDiv.className = `insights ${insight.type}`;
    insightsDiv.innerHTML = `
        <h4>${insight.title}</h4>
        <p>${insight.message}</p>
    `;
}

function displayBenchmark(overallScore, darkScore, greyScore, whiteScore) {
    // Industry benchmarks (mock data based on typical industry standards)
    const benchmarks = {
        overall: 72,
        dark: 18,
        grey: 25,
        white: 57
    };
    
    const comparisonDiv = document.getElementById('benchmark-comparison');
    
    const comparisons = [
        {
            label: 'Overall Score',
            yourScore: Math.round(overallScore),
            industry: benchmarks.overall,
            suffix: '/100'
        },
        {
            label: 'Dark Patterns',
            yourScore: darkScore,
            industry: benchmarks.dark,
            suffix: '%',
            inverse: true // Lower is better
        },
        {
            label: 'Grey Patterns',
            yourScore: greyScore,
            industry: benchmarks.grey,
            suffix: '%',
            inverse: true
        },
        {
            label: 'Ethical Design',
            yourScore: whiteScore,
            industry: benchmarks.white,
            suffix: '%'
        }
    ];
    
    let html = '';
    
    comparisons.forEach(comp => {
        const isBetter = comp.inverse 
            ? comp.yourScore < comp.industry 
            : comp.yourScore > comp.industry;
        
        const maxValue = comp.suffix === '/100' ? 100 : 100;
        const yourWidth = (comp.yourScore / maxValue) * 100;
        const industryWidth = (comp.industry / maxValue) * 100;
        
        const barClass = isBetter ? 'better' : (comp.yourScore === comp.industry ? 'your-score' : 'worse');
        
        html += `
            <div class="benchmark-item">
                <div class="benchmark-label">${comp.label}</div>
                <div class="benchmark-bar-container">
                    <div class="benchmark-bars">
                        <div class="benchmark-bar industry" style="width: ${industryWidth}%"></div>
                        <div class="benchmark-bar ${barClass}" style="width: ${yourWidth}%"></div>
                    </div>
                    <div class="benchmark-values">
                        <span class="benchmark-value your-score">${comp.yourScore}${comp.suffix}</span>
                        <span class="benchmark-value industry">${comp.industry}${comp.suffix}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="benchmark-legend">
            <div class="legend-item">
                <div class="legend-color your-score"></div>
                <span>Your Score</span>
            </div>
            <div class="legend-item">
                <div class="legend-color industry"></div>
                <span>Industry Average</span>
            </div>
        </div>
    `;
    
    comparisonDiv.innerHTML = html;
}

function displayRegulatoryRisk(darkScore, greyScore) {
    // Calculate risk scores based on dark and grey patterns
    const gdprRisk = calculateRiskScore(darkScore, greyScore, 'gdpr');
    const ccpaRisk = calculateRiskScore(darkScore, greyScore, 'ccpa');
    
    // Display risk cards
    const riskCardsDiv = document.getElementById('risk-cards');
    riskCardsDiv.innerHTML = `
        <div class="risk-card ${gdprRisk.level}">
            <div class="risk-regulation">GDPR Compliance</div>
            <div class="risk-level">${gdprRisk.level.toUpperCase()}</div>
            <div class="risk-score">${gdprRisk.score}/100 Risk Score</div>
        </div>
        <div class="risk-card ${ccpaRisk.level}">
            <div class="risk-regulation">CCPA Compliance</div>
            <div class="risk-level">${ccpaRisk.level.toUpperCase()}</div>
            <div class="risk-score">${ccpaRisk.score}/100 Risk Score</div>
        </div>
    `;
    
    // Generate risk details
    const risks = generateRegulatoryRisks(darkScore, greyScore);
    displayRiskDetails(risks);
}

function calculateRiskScore(darkScore, greyScore, regulation) {
    // GDPR is stricter on consent and transparency
    // CCPA focuses more on data selling and opt-out rights
    let riskScore;
    
    if (regulation === 'gdpr') {
        riskScore = Math.round((darkScore * 1.5) + (greyScore * 0.8));
    } else {
        riskScore = Math.round((darkScore * 1.3) + (greyScore * 0.9));
    }
    
    riskScore = Math.min(riskScore, 100);
    
    let level;
    if (riskScore < 30) {
        level = 'low';
    } else if (riskScore < 60) {
        level = 'medium';
    } else {
        level = 'high';
    }
    
    return { score: riskScore, level };
}

function generateRegulatoryRisks(darkScore, greyScore) {
    const risks = [];
    
    if (darkScore > 25) {
        risks.push({
            level: 'high',
            title: 'Hidden Consent Violations',
            description: 'Pre-checked boxes and hidden consent mechanisms violate GDPR Article 7 requiring clear, affirmative consent.'
        });
        risks.push({
            level: 'high',
            title: 'Difficult Opt-Out Process',
            description: 'Complex cancellation flows may violate CCPA requirements for easy opt-out mechanisms and GDPR right to withdraw consent.'
        });
    }
    
    if (darkScore > 15) {
        risks.push({
            level: 'high',
            title: 'Deceptive Data Collection',
            description: 'Misleading language around data usage violates transparency requirements under both GDPR and CCPA.'
        });
    }
    
    if (greyScore > 20) {
        risks.push({
            level: 'medium',
            title: 'Unclear Privacy Notices',
            description: 'Ambiguous privacy information may not meet GDPR requirements for clear, plain language communication.'
        });
        risks.push({
            level: 'medium',
            title: 'Pressure Tactics',
            description: 'Urgency messaging and social proof may undermine informed consent principles required by privacy regulations.'
        });
    }
    
    if (greyScore > 10) {
        risks.push({
            level: 'medium',
            title: 'Confusing Cookie Consent',
            description: 'Complex cookie banners may not provide genuine choice as required by GDPR ePrivacy Directive.'
        });
    }
    
    if (darkScore < 10 && greyScore < 15) {
        risks.push({
            level: 'low',
            title: 'Good Compliance Posture',
            description: 'Design patterns show respect for user privacy and align with regulatory requirements for transparency and consent.'
        });
    }
    
    return risks;
}

function displayRiskDetails(risks) {
    const riskDetailsDiv = document.getElementById('risk-details');
    
    if (risks.length === 0) {
        riskDetailsDiv.innerHTML = '<p style="color: #666; font-size: 0.9rem;">No significant regulatory risks detected.</p>';
        return;
    }
    
    const html = `
        <h4>Compliance Concerns</h4>
        ${risks.map(risk => `
            <div class="risk-item">
                <div class="risk-icon ${risk.level}">!</div>
                <div class="risk-content">
                    <div class="risk-title">${risk.title}</div>
                    <div class="risk-description">${risk.description}</div>
                </div>
            </div>
        `).join('')}
    `;
    
    riskDetailsDiv.innerHTML = html;
}

function displayCompetitorComparison(overallScore) {
    // Generate mock competitor data
    const competitors = [
        {
            name: 'Competitor A',
            score: 78,
            category: 'E-commerce'
        },
        {
            name: 'Competitor B',
            score: 65,
            category: 'E-commerce'
        },
        {
            name: 'Competitor C',
            score: 82,
            category: 'E-commerce'
        },
        {
            name: 'Industry Leader',
            score: 89,
            category: 'E-commerce'
        }
    ];
    
    const competitorGridDiv = document.getElementById('competitor-grid');
    
    const html = competitors.map(comp => {
        const isBetter = Math.round(overallScore) > comp.score;
        const isEqual = Math.round(overallScore) === comp.score;
        const difference = Math.abs(Math.round(overallScore) - comp.score);
        
        let statusClass = 'neutral';
        let statusText = 'Same';
        let statusIcon = '=';
        
        if (isBetter) {
            statusClass = 'better';
            statusText = `+${difference} better`;
            statusIcon = '↑';
        } else if (!isEqual) {
            statusClass = 'worse';
            statusText = `-${difference} behind`;
            statusIcon = '↓';
        }
        
        return `
            <div class="competitor-card">
                <div class="competitor-header">
                    <div class="competitor-name">${comp.name}</div>
                    <div class="competitor-category">${comp.category}</div>
                </div>
                <div class="competitor-scores">
                    <div class="competitor-score-item">
                        <div class="competitor-score-label">Their Score</div>
                        <div class="competitor-score-value">${comp.score}</div>
                    </div>
                    <div class="competitor-score-item">
                        <div class="competitor-score-label">Your Score</div>
                        <div class="competitor-score-value">${Math.round(overallScore)}</div>
                    </div>
                </div>
                <div class="competitor-status ${statusClass}">
                    <span class="status-icon">${statusIcon}</span>
                    <span>${statusText}</span>
                </div>
            </div>
        `;
    }).join('');
    
    competitorGridDiv.innerHTML = html;
}

function displayFixSuggestions(darkScore, greyScore, whiteScore, overallScore) {
    const suggestions = generateFixSuggestions(darkScore, greyScore, whiteScore, overallScore);
    const suggestionsListDiv = document.getElementById('suggestions-list');
    
    const html = suggestions.map((suggestion, index) => `
        <div class="suggestion-item">
            <div class="suggestion-header">
                <div class="suggestion-priority ${suggestion.priority}">
                    ${suggestion.priority.toUpperCase()}
                </div>
                <div class="suggestion-impact">+${suggestion.impact} points</div>
            </div>
            <div class="suggestion-title">${suggestion.title}</div>
            <div class="suggestion-description">${suggestion.description}</div>
            <div class="suggestion-actions">
                <div class="action-label">How to fix:</div>
                <ul class="action-steps">
                    ${suggestion.steps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        </div>
    `).join('');
    
    suggestionsListDiv.innerHTML = html;
}

function generateFixSuggestions(darkScore, greyScore, whiteScore, overallScore) {
    const suggestions = [];
    
    // High priority fixes for dark patterns
    if (darkScore > 25) {
        suggestions.push({
            priority: 'high',
            impact: 15,
            title: 'Remove Pre-Checked Consent Boxes',
            description: 'Pre-selected checkboxes for marketing consent violate GDPR and manipulate users into unwanted subscriptions.',
            steps: [
                'Ensure all consent checkboxes are unchecked by default',
                'Use clear, affirmative opt-in language',
                'Separate essential and marketing consent options'
            ]
        });
        
        suggestions.push({
            priority: 'high',
            impact: 12,
            title: 'Simplify Cancellation Process',
            description: 'Making it difficult to cancel subscriptions is a dark pattern that damages trust and violates consumer protection laws.',
            steps: [
                'Add a visible "Cancel Subscription" button in account settings',
                'Allow cancellation in the same number of clicks as signup',
                'Remove unnecessary retention screens and obstacles'
            ]
        });
    }
    
    if (darkScore > 15) {
        suggestions.push({
            priority: 'high',
            impact: 10,
            title: 'Display All Costs Upfront',
            description: 'Hidden fees and surprise charges at checkout create distrust and may violate consumer protection regulations.',
            steps: [
                'Show total price including all fees on product pages',
                'Display shipping costs before checkout',
                'Clearly itemize all charges in the cart'
            ]
        });
    }
    
    // Medium priority fixes for grey patterns
    if (greyScore > 20) {
        suggestions.push({
            priority: 'medium',
            impact: 8,
            title: 'Reduce Urgency Manipulation',
            description: 'Excessive countdown timers and "only X left" messages create false urgency and pressure users.',
            steps: [
                'Only show urgency messages when genuinely accurate',
                'Remove fake countdown timers',
                'Use honest language about availability'
            ]
        });
        
        suggestions.push({
            priority: 'medium',
            impact: 7,
            title: 'Verify Social Proof Claims',
            description: 'Unverified testimonials and fake user counts mislead customers and damage credibility.',
            steps: [
                'Only display verified customer reviews',
                'Show real-time, accurate user statistics',
                'Include both positive and negative feedback'
            ]
        });
    }
    
    if (greyScore > 10) {
        suggestions.push({
            priority: 'medium',
            impact: 6,
            title: 'Improve Cookie Consent Clarity',
            description: 'Complex cookie banners with confusing options don\'t provide genuine user choice.',
            steps: [
                'Make "Reject All" as prominent as "Accept All"',
                'Use clear, plain language for cookie categories',
                'Remember user preferences across sessions'
            ]
        });
    }
    
    // Low priority improvements
    if (whiteScore < 70) {
        suggestions.push({
            priority: 'low',
            impact: 5,
            title: 'Enhance Privacy Policy Transparency',
            description: 'Clear, accessible privacy information builds trust and ensures regulatory compliance.',
            steps: [
                'Write privacy policy in plain language',
                'Add a summary section at the top',
                'Make privacy settings easily accessible'
            ]
        });
    }
    
    if (overallScore < 80) {
        suggestions.push({
            priority: 'low',
            impact: 4,
            title: 'Add Clear Return Policy',
            description: 'Transparent return and refund policies reduce purchase anxiety and build customer confidence.',
            steps: [
                'Display return policy on product pages',
                'Offer hassle-free returns within reasonable timeframe',
                'Clearly explain the return process'
            ]
        });
    }
    
    // Sort by priority and impact
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    suggestions.sort((a, b) => {
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return b.impact - a.impact;
    });
    
    return suggestions.slice(0, 5); // Return top 5 suggestions
}

function generateFindings(detectedPatterns, pesResults) {
    const findings = [];
    
    // Group patterns by category
    const darkPatterns = detectedPatterns.filter(p => p.category === 'dark');
    const greyPatterns = detectedPatterns.filter(p => p.category === 'grey');
    const whitePatterns = detectedPatterns.filter(p => p.category === 'white');
    
    // Add dark pattern findings
    darkPatterns.forEach(pattern => {
        const patternDef = PATTERN_DEFINITIONS.dark[pattern.type];
        if (patternDef) {
            findings.push({
                type: 'dark',
                text: patternDef.description,
                dimension: patternDef.dimension
            });
        }
    });
    
    // Add grey pattern findings
    greyPatterns.forEach(pattern => {
        const patternDef = PATTERN_DEFINITIONS.grey[pattern.type];
        if (patternDef) {
            findings.push({
                type: 'grey',
                text: patternDef.description,
                dimension: patternDef.dimension
            });
        }
    });
    
    // Add white pattern findings (positive)
    whitePatterns.slice(0, 3).forEach(pattern => {
        const patternDef = PATTERN_DEFINITIONS.white[pattern.type];
        if (patternDef) {
            findings.push({
                type: 'white',
                text: patternDef.description,
                dimension: patternDef.dimension
            });
        }
    });
    
    return findings;
}

function displayFindings(findings) {
    const findingsDiv = document.getElementById('findings');
    
    if (findings.length === 0) {
        findingsDiv.innerHTML = '<p>No significant patterns detected.</p>';
        return;
    }
    
    const html = `
        <h4>Detected Patterns</h4>
        <ul>
            ${findings.map(f => `
                <li>
                    <span style="color: ${getColorForType(f.type)}; font-weight: bold;">
                        ${getIconForType(f.type)}
                    </span>
                    ${f.text}
                </li>
            `).join('')}
        </ul>
    `;
    
    findingsDiv.innerHTML = html;
}

function getColorForType(type) {
    const colors = {
        'dark': '#f5576c',
        'grey': '#fcb69f',
        'white': '#4caf50'
    };
    return colors[type] || '#333';
}

function getIconForType(type) {
    const icons = {
        'dark': '⚠️',
        'grey': '⚡',
        'white': '✓'
    };
    return icons[type] || '•';
}
