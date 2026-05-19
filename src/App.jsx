import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LangProvider } from './hooks/useLang';
import { LandingPage } from './pages/LandingPage';
import { GiftFormPage } from './pages/GiftFormPage';
import { CompletePage } from './pages/CompletePage';
import { GiftPage } from './pages/GiftPage';

function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/gift-form" element={<GiftFormPage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route path="/gift/:giftId" element={<GiftPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center px-5 text-center" style={{ backgroundColor: '#0F0F14' }}>
              <div className="text-4xl mb-4">🎵</div>
              <h1 className="text-xl font-semibold mb-2" style={{ color: '#F0F0F5' }}>Page not found</h1>
              <a href="/" className="text-sm font-medium underline" style={{ color: '#6BA3D6' }}>Go home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}

export default App;
