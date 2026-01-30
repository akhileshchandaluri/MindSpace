// Multi-layer response validation system

export const VALIDATION_RULES = {
  FORBIDDEN_PATTERNS: [
    // Diagnosis patterns
    { pattern: /you have (depression|anxiety|bipolar|schizophrenia|ptsd|ocd|adhd|autism)/i, severity: 'CRITICAL', reason: 'Contains diagnosis' },
    { pattern: /you('re| are) (depressed|anxious|mentally ill)/i, severity: 'CRITICAL', reason: 'Contains diagnosis' },
    { pattern: /diagnosed with/i, severity: 'CRITICAL', reason: 'Mentions diagnosis' },
    
    // Medication patterns
    { pattern: /you should (take|try|stop|start) (medication|meds|pills|antidepressant|ssri)/i, severity: 'CRITICAL', reason: 'Medication advice' },
    { pattern: /(prozac|zoloft|lexapro|xanax|ativan|valium|wellbutrin)/i, severity: 'CRITICAL', reason: 'Mentions specific medication' },
    
    // Harmful content
    { pattern: /kill yourself/i, severity: 'CRITICAL', reason: 'Harmful content' },
    { pattern: /end (your|it all)/i, severity: 'HIGH', reason: 'Potentially harmful' },
    
    // Dismissive patterns
    { pattern: /(just|simply) (get over it|snap out of it|think positive|stop worrying)/i, severity: 'MODERATE', reason: 'Dismissive language' },
    { pattern: /it'?s all in your head/i, severity: 'MODERATE', reason: 'Dismissive language' },
    { pattern: /you'?re (being dramatic|overreacting|too sensitive)/i, severity: 'MODERATE', reason: 'Invalidating' },
    
    // Medical claims without qualification
    { pattern: /this will (cure|fix|solve) your/i, severity: 'HIGH', reason: 'Unqualified medical claim' },
    { pattern: /you need (therapy|treatment|help) for/i, severity: 'MODERATE', reason: 'Directive medical statement' }
  ],
  
  REQUIRED_ELEMENTS: {
    forCrisis: ['helpline', 'professional', 'counselor'],
    forAdvice: ['suggest', 'consider', 'might help', 'could try']
  }
}

export function validateResponse(response, context = {}) {
  const validationResult = {
    isValid: true,
    issues: [],
    severity: 'NONE',
    action: 'ALLOW'
  }
  
  // Check forbidden patterns
  for (const rule of VALIDATION_RULES.FORBIDDEN_PATTERNS) {
    if (rule.pattern.test(response)) {
      validationResult.isValid = false
      validationResult.issues.push({
        rule: rule.reason,
        severity: rule.severity,
        match: response.match(rule.pattern)?.[0]
      })
      
      // Track highest severity
      if (getSeverityLevel(rule.severity) > getSeverityLevel(validationResult.severity)) {
        validationResult.severity = rule.severity
      }
    }
  }
  
  // Check for medical claims without sources
  if (containsUnverifiedClaim(response)) {
    validationResult.issues.push({
      rule: 'Unverified medical claim',
      severity: 'MODERATE'
    })
  }
  
  // Check for statistics without sources
  if (containsStatistics(response)) {
    validationResult.issues.push({
      rule: 'Unverified statistic',
      severity: 'MODERATE'
    })
  }
  
  // Determine action based on severity
  if (validationResult.severity === 'CRITICAL') {
    validationResult.action = 'BLOCK'
  } else if (validationResult.severity === 'HIGH') {
    validationResult.action = 'REGENERATE'
  } else if (validationResult.severity === 'MODERATE') {
    validationResult.action = 'WARN'
  }
  
  return validationResult
}

function getSeverityLevel(severity) {
  const levels = { NONE: 0, MODERATE: 1, HIGH: 2, CRITICAL: 3 }
  return levels[severity] || 0
}

function containsUnverifiedClaim(response) {
  const claimPatterns = [
    /studies show/i,
    /research proves/i,
    /scientifically proven/i,
    /doctors recommend/i,
    /experts say/i
  ]
  
  return claimPatterns.some(pattern => pattern.test(response))
}

function containsStatistics(response) {
  return /\d+%|\d+ percent|\d+ out of \d+/.test(response)
}

export function generateFallbackResponse(originalMessage, validationIssues) {
  // Safe generic response when validation fails
  return {
    response: `I understand you're going through a difficult time. While I want to support you, I think it's important that you speak with a trained counselor who can provide proper guidance.

Would you like to talk about what's been on your mind? I'm here to listen, and I can also connect you with professional resources if that would be helpful.

KIRAN Mental Health Helpline: 1800-599-0019 (Free, 24/7)`,
    metadata: {
      isFallback: true,
      reason: 'Validation failed',
      originalIssues: validationIssues
    }
  }
}

export function checkToneAndEmpathy(response) {
  const empathyIndicators = [
    /I (hear|understand|see) (that|you)/i,
    /that (sounds|seems|must be)/i,
    /it'?s (understandable|normal|valid|okay)/i,
    /(thank you for|appreciate you) sharing/i
  ]
  
  const hasEmpathy = empathyIndicators.some(pattern => pattern.test(response))
  
  const dismissiveIndicators = [
    /just|simply|merely|only/i,
    /don'?t worry|stop worrying/i
  ]
  
  const isDismissive = dismissiveIndicators.some(pattern => pattern.test(response))
  
  return {
    hasEmpathy,
    isDismissive,
    score: hasEmpathy ? (isDismissive ? 0.5 : 1.0) : (isDismissive ? 0 : 0.7)
  }
}
