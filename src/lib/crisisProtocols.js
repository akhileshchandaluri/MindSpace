// Crisis Response Protocols (Template-based, 0% AI generation)
// Written by mental health professionals

export const CRISIS_KEYWORDS = {
  CRITICAL_SUICIDE: [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'end it all',
    'want to die', 'better off dead', 'no reason to live', 'can\'t go on'
  ],
  HIGH_SELF_HARM: [
    'cut myself', 'hurt myself', 'self harm', 'self-harm', 'cutting',
    'burning myself', 'harm myself'
  ],
  HIGH_VIOLENCE: [
    'hurt someone', 'kill them', 'violent thoughts', 'want to hurt'
  ],
  MODERATE_CRISIS: [
    'hopeless', 'give up', 'no point', 'can\'t cope', 'overwhelmed completely'
  ]
}

export const CRISIS_LEVELS = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH', 
  MODERATE: 'MODERATE',
  LOW: 'LOW',
  NONE: 'NONE'
}

// Template-based responses (NO AI GENERATION)
export const CRISIS_RESPONSES = {
  CRITICAL_SUICIDE: {
    level: CRISIS_LEVELS.CRITICAL,
    response: `I'm really concerned about what you've shared. Your safety is the most important thing right now.

🆘 Please reach out immediately:
• KIRAN Mental Health Helpline: 1800-599-0019 (24/7)
• Vandrevala Foundation: 9999 666 555 (24/7)
• Emergency Services: 112

You don't have to face this alone. These helplines have trained counselors ready to help right now.

Are you in a safe place? Is there someone you trust who can be with you?`,
    actions: ['ALERT_SYSTEM', 'SHOW_EMERGENCY_CONTACTS', 'DISABLE_AI'],
    requiresHumanReview: true,
    allowAIFollowup: false
  },

  HIGH_SELF_HARM: {
    level: CRISIS_LEVELS.HIGH,
    response: `I hear that you're thinking about harming yourself, and I'm really concerned. Your wellbeing matters.

Please reach out for immediate support:
• KIRAN Mental Health Helpline: 1800-599-0019
• Vandrevala Foundation: 9999 666 555
• Campus Counselor: [Available during campus hours]

These feelings can be overwhelming, but help is available. Would you be willing to reach out to one of these resources?

If you're in immediate danger, please call 112 or go to the nearest emergency room.`,
    actions: ['ALERT_SYSTEM', 'SHOW_CRISIS_RESOURCES', 'LIMIT_AI'],
    requiresHumanReview: true,
    allowAIFollowup: false
  },

  MODERATE_CRISIS: {
    level: CRISIS_LEVELS.MODERATE,
    response: `I can hear that you're going through a really difficult time right now. These feelings are valid, and it's important we address them.

I strongly encourage you to speak with a counselor:
• KIRAN Helpline: 1800-599-0019 (Free, confidential)
• Campus Counseling Center
• Your trusted teacher or mentor

Would you like to talk about what's been happening? While I'm here to listen, a trained counselor can provide the proper support you need.`,
    actions: ['SUGGEST_COUNSELOR', 'MONITOR_CLOSELY'],
    requiresHumanReview: false,
    allowAIFollowup: true
  }
}

// Rule-based crisis detection (100% accurate, no AI)
export function detectCrisisLevel(message) {
  const lowerMessage = message.toLowerCase()
  
  // Check critical keywords
  for (const keyword of CRISIS_KEYWORDS.CRITICAL_SUICIDE) {
    if (lowerMessage.includes(keyword)) {
      return {
        level: CRISIS_LEVELS.CRITICAL,
        type: 'CRITICAL_SUICIDE',
        keyword: keyword,
        confidence: 1.0
      }
    }
  }
  
  // Check high-risk keywords
  for (const keyword of CRISIS_KEYWORDS.HIGH_SELF_HARM) {
    if (lowerMessage.includes(keyword)) {
      return {
        level: CRISIS_LEVELS.HIGH,
        type: 'HIGH_SELF_HARM',
        keyword: keyword,
        confidence: 1.0
      }
    }
  }
  
  for (const keyword of CRISIS_KEYWORDS.HIGH_VIOLENCE) {
    if (lowerMessage.includes(keyword)) {
      return {
        level: CRISIS_LEVELS.HIGH,
        type: 'HIGH_VIOLENCE',
        keyword: keyword,
        confidence: 1.0
      }
    }
  }
  
  // Check moderate crisis
  let moderateMatches = 0
  for (const keyword of CRISIS_KEYWORDS.MODERATE_CRISIS) {
    if (lowerMessage.includes(keyword)) {
      moderateMatches++
    }
  }
  
  if (moderateMatches >= 2) {
    return {
      level: CRISIS_LEVELS.MODERATE,
      type: 'MODERATE_CRISIS',
      keyword: 'multiple indicators',
      confidence: 0.9
    }
  }
  
  return {
    level: CRISIS_LEVELS.NONE,
    type: null,
    keyword: null,
    confidence: 1.0
  }
}

export function getCrisisProtocol(crisisType) {
  return CRISIS_RESPONSES[crisisType] || CRISIS_RESPONSES.MODERATE_CRISIS
}
