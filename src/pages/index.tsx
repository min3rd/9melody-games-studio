import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((d) => (d.success ? setPosts(d.data) : console.error(d)))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">9Melody — Demo</h1>
        <p className="mb-4">A tiny starter with Prisma (inside src/prisma).</p>
        <section className="space-y-2">
          {posts.map((p: any) => (
            <article key={p.id} className="border rounded p-4 bg-white dark:bg-gray-900">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">{p.content ?? ''}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
