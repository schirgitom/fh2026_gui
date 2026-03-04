import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegister } from '@/features/auth/hooks/useAuth';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useI18n } from '@/i18n/LanguageProvider';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, error } = useRegister();
  const { t } = useI18n();
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await mutateAsync(form);
    navigate('/login');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="subheading">{t('auth.register.welcome')}</p>
        <h2 className="text-2xl font-semibold text-ink-900">{t('auth.register.title')}</h2>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={t('auth.firstName')}
            value={form.firstName}
            onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
          />
          <Input
            label={t('auth.lastName')}
            value={form.lastName}
            onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
          />
        </div>
        <Input
          label={t('auth.email')}
          type="email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <Input
          label={t('auth.password')}
          type="password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {(error as Error).message}
          </div>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>
      </form>
      <p className="text-sm text-ink-600">
        {t('auth.register.prompt')}{' '}
        <Link className="font-semibold text-sea-600" to="/login">
          {t('auth.register.link')}
        </Link>
      </p>
    </div>
  );
};
