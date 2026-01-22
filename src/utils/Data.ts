export type CatData = {
  name: string;
  imageUrl: string;
  status: "liked" | "disliked" | null;
};

export async function getCats(): Promise<CatData[]> {
  const width = 250;
  const height = 250;
  const names = [
    "Whiskers",
    "Mittens",
    "Luna",
    "Oliver",
    "Simba",
    "Chloe",
    "Shadow",
    "Milo",
    "Pumpkin",
    "Programmer art :)",
  ];

  const response = await fetch(
    `https://cataas.com/api/cats?limit=30&width=${width}&height=${height}`,
  );
  const data = await response.json();

  const filtered = data
    .filter((cat: { mimetype?: string }) => cat.mimetype !== "image/gif")
    .slice(0, 10);

  return filtered.map((cat: { id: string }, index: number) => ({
    name: names[index],
    imageUrl: `https://cataas.com/cat/${cat.id}?width=${width}&height=${height}`,
    status: null,
  }));
}
