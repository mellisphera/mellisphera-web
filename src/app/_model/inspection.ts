export interface Inspection{
  _id: string,
  apiaryInspId: string,
  apiaryId: string,
  userId: string,
  createDate: Date,
  opsDate: Date,
  hiveId: string,
  type: string,
  tags: string[],
  description: string,
  events: any[],
  todo: string
}
