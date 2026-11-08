export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  modelUsed?: string;
  warning?: string;
}

export interface ChatResponse {
  success: boolean;
  text: string;
  model: string;
  warning?: string;
  error?: string;
}

export interface MusicResponse {
  success: boolean;
  audioBase64: string;
  mimeType: string;
  lyrics?: string;
  model: string;
  error?: string;
}

export interface ImageResponse {
  success: boolean;
  imageUrl: string;
  model: string;
  error?: string;
}

export interface VideoResponse {
  success: boolean;
  videoUrl: string;
  model: string;
  aspectRatio: string;
  error?: string;
}

export interface TranscribeResponse {
  success: boolean;
  transcript: string;
  model: string;
  wordCount: number;
  error?: string;
}

export const aiApi = {
  // 1. Gemini Multi-Turn Chat
  async sendChat(params: {
    messages: Array<{ role: 'user' | 'model'; text: string }>;
    model?: 'gemini-4-argon' | 'gemini-3.8-flash' | 'gemini-3.1-flash-lite';
    systemInstruction?: string;
    role?: string;
  }): Promise<ChatResponse> {
    const res = await fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Chat request failed');
    }
    return data;
  },

  // 2. Lyria Music Generation
  async generateMusic(params: {
    prompt: string;
    model?: 'lyria-3-clip-preview' | 'lyria-3-pro-preview';
  }): Promise<MusicResponse> {
    const res = await fetch('/api/v1/ai/music', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Music generation failed');
    }
    return data;
  },

  // 3. Create Image (gemini-nano-banana-2.1)
  async generateImage(params: {
    prompt: string;
    aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
    imageSize?: '1K' | '2K';
  }): Promise<ImageResponse> {
    const res = await fetch('/api/v1/ai/image/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Image generation failed');
    }
    return data;
  },

  // 4. Edit Image (gemini-nano-banana-2.1)
  async editImage(params: {
    prompt: string;
    imageBase64: string;
    mimeType?: string;
  }): Promise<ImageResponse> {
    const res = await fetch('/api/v1/ai/image/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Image editing failed');
    }
    return data;
  },

  // 5. Generate Video from Text (gemini-omni-1.2-flash via Interactions API)
  async generateVideo(params: {
    prompt: string;
    aspectRatio?: '16:9' | '9:16';
    duration?: string;
    resolution?: string;
  }): Promise<VideoResponse> {
    const res = await fetch('/api/v1/ai/video/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Video generation failed');
    }
    return data;
  },

  // 6. Animate Image into Video (gemini-omni-1.2-flash via Interactions API)
  async animateImageToVideo(params: {
    imageBase64: string;
    mimeType?: string;
    prompt?: string;
    aspectRatio?: '16:9' | '9:16';
  }): Promise<VideoResponse> {
    const res = await fetch('/api/v1/ai/video/animate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Video animation failed');
    }
    return data;
  },

  // 7. Transcribe Audio (gemini-3.5-transcribe)
  async transcribeAudio(params: {
    audioBase64: string;
    mimeType?: string;
  }): Promise<TranscribeResponse> {
    const res = await fetch('/api/v1/ai/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Audio transcription failed');
    }
    return data;
  }
};
