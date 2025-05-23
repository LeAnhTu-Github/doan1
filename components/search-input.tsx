'use client';

import qs from 'query-string';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export const SearchInput = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Khởi tạo giá trị ban đầu từ searchParams
  const initialTitle = searchParams.get('title') || '';
  const [value, setValue] = useState(initialTitle);
  const debouncedValue = useDebounce(value, 500); // Giả sử độ trễ là 500ms

  const currentCategoryId = searchParams.get('categoryId');

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  // Cập nhật giá trị khi searchParams thay đổi (ví dụ: khi người dùng quay lại)
  useEffect(() => {
    const newTitle = searchParams.get('title') || '';
    if (newTitle !== value) {
      setValue(newTitle);
    }
  }, [searchParams, value]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Tìm kiếm khoá học"
      />
    </div>
  );
};