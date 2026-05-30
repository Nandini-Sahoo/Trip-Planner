import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization - only create client when needed
let genAI = null;
let model = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing. Please add it to your .env file');
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
}

export async function generateTripPlan(destination, days, budgetType, interests) {
  const prompt = `
            Create a detailed ${days}-day travel itinerary for ${destination}.

            Budget: ${budgetType}
            Interests: ${interests.join(", ")}

            IMPORTANT:
            - Each day must be different.
            - Do not repeat activities.
            - Include real attractions, restaurants, and experiences.
            - Activities must be specific to ${destination}.

            Return ONLY valid JSON:
              {
                "itinerary": [
                  {
                    "day": 1,
                    "activities": ["activity1", "activity2"]
                  }
                ],
                "budget": {
                  "flights": 0,
                  "accommodation": 0,
                  "food": 0,
                  "activities": 0,
                  "total": 0
                },
                "hotels": [
                  {
                    "name": "Hotel Name",
                    "description": "Description"
                  }
                ]
              }
            `;

  try {
    const geminiModel = getGeminiClient();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response in case it has markdown formatting
    let cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON object in the response (in case there's extra text)
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Gemini AI Generation Error:', error.message);
    // Return a fallback response if AI fails
    return getFallbackResponse(destination, days, budgetType, interests);
  }
}

export async function regenerateDay(destination, days, existingActivities, dayIndex, instruction) {
  const prompt = `We have a trip to ${destination} for ${days} days. Current day ${dayIndex} activities: ${JSON.stringify(existingActivities)}. 
  Regenerate this day based on instruction: "${instruction}". 
  Return ONLY a JSON array of activities for day ${dayIndex}, like this example: ["Visit museum", "Lunch at cafe", "Evening walk"].
  Make the activities specific to ${destination}.`;

  try {
    const geminiModel = getGeminiClient();
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response
    let cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Find JSON array in the response
    const jsonMatch = cleanJson.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('Gemini Regeneration Error:', error.message);
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