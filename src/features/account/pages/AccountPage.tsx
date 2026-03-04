import { FormEvent, useEffect, useState } from 'react';
import { PageHeader } from '@/shared/components/PageHeader';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useI18n } from '@/i18n/LanguageProvider';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useAccountProfile, useAccountUpdate } from '@/features/account/hooks/useAccount';
import { Skeleton } from '@/shared/ui/Skeleton';

interface AccountForm {
  firstName: string;
  lastName: string;
  email: string;
}

export const AccountPage = () => {
  const { t } = useI18n();
  const user = useAuthStore((state) => state.user);
  const profileQuery = useAccountProfile();
  const profile = profileQuery.data ?? user;
  const updateAccount = useAccountUpdate();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<AccountForm>({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    setForm({
      firstName: profile?.firstName ?? '',
      lastName: profile?.lastName ?? '',
      email: profile?.email ?? ''
    });
  }, [profile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!profile?.id) return;
    setSaved(false);
    try {
      await updateAccount.mutateAsync({
        id: profile.id,
        email: form.email,
        firstName: form.firstName || undefined,
        lastName: form.lastName || undefined
      });
      setSaved(true);
    } catch {
      setSaved(false);
    }
  };

  if (profileQuery.isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (!profile?.id) {
    return (
      <Card>
        <p className="text-ink-600">{t('account.missingUser')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title={t('account.title')} subtitle={t('account.subtitle')} />

      <Card>
        <form className="space-y-4" onSubmit={handleSubmit}>
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

          {updateAccount.isError && (
            <p className="text-sm text-red-600">{t('account.saveError')}</p>
          )}
          {saved && !updateAccount.isPending && (
            <p className="text-sm text-emerald-600">{t('account.saveSuccess')}</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={updateAccount.isPending}>
              {updateAccount.isPending ? t('account.saving') : t('account.save')}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-ink-900">{t('account.passwordTitle')}</h3>
        <p className="mt-2 text-sm text-ink-600">{t('account.passwordNotice')}</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label={t('account.passwordCurrent')} type="password" disabled value="" />
          <Input label={t('account.passwordNew')} type="password" disabled value="" />
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="button" disabled>
            {t('account.passwordSave')}
          </Button>
        </div>
      </Card>
    </div>
  );
};
