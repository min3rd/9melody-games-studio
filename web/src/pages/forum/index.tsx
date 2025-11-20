import Head from 'next/head';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';

export default function Forum() {
  return (
    <main className="container mx-auto py-8">
      <Head>
        <title>Forum - 9Melody</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Forum</h1>
      <p>Forum community placeholder (threads & categories)</p>
      <Link href="/forum/category/sample" className="text-primary">Sample thread</Link>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'vi', ['common']))
  }
});
