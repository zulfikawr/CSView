import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CSView',
    short_name: 'CSView',
    description: 'CSView - Table view for CSV',
    start_url: '/',
    display: 'standalone',
    orientation: "portrait",
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: "/icons/favicon.ico",
        type: "image/x-icon",
      }
    ]
  }
}
