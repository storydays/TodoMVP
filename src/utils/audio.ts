export const playTaskCompletionCommentary = (taskTitle: string, difficulty: string, points: number) => {
  if ('speechSynthesis' in window) {
    const commentaries = [
      `Fantastic! You just scored ${points} points by completing "${taskTitle}"! That ${difficulty} shot was pure excellence!`,
      `Outstanding performance! "${taskTitle}" is complete for ${points} points! Your ${difficulty} execution was flawless!`,
      `What a play! You dominated that ${difficulty} task "${taskTitle}" and earned ${points} points! Keep this momentum going!`,
      `Incredible! "${taskTitle}" is in the books for ${points} points! That ${difficulty} challenge didn't stand a chance!`,
      `Perfect execution! You just crushed "${taskTitle}" and scored ${points} points! Your ${difficulty} skills are on fire!`,
      `Amazing work! "${taskTitle}" complete for ${points} points! That ${difficulty} task was handled like a true champion!`
    ];

    const randomCommentary = commentaries[Math.floor(Math.random() * commentaries.length)];
    const utterance = new SpeechSynthesisUtterance(randomCommentary);
    
    // Set voice properties for energetic commentary
    utterance.rate = 1.2;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Try to use a more energetic voice if available
    const voices = speechSynthesis.getVoices();
    const energeticVoices = voices.filter(voice => 
      voice.name.toLowerCase().includes('male') || 
      voice.name.toLowerCase().includes('david') ||
      voice.name.toLowerCase().includes('mark') ||
      voice.name.toLowerCase().includes('daniel')
    );
    
    if (energeticVoices.length > 0) {
      utterance.voice = energeticVoices[0];
    }

    speechSynthesis.speak(utterance);
  }
};

export const playFireworkSound = () => {
  // Create audio context for firework sound effect
  if ('AudioContext' in window || 'webkitAudioContext' in window) {
    const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Create a burst sound effect
    const createBurstSound = (frequency: number, duration: number, delay: number = 0) => {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.1, audioContext.currentTime + duration);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
      }, delay);
    };
    
    // Create multiple burst sounds for firework effect
    createBurstSound(800, 0.3, 0);
    createBurstSound(600, 0.4, 100);
    createBurstSound(1000, 0.2, 200);
    createBurstSound(400, 0.5, 300);
  }
};