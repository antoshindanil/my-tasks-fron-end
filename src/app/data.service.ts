import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { Project } from './model/Project';
import { Todo } from './model/Todo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getProjects(): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>('https://my-tasks-ng-rails.herokuapp.com//projects')
      .pipe(map((res) => plainToClass(Project, res)));
  }

  updateTodo(project: Project, todo: Todo): Observable<Todo> {
    return this.httpClient
      .patch<Todo>(
        `https://my-tasks-ng-rails.herokuapp.com//projects/${project.id}/todos/${todo.id}`,
        {
          id: todo.id,
          isCompleted: !todo.isCompleted,
        }
      )
      .pipe(map((res) => plainToClass(Todo, res)));
  }

  createTodo(project: Project, todo: Todo): Observable<Project[]> {
    return this.httpClient
      .post<Project[]>(
        'https://my-tasks-ng-rails.herokuapp.com//projects/todos',
        {
          project: {
            id: project.id,
            title: project.title,
          },
          todo: {
            text: todo.text,
            isCompleted: todo.isCompleted,
          },
        }
      )
      .pipe(map((res) => plainToClass(Project, res)));
  }
}
