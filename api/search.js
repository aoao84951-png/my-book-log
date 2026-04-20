export default async function handler(req, res) {
  const { query } = req.query;
  // 구글에게 "리디북스 사이트 안에서만 이 키워드로 책 찾아줘"라고 요청
  const googleSearchUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}+site:ridibooks.com&maxResults=5&langRestrict=ko`;

  try {
    const response = await fetch(googleSearchUrl);
    const data = await response.json();
    
    const books = data.items ? data.items.map(item => {
      const info = item.volumeInfo;
      // 리디북스 특유의 제목 형식에서 군더더기 제거
      const cleanTitle = info.title.replace(" - 리디", "").replace(" | 리디", "");
      
      return {
        title: cleanTitle,
        author: info.authors ? info.authors[0] : '저자 미상',
        // 구글이 찾아준 표지 이미지를 고화질로 변환
        cover: info.imageLinks ? info.imageLinks.thumbnail.replace('http:', 'https:').replace('zoom=1', 'zoom=2') : ''
      };
    }) : [];

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: '검색 엔진 연결 실패' });
  }
}
