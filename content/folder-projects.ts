export type FolderProject = { id: string; title: string; category: string; image: string; width: number; height: number; video?: string; description: string[]; };

// Descriptions will be added when the approved project copy is supplied.
export const folderProjects: FolderProject[] = [
  {
    "id": "velova",
    "title": "Velova",
    "category": "Pitch Deck",
    "image": "/work/velova/cover.webp",
    "width": 1600,
    "height": 900,
    "video": "/work/velova/preview.mp4",
    "description": []
  },
  {
    "id": "maneuver",
    "title": "Maneuver",
    "category": "Pitch Deck",
    "image": "/work/maneuver/cover.webp",
    "width": 1600,
    "height": 900,
    "video": "/work/maneuver/preview.mp4",
    "description": []
  },
  {
    "id": "numa",
    "title": "Numa",
    "category": "Pitch Deck",
    "image": "/work/numa/cover.webp",
    "width": 1600,
    "height": 1200,
    "video": "/work/numa/preview.mp4",
    "description": []
  },
  {
    "id": "cognexo",
    "title": "Cognexo",
    "category": "Presentation Design",
    "image": "/work/cognexo/cover.webp",
    "width": 1200,
    "height": 900,
    "description": []
  },
  {
    "id": "misk",
    "title": "MISK",
    "category": "Presentation Design",
    "image": "/work/misk/cover.webp",
    "width": 1200,
    "height": 900,
    "description": []
  }
];
