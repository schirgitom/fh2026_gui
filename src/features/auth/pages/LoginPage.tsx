import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useI18n } from '@/i18n/LanguageProvider';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useLogin();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync({ email, password });
    navigate('/');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="subheading">{t('auth.login.welcome')}</p>
        <h2 className="text-2xl font-semibold text-ink-900">{t('auth.login.title')}</h2>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {(error as Error).message}
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? t('auth.login.submitting') : t('auth.login.submit')}
        </Button>
      </form>
      <p className="text-sm text-ink-600">
        {t('auth.login.prompt')}{' '}
        <Link className="font-semibold text-sea-600" to="/register">
          {t('auth.login.link')}
        </Link>
      </p>
    </div>
  );
};
