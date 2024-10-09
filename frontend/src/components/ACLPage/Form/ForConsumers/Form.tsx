import React, { FC, useContext, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { ClusterName } from 'lib/interfaces/cluster';
import { useCreateConsumersAcl } from 'lib/hooks/api/acl';
import useAppParams from 'lib/hooks/useAppParams';
import ControlledMultiSelect from 'components/common/MultiSelect/ControlledMultiSelect';
import Input from 'components/common/Input/Input';
import * as S from 'components/ACLPage/Form/Form.styled';
import Checkbox from 'components/common/Checkbox/Checkbox';
import { AclDetailedFormProps, MatchType } from 'components/ACLPage/Form/types';
import useTopicsOptions from 'components/ACLPage/lib/useTopicsOptions';
import useConsumerGroupsOptions from 'components/ACLPage/lib/useConsumerGroupsOptions';
import ACLFormContext from 'components/ACLPage/Form/AclFormContext';
import MatchTypeSelector from 'components/ACLPage/Form/components/MatchTypeSelector';
import { useClusters } from 'lib/hooks/api/clusters';

import formSchema from './schema';
import { toRequest } from './lib';
import { FormValues } from './types';

const ForConsumersForm: FC<AclDetailedFormProps> = ({ formRef }) => {
  const context = useContext(ACLFormContext);
  const { clusterName } = useAppParams<{ clusterName: ClusterName }>();
  const create = useCreateConsumersAcl(clusterName);
  const methods = useForm<FormValues>({
    mode: 'all',
    resolver: yupResolver(formSchema),
  });

  const { setValue } = methods;

  const [addAllTopicsChecked, setAddAllTopicsChecked] = useState(false);

  const [showTopicsError, setShowTopicsError] = useState(false);

  const [addAllConsumerGroupsChecked, setAllConsumerGroupsChecked] = useState(false);

  const handleAddAllTopicsChange = (isChecked: boolean) => {
    setAddAllTopicsChecked(isChecked);
  };

  const handleAddAllConsumerGroupsChange = (isChecked: boolean) => {
    setAllConsumerGroupsChecked(isChecked);
  };

  const { data: clusterStats } =  useClusters();

  const topicCount = clusterStats?.[0]?.topicCount ?? 0;
  const topics = useTopicsOptions(clusterName, topicCount);

  const consumerGroups = useConsumerGroupsOptions(clusterName, 1000);
  const consumerCount = consumerGroups.length;

  const onSubmit = async (formData: FormValues) => {
    try {
      const data = { ...formData }; // Create a copy of formData

      const selectedTopics = data.topics || [];
      const { topicsPrefix } = data;
      const allTopicsSelected = selectedTopics.length === topics.length && topics.length !== 0;

      const { consumerGroups: selectedConsumerGroup } = data;
      const allConsumerGroupsSelected = selectedConsumerGroup?.length === consumerGroups.length && consumerGroups.length !== 0;

      if (selectedTopics.length === 0 && !addAllTopicsChecked && !topicsPrefix) {
        setShowTopicsError(true); // Show the error message
        return; // Prevent form submission
      }

      setShowTopicsError(false); // Hide the error message if topics are selected or checkbox is checked

      if (allTopicsSelected  || addAllTopicsChecked) {
        // If all topics are selected, replace topics with an array containing a single "*" option
        data.topics = [{ value: '*', label: 'All Topics' }];
        data.topicsPrefix = undefined;
      }
      
      if (allConsumerGroupsSelected || addAllConsumerGroupsChecked) {
        data.consumerGroups = [{ value: '*', label: 'All Consumer groups' }]; 
        data.consumerGroupsPrefix = undefined;
      }
      
      await create.createResource(toRequest(data));
      context?.close();
    } catch (e) {
      // Handle error
    }
  };

  const onTopicTypeChange = (value: string) => {
    if (value === MatchType.EXACT) {
      setValue('topicsPrefix', undefined);
    } else {
      setValue('topics', undefined);
    }
  };

  const onConsumerGroupTypeChange = (value: string) => {
    if (value === MatchType.EXACT) {
      setValue('consumerGroupsPrefix', undefined);
    } else {
      setValue('consumerGroups', undefined);
    }
  };

  return (
    <FormProvider {...methods}>
      <S.Form ref={formRef} onSubmit={methods.handleSubmit(onSubmit)}>
        <hr />
        <S.Field>
          <S.Label htmlFor="principal">Principal</S.Label>
          <Input
            name="principal"
            id="principal"
            placeholder="Principal"
            withError
          />
        </S.Field>
        <S.Field>
          <S.Label htmlFor="host">Host restriction</S.Label>
          <Input name="host" id="host" placeholder="Host" withError />
        </S.Field>
        <hr />
        <S.Field>
          <S.Label>From Topic(s)</S.Label>
          <S.ControlList>
            <MatchTypeSelector
              exact={<ControlledMultiSelect name="topics" options={topics} />}
              prefixed={<Input name="topicsPrefix" placeholder="Prefix..." />}
              onChange={onTopicTypeChange}
            />
          </S.ControlList>
        </S.Field>
        { topicCount === 0 && 
           <Checkbox
              name="addAllTopics"
              label="Add ACL for all future created topics"
              hint="Note: You don't have any topics check this box to add ACLs for future topics"
              checked={addAllTopicsChecked}
              onChange={handleAddAllTopicsChange}
            />} 
            {showTopicsError && (
            <span style={{ fontSize: '0.9rem', color: '#E51A1A' }}>Please select at least one topic</span>
          )}
        <hr />
        <S.Field>
          <S.Field>Consumer group(s)</S.Field>
          <S.ControlList>
            <MatchTypeSelector
              exact={
                <ControlledMultiSelect
                  name="consumerGroups"
                  options={consumerGroups}
                />
              }
              prefixed={
                <Input name="consumerGroupsPrefix" placeholder="Prefix..." />
              }
              onChange={onConsumerGroupTypeChange}
            />
          </S.ControlList>
        </S.Field>
        { consumerCount === 0 && 
           <Checkbox
              name="addAllTopics"
              label="Add ACL for all consumer groups"
              hint="Note: You don't have any consumer groups check this box to add ACLs for future created consumer groups"
              checked={addAllConsumerGroupsChecked}
              onChange={handleAddAllConsumerGroupsChange}
            />}
      </S.Form>
    </FormProvider>
  );
};

export default React.memo(ForConsumersForm);
