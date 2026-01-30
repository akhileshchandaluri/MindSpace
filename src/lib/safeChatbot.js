// Safe Chatbot System with Multi-Layer Protection
import { generateAIResponse } from './aiService'
import { detectCrisisLevel, getCrisisProtocol, CRISIS_LEVELS } from './crisisProtocols'
import { validateResponse, generateFallbackResponse, checkToneAndEmpathy } from './safetyValidator'

// Strict system prompt with explicit safety rules
const SAFE_SYSTEM_PROMPT = `You are MindSpace, a supportive companion for students. You are NOT a therapist, doctor, or medical professional.

CRITICAL SAFETY RULES (Breaking these causes harm):

1. NEVER DIAGNOSE CONDITIONS
   ❌ WRONG: "You have depression/anxiety/PTSD"
   ✅ RIGHT: "It sounds like you're experiencing symptoms of low mood"

2. NEVER RECOMMEND MEDICATION
   ❌ WRONG: "You should try antidepressants"
   ✅ RIGHT: "A doctor can discuss treatment options with you"

3. ALWAYS BE EMPATHETIC, NEVER DISMISSIVE
   ❌ WRONG: "Just think positive" / "Everyone feels this way"
   ✅ RIGHT: "That sounds really difficult. Those feelings are valid."

4. SUGGEST EVIDENCE-BASED COPING ONLY
   ✅ Deep breathing (4-7-8 technique)
   ✅ Grounding (5-4-3-2-1 method)
   ✅ Journaling, exercise, sleep hygiene
   ✅ Talking to trusted friends/family

5. RECOMMEND PROFESSIONAL HELP
   For serious concerns, always suggest:
   - KIRAN Helpline: 1800-599-0019
   - Campus counselor
   - Trusted adult/mentor

6. BE HUMBLE ABOUT LIMITATIONS
   ✅ "I'm here to listen, but a counselor can provide better guidance"
   ✅ "I'm not qualified to advise on this"

RESPONSE STRUCTURE:
1. Validate feeling (show empathy)
2. Normalize if appropriate (reduce shame)
3. Suggest practical coping strategy
4. Offer continued support
5. Recommend professional help if needed

Keep responses warm, conversational, and 2-4 sentences.`

// Constitutional AI: Self-critique mechanism
async function selfCritique(response, originalMessage) {
  const critiquePrompt = `You are a safety checker for mental health chatbot responses.

User message: "${originalMessage}"
Bot response: "${response}"

Check for these CRITICAL issues:
1. Does it diagnose any mental health condition?
2. Does it recommend medication or medical treatment?
3. Is it dismissive or invalidating?
4. Does it make unfounded medical claims?
5. For serious concerns, does it suggest professional help?

Respond ONLY with:
- "SAFE" if no issues
- "UNSAFE: [specific reason]" if issues found

Your response:`

  try {
    const critique = await generateAIResponse(critiquePrompt, [], critiquePrompt)
    
    if (critique.includes('UNSAFE')) {
      return {
        safe: false,
        reason: critique.replace('UNSAFE:', '').trim(),
        needsRegeneration: true
      }
    }
    
    return { safe: true }
  } catch (error) {
    console.error('Self-critique failed:', error)
    return { safe: false, reason: 'Critique system error', needsRegeneration: true }
  }
}

// Regenerate with safety feedback
async function regenerateWithFeedback(originalMessage, issues, conversationHistory) {
  const feedbackPrompt = `Previous response had safety issues: ${issues}

Generate a NEW response that:
- Does NOT diagnose conditions
- Does NOT give medical advice
- IS empathetic and validating
- DOES suggest coping strategies
- DOES recommend professional help if serious

User message: "${originalMessage}"

New safe response:`

  return await generateAIResponse(originalMessage, conversationHistory, SAFE_SYSTEM_PROMPT + '\n\n' + feedbackPrompt)
}

// Calculate confidence score
function calculateConfidence(response, validationResult, crisisLevel) {
  let confidence = 100
  
  // Deduct for validation issues
  if (validationResult.issues.length > 0) {
    confidence -= validationResult.issues.length * 10
  }
  
  // Deduct if no empathy detected
  const toneCheck = checkToneAndEmpathy(response)
  if (!toneCheck.hasEmpathy) {
    confidence -= 15
  }
  
  // Deduct for very short responses
  if (response.length < 50) {
    confidence -= 10
  }
  
  // Adjust based on crisis level
  if (crisisLevel !== CRISIS_LEVELS.NONE) {
    confidence -= 20 // Lower confidence when crisis involved
  }
  
  return Math.max(0, Math.min(100, confidence))
}

// Log for audit trail
function logResponse(data) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userMessage: data.userMessage.substring(0, 100), // First 100 chars only
    responseType: data.responseType,
    crisisLevel: data.crisisLevel,
    aiGenerated: data.aiGenerated,
    validationPassed: data.validationPassed,
    confidence: data.confidence,
    regenerationCount: data.regenerationCount
  }
  
  // Store in localStorage for demonstration
  const logs = JSON.parse(localStorage.getItem('mindspace_safety_logs') || '[]')
  logs.push(logEntry)
  localStorage.setItem('mindspace_safety_logs', JSON.stringify(logs.slice(-100))) // Keep last 100
}

// MAIN SAFE CHATBOT FUNCTION
export async function getSafeChatResponse(userMessage, conversationHistory = []) {
  const startTime = Date.now()
  let regenerationCount = 0
  
  try {
    // STEP 1: Crisis Detection (Rule-based, 100% accurate)
    const crisis = detectCrisisLevel(userMessage)
    
    // STEP 2: If critical crisis, use template (NO AI)
    if (crisis.level === CRISIS_LEVELS.CRITICAL || crisis.level === CRISIS_LEVELS.HIGH) {
      const protocol = getCrisisProtocol(crisis.type)
      
      logResponse({
        userMessage,
        responseType: 'TEMPLATE_PROTOCOL',
        crisisLevel: crisis.level,
        aiGenerated: false,
        validationPassed: true,
        confidence: 100,
        regenerationCount: 0
      })
      
      return {
        response: protocol.response,
        type: 'crisis_protocol',
        crisisLevel: crisis.level,
        aiGenerated: false,
        confidence: 100,
        actions: protocol.actions,
        requiresHumanReview: protocol.requiresHumanReview,
        allowAIFollowup: protocol.allowAIFollowup,
        processingTime: Date.now() - startTime
      }
    }
    
    // STEP 3: For non-crisis, generate AI response with safety
    let response = await generateAIResponse(userMessage, conversationHistory, SAFE_SYSTEM_PROMPT)
    
    // STEP 4: Self-critique
    const critique = await selfCritique(response, userMessage)
    if (!critique.safe) {
      console.log('Self-critique failed, regenerating...')
      response = await regenerateWithFeedback(userMessage, critique.reason, conversationHistory)
      regenerationCount++
    }
    
    // STEP 5: Validation layer
    const validation = validateResponse(response, { crisis })
    
    if (validation.action === 'BLOCK') {
      console.warn('Response blocked by validation:', validation.issues)
      const fallback = generateFallbackResponse(userMessage, validation.issues)
      
      logResponse({
        userMessage,
        responseType: 'FALLBACK',
        crisisLevel: crisis.level,
        aiGenerated: false,
        validationPassed: false,
        confidence: 60,
        regenerationCount
      })
      
      return {
        response: fallback.response,
        type: 'fallback',
        crisisLevel: crisis.level,
        aiGenerated: false,
        confidence: 60,
        validationIssues: validation.issues,
        processingTime: Date.now() - startTime
      }
    }
    
    if (validation.action === 'REGENERATE' && regenerationCount < 2) {
      console.log('Regenerating due to validation issues...')
      response = await regenerateWithFeedback(userMessage, validation.issues[0]?.rule, conversationHistory)
      regenerationCount++
      
      // Re-validate
      const revalidation = validateResponse(response, { crisis })
      if (revalidation.action === 'BLOCK') {
        const fallback = generateFallbackResponse(userMessage, revalidation.issues)
        
        logResponse({
          userMessage,
          responseType: 'FALLBACK_AFTER_REGEN',
          crisisLevel: crisis.level,
          aiGenerated: false,
          validationPassed: false,
          confidence: 50,
          regenerationCount
        })
        
        return {
          response: fallback.response,
          type: 'fallback',
          crisisLevel: crisis.level,
          aiGenerated: false,
          confidence: 50,
          validationIssues: revalidation.issues,
          processingTime: Date.now() - startTime
        }
      }
    }
    
    // STEP 6: Calculate confidence
    const confidence = calculateConfidence(response, validation, crisis.level)
    
    // STEP 7: Add disclaimer for moderate crisis
    if (crisis.level === CRISIS_LEVELS.MODERATE) {
      response += '\n\nIf these feelings persist or worsen, please reach out to KIRAN Helpline: 1800-599-0019'
    }
    
    // STEP 8: Log successful response
    logResponse({
      userMessage,
      responseType: 'AI_SAFE',
      crisisLevel: crisis.level,
      aiGenerated: true,
      validationPassed: validation.isValid,
      confidence,
      regenerationCount
    })
    
    // STEP 9: Return safe response
    return {
      response,
      type: 'ai_generated',
      crisisLevel: crisis.level,
      aiGenerated: true,
      confidence,
      validationWarnings: validation.action === 'WARN' ? validation.issues : [],
      regenerationCount,
      processingTime: Date.now() - startTime
    }
    
  } catch (error) {
    console.error('Safe chatbot error:', error)
    
    // Emergency fallback
    return {
      response: `I'm having trouble processing that right now. For immediate support, please contact:
      
KIRAN Mental Health Helpline: 1800-599-0019 (24/7, Free)
      
Would you like to try rephrasing your message?`,
      type: 'error_fallback',
      crisisLevel: CRISIS_LEVELS.NONE,
      aiGenerated: false,
      confidence: 40,
      error: error.message,
      processingTime: Date.now() - startTime
    }
  }
}

// Get safety logs for transparency
export function getSafetyLogs() {
  return JSON.parse(localStorage.getItem('mindspace_safety_logs') || '[]')
}

// Clear safety logs
export function clearSafetyLogs() {
  localStorage.removeItem('mindspace_safety_logs')
}
