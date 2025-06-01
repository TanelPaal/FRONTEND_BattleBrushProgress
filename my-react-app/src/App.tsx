import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './app/login/page';
import MiniCollectionPage from './app/miniaturecollection/page';
import MiniPaintSwatchPage from './app/minipaintswatch/page';
import MiniPaintSwatchCreatePage from './app/minipaintswatch/create/page';
import MiniPaintSwatchEditPage from './app/minipaintswatch/edit/[id]/page';
import MiniPaintSwatchDeletePage from './app/minipaintswatch/delete/[id]/page';
import PersonPaintsPage from './app/personpaints/page';
import PersonPaintsCreatePage from './app/personpaints/create/page';
import PersonPaintsEditPage from './app/personpaints/edit/[id]/page';
import PersonPaintsDeletePage from './app/personpaints/delete/[id]/page';
import RegisterPage from './app/register/page';
import HomePage from './app/page';
import PersonPage from './app/persons/page';
import PersonCreatePage from './app/persons/create/page';
import PersonEditPage from './app/persons/edit/[id]/page';
import PersonDeletePage from './app/persons/delete/[id]/page';
import MiniCollectionCreatePage from './app/miniaturecollection/create/page';
import MiniCollectionEditPage from './app/miniaturecollection/edit/[id]/page';
import MiniCollectionDeletePage from './app/miniaturecollection/delete/[id]/page';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      navigate('/login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/persons" element={<PersonPage />} />
      <Route path="/persons/create" element={<PersonCreatePage />} />
      <Route path="/persons/edit/:id" element={<PersonEditPage />} />
      <Route path="/persons/delete/:id" element={<PersonDeletePage />} />
      <Route path="/miniaturecollection" element={<MiniCollectionPage />} />
      <Route path="/miniaturecollection/create" element={<MiniCollectionCreatePage />} />
      <Route path="/miniaturecollection/edit/:id" element={<MiniCollectionEditPage />} />
      <Route path="/miniaturecollection/delete/:id" element={<MiniCollectionDeletePage />} />
      <Route path="/minipaintswatch" element={<MiniPaintSwatchPage />} />
      <Route path="/minipaintswatch/create" element={<MiniPaintSwatchCreatePage />} />
      <Route path="/minipaintswatch/edit/:id" element={<MiniPaintSwatchEditPage />} />
      <Route path="/minipaintswatch/delete/:id" element={<MiniPaintSwatchDeletePage />} />
      <Route path="/personpaints" element={<PersonPaintsPage />} />
      <Route path="/personpaints/create" element={<PersonPaintsCreatePage />} />
      <Route path="/personpaints/edit/:id" element={<PersonPaintsEditPage />} />
      <Route path="/personpaints/delete/:id" element={<PersonPaintsDeletePage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}
