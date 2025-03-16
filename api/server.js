import fetch from "node-fetch";

export default async function handler() {
  res.setHeader("Access-Control-Allow-Origin", ""); // Allow all domains ()
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const query = req.query.q || "";
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "failed to fetch data" });
  }
}
