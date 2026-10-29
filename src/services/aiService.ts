import { ChatMessage, Opportunity, UserProfile } from '../types';

export const aiService = {
  async sendChatMessage(
    message: string,
    history: ChatMessage[],
    userProfile: UserProfile
  ): Promise<{ reply: string; source: 'gemini' | 'demo-fallback' }> {
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: history.map((h) => ({ role: h.role, text: h.text })),
          userProfile,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      return { reply: data.reply, source: data.source || 'gemini' };
    } catch (err) {
      console.warn('AI chat error, using local fallback:', err);
      return {
        reply: `Halo ${userProfile.name}! Saya siap membantumu di CampusOne. Kamu dapat menanyakan seputar peluang beasiswa, panduan materi di QuestLearn, mencari study partner di PeerMatch, atau memesan fasilitas di SmartCampus!`,
        source: 'demo-fallback',
      };
    }
  },

  async getOpportunityAdvice(
    action: 'requirements' | 'checklist' | 'motivation_tips' | 'match_advice',
    opportunity: Opportunity,
    userProfile: UserProfile
  ): Promise<{ result: string; source: 'gemini' | 'demo-fallback' }> {
    try {
      const res = await fetch('/api/ai/opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          opportunity,
          userProfile,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      return { result: data.result, source: data.source || 'gemini' };
    } catch (err) {
      console.warn('Opportunity AI error, using local fallback:', err);
      return {
        result: `### 📋 Rekomendasi Persiapan Cepat\n\nUntuk mendaftar **${opportunity.title}**, pastikan kamu menyiapkan Transkrip Akademik terbaru, CV terformat rapi, dan Surat Rekomendasi dari dekanat kampus.`,
        source: 'demo-fallback',
      };
    }
  },

  async getQuestLearnExplanation(
    action: 'explain' | 'example' | 'quiz' | 'study_plan',
    topic: string,
    context: string,
    userProfile: UserProfile
  ): Promise<{ result: string; source: 'gemini' | 'demo-fallback' }> {
    try {
      const res = await fetch('/api/ai/questlearn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          topic,
          context,
          userProfile,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const data = await res.json();
      return { result: data.result, source: data.source || 'gemini' };
    } catch (err) {
      console.warn('QuestLearn AI error, using local fallback:', err);
      return {
        result: `### 🧠 Penjelasan Singkat: ${topic}\n\nTopik ini penting untuk memahami struktur dan efisiensi algoritma komputasi. Cobalah latihan implementasi langsung dan uji pemahamanmu dengan kuis interaktif!`,
        source: 'demo-fallback',
      };
    }
  },
};
