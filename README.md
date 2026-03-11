# Dark Pattern Detector

A minimalistic web tool to analyze websites and screenshots for dark patterns, grey patterns, and ethical design practices using the Pattern Ethics Score (PES) system.

## Features

- **Pattern Ethics Score (PES)**: Comprehensive scoring system based on 6 dimensions
- **URL Analysis**: Analyze websites by entering their URL
- **Image Upload**: Upload screenshots for analysis
- **Multi-dimensional Scoring**: Evaluate across 6 key dimensions with weighted scoring
- **Industry Benchmarks**: Compare against industry standards
- **Regulatory Risk Assessment**: GDPR and CCPA compliance risk scores
- **Competitor Comparison**: See how you stack up against competitors
- **Fix Suggestions**: Actionable recommendations to improve ethics score
- **Responsive Design**: Works on all devices (mobile, tablet, desktop)

## Scoring System

### Pattern Categories

- **⚫ Dark Patterns**: Manipulative, deceptive, exploitative (Rating 0-1)
- **🩶 Grey Patterns**: Acceptable but slightly manipulative or unclear (Rating 2-3)
- **⚪ White Patterns**: Ethical, transparent, user-first (Rating 4-5)

### 6 Scoring Dimensions

Each pattern is evaluated across 6 dimensions on a 0-5 scale:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Transparency | 20% | Are intentions clear? |
| User Control | 20% | Can users easily opt-out/reverse? |
| Intent Alignment | 15% | Is design aligned to user goals? |
| Friction Fairness | 15% | Is friction used ethically? |
| Data Ethics | 20% | Is data collection fair & consented? |
| Cognitive Load | 10% | Is confusion intentionally created? |

### Scoring Formula

```
PES = Σ(Dimension Score × Weight)
Final Score = PES × 20 (converted to 100 scale)
```

### Rating Scale

| Score | Meaning | Category |
|-------|---------|----------|
| 0 | Strong dark pattern | Dark |
| 1 | Clear dark behavior | Dark |
| 2 | Grey leaning dark | Grey |
| 3 | Neutral / acceptable | Grey |
| 4 | Ethical but improvable | White |
| 5 | Strong white pattern | White |

## Critical Dark Pattern Flags

The system automatically flags severe patterns that override the score interpretation:

**Critical Patterns (Auto-flagged):**
- Hidden costs/fees
- Forced continuity (difficult cancellation)
- Disguised ads
- Roach motel (easy in, hard out)
- Confirmshaming
- Sneak into basket (pre-checked items)
- Trick questions
- Privacy zuckering

**Override Rule:**
If ANY critical pattern is detected, the system automatically labels the design as "⚫ Dark Pattern" regardless of the overall score, with a warning about critical violations.

## Score Interpretation

The Pattern Ethics Score (PES) ranges from 0-100 and is categorized as follows:

| Score Range | Category | Meaning | Description |
|-------------|----------|---------|-------------|
| 80-100 | ⚪ White Pattern | Ethical & user-first | Strong ethical practices with transparent interactions |
| 60-79 | 🩶 Light Grey | Mostly fair, minor concerns | Generally ethical with some areas for improvement |
| 40-59 | 🩶 Grey | Questionable persuasion | Persuasive patterns that may not align with user interests |
| 20-39 | ⚫ Dark Grey | Manipulative elements present | Multiple manipulative patterns detected |
| 0-19 | ⚫ Dark Pattern | Highly deceptive design | Heavy reliance on dark patterns that exploit users |

## Usage

Simply open `index.html` in your browser to start analyzing.

## Pattern Detection Rules (AI Layer)

The system uses rule-based tagging for automatic pattern detection:

| Detection | Pattern Type | Risk Level |
|-----------|-------------|------------|
| Pre-checked boxes | Dark | High |
| Countdown timers | Grey | Medium |
| Multiple opt-out screens | Dark | High |
| Hidden unsubscribe | Dark | Critical |
| Misleading button colors | Grey | Medium |
| Confirmshaming language | Dark | High |
| Hidden costs | Dark | Critical |
| Complex cancellation | Dark | Critical |

## Pattern Severity Index (PSI)

Advanced severity calculation for enterprise risk prioritization:

```
PSI = PES × User Impact × Scale Exposure
```

**Factors:**
- User Impact: 1-3 (minor inconvenience to significant harm)
- Scale Exposure: 1-3 (based on user base affected)

**PSI Severity Levels:**
- Critical (80-100): P0 - Immediate action required
- High (60-79): P1 - Address within 1 week
- Medium (40-59): P2 - Address within 1 month
- Low (20-39): P3 - Address in next quarter
- Minimal (0-19): P4 - Monitor and review

## Architecture

**Input Layer:**
- UX audit form
- Heuristic checklist
- AI pattern detection (rule-based)

**Processing Layer:**
- Weighted scoring engine (6 dimensions)
- Rule-based flag engine
- Pattern classifier

**Output Layer:**
- Scorecard with PES
- Dimension analysis
- Risk heatmap
- Compliance report (GDPR/CCPA)
- Fix suggestions

## Files

- `index.html` - Main HTML structure
- `styles.css` - Responsive styling
- `script.js` - UI logic and interactions
- `scoring-logic.js` - PES calculation engine with 6-dimensional weighted scoring
- `pattern-detection-rules.js` - Rule-based pattern detection system
- `pattern-severity-index.js` - PSI calculation for enterprise risk prioritization
- `export-report.js` - Report generation and export functionality

## Push to GitHub

To push this project to GitHub, run:

```bash
git init
git add .
git commit -m "Initial commit: Dark Pattern Detector with PES system"
git branch -M main
git remote add origin https://github.com/prempradip/darkpatterns.git
git push -u origin main
```

## Note

This is a demo with mock pattern detection. For production use, integrate with:
- Computer vision API for image analysis
- Web scraping service for URL analysis
- Machine learning models for pattern recognition

## Pattern Examples

### Dark Patterns (0-1)
- Hidden costs revealed at checkout
- Difficult subscription cancellation
- Pre-checked consent boxes
- Confirmshaming (guilt-tripping)
- Disguised ads
- Trick questions
- Roach motel (easy in, hard out)
- Privacy zuckering

### Grey Patterns (2-3)
- Unverified urgency messaging
- Unverified social proof
- Pre-selected default options
- Complex pricing structures
- Nagging (persistent popups)
- Obstruction (buried settings)
- Intermediate currency (points/gems)

### White Patterns (4-5)
- Clear upfront pricing
- Easy cancellation process
- Explicit consent with unchecked defaults
- Transparent data usage
- Honest urgency (real scarcity)
- Verified social proof
- Clear navigation
- Progressive disclosure

## License

MIT License - Feel free to use and modify for your projects.
