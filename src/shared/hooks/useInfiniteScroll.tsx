import {useEffect} from "react";
import {useInView} from "react-intersection-observer";

export const useInfiniteScroll = ({
  threshold = 0.1,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: {
  threshold?: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}) => {
  const {ref, inView} = useInView({threshold});
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);
  return {ref};
};
