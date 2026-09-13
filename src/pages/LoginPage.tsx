import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  getProfileByCurrentUser,
  hasAdminRole,
  signInWithPassword,
  signOut,
} from '../services/authService';

export default function LoginPage() {
  const [email] = useState('');
  const [password] = useState('');
  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      await signInWithPassword({ email, password });
      const profile = await getProfileByCurrentUser();

      if (!hasAdminRole(profile?.app_role)) {
        await signOut();
        return;
      }

      navigate('/admin');
    } catch {
      return;
    }
  }

  void handleSubmit;

  return null;
}
