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

export const getQuery = () => {
  const cache = new Map(); // WeakMap 대신 일반 Map 사용

  return async ({ queryKey, queryFn }) => {
    const keyString = JSON.stringify(queryKey);

    if (!cache.has(keyString)) {
      console.log("Fetching new data for:", keyString);
      const response = await queryFn();
      const data = await response.data;
      cache.set(keyString, data);
    } else {
      console.log("Using cached data for:", keyString);
    }

    return cache.get(keyString);
  };
};

export const getCacheData = (fetchFn: any) => {
  const cache = new WeakMap();

  return async () => {
    if (cache.get(fetchFn)) {
      return cache.get(fetchFn);
    }

    const data = await fetchFn();

    cache.set(fetchFn, data);
    return cache.get(fetchFn);
  };
};
