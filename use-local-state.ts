"use client";
// 데모용: Supabase 연결 전에는 입력한 내용을 브라우저(localStorage)에 저장합니다.
// Supabase 연결 후에는 이 훅을 쓰는 컴포넌트에서 insert/select 로 바꾸면 됩니다.
import { useEffect, useState } from "react";

export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* 저장소를 쓸 수 없으면 기본값 유지 */
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* 무시 */
    }
  }, [key, value, loaded]);

  return [value, setValue] as const;
}
