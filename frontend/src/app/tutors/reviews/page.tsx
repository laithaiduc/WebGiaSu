"use client";
import TutorReviewsTab from '@/components/reviews/TutorReviewsTab';
import '../dashboard/tutor.css';

export default function TutorReviewsPage() {
  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <h1 style={{ color: '#D94625', fontSize: '2rem', marginBottom: '2rem' }}>Quản lý Đánh giá</h1>
      <TutorReviewsTab />
    </div>
  );
}
