export interface SelectionSnapshot {
  roomId: string;
  startTime: string;
  endTime: string;
  nowTime: string;
}

export function isResultCurrent(
  checked: SelectionSnapshot,
  current: SelectionSnapshot
): boolean {
  return checked.roomId === current.roomId &&
    checked.startTime === current.startTime &&
    checked.endTime === current.endTime &&
    checked.nowTime === current.nowTime;
}
