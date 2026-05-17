const defaultLayouts = {
  homepage: [
    {
      id: 'hero',
      type: 'heroBanner',
      enabled: true,
      order: 1,
      props: { title: 'Welcome to Sajilo' },
    },
    {
      id: 'categories',
      type: 'categoriesGrid',
      enabled: true,
      order: 2,
      props: {},
    },
    {
      id: 'featuredWorkers',
      type: 'featuredWorkers',
      enabled: true,
      order: 3,
      props: {},
    },
    {
      id: 'promoStrip',
      type: 'promoStrip',
      enabled: true,
      order: 4,
      props: {},
    },
  ],
};

export default defaultLayouts;