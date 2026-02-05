import { useEffect, useState } from 'react';

const waitForImages = () => {
  const images = Array.from(document.images || []);
  if (images.length === 0) {
    return Promise.resolve();
  }

  const pending = images.filter((img) => !img.complete);
  if (pending.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          const cleanup = () => {
            img.removeEventListener('load', cleanup);
            img.removeEventListener('error', cleanup);
            resolve();
          };
          img.addEventListener('load', cleanup, { once: true });
          img.addEventListener('error', cleanup, { once: true });
        })
    )
  ).then(() => undefined);
};

const waitForFonts = () => {
  const fonts = (document as Document & { fonts?: { ready: Promise<void> } }).fonts;
  if (!fonts?.ready) {
    return Promise.resolve();
  }
  return fonts.ready;
};

const waitForWindowLoad = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    const handleLoad = () => resolve();
    window.addEventListener('load', handleLoad, { once: true });
  });

const usePageReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([waitForWindowLoad(), waitForFonts(), waitForImages()])
      .then(() => {
        if (!isMounted) return;
        setIsReady(true);
      })
      .catch(() => {
        if (!isMounted) return;
        setIsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return isReady;
};

export default usePageReady;
