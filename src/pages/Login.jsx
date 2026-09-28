import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';

function Login() {
  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Google sign-in failed. Please try again.');
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Memory Search</h1>

        <p>
          Your private space for notes, photos, videos,
          and voice memories.
        </p>

        <button
          type="button"
          className="google-login-button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Login;