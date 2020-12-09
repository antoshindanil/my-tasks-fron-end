import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Project } from '../model/Project';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass'],
})
export class FormComponent implements OnInit {
  @Input() projectList: Project[] | undefined;
  @Input() status: boolean | undefined;
  @Output() statusChange = new EventEmitter<boolean>();
  @Output() projectListChange = new EventEmitter<Project[]>();

  public formProjectTitleStatus = true;

  public createTodoForm: FormGroup = this.fb.group({
    project: this.fb.group({
      id: [null, [Validators.required]],
      title: [null],
    }),
    todo: this.fb.group({
      text: [null, [Validators.required]],
    }),
  });

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.showProjectTextInput();
  }

  onStatusChange(): void {
    this.status = !this.status;
    this.statusChange.emit(this.status);
  }

  onProjectListChange(projectList: Project[]): void {
    this.projectList = projectList;
    this.projectListChange.emit(this.projectList);
  }

  onSubmit(): void {
    const controls = this.createTodoForm.controls;
    const idValue = controls.project.value.id;

    if (this.createTodoForm.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      return;
    }

    if (idValue === 'new') {
      delete this.createTodoForm.controls.project.value.id;
    }

    const project = controls.project.value;
    const todo = controls.todo.value;

    this.dataService.createTodo(project, todo).subscribe((value) => {
      this.onProjectListChange(value);
      this.onStatusChange();
    });
  }

  showProjectTextInput(): void {
    const form: FormGroup = this.createTodoForm;

    const titleControl = form.get(['project', 'title']);
    const idControl = form.get(['project', 'id']);

    titleControl?.disable();

    idControl?.valueChanges?.subscribe((value) => {
      if (value === 'new') {
        titleControl?.enable();
        titleControl?.setValidators([Validators.required]);
        titleControl?.updateValueAndValidity();

        this.formProjectTitleStatus = false;
      } else {
        titleControl?.disable();
        this.formProjectTitleStatus = true;
      }
    });
  }
}
