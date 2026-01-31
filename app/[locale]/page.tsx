import LoginButton from "@/components/auth/LoginButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useTranslations } from 'next-intl';
import { Link } from '@/lib/i18n/routing';

export default function Home() {
  const t = useTranslations('LoginPage');
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F9F4EE] dark:bg-[#1a1a1a]">
      <div className="w-full max-w-md space-y-6">
        {/* Logo with Orange Background */}
        <div className="bg-[#C96442] rounded-lg p-4 shadow-md flex items-center justify-center">
          <img
            src="https://portal.science.kmitl.ac.th/_app/immutable/assets/sci-kmitl-logo.64kyxinc.avif"
            alt="School of Science KMITL"
            className="h-16 md:h-22"
          />
        </div>

        {/* Login Card */}
        <div className="bg-[#f9f4ed] dark:bg-[#2a2a2a] rounded-lg border border-orange-200 dark:border-gray-700 p-6 shadow-md">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('title')}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('subtitle')}
              </p>
            </div>

            {/* Google Login Button */}
            <LoginButton />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            <Link href="/help/privacy-policy" className="hover:underline hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('privacyPolicy')}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </main>
  );
}