import { Router } from 'express';
import { localStore } from '../utils/prisma';

const router = Router();

router.get('/', (req, res) => {
  const posts = localStore.db.blogPosts
    .filter((post) => post.status === 'PUBLISHED')
    .sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || '') * -1);

  res.json({ success: true, data: posts });
});

router.get('/:slug', (req, res) => {
  const post = localStore.db.blogPosts.find((item) => item.slug === req.params.slug);
  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found' });
  }

  post.viewCount += 1;
  res.json({ success: true, data: post });
});

export default router;
