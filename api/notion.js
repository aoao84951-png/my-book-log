export default async function handler(req, res) {
  const { title, author, cover } = JSON.parse(req.body);
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        "이름": { title: [{ text: { content: title } }] },
        "저자": { rich_text: [{ text: { content: author } }] }
      },
      cover: { type: "external", external: { url: cover } }
    })
  });
  res.status(200).json({ success: response.ok });
}
