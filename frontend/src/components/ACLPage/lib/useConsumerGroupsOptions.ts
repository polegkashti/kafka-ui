import { useConsumerGroups } from 'lib/hooks/api/consumers';
import { useMemo } from 'react';

const useConsumerGroupsOptions = (clusterName: string, consumerGroupCount?: number) => {
  const { data } = useConsumerGroups({ clusterName, search: '', perPage: consumerGroupCount});
  const consumerGroups = useMemo(() => {
    return (
      data?.consumerGroups?.map((cg) => {
        return {
          value: cg.groupId,
          label: cg.groupId,
        };
      }) || []
    );
  }, [data]);

  return consumerGroups;
};

export default useConsumerGroupsOptions;
