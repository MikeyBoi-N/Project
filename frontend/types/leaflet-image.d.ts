// frontend/types/leaflet-image.d.ts
declare module 'leaflet-image' {
  import { Map as LeafletMap } from 'leaflet';

  function leafletImage(
    map: LeafletMap,
    callback: (err: Error | null, canvas: HTMLCanvasElement) => void
  ): void;

  export default leafletImage;
}