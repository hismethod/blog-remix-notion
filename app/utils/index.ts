export function emojiFavigonDataUri(emoji: string) {
  const emojiTemplate =
  `<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22>
    <text y=%22.9em%22 font-size=%2290%22>
      ${emoji}
    </text>
  </svg>`.trim();

  return `data:image/svg+xml,${emojiTemplate}`;
}

export type getDateStringOptions = {
 shortYear?: boolean;
 shortDay?: boolean;
 showDay?: boolean;
};

export function getDateString(epochString: string,
  option : getDateStringOptions = {
    shortYear: false,
    shortDay: true,
    showDay: true,
  }) {
  const { shortYear, showDay, shortDay } = option;
  const date = new Date(epochString);
  const YYYY = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate();
  const year = shortYear ? YYYY.toString().slice(-2) : YYYY;

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const day = days[date.getDay()];
  const dayString = shortDay ? ` (${day})` : ` ${day}요일`;

  return `${year}년 ${mm}월 ${dd}일${showDay ? dayString : ''}`;
}