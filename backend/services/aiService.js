import OpenAI from 'openai';

// Lazy initialization - only create client when needed
let openai = null;

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is missing. Please add it to your .env file');
    }
    openai = new OpenAI({ apiKey });
  }
  return openai;
}

export async function generateTripPlan(destination, days, budgetType, interests) {
  const prompt = `Generate a travel itinerary for ${destination} for ${days} days. Budget type: ${budgetType}. Interests: ${interests.join(', ')}. 
  Return ONLY valid JSON with this exact structure (no other text before or after):
  {
    "itinerary": [{"day": 1, "activities": ["activity1", "activity2"]}, {"day": 2, "activities": ["activity1", "activity2"]}],
    "budget": {"flights": number, "accommodation": number, "food": number, "activities": number, "total": number},
    "hotels": [{"name": "Hotel Name", "description": "short description with price indication"}]
  }`;

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    // Clean the response in case it has markdown formatting
    const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI Generation Error:', error.message);
    // Return a fallback response if AI fails
    return getFallbackResponse(destination, days, budgetType, interests);
  }
}

export async function regenerateDay(destination, days, existingActivities, dayIndex, instruction) {
  const prompt = `We have a trip to ${destination} for ${days} days. Current day ${dayIndex} activities: ${JSON.stringify(existingActivities)}. 
  Regenerate this day based on instruction: "${instruction}". Return ONLY a JSON array of activities for day ${dayIndex}, like this example: ["Visit museum", "Lunch at cafe", "Evening walk"].`;

  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Regeneration Error:', error.message);
    // Return original activities if regeneration fails
    return existingActivities;
  }
}

// Fallback response when AI is unavailable
function getFallbackResponse(destination, days, budgetType, interests) {
  const itinerary = [];
  for (let i = 1; i <= days; i++) {
    itinerary.push({
      day: i,
      activities: [
        `Morning exploration of ${destination}`,
        `Local cuisine tasting (${interests[0] || 'Food'} focus)`,
        `Afternoon sightseeing`,
        `Evening relaxation`
      ]
    });
  }
  
  let multiplier = budgetType === 'Low' ? 0.7 : budgetType === 'High' ? 1.5 : 1;
  const baseCost = 500;
  
  return {
    itinerary,
    budget: {
      flights: Math.round(300 * multiplier),
      accommodation: Math.round(200 * multiplier),
      food: Math.round(150 * multiplier),
      activities: Math.round(100 * multiplier),
      total: Math.round(750 * multiplier)
    },
    hotels: [
      { name: `${destination} Grand Hotel`, description: `${budgetType} range option with good amenities` },
      { name: `${destination} Boutique Stay`, description: `Centrally located, ${budgetType.toLowerCase()} budget` }
    ]
  };
}