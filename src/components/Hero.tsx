import Button from './Button';
import Link from 'next/link';
import AnimatedCounter from './AnimatedCounter';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      {/* Layered Gradient Waves */}
      <div className="wave-container">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255, 77, 109, 0.1)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(123, 44, 191, 0.2)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(16, 0, 43, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="var(--background)" />
          </g>
        </svg>
      </div>

      <div className="hero-content">
        <h1 className="hero-title text-gradient">
          Publish Your Story. <br /> Reach the World.
        </h1>
        <p className="hero-subtitle">
          From professional publishing services to a global bookstore, we help authors turn manuscripts into bestsellers and readers find their next favorite book.
        </p>
        <div className="hero-actions">
          <Link href="/auth/signup">
            <Button size="lg" className="hero-btn">Start Publishing</Button>
          </Link>
          <Link href="/bookstore">
            <Button variant="secondary" size="lg" className="hero-btn">Browse Bookstore</Button>
          </Link>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <h3><AnimatedCounter end={10} suffix="K+" /></h3>
            <p>Books Published</p>
          </div>
          <div className="stat-item">
            <h3><AnimatedCounter end={50} suffix="K+" /></h3>
            <p>Active Authors</p>
          </div>
          <div className="stat-item">
            <h3><AnimatedCounter end={1} suffix="M+" /></h3>
            <p>Readers Monthly</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
