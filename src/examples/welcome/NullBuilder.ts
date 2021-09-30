import { createBuilder } from '../../esp'

export const createNullBuilder = () => createBuilder(null, () => undefined)
