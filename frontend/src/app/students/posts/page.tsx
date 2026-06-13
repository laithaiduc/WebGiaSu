"use client";
import './posts.css';
import StudentPostsManager from '@/components/posts/StudentPostsManager';

export default function StudentPostsPage() {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <StudentPostsManager />
    </div>
  );
}
