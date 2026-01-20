import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
})

export const generateAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are MindSpace, a compassionate AI mental health companion for students. You provide:
- Empathetic, non-judgmental support
- Active listening and validation
- Coping strategies and mindfulness techniques
- Crisis detection and appropriate resource referrals

Guidelines:
- Be warm, understanding, and supportive
- Ask clarifying questions to understand better
- Validate feelings without minimizing them
- Suggest healthy coping mechanisms
- If crisis keywords detected (suicide, self-harm), immediately provide helpline numbers
- Keep responses concise but meaningful (2-4 sentences)
- Use a conversational, friendly tone

IMPORTANT: If user mentions suicide, self-harm, or severe crisis:
Immediately respond: "I'm really concerned about what you've shared. Your safety is the most important thing right now. Please reach out immediately to:
• KIRAN Mental Health Helpline: 1800-599-0019
• Vandrevala Foundation: 9999 666 555
• Emergency Services: 112"`
      },
      ...conversationHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: userMessage
      }
    ]

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
      stream: false
    })

    return completion.choices[0]?.message?.content || 'I understand. Could you tell me more about what you\'re going through?'
  } catch (error) {
    console.error('Groq API Error:', error)
    
    // Fallback response
    if (error.message?.includes('API key')) {
      return 'I\'m having trouble connecting right now. Please check back in a moment.'
    }
    
    return 'I\'m here to listen. Could you share more about what\'s on your mind?'
  }
}

export const detectCrisis = (text) => {
  const crisisKeywords = [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'end it all',
    'want to die', 'better off dead', 'self-harm', 'hurt myself',
    'cut myself', 'no reason to live'
  ]
  
  const lowerText = text.toLowerCase()
  return crisisKeywords.some(keyword => lowerText.includes(keyword))
}

export const detectEmotion = (text) => {
  const lowerText = text.toLowerCase()
  
  const emotionPatterns = {
    anxious: ['anxious', 'worried', 'nervous', 'panic', 'overwhelmed', 'stressed', 'anxiety'],
    sad: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'lonely', 'depression'],
    angry: ['angry', 'frustrated', 'mad', 'irritated', 'annoyed', 'furious'],
    happy: ['happy', 'good', 'great', 'excited', 'joyful', 'content', 'wonderful'],
    tired: ['tired', 'exhausted', 'drained', 'burnout', 'fatigued', 'burnt out']
  }

  for (const [emotion, keywords] of Object.entries(emotionPatterns)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      const stressLevel = ['anxious', 'sad', 'angry'].includes(emotion) ? 7 : 3
      return { emotion, stressLevel }
    }
  }

  return { emotion: 'neutral', stressLevel: 5 }
}
