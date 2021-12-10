import { EventBase } from './EventBase'
import { Option } from './Option'

export interface ArgumentClassBuilder<EventType extends EventBase, Field extends keyof EventType['args']> {
  options(options: Array<Option<EventType['args'][Field]>>): void
}
