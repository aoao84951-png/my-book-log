export default async function handler(req, res) {
  const { query } = req.query;
  // 네이버 도서 검색 페이지를 직접 읽어옵니다.
  const targetUrl = `https://search.naver.com/search.naver?where=book&query=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
    });
    const html = await response.text();

    // 검색 결과에서 제목, 저자, 이미지를 가공 (정규식 사용)
    const titles = html.match(/<a class="book_tit".*?>([\s\S]*?)<\/a>/g) || [];
    const authors = html.match(/<span class="txt">([\s\S]*?)<\/span>/g) || [];
    const covers = html.match(/<img src="(.*?)"/g) || [];

    const books = titles.slice(0, 5).map((t, i) => ({
      title: t.replace(/<[^>]*>?/gm, '').trim(),
      author: authors[i] ? authors[i].replace(/<[^>]*>?/gm, '').trim() : "저자 미상",
      cover: covers[i+1] ? covers[i+1].match(/"(.*?)"/)[1] : "" 
    }));

    res.status(200).json(books);
  } catch (error) {
    res.status(200).json([]);
  }
}
