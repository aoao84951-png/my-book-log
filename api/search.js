export default async function handler(req, res) {
  const { query } = req.query;
  try {
    const response = await fetch(`https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=ttbsom_dae1435001&Query=${encodeURIComponent(query)}&QueryType=Title&MaxResults=5&start=1&SearchTarget=Book&output=js&Version=20131101`);
    const data = await response.json();
    const books = data.item ? data.item.map(item => ({
      title: item.title,
      author: item.author,
      cover: item.cover.replace('cover200', 'cover500'),
    })) : [];
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json([]);
  }
}
