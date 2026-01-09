'use client';
import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import styles from './LoadingSpinner.module.scss';
import sandyAnimation from '@/public/animations/sandy-loading.json';

interface LoadingSpinnerProps {
  size?: number;
  text?: string;
}

export default function LoadingSpinner({ size = 200, text = 'Đang tải...' }: LoadingSpinnerProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5);
    }
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <Lottie 
          lottieRef={lottieRef}
          animationData={sandyAnimation}
          loop={true}
          style={{ width: size, height: size }}
        />
        {text && <p className={styles.loadingText}>{text}</p>}
      </div>
    </div>
  );
}