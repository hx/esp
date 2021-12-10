import { createAggregate } from '../../esp'

export const createNullAggregate = () => createAggregate(null, () => undefined)
