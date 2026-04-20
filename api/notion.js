export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
  const { title, author, cover } = JSON.parse(req.body);

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        // 사용자님의 노션 데이터베이스 속성명에 맞춤
        properties: {
          "이름": { // 페이지 제목 (책 제목)
            title: [{ text: { content: title } }]
          },
          "author": { // 저자 이름 (텍스트 속성)
            rich_text: [{ text: { content: author } }]
          },
          "cover": { // 책 표지 (파일과 미디어 속성)
            files: [{
              name: "Cover Image",
              type: "external",
              external: { url: cover }
            }]
          }
        }
      })
    });

    const result = await response.json();
    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      console.error(result);
      res.status(500).json({ success: false, error: result.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
