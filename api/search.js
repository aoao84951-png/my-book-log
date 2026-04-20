export default async function handler(req, res) {
  const { query } = req.query;
  try {
    // 네이버 도서 검색 API를 사용하여 리디북스 신작까지 검색
    const response = await fetch(`https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}&display=5`, {
      headers: {
        'X-Naver-Client-Id': '8MvG5mG_8_N_Nq68_E1c', // 임시 연결 ID
        'X-Naver-Client-Secret': '3U_8Fz6_T_' // 임시 비밀키
      }
    });
    const data = await response.json();
    
    const books = data.items ? data.items.map(item => ({
      title: item.title.replace(/<[^>]*>?/gm, ''), // HTML 태그 제거
      author: item.author.replace(/<[^>]*>?/gm, ''),
      cover: item.image,
      description: item.description.replace(/<[^>]*>?/gm, '')
    })) : [];

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Naver Search failed' });
  }
}
