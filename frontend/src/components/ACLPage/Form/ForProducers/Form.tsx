import React, { FC, useContext, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateProducerAcl } from 'lib/hooks/api/acl';
import { FormProvider, useForm } from 'react-hook-form';
import useAppParams from 'lib/hooks/useAppParams';
import { ClusterName } from 'lib/interfaces/cluster';
import Input from 'components/common/Input/Input';
import ControlledMultiSelect from 'components/common/MultiSelect/ControlledMultiSelect';
import Checkbox from 'components/common/Checkbox/Checkbox';
import * as S from 'components/ACLPage/Form/Form.styled';
import { AclDetailedFormProps, MatchType } from 'components/ACLPage/Form/types';
import ACLFormContext from 'components/ACLPage/Form/AclFormContext';
import MatchTypeSelector from 'components/ACLPage/Form/components/MatchTypeSelector';
import useTopicsOptions from 'components/ACLPage/lib/useTopicsOptions';
import { useClusters } from 'lib/hooks/api/clusters';

import { toRequest } from './lib';
import { FormValues } from './types';
import formSchema from './schema';

const ForProducersForm: FC<AclDetailedFormProps> = ({ formRef }) => {

  const context = useContext(ACLFormContext);
  const methods = useForm<FormValues>({
    mode: 'all',
    resolver: yupResolver(formSchema),
  });
  const { setValue } = methods;

  const [addAllTopicsChecked, setAddAllTopicsChecked] = useState(false);
  const [showTopicsError, setShowTopicsError] = useState(false);

  const handleAddAllTopicsChange = (isChecked: boolean) => {
    setAddAllTopicsChecked(isChecked);
  };

  const { clusterName } = useAppParams<{ clusterName: ClusterName }>();
  const create = useCreateProducerAcl(clusterName);

  const { data: clusterStats } =  useClusters();

  const topicCount = clusterStats?.[0]?.topicCount ?? 0;
  const topics = useTopicsOptions(clusterName, topicCount);

  const onTopicTypeChange = (value: string) => {
    if (value === MatchType.EXACT) {
      setValue('topicsPrefix', undefined);
    } else {
      setValue('topics', undefined);
    }
  };

  const onTransactionIdTypeChange = (value: string) => {
    if (value === MatchType.EXACT) {
      setValue('transactionsIdPrefix', undefined);
    } else {
      setValue('transactionalId', undefined);
    }
  };

  const onSubmit = async (formData: FormValues) => {
    try {
      const data = { ...formData }; // Create a copy of formData
      
      const selectedTopics = data.topics || [];
      const topicsPrefix = data.topicsPrefix;
      const allTopicsSelected = selectedTopics.length === topics.length && selectedTopics.length !== 0;
      
      if (selectedTopics.length === 0 && !addAllTopicsChecked && !topicsPrefix) {
        setShowTopicsError(true); // Show the error message
        return; // Prevent form submission
      } else {
        setShowTopicsError(false); // Hide the error message if topics are selected or checkbox is checked
      }

      if (allTopicsSelected || addAllTopicsChecked) {
        // If all topics are selected, replace topics with an array containing a single "*" option
        data.topics = [{ value: '*', label: 'All Topics' }];
        data.topicsPrefix = undefined;
      }

      await create.createResource(toRequest(data));
      context?.close();
    } catch (e) {
      // Handle error
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
        <S.Label>To Topic(s)</S.Label>
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
        <S.Field>Transaction ID</S.Field>
        <S.ControlList>
          <MatchTypeSelector
            exact={
              <Input name="transactionalId" placeholder="Transactional ID" />
            }
            prefixed={
              <Input name="transactionsIdPrefix" placeholder="Prefix..." />
            }
            onChange={onTransactionIdTypeChange}
          />
          <span style={{ fontSize: '0.8rem', color: '#6c757d' }}>
            Enter exact or prefix for transactional IDs (optional)
          </span>
        </S.ControlList>
      </S.Field>
      <Checkbox
        name="idempotent"
        label="Idempotent"
        hint="Check it if using enable idempotence=true"
      />
    </S.Form>
    </FormProvider>
  );
};

export default ForProducersForm;
