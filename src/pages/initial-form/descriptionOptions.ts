export const DESCRIPTION_OPTIONS_ES = [
    {
      "group": "lifestyle",
      "items": [
        "Lector/a",
        "Cinéfilo/a",
        "Amante de la música",
        "Rockero/a",
        "Gamer",
        "Friki",
        "Otaku",
        "Cocinillas",
        "Foodie",
        "Viajero/a",
        "Deportista",
        "Yogui",
        "Creativo/a",
        "Fotógrafo/a"
      ]
    },
    {
      "group": "personality",
      "items": [
        "Introvertido/a",
        "Extrovertido/a",
        "Reflexivo/a",
        "Curioso/a",
        "Idealista",
        "Organizado/a",
        "Social",
        "Silencioso/a",
        "Apasionado/a",
        "Espiritual",
        "Romántico/a",
        "Pragmático/a",
        "Sensible",
        "Sarcástico/a"
      ]
    },
    {
      "group": "feelings",
      "items": [
        "Feliz",
        "Optimista",
        "Tranquilo/a",
        "Cansado/a",
        "Ansioso/a",
        "Nostálgico/a",
        "Aburrido/a",
        "Desmotivado/a",
        "Esperanzado/a",
        "Confuso/a",
        "Agradecido/a",
        "Resiliente"
      ]
    }
  ]

  export const DESCRIPTION_OPTIONS_EN = [
    {
      "group": "lifestyle",
      "items": [
        "Reader",
        "Movie lover",
        "Music lover",
        "Rocker",
        "Gamer",
        "Geek",
        "Otaku",
        "Cook",
        "Foodie",
        "Traveler",
        "Athlete",
        "Yogi",
        "Creative",
        "Photographer"
      ]
    },
    {
      "group": "personality",
      "items": [
        "Introverted",
        "Extroverted",
        "Thoughtful",
        "Curious",
        "Idealistic",
        "Organized",
        "Social",
        "Quiet",
        "Passionate",
        "Spiritual",
        "Romantic",
        "Pragmatic",
        "Sensitive",
        "Sarcastic"
      ]
    },
    {
      "group": "feelings",
      "items": [
        "Happy",
        "Optimistic",
        "Calm",
        "Tired",
        "Anxious",
        "Nostalgic",
        "Bored",
        "Unmotivated",
        "Hopeful",
        "Confused",
        "Grateful",
        "Resilient"
      ]
    }
  ]
  
  export const DESCRIPTION_OPTIONS_CA = [
    {
      "group": "lifestyle",
      "items": [
        "Lector/a",
        "Cineasta",
        "Amant de la música",
        "Rocker",
        "Gamer",
        "Friki",
        "Otaku",
        "Cuiner/a",
        "Foodie",
        "Viatger/a",
        "Esportista",
        "Iogui",
        "Creatiu/va",
        "Fotògraf/a"
      ]
    },
    {
      "group": "personality",
      "items": [
        "Introvertit/da",
        "Extrovertit/da",
        "Reflexiu/va",
        "Curiós/osa",
        "Idealista",
        "Organitzat/da",
        "Social",
        "Silenciós/osa",
        "Apasionat/da",
        "Espiritual",
        "Romàntic/ca",
        "Pragmàtic/ca",
        "Sensible",
        "Sarcàstic/ca"
      ]
    },
    {
      "group": "feelings",
      "items": [
        "Feliç",
        "Optimista",
        "Tranquil/la",
        "Cansat/ada",
        "Ansiós/osa",
        "Nostàlgic/ca",
        "Avorrit/da",
        "Desmotivat/da",
        "Esperançat/ada",
        "Confús/osa",
        "Agraït/ida",
        "Resilient"
      ]
    }
  ]
  
export const DESCRIPTION_OPTIONS = (language?: string) => {
  if (language === "ca") return DESCRIPTION_OPTIONS_CA
  if (language === "en") return DESCRIPTION_OPTIONS_EN
  return DESCRIPTION_OPTIONS_ES
}