import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function Home() {
  return (
    <main className="min-h-screen bg-surface dark:bg-surface-dark text-black dark:text-white">
      <Head>
        <title>9Melody Games Studio</title>
      </Head>
      <div className="container mx-auto py-24">
        <h1 className="text-3xl font-bold">9Melody Games Studio</h1>
        <p className="mt-4">Trang web giới thiệu studio phát triển game indie thuần 100% người Việt</p>
        <nav className="mt-8">
          <Link href="/posts" className="text-primary">Bài viết</Link>
          <span className="mx-4">|</span>
          <Link href="/jobs" className="text-primary">Tuyển dụng</Link>
          <span className="mx-4">|</span>
          <Link href="/forum" className="text-primary">Forum</Link>
        </nav>
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'vi', ['common']))
  }
});
