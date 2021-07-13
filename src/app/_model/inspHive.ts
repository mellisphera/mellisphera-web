export interface InspHive{
  _id: string,
  inspId: string,
  date: Date,
  apiaryId: string,
  hiveId: string,
  tasks: any[],
  obs: any[]
  notes: string,
  todo: string
}
