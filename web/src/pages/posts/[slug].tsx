import { GetStaticPaths, GetStaticProps } from 'next';
import prisma from '@lib/prisma';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function PostPage({ post }: { post: any }) {
  if (!post) return <div>Not found</div>;
  return (
    <main className="container mx-auto py-8">
      <Head>
        <title>{post.title}</title>
      </Head>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } });
  const paths = posts.map((p) => ({ params: { slug: p.slug } }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string;
  const post = await prisma.post.findUnique({ where: { slug } });

  return {
    props: {
      post: post ? JSON.parse(JSON.stringify(post)) : null,
      ...(await serverSideTranslations(locale || 'vi', ['common']))
    },
    revalidate: 60
  };
};
