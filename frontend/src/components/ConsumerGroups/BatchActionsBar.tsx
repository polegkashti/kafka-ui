import React, { useMemo } from 'react';
import { Row } from '@tanstack/react-table';
import { Action, ConsumerGroupState, ConsumerGroup, ResourceType } from 'generated-sources';
import useAppParams from 'lib/hooks/useAppParams';
import { ClusterName } from 'lib/interfaces/cluster';
import { useConfirm } from 'lib/hooks/useConfirm';
import { ActionCanButton } from 'components/common/ActionComponent';
import { isPermitted } from 'lib/permissions';
import { useUserInfo } from 'lib/hooks/useUserInfo';
import {  showServerError, showAlert } from 'lib/errorHandling';
import { useDeleteMultipleConsumerGroupsMutation } from 'lib/hooks/api/consumers';

interface BatchActionsbarProps {
  rows: Row<ConsumerGroup>[];  // Ensure that each row's original contains `groupId` and `state`
  resetRowSelection(): void;
}

const BatchActionsbar: React.FC<BatchActionsbarProps> = ({
  rows,
  resetRowSelection,
}) => {
  const { clusterName } = useAppParams<{ clusterName: ClusterName }>();
  const confirm = useConfirm();
  const { roles, rbacFlag } = useUserInfo();

  // Map to include both groupId and state
  const selectedConsumerGroups = rows.map(({ original }) => ({
    groupId: original.groupId,
    state: original.state as ConsumerGroupState,
  }));

  const deleteMultipleConsumerGroupsMutation = useDeleteMultipleConsumerGroupsMutation();

  const deleteConsumerGroupsHandler = () => {
    const nonEmptyGroups = selectedConsumerGroups.filter(
      (group: ConsumerGroup) => group.state !== ConsumerGroupState.EMPTY
    );

    if (nonEmptyGroups.length > 0) {
      showAlert('error', {
        title: 'Deletion Failed',
        message: 'All selected consumer groups must be in EMPTY state to be deleted.',
      });
      return;
    }

    confirm(
      'Are you sure you want to delete the selected consumer groups?',
      async () => {
        try {
            await deleteMultipleConsumerGroupsMutation.mutateAsync({
                clusterName,
                consumerGroups: selectedConsumerGroups.map(group => group.groupId),
            });
            resetRowSelection();
        } catch (e) {
          // do nothing
        }
      }
    );
  };

  const canDeleteSelectedConsumerGroups = useMemo(() => {
    return selectedConsumerGroups.every((value) =>
      isPermitted({
        roles,
        resource: ResourceType.CONSUMER,
        action: Action.DELETE,
        value: value.groupId,
        clusterName,
        rbacFlag,
      })
    );
  }, [selectedConsumerGroups, clusterName, roles]);

  return (
    <>
      <ActionCanButton
        buttonSize="M"
        buttonType="secondary"
        onClick={deleteConsumerGroupsHandler}
        disabled={!selectedConsumerGroups.length}
        canDoAction={canDeleteSelectedConsumerGroups}
      >
        Delete selected consumer groups
      </ActionCanButton>
    </>
  );
};

export default BatchActionsbar;