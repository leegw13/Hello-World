function topicParticle(word) {
  const last = word.charCodeAt(word.length - 1);
  return last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 !== 0 ? "은" : "는";
}
const locations = {
  id: [["화장실", "toilet", "똘렛"], ["편의점", "minimarket", "미니마르껫"], ["식당", "restoran", "레스또란"], ["카페", "kafe", "까페"], ["약국", "apotek", "아뽀떽"], ["병원", "rumah sakit", "루마 사낏"], ["ATM", "ATM", "아떼엠"], ["출구", "pintu keluar", "삔뚜 끌루아르"], ["공항", "bandara", "반다라"], ["버스 정류장", "halte bus", "할떼 부스"], ["기차역", "stasiun kereta", "스타시운 끄레따"], ["호텔", "hotel", "호텔"]],
  vi: [["화장실", "nhà vệ sinh", "냐 베 신"], ["편의점", "cửa hàng tiện lợi", "끄어 항 띠엔 러이"], ["식당", "nhà hàng", "냐 항"], ["카페", "quán cà phê", "꽌 까 페"], ["약국", "nhà thuốc", "냐 투옥"], ["병원", "bệnh viện", "베인 비엔"], ["ATM", "máy ATM", "마이 에이티엠"], ["출구", "lối ra", "로이 자"], ["공항", "sân bay", "선 바이"], ["버스 정류장", "trạm xe buýt", "짬 쎄 부잇"], ["기차역", "ga tàu", "가 따우"], ["호텔", "khách sạn", "칵 싼"]]
};

function restaurant(language) {
  const vietnamese = language === "vi";
  return {
    title: "메뉴와 주문 옵션을 선택하세요",
    items: vietnamese ? [["쌀국수", "phở", "퍼"], ["분짜", "bún chả", "분 짜"], ["반미", "bánh mì", "바인 미"], ["껌떰", "cơm tấm", "껌 떰"], ["월남쌈", "gỏi cuốn", "고이 꾸온"], ["물", "nước", "느억"]] : [["나시고렝", "Nasi goreng", "나시 고렝"], ["미고렝", "Mie goreng", "미 고렝"], ["사테", "Sate", "사떼"], ["박소", "Bakso", "박소"], ["밥", "Nasi", "나시"], ["물", "Air", "아이르"]],
    options: vietnamese ? [["기본 주문", "", ""], ["맵지 않게", "không cay", "콩 까이"], ["포장", "mang đi", "망 디"]] : [["기본 주문", "", ""], ["맵지 않게", "jangan pedas", "장안 뻐다스"], ["포장", "dibungkus", "디붕꾸스"]],
    sentence(item, option) {
      const ko = `${item[0]}${option[0] === "기본 주문" ? "" : `, ${option[0]}`} 주세요.`;
      return vietnamese ? { ko, vi: `Cho tôi ${item[1]}${option[1] ? ` ${option[1]}` : ""}.`, pron: `쪼 또이 ${item[2]}${option[2] ? ` ${option[2]}` : ""}` } : { ko, id: `Saya mau ${item[1]}${option[1] ? `, ${option[1]}` : ""}, ya.`, pron: `사야 마우 ${item[2]}${option[2] ? `, ${option[2]}` : ""} 야` };
    }
  };
}

function cafe(language) {
  const vietnamese = language === "vi";
  return {
    title: "메뉴에 맞는 주문 옵션을 선택하세요",
    items: vietnamese ? [["연유 커피", "cà phê sữa", "까 페 쓰어", "coffee"], ["블랙 커피", "cà phê đen", "까 페 덴", "coffee"], ["코코넛 커피", "cà phê dừa", "까 페 즈어", "coffee"], ["아메리카노", "americano", "아메리까노", "coffee"], ["에스프레소", "espresso", "에스프레소", "coffee"], ["밀크티", "trà sữa", "짜 쓰어", "tea"], ["아이스티", "trà đá", "짜 다", "cold"], ["차", "trà", "짜", "tea"], ["생과일주스", "nước ép trái cây", "느억 엡 짜이 꺼이", "juice"], ["스무디", "sinh tố", "신 또", "cold"], ["생수", "nước suối", "느억 쑤오이", "water"], ["케이크", "bánh ngọt", "바인 응옷", "food"], ["반미", "bánh mì", "바인 미", "food"]] : [["아메리카노", "Americano", "아메리까노", "coffee"], ["카페라떼", "Café latte", "까페 라떼", "coffee"], ["카푸치노", "Cappuccino", "까푸치노", "coffee"], ["에스프레소", "Espresso", "에스쁘레소", "coffee"], ["아이스커피", "Es kopi", "에스 꼬삐", "cold"], ["차", "Teh", "떼", "tea"], ["아이스티", "Es teh", "에스 떼", "cold"], ["핫초콜릿", "Cokelat panas", "초끌랏 빠나스", "hot"], ["주스", "Jus", "주스", "juice"], ["스무디", "Smoothie", "스무디", "cold"], ["생수", "Air mineral", "아이르 미네랄", "water"], ["케이크", "Kue", "꾸에", "food"], ["크루아상", "Croissant", "크루아상", "food"]],
    options: vietnamese ? [["기본", "", "", ["coffee", "cold", "tea", "juice", "water", "food"]], ["아이스", "đá", "다", ["coffee", "tea"]], ["뜨겁게", "nóng", "농", ["coffee", "tea"]], ["작은 사이즈", "cỡ nhỏ", "꺼 뇨", ["coffee", "cold", "tea", "juice"]], ["큰 사이즈", "cỡ lớn", "꺼 런", ["coffee", "cold", "tea", "juice"]], ["설탕 조금", "ít đường", "잇 드엉", ["coffee", "tea", "juice"]], ["설탕 없이", "không đường", "콩 드엉", ["coffee", "tea", "juice"]], ["얼음 없이", "không đá", "콩 다", ["cold", "juice"]]] : [["기본", "", "", ["coffee", "cold", "tea", "hot", "juice", "water", "food"]], ["아이스", "dingin", "딩인", ["coffee", "tea"]], ["뜨겁게", "panas", "빠나스", ["coffee", "tea"]], ["작은 사이즈", "ukuran kecil", "우꾸란 끄찔", ["coffee", "cold", "tea", "hot", "juice"]], ["큰 사이즈", "ukuran besar", "우꾸란 브사르", ["coffee", "cold", "tea", "hot", "juice"]], ["설탕 조금", "sedikit gula", "스디낏 굴라", ["coffee", "tea", "hot", "juice"]], ["설탕 없이", "tanpa gula", "딴빠 굴라", ["coffee", "tea", "hot", "juice"]], ["얼음 없이", "tanpa es", "딴빠 에스", ["cold", "juice"]]],
    sentence(item, option) {
      const ko = `${option[0] === "기본" ? "" : `${option[0]} `}${item[0]} 주세요.`;
      return vietnamese ? { ko, vi: `Cho tôi ${item[1]}${option[1] ? ` ${option[1]}` : ""}.`, pron: `쪼 또이 ${item[2]}${option[2] ? ` ${option[2]}` : ""}` } : { ko, id: `Saya mau ${item[1]}${option[1] ? ` ${option[1]}` : ""}, ya.`, pron: `사야 마우 ${item[2]}${option[2] ? ` ${option[2]}` : ""} 야` };
    }
  };
}

function locationKiosk(language) {
  const vietnamese = language === "vi";
  return {
    title: "장소를 선택하면 두 가지 질문이 표시됩니다",
    items: locations[language],
    options: [],
    sentences(item) {
      if (vietnamese) return [
        { ko: `${item[0]}${topicParticle(item[0])} 어디예요?`, vi: `${item[1]} ở đâu?`, pron: `${item[2]} 어 더우?` },
        { ko: `${item[0]}에 어떻게 가나요?`, vi: `Đi đến ${item[1]} như thế nào?`, pron: `디 덴 ${item[2]} 느 테 나오?` }
      ];
      return [
        { ko: `${item[0]}${topicParticle(item[0])} 어디인가요?`, id: `Di mana ${item[1]}?`, pron: `디 마나 ${item[2]}?` },
        { ko: `${item[0]}에 어떻게 가나요?`, id: `Bagaimana cara ke ${item[1]}?`, pron: `바가이마나 짜라 끄 ${item[2]}?` }
      ];
    }
  };
}

export const KIOSKS = {
  id: { restaurant: restaurant("id"), cafe: cafe("id"), location: locationKiosk("id") },
  vi: { restaurant: restaurant("vi"), cafe: cafe("vi"), location: locationKiosk("vi") }
};
