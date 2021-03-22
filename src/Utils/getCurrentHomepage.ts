import { Homepage } from '../Models';
import { isDevelopment } from '../Config';

export const getCurrentHomepage = (location: Location, homepages: Homepage[]): Homepage | undefined => {

  if (isDevelopment && (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '192.168.43.198')) {
    return homepages && homepages[0];
  }

  let homepage: Homepage | undefined;
  for (const key in homepages) {
    if (homepages[key] && homepages[key].url === location.hostname) {
      homepage = homepages[key];
      break;
    }
  }

  return homepage;
};