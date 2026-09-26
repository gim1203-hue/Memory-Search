import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function QuickActions({ addMemory, openNoteForm }) {
  const navigate = useNavigate();

  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const microphoneStreamRef = useRef(null);

  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceError, setVoiceError] = useState('');

  function makeDateKey(date) {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function handlePhotoClick() {
    photoInputRef.current?.click();
  }

  function handleVideoClick() {
    videoInputRef.current?.click();
  }

  async function handlePhotoSelected(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.');
      return;
    }

    const now = new Date();
    const newPhotoMemory = {
      id: Date.now(),
      date: makeDateKey(now),
      time: now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
      icon: '📸',
      title: file.name,
      description: 'Photo added from your device.',
      category: 'Daily Life',
      favorite: false,
      mediaType: 'photo',
    };

    await addMemory(newPhotoMemory, file);

    event.target.value = '';
  }

  async function handleVideoSelected(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      alert('Please choose a video file.');
      return;
    }

    const now = new Date();
    const newVideoMemory = {
      id: Date.now(),
      date: makeDateKey(now),
      time: now.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      }),
      icon: '🎥',
      title: file.name,
      description: 'Video added from your device.',
      category: 'Daily Life',
      favorite: false,
      mediaType: 'video',
    };

    await addMemory(newVideoMemory, file);

    event.target.value = '';
  }

  async function startVoiceRecording() {
    setVoiceError('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setVoiceError(
        'Microphone recording is not supported by this browser.'
      );
      return;
    }

    if (!window.MediaRecorder) {
      setVoiceError(
        'MediaRecorder is not supported by this browser.'
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      microphoneStreamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(
          audioChunksRef.current,
          {
            type:
              mediaRecorder.mimeType ||
              'audio/webm',
          }
        );

        const now = new Date();

        const newVoiceMemory = {
          id: Date.now(),
          date: makeDateKey(now),
          time: now.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
          }),
          icon: '🎙️',
          title: 'Voice Memo',
          description: 'Voice memo recorded from your microphone.',
          category: 'Personal',
          favorite: false,
          mediaType: 'audio',
        };

        await addMemory(newVoiceMemory, audioBlob);

        microphoneStreamRef.current?.getTracks().forEach(
          (track) => track.stop()
        );

        microphoneStreamRef.current = null;
        audioChunksRef.current = [];

        setShowVoiceRecorder(false);
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error('Microphone error:', error);

      setVoiceError(
        'Could not access the microphone. Please allow microphone permission and try again.'
      );
    }
  }

  function stopVoiceRecording() {
    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      return;
    }

    if (recorder.state === 'recording') {
      recorder.stop();
    }

    setIsRecording(false);
  }

  function closeVoiceRecorder() {
    if (isRecording) {
      return;
    }

    microphoneStreamRef.current?.getTracks().forEach(
      (track) => track.stop()
    );

    microphoneStreamRef.current = null;

    setVoiceError('');
    setShowVoiceRecorder(false);
  }

  return (
    <>
      <div className="panel quick-panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">QUICK ACCESS</p>
            <h3>Add Something</h3>
          </div>
        </div>
<div className="quick-actions">
  <button
  type="button"
  onClick={openNoteForm}
>
  <span>📝</span>
  New Note
</button>
          <button
            type="button"
            onClick={handlePhotoClick}
          >
            <span>📸</span>
            Add Photo
          </button>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoSelected}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={handleVideoClick}
          >
            <span>🎥</span>
            Add Video
          </button>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            onChange={handleVideoSelected}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            onClick={() => {
              setVoiceError('');
              setShowVoiceRecorder(true);
            }}
          >
            <span>🎙️</span>
            Voice Memo
          </button>

          <button
            type="button"
            onClick={() => navigate('/calendar')}
          >
            <span>📅</span>
            Open Calendar
          </button>

          <button
            type="button"
            onClick={() => navigate('/favorites')}
          >
            <span>⭐</span>
            Favorites
          </button>
        </div>
      </div>

      {showVoiceRecorder && (
        <div className="voice-recorder-overlay">
          <div className="voice-recorder-modal">
            <div className="panel-heading">
              <div>
                <p className="section-label">
                  VOICE MEMO
                </p>

                <h3>
                  {isRecording
                    ? 'Recording...'
                    : 'Record a Voice Memory'}
                </h3>
              </div>

              {!isRecording && (
                <button
                  type="button"
                  className="text-button"
                  onClick={closeVoiceRecorder}
                >
                  Close
                </button>
              )}
            </div>

            <div className="voice-recorder-content">
              <div
                className={`recording-indicator ${
                  isRecording ? 'recording' : ''
                }`}
              >
                🎙️
              </div>

              {isRecording ? (
                <p>
                  Recording is active. Speak into your microphone.
                </p>
              ) : (
                <p>
                  Press Start Recording, then allow microphone access
                  if your browser asks.
                </p>
              )}

              {voiceError && (
                <p className="voice-error">
                  {voiceError}
                </p>
              )}

              <div className="voice-recorder-actions">
                {!isRecording ? (
                  <button
                    type="button"
                    className="primary-button"
                    onClick={startVoiceRecording}
                  >
                    🎙️ Start Recording
                  </button>
                ) : (
                  <button
                    type="button"
                    className="record-stop-button"
                    onClick={stopVoiceRecording}
                  >
                    ⏹ Stop & Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QuickActions;
