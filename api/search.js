export default async function handler(req, res) {
  const { query } = req.query;
  // 네이버 모바일 도서 검색 페이지를 직접 읽어옵니다 (가장 가볍고 빠름)
  const targetUrl = `https://m.search.naver.com/search.naver?where=m_book&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1' }
    });
    const html = await response.text();

    // 검색 결과에서 제목, 저자, 이미지를 가공하는 로직
    const books = [];
    const items = html.split('<li class="book_item">').slice(1, 6); // 상위 5개만

    items.forEach(item => {
      const title = item.match(/<div class="tit">([\s\S]*?)<\/div>/)?.[1]?.replace(/<[^>]*>?/gm, '').trim() || "제목 없음";
      const author = item.match(/<span class="txt">([\s\S]*?)<\/span>/)?.[1]?.replace(/<[^>]*>?/gm, '').trim() || "저자 미상";
      const cover = item.match(/src="(.*?)"/)?.[1] || "";
      
      books.push({ title, author, cover });
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(200).json([{ title: "검색 실패", author: "다시 시도해주세요", cover: "" }]);
  }
}
