import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import prisma from '@lib/prisma';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
};

export default function Posts({ posts }: { posts: Post[] }) {
  return (
    <main className="container mx-auto py-8">
      <Head>
        <title>Posts - 9Melody</title>
      </Head>
      <h1 className="text-2xl font-bold mb-4">Bài viết</h1>
      <ul>
        {posts.map((p) => (
          <li key={p.id} className="mb-3">
            <Link href={`/posts/${p.slug}`} className="text-primary">{p.title}</Link>
            <p className="text-sm text-muted mt-1">{p.excerpt || ''}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const posts = await prisma.post.findMany({ where: { published: true }, take: 10, orderBy: { createdAt: 'desc' } });

  return {
    props: {
      posts: JSON.parse(JSON.stringify(posts)),
      ...(await serverSideTranslations(locale || 'vi', ['common']))
    },
    revalidate: 60
  };
};
