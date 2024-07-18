const xmlToJson = (xml) => {
  let obj = {};
  if (xml.nodeType === 1) {
    // element
    // 속성 처리
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        // 여기서 xml.attributes는 해당 XML 엘리먼트의 속성들을 담고 있는 NameNodeMap
        // item()는 해당 속성들 중에서 인덱스 j에 해당하는 속성을 가져옴
        console.log(obj["@attributes"]);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) {
    // text
    obj = xml.nodeValue;
  }

  // 자식 요소 처리
  if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] === "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push === "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};

export default xmlToJson;
