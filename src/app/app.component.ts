import { Component, OnInit } from '@angular/core';
import { Project } from './model/Project';
import { Todo } from './model/Todo';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  public projectsList: Project[] = [];
  public formStatus = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects(): void {
    this.dataService.getProjects().subscribe((projects) => {
      this.projectsList = projects;
    });
  }

  onCompleteTodo(project: Project, todo: Todo): void {
    this.dataService.updateTodo(project, todo).subscribe((todoRes: Todo) => {
      const currentlyTodo: Todo = this.projectsList
        .filter((item) => item.id === project.id)[0]
        .todos.filter((item) => item.id === todoRes.id)[0];

      currentlyTodo.isCompleted = todoRes.isCompleted;
    });
  }

  identifyTodo(index: number, item: Todo): number {
    return item.id;
  }
}
