// 相談者区分
export const CONSULTANT_TYPES = [
  { value: "self", label: "ご本人" },
  { value: "family", label: "ご家族" },
  { value: "hospital", label: "病院関係者（MSW・退院支援等）" },
  { value: "caremanager", label: "ケアマネジャー" },
  { value: "other", label: "その他" },
] as const;

// 要介護度
export const CARE_LEVELS = [
  { value: "support1", label: "要支援1" },
  { value: "support2", label: "要支援2" },
  { value: "care1", label: "要介護1" },
  { value: "care2", label: "要介護2" },
  { value: "care3", label: "要介護3" },
  { value: "care4", label: "要介護4" },
  { value: "care5", label: "要介護5" },
  { value: "applying", label: "申請中" },
  { value: "not_applied", label: "未申請" },
  { value: "unknown", label: "わからない" },
] as const;

// 医療処置
export const MEDICAL_FLAGS = [
  { value: "gastrostomy", label: "胃ろう" },
  { value: "suction", label: "たん吸引" },
  { value: "insulin", label: "インスリン投与" },
  { value: "dialysis", label: "人工透析" },
  { value: "oxygen", label: "在宅酸素" },
  { value: "bedsore", label: "褥瘡（じょくそう）" },
  { value: "dementia", label: "認知症" },
  { value: "stoma", label: "ストーマ" },
  { value: "catheter", label: "バルーンカテーテル" },
  { value: "ivdrip", label: "点滴" },
] as const;

// 入居時期
export const MOVE_IN_TIMINGS = [
  { value: "urgent", label: "至急（1週間以内）" },
  { value: "2weeks", label: "2週間以内" },
  { value: "1month", label: "1ヶ月以内" },
  { value: "3months", label: "3ヶ月以内" },
  { value: "undecided", label: "未定・情報収集中" },
] as const;

// 希望連絡方法
export const PREFERRED_CONTACTS = [
  { value: "phone", label: "電話" },
  { value: "email", label: "メール" },
  { value: "line", label: "LINE" },
] as const;

// 案件ステータス
export const LEAD_STATUSES = [
  { value: "new", label: "新規", color: "bg-blue-100 text-blue-800" },
  { value: "contacted", label: "連絡済", color: "bg-yellow-100 text-yellow-800" },
  { value: "qualified", label: "条件確認済", color: "bg-purple-100 text-purple-800" },
  { value: "tour_scheduled", label: "見学予約済", color: "bg-indigo-100 text-indigo-800" },
  { value: "toured", label: "見学済", color: "bg-cyan-100 text-cyan-800" },
  { value: "contracted", label: "成約", color: "bg-green-100 text-green-800" },
  { value: "lost", label: "失注", color: "bg-gray-100 text-gray-800" },
] as const;

// 紹介元種別
export const SOURCE_TYPES = [
  { value: "hospital", label: "病院" },
  { value: "community", label: "地域包括支援センター" },
  { value: "caremanager", label: "ケアマネジャー" },
  { value: "other", label: "その他" },
] as const;

// 重要度
export const SEVERITY_LEVELS = [
  { value: "low", label: "低" },
  { value: "med", label: "中" },
  { value: "high", label: "高" },
] as const;
