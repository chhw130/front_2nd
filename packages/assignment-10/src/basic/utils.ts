import { AxiosResponse } from "axios";
import { SearchOption } from "./SearchDialog";
import { Lecture } from "./types";

export const fill2 = (n: number) => `0${n}`.substr(-2);

export const parseHnM = (current: number) => {
  const date = new Date(current);
  return `${fill2(date.getHours())}:${fill2(date.getMinutes())}`;
};

const getTimeRange = (value: string): number[] => {
  const [start, end] = value.split("~").map(Number);
  if (end === undefined) return [start];
  return Array(end - start + 1)
    .fill(start)
    .map((v, k) => v + k);
};

export const parseSchedule = (schedule: string) => {
  const schedules = schedule.split("<p>");
  return schedules.map((schedule) => {
    const reg = /^([가-힣])(\d+(~\d+)?)(.*)/;

    const [day] = schedule.split(/(\d+)/);

    const range = getTimeRange(schedule.replace(reg, "$2"));

    const room = schedule.replace(reg, "$4")?.replace(/\(|\)/g, "");

    return { day, range, room };
  });
};

interface QueryType<T> {
  queryKey: string;
  queryFn: () => Promise<AxiosResponse<T, unknown>>;
}

/**
 * queryKey에 따라 캐싱하는 함수
 * @returns
 */
export const getQuery = () => {
  const cache = new Map<string, unknown>(); // WeakMap 대신 일반 Map 사용

  return async <T>({ queryKey, queryFn }: QueryType<T>): Promise<T> => {
    console.log(`API 호출 ${queryKey}`, performance.now());

    if (cache.has(queryKey)) {
      return cache.get(queryKey) as T;
    }

    const response = await queryFn();
    const data = await response.data;
    cache.set(queryKey, data);

    return cache.get(queryKey) as T;
  };
};

/**
 * 검색옵션에 따라 필터링된 강의들을 얻는 함수
 * @param searchOptions
 * @param lectures
 * @returns
 */
export const getFilteredLectures = (
  searchOptions: SearchOption,
  lectures: Lecture[]
) => {
  const { query = "", credits, grades, days, times, majors } = searchOptions;

  return lectures
    .filter(
      (lecture) =>
        lecture?.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture?.id.toLowerCase().includes(query.toLowerCase())
    )
    .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
    .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
    .filter(
      (lecture) => !credits || lecture.credits.startsWith(String(credits))
    )
    .filter((lecture) => {
      if (days.length === 0) {
        return true;
      }
      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
      return schedules.some((s) => days.includes(s.day));
    })
    .filter((lecture) => {
      if (times.length === 0) {
        return true;
      }
      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
      return schedules.some((s) =>
        s.range.some((time) => times.includes(time))
      );
    });
};
