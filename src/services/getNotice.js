export async function getNotice(startIdx, endIdx) {
  try {
    const response = await fetch("/api1/OpenAPI/service/bis/Notice");
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const items = [];

    // xmlDoc에서 <item> 엘리먼트들을 모두 찾음
    const itemNodes = xmlDoc.getElementsByTagName("item");

    // 각 <item> 엘리먼트에 대해 반복
    for (let i = 0; i < itemNodes.length; i++) {
      const item = itemNodes[i];

      // <NoticeID>, <NoticeTitle>, <NoticeText>, <date> 엘리먼트들의 값을 가져와서 객체로 만듦
      const newItem = {
        NoticeID: item.querySelector("NoticeID").textContent,
        NoticeTitle: item.querySelector("NoticeTitle").textContent,
        NoticeText: item.querySelector("NoticeText").textContent,
        date: item.querySelector("date").textContent,
      };

      // 배열에 추가
      items.push(newItem);
    }

    // 데이터를 최신순으로 정렬
    const sortedData = items.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // 최신순으로 정렬
    });

    const extractedData = [];

    // 정렬된 데이터를 사용
    sortedData.slice(startIdx, endIdx).forEach((item) => {
      const noticeId = item.NoticeID;
      const noticeTitle = item.NoticeTitle;
      const noticeText = item.NoticeText;
      const date = item.date;
      const dateOnlyStr = new Date(date).toISOString().split("T")[0];

      extractedData.push({
        noticeId,
        noticeTitle,
        noticeText,
        dateOnlyStr,
      });
    });

    return extractedData;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getNoticeTotalCount() {
  try {
    const response = await fetch("/api1/OpenAPI/service/bis/Notice");
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const totalCount = parseInt(
      xmlDoc.querySelector("totalCount").textContent,
      10
    );

    return totalCount;
  } catch (error) {
    throw new Error(error);
  }
}
