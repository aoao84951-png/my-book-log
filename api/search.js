export default async function handler(req, res) {
  const { query } = req.query;
  // 리디북스 BL/eBook 검색 결과 페이지 주소
  const ridiSearchUrl = `https://ridibooks.com/search?q=${encodeURIComponent(query)}&adult_exclude=n`;

  try {
    const response = await fetch(ridiSearchUrl);
    const html = await response.text();

    // 검색 결과 목록에서 책 정보를 추출하는 정규식 (스크래핑)
    // 리디북스 사이트 구조에 맞춰 제목, 저자, 표지 정보를 긁어옵니다.
    const bookRegex = /<li class="book_macro_110">([\s\S]*?)<\/li>/g;
    const books = [];
    let match;

    while ((match = bookRegex.exec(html)) !== null && books.length < 5) {
      const content = match[1];
      const title = content.match(/<span class="title_text">([\s\S]*?)<\/span>/)?.[1]?.trim() || "제목 없음";
      const author = content.match(/<a class="author">([\s\S]*?)<\/a>/)?.[1]?.trim() || "저자 미상";
      const cover = content.match(/data-src="(.*?)"/)?.[1] || content.match(/src="(.*?)"/)?.[1] || "";

      books.push({ title, author, cover });
    }

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: '리디북스 검색에 실패했습니다.' });
  }
}
