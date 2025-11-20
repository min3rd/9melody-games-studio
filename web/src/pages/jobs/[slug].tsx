import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '@lib/prisma';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function JobPage({ job }: { job: any }) {
  if (!job) return <div>Not found</div>;
  return (
    <main className="container mx-auto py-8">
      <Head>
        <title>{job.title}</title>
      </Head>
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: job.description }} />
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const jobs = await prisma.job.findMany({ where: { isPublished: true }, select: { slug: true } });
  const paths = jobs.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const job = await prisma.job.findUnique({ where: { slug } });

  return {
    props: {
      job: job ? JSON.parse(JSON.stringify(job)) : null,
      ...(await serverSideTranslations(locale || 'vi', ['common']))
    },
    revalidate: 60
  };
};
