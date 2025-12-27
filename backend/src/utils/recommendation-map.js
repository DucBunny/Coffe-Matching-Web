export const STYLE_TO_TAGS_MAP = {
  // --- NHÓM 1: MỤC ĐÍCH ---
  勉強: {
    // Học bài
    purpose: ['study'],
    amenities: ['quiet', 'power', 'ac']
  },
  仕事: {
    // Làm việc
    purpose: ['work'],
    amenities: ['wifi', 'power', 'ac']
  },
  デート: {
    // Hẹn hò
    purpose: ['date'],
    amenities: ['cozy', 'vintage', 'luxury', 'lake_view']
  },
  おしゃべり: {
    // Tán gẫu
    purpose: ['meetup', 'relax'],
    amenities: ['spacious', 'street_view', 'food']
  },
  '観光・絶景': {
    // Du lịch / Ngắm cảnh
    purpose: ['view'],
    amenities: ['lake_view', 'rooftop', 'landmark']
  },

  // --- NHÓM 2: KHÔNG GIAN ---
  静か: {
    // Yên tĩnh
    amenities: ['quiet', 'hidden']
  },
  賑やか: {
    // Sôi động
    purpose: ['meetup'],
    amenities: ['street_view']
  },
  レトロ: {
    // Hoài cổ
    amenities: ['vintage']
  },
  モダン: {
    // Hiện đại
    amenities: ['modern', 'industrial']
  },
  '自然・庭': {
    // Thiên nhiên
    amenities: ['garden', 'outdoor']
  },
  ルーフトップ: {
    // Sân thượng
    amenities: ['rooftop']
  },
  隠れ家: {
    // Quán ẩn mình
    amenities: ['hidden', 'quiet']
  },

  // --- NHÓM 3: TIỆN ÍCH ---
  WiFi高速: {
    amenities: ['wifi']
  },
  電源あり: {
    amenities: ['power']
  },
  テラス席: {
    amenities: ['outdoor', 'street_view']
  },
  駐車場: {
    amenities: ['parking']
  },
  広々: {
    amenities: ['spacious']
  },
  ペット可: {
    amenities: ['pet']
  },

  // --- NHÓM 4: ĐỐI TƯỢNG ---
  一人: {
    // Đi một mình
    purpose: ['work', 'study'],
    amenities: ['quiet']
  },
  友人: {
    // Bạn bè
    purpose: ['meetup'],
    amenities: ['spacious', 'food']
  },
  カップル: {
    // Cặp đôi
    purpose: ['date'],
    amenities: ['cozy', 'lake_view']
  },
  ファミリー: {
    // Gia đình
    purpose: ['with_child'],
    amenities: ['family', 'spacious', 'parking', 'food']
  },

  // --- NHÓM 5: ĐẶC BIỆT ---
  深夜営業: {
    // Mở muộn / 24h
    amenities: ['late_night']
  },
  '食事・スイーツ': {
    // Đồ ăn / Bánh
    amenities: ['food']
  }
}
