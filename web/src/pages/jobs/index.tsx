import { GetStaticProps } from 'next';
import prisma from '@lib/prisma';
import Link from 'next/link';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Jobs({ jobs }: { jobs: any[] }) {
  return (
    <main className="container mx-auto py-8">
      <Head>
        <title>Jobs - 9Melody</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Tuyển dụng</h1>
      <ul>
        {jobs.map((j) => (
          <li key={j.id} className="mb-3">
            <Link href={`/jobs/${j.slug}`} className="text-primary">{j.title}</Link>
            <p className="text-sm text-muted mt-1">{j.location || 'Remote'}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const jobs = await prisma.job.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' } });

  return {
    props: { jobs: JSON.parse(JSON.stringify(jobs)), ...(await serverSideTranslations(locale || 'vi', ['common'])) },
    revalidate: 60
  };
};
