import { lazy } from 'react';

// Map block types to React components (lazy loaded for performance)
const layoutBlockRegistry = {
  heroBanner: lazy(() => import('../components/BannerCarousel.jsx')),
  categoriesGrid: lazy(() => import('../components/HomeCategoryController.jsx')),
  featuredWorkers: lazy(() => import('../components/WorkerList.jsx')),
  promoStrip: lazy(() => import('../components/BannerCarousel.jsx')), // reuse banner as promo strip for now
};

export default layoutBlockRegistry;