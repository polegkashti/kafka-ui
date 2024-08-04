import { RefObject } from 'react';

export interface AclDetailedFormProps {
  formRef: RefObject<HTMLFormElement> | null;
}

export interface ACLFormProps {
  isOpen: boolean;
}

export enum MatchType {
  EXACT = 'EXACT',
  PREFIXED = 'PREFIXED',
}

export enum ACLType {
  FOR_PRODUCERS = 'FOR_PRODUCERS',
  FOR_CONSUMERS = 'FOR_CONSUMERS'
}