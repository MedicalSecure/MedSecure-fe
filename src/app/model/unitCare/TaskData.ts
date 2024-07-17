export  interface TaskData {
  tasks: {
    pageIndex: number;
    pageSize: number;
    count: number;
    data: Task[];

  };
}


export interface Task {
  id: string;
  content: string;
  taskState: number;
  taskAction: number;
  createdAt:Date
}




