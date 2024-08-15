import { Todo } from 'electron/main/server/api.type'

const mockTodo1: Todo = {
    id: 1,
    text: 'Item 1',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodo2: Todo = {
    id: 2,
    text: 'Item 2',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodo3: Todo = {
    id: 3,
    text: 'Item 3',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

export const mockTodoList = [mockTodo1, mockTodo2, mockTodo3]
