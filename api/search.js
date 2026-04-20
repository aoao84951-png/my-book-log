export default async function handler(req, res) {
  const { query } = req.query;
  // 구글 도서 API를 통해 리디북스 사이트 내 정보만 정밀 검색
  const googleApiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}+site:ridibooks.com&maxResults=5&langRestrict=ko`;

  try {
    const response = await fetch(googleApiUrl);
    const data = await response.json();
    
    if (!data.items) return res.status(200).json([]);

    const books = data.items.map(item => {
      const info = item.volumeInfo;
      // 리디북스 특유의 제목에서 군더더기 제거
      const title = info.title.replace(' - 리디', '').replace(' | 리디', '');
      const author = info.authors ? info.authors[0] : '저자 미상';
      // 구글 이미지를 고화질로 변환
      const cover = info.imageLinks ? info.imageLinks.thumbnail.replace('http:', 'https:').replace('zoom=1', 'zoom=2') : '';
      
      return { title, author, cover };
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(200).json([]);
  }
}
