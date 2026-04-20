export default async function handler(req, res) {
  const { query } = req.query;
  try {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`);
    const data = await response.json();
    const books = data.items ? data.items.map(item => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : 'Unknown',
      cover: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : '',
    })) : [];
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}
